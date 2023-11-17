import { accountOrServerId, getCredentialClient, useCredentialDispatch, useServerTheme } from "app/store";
import React, { useEffect, useState } from "react";

import { AttendanceStatus, Event, EventAttendance, EventInstance, Permission } from "@jonline/api";
import { Anchor, AnimatePresence, Button, Dialog, Heading, Input, Label, Paragraph, RadioGroup, Select, SizeTokens, standardAnimation, TextArea, Theme, useMedia, XStack, YStack, ZStack } from "@jonline/ui";
import { AlertTriangle, Check, ChevronDown, ChevronRight, Edit, Plus } from "@tamagui/lucide-icons";
import { hasPermission } from "app/utils/permission_utils";
import { createParam } from "solito";
import { TamaguiMarkdown } from "../post/tamagui_markdown";
import RsvpCard from "./rsvp_card";
import { passes, pending, rejected } from "app/utils/moderation_utils";

export interface EventRsvpManagerProps {
  event: Event;
  instance: EventInstance;
  newRsvpMode: RsvpMode;
  setNewRsvpMode: (mode: RsvpMode) => void;
}

export type RsvpMode = 'anonymous' | 'user' | undefined;

// let newEventId = 0;
const { useParam } = createParam<{ anonymousAuthToken: string }>()

