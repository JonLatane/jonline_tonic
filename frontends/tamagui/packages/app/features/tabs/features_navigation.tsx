import { Group, User, UserListingType } from "@jonline/api";
import { JonlineServer, RootState, getUsersPage, loadUsersPage, setInlineFeatureNavigation, useAccountOrServer, useCredentialDispatch, useTypedSelector } from 'app/store';
import { Button, Heading, Popover, ScrollView, XStack, YStack, useMedia } from '@jonline/ui';
import { useAccount, useLocalApp, useServerTheme } from 'app/store';
import { useLink } from "solito/link";
import { AlertTriangle, Menu, Circle, SeparatorVertical } from "@tamagui/lucide-icons";
import { themedButtonBackground } from 'app/utils/themed_button_background';
import { useEffect, useState } from "react";

export enum AppSection {
  HOME = 'home',
  POSTS = 'posts',
  POST = 'post',
  EVENTS = 'events',
  EVENT = 'event',
  PEOPLE = 'people',
  PROFILE = 'profile',
  GROUPS = 'groups',
  GROUP = 'group',
  MEDIA = 'media',
  INFO = 'info',
}

export enum AppSubsection {
  FOLLOW_REQUESTS = 'follow_requests',
}

export function sectionTitle(section: AppSection): string {
  switch (section) {
    case AppSection.HOME:
      return 'Latest';
    case AppSection.POSTS:
      return 'Posts';
    case AppSection.POST:
      return 'Post';
    case AppSection.EVENTS:
      return 'Events';
    case AppSection.EVENT:
      return 'Event';
    case AppSection.PEOPLE:
      return 'People';
    case AppSection.PROFILE:
      return 'Profile';
    case AppSection.GROUPS:
      return 'Groups';
    case AppSection.GROUP:
      return 'Group';
    case AppSection.MEDIA:
      return 'My Media';
    case AppSection.INFO:
      return 'Info';
    // default:
    //   return 'Latest';
  }
}
export function subsectionTitle(subsection?: AppSubsection): string | undefined {
  switch (subsection) {
    case AppSubsection.FOLLOW_REQUESTS:
      return 'Follow Requests';
    default:
      return undefined;
  }
}

export function useInlineFeatureNavigation() {
  const mediaQuery = useMedia();
  const { inlineFeatureNavigation } = useLocalApp();

  return inlineFeatureNavigation || inlineFeatureNavigation == undefined && mediaQuery.gtXs;
}

export type FeaturesNavigationProps = {
  appSection?: AppSection;
  appSubsection?: AppSubsection;
  selectedGroup?: Group;
  // Forwarder to link to a group page. Defaults to /g/:shortname.
  // But, for instance, post pages can link to /g/:shortname/p/:id.
  groupPageForwarder?: (group: Group) => string;
};

