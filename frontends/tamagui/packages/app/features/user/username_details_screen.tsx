import { Moderation, Permission, User } from '@jonline/api'
import { Button, dismissScrollPreserver, Heading, isClient, isWeb, needsScrollPreservers, ScrollView, Text, TextArea, Tooltip, useWindowDimensions, XStack, YStack } from '@jonline/ui'
import { CheckCircle, ChevronRight, Edit, Eye, AlertTriangle } from '@tamagui/lucide-icons';
import { clearUserAlerts, loadUsername, loadUserPosts, RootState, selectUserById, updateUser, useCredentialDispatch, userSaved, useServerTheme, useTypedSelector } from 'app/store'
import { pending } from 'app/utils/moderation'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import StickyBox from "react-sticky-box"
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { useAccount } from '../../store/store'
import { AsyncPostCard } from '../post/async_post_card'
import { TamaguiMarkdown } from '../post/tamagui_markdown'
import { ToggleRow } from '../settings_sheet'
import { TabsNavigation } from '../tabs/tabs_navigation'
import UserCard from './user_card'


const { useParam } = createParam<{ username: string }>()

export function UsernameDetailsScreen() {
  const [username] = useParam('username')
  const linkProps = useLink({ href: '/' })

  const { server, primaryColor, primaryTextColor, navColor, navTextColor } = useServerTheme();
  const userId = useTypedSelector((state: RootState) => username ? state.users.usernameIds[username] : undefined);
  const user = useTypedSelector((state: RootState) =>
    userId ? selectUserById(state.users, userId) : undefined);
  const { dispatch, accountOrServer } = useCredentialDispatch();
  const usersState = useTypedSelector((state: RootState) => state.users);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showPermissionsAndVisibility, setShowPermissionsAndVisibility] = useState(false);
  const userLoadFailed = usersState.failedUsernames.includes(username!);
  const isCurrentUser = accountOrServer.account && accountOrServer.account?.user?.id == user?.id;
  const isAdmin = accountOrServer.account?.user?.permissions?.includes(Permission.ADMIN);
  const canEdit = isCurrentUser || isAdmin;
  const [name, setName] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const avatar = useTypedSelector((state: RootState) => userId ? state.users.avatars[userId] : undefined);
  const [updatedAvatar, setUpdatedAvatar] = useState(avatar);
  const [editMode, setEditMode] = useState(false);
  const [defaultFollowModeration, setDefaultFollowModeration] = useState(user?.defaultFollowModeration ?? Moderation.MODERATION_UNKNOWN);

  const successSaving = useTypedSelector((state: RootState) => state.users.successMessage == userSaved);
  const dirtyData = name != user?.username || bio != user?.bio || updatedAvatar != avatar
    || defaultFollowModeration != user?.defaultFollowModeration;

  const userPosts = useTypedSelector((state: RootState) => {
    return userId ? (state.users.idPosts ?? {})[userId] : undefined
  });
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);
  useEffect(() => {
    if (user && !name) {
      setName(user.username);
      setBio(user.bio);
      setUpdatedAvatar(avatar);
      setDefaultFollowModeration(user.defaultFollowModeration);
    }
    if (dirtyData && successSaving) {
      dispatch(clearUserAlerts!());
    }
    if (editMode && !canEdit) setEditMode(false);
    if (userId && !userPosts && !loadingUserPosts) {
      setLoadingUserPosts(true);
      reloadPosts();
    } else if (userPosts) {
      setLoadingUserPosts(false);
      dismissScrollPreserver(setShowScrollPreserver);
    }
  });

  function reloadPosts() {
    if (!accountOrServer.server) return;

    setTimeout(() =>
      dispatch(loadUserPosts({ ...accountOrServer, userId: userId! })), 1);
  }

  const [showScrollPreserver, setShowScrollPreserver] = useState(needsScrollPreservers());
  useEffect(() => {
    if (username && !loadingUser && (!user || usersState.status == 'unloaded') && !userLoadFailed) {
      setLoadingUser(true);
      setTimeout(() => dispatch(loadUsername({ ...accountOrServer, username: username! })));
    } else if (loadingUser && (user || userLoadFailed)) {
      setLoadingUser(false);
    }
    if (user && showScrollPreserver) {
      dismissScrollPreserver(setShowScrollPreserver);
    }
  });
  const windowHeight = useWindowDimensions().height;
  function saveUser() {
    if (!canEdit && !user) return;

    setTimeout(() => dispatch(updateUser({
      ...accountOrServer,
      user: { ...user!, bio: bio ?? '', defaultFollowModeration },
      avatar: avatar,
    })));
  }
  const postsState = useTypedSelector((state: RootState) => state.posts);
  const loading = usersState.status == 'loading' || usersState.status == 'unloaded'
    || postsState.status == 'loading' || postsState.status == 'unloaded';

  return (
    <TabsNavigation>
      <YStack f={1} jc="center" ai="center" space margin='$3' w='100%'>
        {user ? <>
          <ScrollView w='100%'>
            <YStack maw={800} w='100%' als='center' marginHorizontal='auto'>
              <UserCard user={user} setUsername={editMode ? setName : undefined} setAvatar={editMode ? setUpdatedAvatar : undefined} />
              <YStack als='center' w='100%' p='$3' space>
                {editMode ?
                  <TextArea value={bio} onChangeText={t => setBio(t)}
                    placeholder={`Edit ${isCurrentUser ? 'your' : `${name}'s`} user bio. Markdown is supported.`}

                    scale={1}
                    y={0}
                    enterStyle={{
                      y: -50,
                      opacity: 0,
                    }}
                    exitStyle={{
                      opacity: 0,
                    }} />
                  : <YStack
                    scale={1}
                    y={0}
                    enterStyle={{
                      y: -50,
                      opacity: 0,
                    }}
                    exitStyle={{
                      opacity: 0,
                    }}>
                      <TamaguiMarkdown text={bio!} />
                      </YStack>}
                {/* {canEdit ?
                <TextArea value={bio} onChangeText={t => setBio(t)}
                  placeholder='Your user bio' />
                : <TamaguiMarkdown text={bio!} />}
              {canEdit ?
                <TextArea value={bio} onChangeText={t => setBio(t)}
                  placeholder='Your user bio' />
                : <TamaguiMarkdown text={bio!} />}
              {canEdit ?
                <TextArea value={bio} onChangeText={t => setBio(t)}
                  placeholder='Your user bio' />
                : <TamaguiMarkdown text={bio!} />}
              {canEdit ?
                <TextArea value={bio} onChangeText={t => setBio(t)}
                  placeholder='Your user bio' />
                : <TamaguiMarkdown text={bio!} />} */}
              </YStack>
              <Button mt={-15} onPress={() => setShowPermissionsAndVisibility(!showPermissionsAndVisibility)} transparent>
                <XStack ac='center' jc='center'>
                  <Heading size='$4' ta='center'>Visibility & Permissions</Heading>
                  <XStack animation='bouncy' rotate={showPermissionsAndVisibility ? '90deg' : '0deg'}>
                    <ChevronRight />
                  </XStack>
                </XStack>
              </Button>
              <UserVisibilityPermissions expanded={showPermissionsAndVisibility}
                {...{ user, defaultFollowModeration, setDefaultFollowModeration, editMode }} />

              {(userPosts || []).length > 0 ?
                <>
                  <Heading size='$4' ta='center'>Latest Activity</Heading>
                  <FlatList data={userPosts} style={{ width: '100%' }}
                    // onRefresh={reloadPosts}
                    // refreshing={postsState.status == 'loading'}
                    // Allow easy restoring of scroll position
                    ListFooterComponent={showScrollPreserver ? <YStack h={100000} /> : undefined}
                    keyExtractor={(postId) => postId}
                    renderItem={({ item: postId }) => {
                      return <AsyncPostCard key={`userpost-${postId}`} postId={postId} />;
                    }} />
                </>
                : loading ? undefined : <Heading size='$1' ta='center'>No posts yet</Heading>}

              {isWeb && canEdit ? <YStack h={50} /> : undefined}
            </YStack>
          </ScrollView>
          {canEdit ?
            isWeb ? <StickyBox bottom offsetBottom={0} className='blur' style={{ width: '100%' }}>
              <YStack w='100%' opacity={.92} paddingVertical='$2' backgroundColor='$background' alignContent='center'>
                <XStack alignItems='center'>
                  <XStack f={1} />
                  <Tooltip placement="top-start">
                    <Tooltip.Trigger>
                      <Button backgroundColor={editMode ? undefined : navColor} color={editMode ? undefined : navTextColor} als='center' onPress={() => setEditMode(false)} icon={Eye} circular mr='$2' />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <Heading size='$2'>View {isCurrentUser ? 'your' : 'this'} profile</Heading>
                    </Tooltip.Content>
                  </Tooltip>
                  <Tooltip placement="top-start">
                    <Tooltip.Trigger>
                      <Button backgroundColor={!editMode ? undefined : navColor} color={!editMode ? undefined : navTextColor} als='center' onPress={() => {
                        setEditMode(true); isClient && window.scrollTo({ top: 0, behavior: 'smooth' })
                      }} icon={Edit} circular mr='$5' />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <Heading size='$2'>Edit {isCurrentUser ? 'your' : 'this'} profile</Heading>
                    </Tooltip.Content>
                  </Tooltip>
                  {dirtyData ? <YStack animation="bouncy"
                    p='$3'
                    opacity={1}
                    scale={1}
                    y={0}
                    enterStyle={{ y: -50, opacity: 0, }}
                    exitStyle={{ opacity: 0, }}>
                    <AlertTriangle color='yellow' />
                  </YStack> : <YStack animation="bouncy"
                    p='$3'
                    opacity={0}>
                    <AlertTriangle color='yellow' />
                  </YStack>}
                  <Button backgroundColor={primaryColor} als='center' onPress={saveUser}>
                    <Heading size='$2' color={primaryTextColor}>Save</Heading>
                  </Button>
                  {successSaving ? <YStack animation="bouncy"
                    p='$3'
                    opacity={1}
                    scale={1}
                    y={0}
                    enterStyle={{ y: -50, opacity: 0, }}
                    exitStyle={{ opacity: 0, }}>
                    <CheckCircle color='green' />
                  </YStack> : <YStack animation="bouncy"
                    p='$3'
                    opacity={0}>
                    <CheckCircle color='green' />
                  </YStack>}
                  <XStack f={1} />
                </XStack>
              </YStack>
            </StickyBox>
              : <Button mt='$3' backgroundColor={primaryColor} onPress={saveUser}>Save Changes</Button>
            : undefined}
        </>
          : userLoadFailed
            ? <YStack width='100%' maw={800} jc="center" ai="center">
              <Heading size='$5' mb='$3'>The profile for <Text fontFamily='$body' fontSize='$7'>{username}</Text> could not be loaded.</Heading>
              <Heading size='$3' ta='center'>They may either not exist, not be visible to you, or be hidden by moderators.</Heading>
            </YStack>
            : <Heading size='$3'>Loading{username ? ` ${username}` : ''}</Heading>}
      </YStack>
    </TabsNavigation>
  )
}

interface UserVisibilityPermissionsProps {
  user: User,
  defaultFollowModeration: Moderation,
  setDefaultFollowModeration: (v: Moderation) => void,
  expanded?: boolean;
  editMode: boolean;
}

const UserVisibilityPermissions: React.FC<UserVisibilityPermissionsProps> = ({ user, defaultFollowModeration, setDefaultFollowModeration, editMode, expanded = true }) => {
  const account = useAccount();
  const isCurrentUser = account && account?.user?.id == user.id;
  const isAdmin = account?.user?.permissions?.includes(Permission.ADMIN);
  const canEdit = isCurrentUser || isAdmin;
  return expanded ? <YStack animation="bouncy"
    p='$3'
    opacity={1}
    scale={1}
    y={0}
    enterStyle={{
      y: -50,
      opacity: 0,
    }}
    exitStyle={{
      opacity: 0,
    }}>
    <ToggleRow name={`Require${editMode && isCurrentUser ? '' : 's'} Permission to Follow`} value={pending(defaultFollowModeration)}
      disabled={!editMode || !canEdit}
      setter={(v) => setDefaultFollowModeration(v ? Moderation.PENDING : Moderation.UNMODERATED)} />

  </YStack> : <></>;
}