export const EventRsvpManager: React.FC<EventRsvpManagerProps> = ({
  event,
  instance,
  newRsvpMode,
  setNewRsvpMode
}) => {
  const mediaQuery = useMedia();
  const { server, primaryColor, primaryTextColor, primaryAnchorColor, navColor, navTextColor, navAnchorColor } = useServerTheme();

  let { dispatch, accountOrServer } = useCredentialDispatch();
  const { account } = accountOrServer;
  const isEventOwner = account && account?.user?.id === event?.post?.author?.userId;

  const [queryAnonAuthToken, setQueryAnonAuthToken] = useParam('anonymousAuthToken');
  const anonymousAuthToken = queryAnonAuthToken ?? '';

  const showRsvpSection = event?.info?.allowsRsvps &&
    (event?.info?.allowsAnonymousRsvps || hasPermission(accountOrServer?.account?.user, Permission.RSVP_TO_EVENTS));

  // const [newRsvpMode, setNewRsvpMode] = useState(undefined as RsvpMode);
  const [attendances, setAttendances] = useState([] as EventAttendance[]);
  const currentRsvp = attendances.find(a => account !== undefined && a.userAttendee?.userId === account.user?.id);
  const currentAnonRsvp = attendances.find(a => a.anonymousAttendee && a.anonymousAttendee?.authToken === queryAnonAuthToken);
  // const [currentRsvp, setCurrentRsvp] = useState(undefined as EventAttendance | undefined);
  // const [currentAnonRsvp, setCurrentAnonRsvp] = useState(undefined as EventAttendance | undefined);
  // useEffect(() => {
  //   setCurrentRsvp(attendances.find(a => account !== undefined && a.userAttendee?.userId === account.user?.id));
  //   setCurrentAnonRsvp(attendances.find(a => a.anonymousAttendee?.authToken === anonymousAuthToken));
  // }, [attendances.map(a => a.id).join(',')]);
  const [showRsvpCards, setShowRsvpCards] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [creatingRsvp, setCreatingRsvp] = useState(false);
  const [previewingRsvp, setPreviewingRsvp] = useState(false);

  const numberOfGuestsOptions = [...Array(52).keys()];

  useEffect(() => {
    if (newRsvpMode === 'anonymous' && currentAnonRsvp) {
      setAnonymousRsvpName(currentAnonRsvp.anonymousAttendee?.name ?? '');
      setNumberOfGuests(currentAnonRsvp.numberOfGuests);
      setPublicNote(currentAnonRsvp.publicNote);
      setPrivateNote(currentAnonRsvp.privateNote);
      setRsvpStatus(currentAnonRsvp.status);
    } else if (newRsvpMode === 'user' && currentRsvp) {
      setNumberOfGuests(currentRsvp.numberOfGuests);
      setPublicNote(currentRsvp.publicNote);
      setPrivateNote(currentRsvp.privateNote);
      setRsvpStatus(currentRsvp.status);
    }
  }, [newRsvpMode, currentAnonRsvp, currentRsvp]);

  const scrollToRsvps = () =>
    document.querySelectorAll('.event-rsvp-manager')
      .forEach(e => e.scrollIntoView({ block: 'center', behavior: 'smooth' }));

  useEffect(() => {
    if (queryAnonAuthToken && queryAnonAuthToken !== '') {
      setTimeout(() => {
        setNewRsvpMode('anonymous');
      },
        1000)
    }
  }, [queryAnonAuthToken]);

  useEffect(() => {
    if (newRsvpMode !== undefined) {
      scrollToRsvps();
    }
  }, [newRsvpMode]);

  useEffect(() => {
    if (instance && !loaded && !loading) {
      setLoading(true);
      setTimeout(async () => {
        try {
          const client = await getCredentialClient(accountOrServer);
          const data = await client.getEventAttendances({
            eventInstanceId: instance?.id,
            anonymousAttendeeAuthToken: anonymousAuthToken
          }, client.credential);
          setAttendances(data.attendances);
        } catch (e) {
          console.error('Failed to load event attendances', e)
          setLoadFailed(true);
        } finally {
          setLoaded(true);
          setLoading(false);
        }
      }, 1);

      // setLoaded(true);
    }
  }, [accountOrServerId(accountOrServer), event?.id, instance?.id, loading, loaded]);

  const [rsvpStatus, setRsvpStatus] = useState(AttendanceStatus.INTERESTED);
  const [anonymousRsvpName, setAnonymousRsvpName] = useState('');
  const [publicNote, setPublicNote] = useState('');
  const [privateNote, setPrivateNote] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const canRsvp = (newRsvpMode === 'user' && account?.user) || anonymousRsvpName.length > 0;

  const upsertableAttendance = instance ? {
    eventInstanceId: instance.id,
    userAttendee: newRsvpMode === 'user'
      ? { userId: account?.user?.id }
      : undefined,
    anonymousAttendee: newRsvpMode === 'anonymous' ? {
      name: anonymousRsvpName,
      authToken: anonymousAuthToken
    } : undefined,
    status: rsvpStatus,
    numberOfGuests: numberOfGuests,
    privateNote,
    publicNote,
  } : undefined;

  const [upserting, setUpserting] = useState(false);
  async function upsertRsvp() {
    setUpserting(true);

    const client = await getCredentialClient(accountOrServer);
    client.upsertEventAttendance(upsertableAttendance!, client.credential).then((attendance) => {
      updateAttendance(attendance);

      if (newRsvpMode === 'anonymous') {
        setQueryAnonAuthToken(attendance.anonymousAttendee?.authToken ?? '');
      } else {
        setNewRsvpMode(undefined);
      }
    }).finally(() => setUpserting(false));
  }

  function updateAttendance(attendance: EventAttendance) {
    setAttendances([
      attendance,
      ...attendances.filter(a => a.id !== attendance.id)
    ]);
  }

  const [deleting, setDeleting] = useState(false);
  async function deleteRsvp(attendance: EventAttendance) {
    setDeleting(true);

    const client = await getCredentialClient(accountOrServer);
    client.deleteEventAttendance({
      eventInstanceId: instance.id,
      userAttendee: newRsvpMode === 'user'
        ? { userId: account?.user?.id }
        : undefined,
      anonymousAttendee: newRsvpMode === 'anonymous' ? {
        name: anonymousRsvpName,
        authToken: anonymousAuthToken
      } : undefined,
      status: rsvpStatus,
      numberOfGuests: numberOfGuests,
      privateNote,
      publicNote,
    }, client.credential).then((a) => {
      setAttendances([
        ...attendances.filter(a => a.id !== attendance.id)
      ]);
      setNewRsvpMode(undefined);
      if (attendance.anonymousAttendee !== undefined) {
        setQueryAnonAuthToken('');
      }
    }).finally(() => setDeleting(false));
  }

  if (!instance) {
    return <></>;
  }

  const editingAttendance = newRsvpMode === 'anonymous' ? currentAnonRsvp : newRsvpMode === 'user' ? currentRsvp : undefined;

  const nonPendingAttendances = attendances.filter(a => passes(a.moderation)).sort((a, b) => a.status - b.status);
  const [goingRsvpCount, goingAttendeeCount] = nonPendingAttendances
    .filter(a => a.status === AttendanceStatus.GOING)
    .reduce((acc, a) => [acc[0] + 1, acc[1] + a.numberOfGuests], [0, 0]);
  const [interestedRsvpCount, interestedAttendeeCount] = nonPendingAttendances
    .filter(a => [AttendanceStatus.INTERESTED, AttendanceStatus.REQUESTED].includes(a.status))
    .reduce((acc, a) => [acc[0] + 1, acc[1] + a.numberOfGuests], [0, 0]);


  const pendingAttendances = attendances.filter(a => pending(a.moderation)).sort((a, b) => a.status - b.status);
  const [pendingRsvpCount, pendingAttendeeCount] = pendingAttendances
    .reduce((acc, a) => [acc[0] + 1, acc[1] + a.numberOfGuests], [0, 0]);
  const hasPendingAttendances = pendingRsvpCount > 0 || pendingAttendeeCount > 0;

  const rejectedAttendances = attendances.filter(a => rejected(a.moderation)).sort((a, b) => a.status - b.status);

  const othersAttendances = nonPendingAttendances.filter(a => [currentRsvp, currentAnonRsvp].every(c => c?.id !== a.id));

  return showRsvpSection
    ? <YStack space='$2' mb='$4' mx='$3' className="event-rsvp-manager">
      <XStack id='rsvp-manager-buttons' space='$2' w='100%'>
        {hasPermission(accountOrServer?.account?.user, Permission.RSVP_TO_EVENTS)
          ? <Button disabled={upserting || loading} opacity={upserting || loading ? 0.5 : 1}
            transparent={newRsvpMode != 'user'} h='$7' f={1} p={0} onPress={() => setNewRsvpMode(newRsvpMode === 'user' ? undefined : 'user')}>
            <YStack ai='center'>
              <ZStack h='$2' w='$2'>
                <XStack animation='standard' rotate={newRsvpMode === 'user' ? '90deg' : '0deg'}
                  opacity={newRsvpMode === 'user' ? 1 : 0}>
                  <ChevronRight color={primaryAnchorColor} />
                </XStack>
                <XStack animation='standard' rotate={newRsvpMode === 'user' ? '45deg' : '0deg'}
                  opacity={!currentRsvp && newRsvpMode !== 'user' ? 1 : 0}>
                  <Plus color={primaryAnchorColor} />
                </XStack>
                <XStack animation='standard'
                  opacity={currentRsvp && newRsvpMode !== 'user' ? 1 : 0}>
                  <Edit color={primaryAnchorColor} />
                </XStack>
              </ZStack>
              <Heading color={primaryAnchorColor} size='$5'>RSVP</Heading>
            </YStack>
          </Button>
          : undefined}
        {event?.info?.allowsAnonymousRsvps
          ? <>
            <Button mb='$2' disabled={upserting || loading} opacity={upserting || loading ? 0.5 : 1}
              transparent={newRsvpMode != 'anonymous'} h='$7' f={1} p={0} onPress={() => setNewRsvpMode(newRsvpMode === 'anonymous' ? undefined : 'anonymous')}>
              <YStack ai='center'>
                <ZStack h='$2' w='$2'>
                  <XStack animation='standard' rotate={newRsvpMode === 'anonymous' ? '90deg' : '0deg'}
                    opacity={newRsvpMode === 'anonymous' ? 1 : 0}>
                    <ChevronRight color={navAnchorColor} />
                  </XStack>
                  <XStack animation='standard' rotate={newRsvpMode === 'anonymous' ? '45deg' : '0deg'}
                    opacity={!currentAnonRsvp && newRsvpMode !== 'anonymous' ? 1 : 0}>
                    <Plus color={navAnchorColor} />
                  </XStack>
                  <XStack animation='standard'
                    opacity={currentAnonRsvp && newRsvpMode !== 'anonymous' ? 1 : 0}>
                    <Edit color={navAnchorColor} />
                  </XStack>
                </ZStack>
                <Heading color={navAnchorColor} size='$3'>Anonymous</Heading>
                <Heading color={navAnchorColor} size='$2'>RSVP</Heading>
              </YStack>
            </Button>
          </>
          : undefined}
      </XStack>
      <AnimatePresence>
        {newRsvpMode !== undefined
          ? <YStack key='rsvp-section' space='$2' mb='$4' animation='standard' {...standardAnimation}>
            {newRsvpMode === 'anonymous'
              ? <>
                {/* {!previewingRsvp
                  ? <Input textContentType="name" f={1}
                    my='$1'
                    placeholder='Anonymous Auth Token (used for editing/deleting RSVPs)'
                    disabled={creatingRsvp} opacity={creatingRsvp || anonymousAuthToken == '' ? 0.5 : 1}
                    autoCapitalize='words'
                    value={anonymousAuthToken}
                    onChange={(data) => { setQueryAnonAuthToken(data.nativeEvent.text) }} />
                  : <Paragraph size='$1' my='auto' f={1}>Invite #{anonymousAuthToken}</Paragraph>} */}
                {queryAnonAuthToken && queryAnonAuthToken.length > 0 && !currentAnonRsvp
                  ? <Paragraph size='$2' mx='$4' mb='$2' als='center' ta='center'>
                    Your anonymous RSVP token was not found. Check the link you used to get here, or just create a new anonymous RSVP.
                  </Paragraph>
                  : undefined}
                {!previewingRsvp
                  ? <Input textContentType="name" f={1}
                    my='$1'

                    placeholder={`Anonymous Guest Name (required)`}
                    disabled={creatingRsvp} opacity={creatingRsvp || anonymousRsvpName == '' ? 0.5 : 1}
                    autoCapitalize='words'
                    value={anonymousRsvpName}
                    onChange={(data) => { setAnonymousRsvpName(data.nativeEvent.text) }} />
                  : <Heading my='auto' f={1}>{anonymousRsvpName}</Heading>}
              </>
              : previewingRsvp
                ? <Heading my='auto' f={1}>{account?.user?.username}</Heading>
                : undefined}


            <Select native onValueChange={v => setNumberOfGuests(parseInt(v))} value={numberOfGuests.toString()}>
              <Select.Trigger w='100%' f={1} iconAfter={ChevronDown}>
                <Select.Value w='100%' placeholder="Choose Visibility" />
              </Select.Trigger>

              <RadioGroup aria-labelledby="Do you plan to attend?" defaultValue={rsvpStatus.toString()}
                onValueChange={v => setRsvpStatus(parseInt(v))}
                value={rsvpStatus.toString()} name="form" >
                <XStack alignItems="center" space="$2" flexWrap="wrap" mb='$2'>
                  <RadioGroupItemWithLabel color={primaryAnchorColor} size="$3" value={AttendanceStatus.GOING.toString()} label="Going" />
                  <RadioGroupItemWithLabel color={navAnchorColor} size="$3" value={AttendanceStatus.INTERESTED.toString()} label="Interested" />
                  <RadioGroupItemWithLabel size="$3" value={AttendanceStatus.NOT_GOING.toString()} label="Not Going" />
                </XStack>
              </RadioGroup>


              <Select.Content zIndex={200000}>
                <Select.Viewport minWidth={200} w='100%'>
                  <XStack w='100%'>
                    <Select.Group space="$0" w='100%'>
                      {numberOfGuestsOptions.map(i => i + 1).map((item, i) => {
                        return (
                          <Select.Item
                            debug="verbose"
                            index={i}
                            key={item.toString()}
                            value={item.toString()}
                          >
                            <Select.ItemText>{item} {item === 1 ? 'attendee' : 'attendees'}</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        )
                      })}
                    </Select.Group>
                    <YStack
                      position="absolute"
                      right={0}
                      top={0}
                      bottom={0}
                      alignItems="center"
                      justifyContent="center"
                      width={'$4'}
                      pointerEvents="none"
                    >
                      <ChevronDown size='$2' />
                    </YStack>
                  </XStack>
                </Select.Viewport>
              </Select.Content>
            </Select>

            {!previewingRsvp
              ? <TextArea f={1} pt='$2' my='$1' value={publicNote}
                disabled={creatingRsvp} opacity={creatingRsvp || publicNote == '' ? 0.5 : 1}
                h={(publicNote?.length ?? 0) > 300 ? window.innerHeight - 100 : undefined}
                onChangeText={setPublicNote}
                placeholder={`Public note (optional). Markdown is supported.`} />
              : <YStack maw={600} als='center' width='100%'>
                <TamaguiMarkdown text={publicNote} />
              </YStack>}

            {!previewingRsvp
              ? <TextArea f={1} pt='$2' my='$1' value={privateNote}
                disabled={creatingRsvp} opacity={creatingRsvp || privateNote == '' ? 0.5 : 1}
                h={(privateNote?.length ?? 0) > 300 ? window.innerHeight - 100 : undefined}
                onChangeText={setPrivateNote}
                placeholder={`Private note (optional). Markdown is supported.`} />
              : <YStack maw={600} als='center' width='100%'>
                <TamaguiMarkdown text={privateNote} />
              </YStack>}
            {newRsvpMode === 'anonymous'
              ? <>
                {queryAnonAuthToken && queryAnonAuthToken.length > 0
                  ? <>
                    {currentAnonRsvp
                      ? <>
                        <Paragraph size='$4' mx='$4' my='$1' als='center' ta='center'>
                          Save <Anchor href={`/rsvp/${queryAnonAuthToken}`} color={navAnchorColor} target='_blank'>this private RSVP link</Anchor> to update your RSVP later.
                        </Paragraph>

                        <Dialog>
                          <Dialog.Trigger asChild>
                            <Button transparent mx='auto' color={primaryAnchorColor} disabled={upserting || deleting} opacity={!upserting && !deleting ? 1 : 0.5}>
                              Create New Anonymous RSVP
                            </Button>
                          </Dialog.Trigger>
                          <Dialog.Portal zi={1000011}>
                            <Dialog.Overlay
                              key="overlay"
                              animation="quick"
                              o={0.5}
                              enterStyle={{ o: 0 }}
                              exitStyle={{ o: 0 }}
                            />
                            <Dialog.Content
                              bordered
                              elevate
                              key="content"
                              animation={[
                                'quick',
                                {
                                  opacity: {
                                    overshootClamping: true,
                                  },
                                },
                              ]}
                              m='$3'
                              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                              x={0}
                              scale={1}
                              opacity={1}
                              y={0}
                            >
                              <YStack space>
                                <Dialog.Title>Create New Anonymous RSVP</Dialog.Title>
                                <Dialog.Description>
                                  Make sure you've saved the <Anchor href={`/rsvp/${queryAnonAuthToken}`} color={navAnchorColor} target='_blank'>this private RSVP link</Anchor>
                                  to update/delete your current RSVP later!
                                </Dialog.Description>

                                <XStack space="$3" jc="flex-end">
                                  <Dialog.Close asChild>
                                    <Button>Cancel</Button>
                                  </Dialog.Close>
                                  <Dialog.Close asChild>
                                    {/* <Theme inverse> */}
                                    <Button color={primaryAnchorColor}
                                      onPress={() => setQueryAnonAuthToken(undefined)}>
                                      Delete
                                    </Button>
                                    {/* </Theme> */}
                                  </Dialog.Close>
                                </XStack>
                              </YStack>
                            </Dialog.Content>
                          </Dialog.Portal>
                        </Dialog>
                      </>
                      : undefined}

                  </>
                  : <Paragraph size='$1' mx='$4' my='$1' ta='center'>
                    When you press "RSVP", you will be assigned a unique RSVP link.
                    You can use it to edit or delete your RSVP later.
                    Save it in your browser bookmarks, notes app, or calendar app of choice.
                  </Paragraph>}
              </>
              : undefined}
            <XStack w='100%' space='$2'>
              <Button f={1} disabled={!canRsvp || upserting || deleting} opacity={canRsvp && !upserting && !deleting ? 1 : 0.5}
                onPress={upsertRsvp} color={newRsvpMode === 'anonymous' ? navAnchorColor : primaryAnchorColor}>
                {editingAttendance ? 'Update RSVP' : 'RSVP'}
              </Button>
              {editingAttendance
                ? <Dialog>
                  <Dialog.Trigger asChild>
                    <Button f={1} disabled={upserting || deleting} opacity={!upserting && !deleting ? 1 : 0.5}>
                      Delete RSVP
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Portal zi={1000011}>
                    <Dialog.Overlay
                      key="overlay"
                      animation="quick"
                      o={0.5}
                      enterStyle={{ o: 0 }}
                      exitStyle={{ o: 0 }}
                    />
                    <Dialog.Content
                      bordered
                      elevate
                      key="content"
                      animation={[
                        'quick',
                        {
                          opacity: {
                            overshootClamping: true,
                          },
                        },
                      ]}
                      m='$3'
                      enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                      exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                      x={0}
                      scale={1}
                      opacity={1}
                      y={0}
                    >
                      <YStack space>
                        <Dialog.Title>Delete RSVP</Dialog.Title>
                        <Dialog.Description>
                          Really delete this RSVP?
                        </Dialog.Description>

                        <XStack space="$3" jc="flex-end">
                          <Dialog.Close asChild>
                            <Button>Cancel</Button>
                          </Dialog.Close>
                          <Dialog.Close asChild>
                            {/* <Theme inverse> */}
                            <Button color={primaryAnchorColor}
                              onPress={() => deleteRsvp(editingAttendance)}>
                              Delete
                            </Button>
                            {/* </Theme> */}
                          </Dialog.Close>
                        </XStack>
                      </YStack>
                    </Dialog.Content>
                  </Dialog.Portal>
                </Dialog>
                : undefined}
              <Button f={1} disabled={upserting || deleting} opacity={!upserting && !deleting ? 1 : 0.5}
                onPress={() => setNewRsvpMode(undefined)}>
                Cancel
              </Button>
            </XStack>
          </YStack>
          : undefined}
        <Button key='rsvp-card-toggle'
          h={hasPendingAttendances
            ? (mediaQuery.gtXxxxs ? '$10' : '$15')
            : (mediaQuery.gtXxxxs ? '$5' : '$10')}
          onPress={() => setShowRsvpCards(!showRsvpCards)} disabled={attendances.length === 0} o={attendances.length === 0 ? 0.5 : 1}>
          <XStack w='100%'>
            <YStack f={1}>
              {hasPendingAttendances
                ? <XStack w='100%' flexWrap="wrap">
                  <Paragraph size='$1' fontWeight='700'>{isEventOwner ? 'Pending Your Approval' : 'Pending Owner Approval'}</Paragraph>
                  {loaded
                    ? <Paragraph size='$1' ml='auto'>{pendingRsvpCount} {pendingRsvpCount === 1 ? 'RSVP' : 'RSVPs'} | {pendingAttendeeCount} {pendingAttendeeCount === 1 ? 'attendee' : 'attendees'}</Paragraph>
                    : <Paragraph size='$1' ml='auto'>...</Paragraph>}
                </XStack>
                : undefined}
              <XStack w='100%' flexWrap="wrap">
                <Paragraph size='$1' color={primaryAnchorColor}>Going</Paragraph>
                {loaded
                  ? <Paragraph size='$1' ml='auto'>{goingRsvpCount} {goingRsvpCount === 1 ? 'RSVP' : 'RSVPs'} | {goingAttendeeCount} {goingAttendeeCount === 1 ? 'attendee' : 'attendees'}</Paragraph>
                  : <Paragraph size='$1' ml='auto'>...</Paragraph>}
              </XStack>
              <XStack w='100%' flexWrap="wrap">
                <Paragraph size='$1' color={navAnchorColor}>Interested/Invited</Paragraph>
                {loaded
                  ? <Paragraph size='$1' ml='auto'>{interestedRsvpCount} {interestedRsvpCount === 1 ? 'RSVP' : 'RSVPs'} | {interestedAttendeeCount} {interestedAttendeeCount === 1 ? 'attendee' : 'attendees'}</Paragraph>
                  : <Paragraph size='$1' ml='auto'>...</Paragraph>}
              </XStack>
            </YStack>
            <XStack animation='quick' my='auto' ml='$2' rotate={showRsvpCards ? '90deg' : '0deg'}>
              <ChevronRight />
            </XStack>
          </XStack>
        </Button>
        {showRsvpCards
          ? <YStack key='attendance-cards' mt='$2' space='$2' animation='standard' {...standardAnimation}>
            <AnimatePresence>
              {loadFailed
                ? <AlertTriangle key='error' />
                : undefined}

              {currentRsvp || currentAnonRsvp
                ? <Heading size='$6' mx='auto' key='your-rsvps'
                  animation='standard'
                  {...standardAnimation}>Your {currentRsvp && currentAnonRsvp ? 'RSVPs' : 'RSVP'}</Heading>
                : undefined}
              {currentAnonRsvp //&& newRsvpMode !== 'anonymous'
                ? <Theme inverse={newRsvpMode === 'anonymous'}>
                  <RsvpCard key={`current-anon-rsvp-${currentAnonRsvp.anonymousAttendee?.authToken}`}
                    attendance={currentAnonRsvp}
                    event={event}
                    instance={instance}
                    onPressEdit={() => {
                      setNewRsvpMode('anonymous');
                      scrollToRsvps();
                      // document.querySelectorsrsvp-manager-buttons')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                    }}
                    onModerated={updateAttendance}
                  />
                </Theme>
                : undefined}
              {currentRsvp //&& newRsvpMode !== 'user'
                ? <Theme inverse={newRsvpMode === 'user'}>
                  <RsvpCard key={`current-rsvp-${currentRsvp.userAttendee?.userId}`}
                    attendance={currentRsvp}
                    event={event}
                    instance={instance}
                    onPressEdit={() => {
                      setNewRsvpMode('user');
                      scrollToRsvps();
                      // document.querySelector('#rsvp-manager-buttons')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                    }}
                    onModerated={updateAttendance}
                  />
                </Theme>
                : undefined}

              {pendingAttendances.length > 0
                ? <Heading size='$6' mx='auto' key='pending-rsvps'
                  animation='standard'
                  {...standardAnimation}>Pending RSVPs</Heading>
                : undefined}
              {pendingAttendances.map((attendance, index) => {
                return <RsvpCard key={`pending-rsvp-${attendance.userAttendee?.userId ?? index}`}
                  attendance={attendance}
                  event={event}
                  instance={instance}
                  onModerated={updateAttendance}
                />;
              })}

              {othersAttendances.length > 0
                ? <Heading size='$6' mx='auto' key='other-rsvps'
                  animation='standard'
                  {...standardAnimation}>Others' RSVPs</Heading>
                : undefined}
              {othersAttendances.map((attendance, index) => {
                return <RsvpCard key={`non-pending-rsvp-${attendance.userAttendee?.userId ?? index}`}
                  attendance={attendance}
                  event={event}
                  instance={instance}
                  onModerated={updateAttendance}
                />;
              })}

              {rejectedAttendances.length > 0
                ? <Heading size='$6' mx='auto' key='rejected-rsvps'
                  animation='standard'
                  {...standardAnimation}>Rejected RSVPs</Heading>
                : undefined}
              {rejectedAttendances.map((attendance, index) => {
                return <RsvpCard key={`rejected-rsvp-${attendance.userAttendee?.userId ?? index}`}
                  attendance={attendance}
                  event={event}
                  instance={instance}
                  onModerated={updateAttendance}
                />;
              })}
            </AnimatePresence>
          </YStack>
          : undefined}
      </AnimatePresence>
    </YStack>
    : <></>;
};

export function RadioGroupItemWithLabel(props: {
  size: SizeTokens
  value: string
  label: string
  color?: string
}) {
  const id = `radiogroup-${props.value}`
  return (
    <XStack f={1} alignItems="center" space="$4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label size={props.size} htmlFor={id} color={props.color}>
        {props.label}
      </Label>
    </XStack>
  )
}
