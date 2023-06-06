import { Event, EventListingType, Group } from '@jonline/api';
import { Heading, Spinner, YStack, dismissScrollPreserver, needsScrollPreservers, useWindowDimensions } from '@jonline/ui';
import { RootState, getEventPages, getHasMoreEventPages, loadEventsPage, useCredentialDispatch, useServerTheme, useTypedSelector } from 'app/store';
import React, { useEffect, useState } from 'react';
import StickyBox from "react-sticky-box";
// import { StickyCreateButton } from '../evepont/create_event_sheet';
import EventCard from '../event/event_card';
import { AppSection } from '../tabs/features_navigation';
import { TabsNavigation } from '../tabs/tabs_navigation';
import { PaginationIndicator } from './pagination_indicator';
import { useEventPages } from 'app/hooks/pagination_hooks';
import { HomeScreenProps } from './home_screen';

export function EventsScreen() {
  return <BaseEventsScreen />;
}

export const BaseEventsScreen: React.FC<HomeScreenProps> = ({ selectedGroup }: HomeScreenProps) => {
  const eventsState = useTypedSelector((state: RootState) => state.events);

  const [showScrollPreserver, setShowScrollPreserver] = useState(needsScrollPreservers());
  const { server, primaryColor, navColor, navTextColor } = useServerTheme();
  const dimensions = useWindowDimensions();

  useEffect(() => {
    document.title = server?.serverConfiguration?.serverInfo?.name || 'Jonline';
  });

  const [currentPage, setCurrentPage] = useState(0);
  const { events, loadingEvents, reloadEvents, hasMorePages: hasMoreEventPages } = useEventPages(
    EventListingType.PUBLIC_EVENTS,
    currentPage,
    () => dismissScrollPreserver(setShowScrollPreserver)
  );

  return (
    <TabsNavigation
      appSection={AppSection.EVENTS}
      selectedGroup={selectedGroup}
      groupPageForwarder={(group) => `/g/${group.shortname}/posts`}
    >
      {eventsState.loadStatus == 'loading' ? <StickyBox style={{ zIndex: 10, height: 0 }}>
        <YStack space="$1" opacity={0.92}>
          <Spinner size='large' color={navColor} scale={2}
            top={dimensions.height / 2 - 50}
          />
        </YStack>
      </StickyBox> : undefined}
      <YStack f={1} w='100%' jc="center" ai="center" p="$0" paddingHorizontal='$3' mt='$3' maw={800} space>
        {events.length == 0
          ? eventsState.loadStatus != 'loading' && eventsState.loadStatus != 'unloaded'
            ? <YStack width='100%' maw={600} jc="center" ai="center">
              <Heading size='$5' mb='$3'>No events found.</Heading>
              <Heading size='$3' ta='center'>The events you're looking for may either not exist, not be visible to you, or be hidden by moderators.</Heading>
            </YStack>
            : undefined
          : <>
            <YStack>
              {events.map((event) => {
                return <EventCard event={event} isPreview />;
              })}
              <PaginationIndicator page={currentPage} loadingPage={loadingEvents || eventsState.loadStatus == 'loading'}
                hasNextPage={hasMoreEventPages}
                loadNextPage={() => setCurrentPage(currentPage + 1)} />
              {showScrollPreserver ? <YStack h={100000} /> : undefined}
            </YStack>
          </>}
      </YStack>
      {/* <StickyCreateButton /> */}
    </TabsNavigation>
  )
}