export function FeaturesNavigation({ appSection = AppSection.HOME, appSubsection, selectedGroup, groupPageForwarder }: FeaturesNavigationProps) {
  const account = useAccount();
  const mediaQuery = useMedia();
  const { primaryTextColor, navColor, navTextColor, textColor } = useServerTheme();

  const latestLink = useLink({
    href:
      selectedGroup == undefined ? '/' : `/g/${selectedGroup.shortname}`
  });
  const postsLink = useLink({
    href:
      selectedGroup == undefined ? '/posts' : `/g/${selectedGroup.shortname}/posts`
  });
  const eventsLink = useLink({
    href:
      selectedGroup == undefined ? '/events' : `/g/${selectedGroup.shortname}/events`
  });
  const peopleLink = useLink({ href: '/people' });
  const followRequestsLink = useLink({ href: '/people/follow_requests' });
  const myMediaLink = useLink({ href: '/media' });

  const isLatest = appSection == AppSection.HOME;
  const isPosts = appSection == AppSection.POSTS;
  const isEvents = appSection == AppSection.EVENTS;
  const isMedia = appSection == AppSection.MEDIA;
  const isPeople = appSection == AppSection.PEOPLE && appSubsection == undefined;
  const isFollowRequests = appSection == AppSection.PEOPLE && appSubsection == AppSubsection.FOLLOW_REQUESTS;

  const menuItems = [
    AppSection.HOME,
    AppSection.POSTS,
    // AppSection.POST,
    AppSection.EVENTS,
    // AppSection.EVENT,
    AppSection.PEOPLE,
    // AppSection.PROFILE,
    // AppSection.GROUPS,
    // AppSection.GROUP,
    AppSection.MEDIA,

  ];
  const inlineNavigation = useInlineFeatureNavigation();
  const reorderInlineNavigation = !mediaQuery.gtMd && account;// && !menuItems.includes(appSection));
  const inlineNavSeparators = inlineNavigation && account?.user?.id /*&& mediaQuery.gtMd*/;

  const followRequests: User[] | undefined = useTypedSelector((state: RootState) =>
    getUsersPage(state.users, UserListingType.FOLLOW_REQUESTS, 0));
  const followRequestCount = followRequests?.length ?? 0;
  const followPageStatus = useTypedSelector((state: RootState) => state.users.pagesStatus);

  const { dispatch, accountOrServer } = useCredentialDispatch();
  const [loadingUsers, setLoadingUsers] = useState(false);
  useEffect(() => {
    if (loadingUsers == undefined && !loadingUsers) {
      if (!accountOrServer.server) return;

      console.log("Loading users...");
      setLoadingUsers(true);
      dispatch(loadUsersPage({ listingType: UserListingType.FOLLOW_REQUESTS, ...accountOrServer }));
    } else if (followPageStatus == 'loaded' && loadingUsers) {
      setLoadingUsers(false);
      // dismissScrollPreserver(setShowScrollPreserver);
    }
  });

  const [latest, posts, events] = [
    navButton(isLatest, latestLink, sectionTitle(AppSection.HOME)),
    navButton(isPosts, postsLink, sectionTitle(AppSection.POSTS)),
    navButton(isEvents, eventsLink, sectionTitle(AppSection.EVENTS)),
  ];
  const postsEventsRow = inlineNavigation && reorderInlineNavigation
    ? (appSection == AppSection.EVENT || appSection == AppSection.EVENTS)
      ? <>{events}{posts}</>
      : (appSection == AppSection.POST || appSection == AppSection.POSTS || appSection == AppSection.MEDIA || appSection == AppSection.INFO || appSection == AppSection.GROUP || appSection == AppSection.PEOPLE)
        ? <>{posts}{events}</>
        : <>{latest}{posts}{events}</>
    : <>{latest}{posts}{events}</>;

  const showFollowRequests = account && (
    (!inlineNavigation || (!reorderInlineNavigation && appSubsection == AppSubsection.FOLLOW_REQUESTS))
    || followRequestCount > 0
    || isPeople
  );
  const peopleRow = <>
    {navButton(isPeople, peopleLink, 'People')}
    {showFollowRequests ? navButton(isFollowRequests, followRequestsLink,
      `Follow Requests${followRequestCount > 0 ? ` (${followRequestCount})` : ''}`
    ) : undefined}
  </>;
  const isPeopleRow = isPeople || isFollowRequests;

  const myDataRow = <>
    {account ? navButton(isMedia, myMediaLink, 'My Media') : undefined}
  </>

  function triggerButton() {
    return <Button scale={0.95} ml={selectedGroup ? -4 : -3} my='auto'
      disabled={inlineNavigation}
      icon={inlineNavigation ? undefined : <Menu color={navTextColor} />}
      {...themedButtonBackground(navColor)}>
      <Heading size="$4"
        // color={primaryTextColor}
        color={navTextColor}
      >{subsectionTitle(appSubsection) ?? sectionTitle(appSection)}</Heading>
    </Button>;
  }

  function navButton(selected: boolean, link: object, name: string) {
    return selected && inlineNavigation ?
      !reorderInlineNavigation
        ? <>{triggerButton()}</>
        : <></>
      : <Popover.Close asChild>
        <Button
          // bordered={false}
          transparent
          my='auto'
          size="$3"
          disabled={selected}
          o={selected ? 0.5 : 1}
          backgroundColor={selected ? navColor : undefined}
          hoverStyle={{ backgroundColor: '$colorTransparent' }}
          {...link}
        >
          <Heading size="$4" color={selected ? navTextColor : inlineNavigation ? primaryTextColor : textColor}>{name}</Heading>
        </Button>
      </Popover.Close>;
  }

  const inlineSeparator = inlineNavSeparators
    ? <XStack my='auto'>
      <SeparatorVertical color={primaryTextColor} size='$1' />
    </XStack>
    : undefined;



  // console.log('inlineNavigation', inlineNavigation, 'reorderInlineNavigation', reorderInlineNavigation, menuItems.includes(appSection));
  return inlineNavigation
    ? <>
      <XStack w={selectedGroup ? 11 : 3.5} />
      {!reorderInlineNavigation && menuItems.includes(appSection) ? undefined : triggerButton()}
      <XStack space='$2' ml='$1' my='auto'>
        {isPeopleRow && reorderInlineNavigation ? peopleRow : postsEventsRow}
        {inlineSeparator}
        {isPeopleRow && reorderInlineNavigation ? postsEventsRow : peopleRow}
        {isMedia && reorderInlineNavigation ? undefined : inlineSeparator}
        {myDataRow}
      </XStack>
    </>
    : <>
      <XStack w={selectedGroup ? 11 : 3.5} />
      <Popover size="$5">
        <Popover.Trigger asChild>
          {triggerButton()}
        </Popover.Trigger>
        <Popover.Content
          bw={1}
          boc="$borderColor"
          enterStyle={{ x: 0, y: -10, o: 0 }}
          exitStyle={{ x: 0, y: -10, o: 0 }}
          x={0}
          y={0}
          o={1}
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          elevate
        >
          <Popover.Arrow bw={1} boc="$borderColor" />

          <YStack space="$3">
            <XStack ac='center' jc='center' space='$2'>
              {postsEventsRow}
            </XStack>
            <XStack ac='center' jc='center' space='$2'>
              {peopleRow}
            </XStack>
            <XStack ac='center' jc='center' space='$2'>
              {myDataRow}
            </XStack>
          </YStack>
        </Popover.Content>
      </Popover>
    </>;
}
