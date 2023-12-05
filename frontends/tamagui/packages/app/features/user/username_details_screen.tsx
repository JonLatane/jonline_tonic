import { Moderation, Permission, User, Visibility } from '@jonline/api';
import { AnimatePresence, Button, Dialog, Heading, Input, Paragraph, ScrollView, Spinner, Text, TextArea, Theme, Tooltip, XStack, YStack, ZStack, dismissScrollPreserver, isClient, isWeb, needsScrollPreservers, reverseHorizontalAnimation, standardHorizontalAnimation, useMedia, useToastController, useWindowDimensions } from '@jonline/ui';
import { AlertTriangle, CheckCircle, ChevronRight, Edit, Eye, SquareAsterisk, Trash, XCircle } from '@tamagui/lucide-icons';
import { PermissionsEditor, PermissionsEditorProps, TamaguiMarkdown, ToggleRow, VisibilityPicker } from 'app/components';
import { useAccount, useCredentialDispatch } from 'app/hooks';
import { RootState, deleteUser, getFederated, loadUserPosts, loadUsername, resetPassword, selectUserById, updateUser, useRootSelector, useServerTheme } from 'app/store';
import { hasAdminPermission, pending, setDocumentTitle, themedButtonBackground } from 'app/utils';
import React, { useEffect, useState } from 'react';
import StickyBox from "react-sticky-box";
import { createParam } from 'solito';
import { useLink } from 'solito/link';
import { PostCard } from '../post/post_card';
import { AppSection } from '../navigation/features_navigation';
import { TabsNavigation } from '../navigation/tabs_navigation';
import { UserCard, useFullAvatarHeight } from './user_card';

const { useParam } = createParam<{ username: string }>()

export function UsernameDetailsScreen() {
  const [inputUsername] = useParam('username');
  const linkProps = useLink({ href: '/' });

  const { server, primaryColor, primaryTextColor, navColor, navTextColor } = useServerTheme();
  const paramUserId: string | undefined = useRootSelector((state: RootState) => inputUsername ? state.users.usernameIds[inputUsername] : undefined);
  const [userId, setUserId] = useState(paramUserId);
  const user = useRootSelector((state: RootState) => userId ? selectUserById(state.users, userId) : undefined);
  const { dispatch, accountOrServer } = useCredentialDispatch();
  const usersState = useRootSelector((state: RootState) => state.users);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const userLoadFailed = getFederated(usersState.failedUsernames, server).includes(inputUsername!);
  const isCurrentUser = accountOrServer.account && accountOrServer.account?.user?.id == user?.id;
  const isAdmin = hasAdminPermission(accountOrServer.account?.user);
  const canEdit = isCurrentUser || isAdmin;
  const [username, setUsername] = useState(user?.username);
  const [bio, setBio] = useState(user?.bio);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [editMode, setEditMode] = useState(false);
  const [defaultFollowModeration, setDefaultFollowModeration] = useState(user?.defaultFollowModeration ?? Moderation.MODERATION_UNKNOWN);
  const [visibility, setVisibility] = useState(Visibility.GLOBAL_PUBLIC);
  const [permissions, setPermissions] = useState(user?.permissions ?? []);
  function selectPermission(permission: Permission) {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p != permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  }
  function deselectPermission(permission: Permission) {
    setPermissions(permissions.filter(p => p != permission));
  }

  const permissionsEditorProps: PermissionsEditorProps = {
    selectedPermissions: permissions,
    selectPermission,
    deselectPermission,
    editMode
  };

  const permissionsModified = JSON.stringify(permissions) !== JSON.stringify(user?.permissions ?? []);
  const dirtyData = user !== undefined && (
    username != user?.username || bio != user?.bio || avatar?.id != user?.avatar?.id
    || defaultFollowModeration != user?.defaultFollowModeration || visibility != user?.visibility
    || permissionsModified
  );

  const userPosts = useRootSelector((state: RootState) => {
    return userId
      ? (state.users.idPosts ?? {})[userId]
        ?.map(postId => state.posts.entities[postId]!)
      : undefined
  });
  const [showScrollPreserver, setShowScrollPreserver] = useState(needsScrollPreservers());
  const [loadingUserPosts, setLoadingUserPosts] = useState(false);
  const [loadingUserEvents, setLoadingUserEvents] = useState(false);
  const fullAvatarHeight = useFullAvatarHeight();
  function resetFormData() {
    if (!user) {
      setUsername(undefined);
      setBio(undefined);
      setAvatar(undefined);
      setDefaultFollowModeration(Moderation.MODERATION_UNKNOWN);
      setVisibility(Visibility.VISIBILITY_UNKNOWN);
      setPermissions([]);
      return;
    };

    setUsername(user.username);
    setBio(user.bio);
    setAvatar(user.avatar);
    setDefaultFollowModeration(user.defaultFollowModeration);
    setVisibility(user.visibility);
    setPermissions(user.permissions);
  }

  const [successSaving, setSuccessSaving] = useState(false);
  useEffect(() => {
    if (paramUserId != userId) {
      setUserId(paramUserId);
      resetFormData();
    }
  }, [paramUserId, userId]);
  useEffect(() => {
    if (user && !username) {
      setUserId(paramUserId);
      resetFormData();
    }
  }, [user, username]);
  // useEffect(() => {
  //   if (dirtyData && successSaving) {
  //     dispatch(clearUserAlerts!());
  //   }
  // }, [dirtyData, successSaving]);
  useEffect(() => {
    if (editMode && !canEdit) setEditMode(false);
  }, [editMode, canEdit]);
  useEffect(() => {
    if (userId && !userPosts && !loadingUserPosts) {
      setLoadingUserPosts(true);
      setTimeout(() => dispatch(loadUserPosts({ ...accountOrServer, userId: userId! })), 1);
    } else if (loadingUserPosts && userPosts) {
      setLoadingUserPosts(false);
    }
  }, [userId, userPosts, loadingUserPosts]);

  // function reloadPosts() {
  //   if (!accountOrServer.server) return;

  //   setTimeout(() =>
  //     dispatch(loadUserPosts({ ...accountOrServer, userId: userId! })), 1);
  // }

  useEffect(() => {
    if (inputUsername && !loadingUser && (!user /*|| usersState.status == 'unloaded'*/) && !userLoadFailed) {
      setLoadingUser(true);
      setTimeout(() => dispatch(loadUsername({ ...accountOrServer, username: inputUsername! })));
    } else if (loadingUser && (user || userLoadFailed)) {
      setLoadingUser(false);
    }
  }, [inputUsername, loadingUser, user, /*usersState.status,*/ userLoadFailed]);
  useEffect(() => {
    if (user && userPosts && showScrollPreserver) {
      dismissScrollPreserver(setShowScrollPreserver);
    }
  }, [user, userPosts, showScrollPreserver])
  const windowHeight = useWindowDimensions().height;
  const [saving, setSaving] = useState(false);
  //= useRootSelector((state: RootState) => state.users.successMessage == userSaved);
  const toast = useToastController()

  useEffect(() => {
    const serverName = server?.serverConfiguration?.serverInfo?.name || '...';
    const realName = (user?.realName?.length ?? 0) > 0 ? user?.realName : undefined;
    let title = realName ?? username ?? 'User';
    title += ` | Profile | ${serverName}`;
    setDocumentTitle(title)
  }, [user, username]);

  async function saveUser() {
    if (!canEdit && !user) return;

    const usernameChanged = username != user?.username;

    setSaving(true);
    dispatch(updateUser({
      ...accountOrServer,
      ...{ ...user!, username: username ?? '', bio: bio ?? '', avatar, defaultFollowModeration, visibility, permissions },
    })).then((result) => {
      const success = result.type == updateUser.fulfilled.type;
      if (success && usernameChanged) {
        window.location.replace(`/${username}`);
      }
      if (!success) {
        toast.show('Failed to save profile changes.', {
          message: usernameChanged ? 'The new username may be taken or invalid.' : undefined,
        })
      } else {
        toast.show('Profile saved.')
      }
      setSuccessSaving(success);
      setSaving(false);
      setTimeout(() => setSuccessSaving(false), 3000);
    });
  }
  const postsState = useRootSelector((state: RootState) => state.posts);
  const loading = loadingUser || loadingUserPosts || loadingUserEvents;

  // const loading = usersState.status == 'loading' || usersState.status == 'unloaded'
  //   || postsState.status == 'loading' || postsState.status == 'unloaded';

  return (
    <TabsNavigation appSection={AppSection.PROFILE}>
      <YStack f={1} jc="center" ai="center" space margin='$3' w='100%'>
        {user ? <>
          <ScrollView w='100%'>
            <YStack maw={800} w='100%' als='center' p='$2' marginHorizontal='auto'>
              <UserCard
                editable editingDisabled={!editMode}
                user={user}
                username={username}
                setUsername={setUsername}
                avatar={avatar}
                setAvatar={setAvatar} />
              <YStack als='center' w='100%' paddingHorizontal='$2' paddingVertical='$3' space>
                {editMode ?
                  <TextArea key='bio-edit' animation='quick' {...standardHorizontalAnimation}
                    value={bio} onChangeText={t => setBio(t)}
                    // size='$5'
                    h='$14'
                    placeholder={`Edit ${isCurrentUser ? 'your' : `${username}'s`} user bio. Markdown is supported.`}
                  />
                  : <YStack key='bio-markdown' animation='quick' {...reverseHorizontalAnimation}>
                    <TamaguiMarkdown text={bio!} />
                  </YStack>}
              </YStack>
              <Button mt={-15} onPress={() => setShowUserSettings(!showUserSettings)} transparent>
                <XStack ac='center' jc='center'>
                  <Heading size='$4' ta='center'>User Settings</Heading>
                  <XStack animation='standard' rotate={showUserSettings ? '90deg' : '0deg'}>
                    <ChevronRight />
                  </XStack>
                </XStack>
              </Button>
              <UserVisibilityPermissions expanded={showUserSettings}
                {...{ user, defaultFollowModeration, setDefaultFollowModeration, visibility, setVisibility, permissionsEditorProps, editMode }} />

              {(userPosts || []).length > 0 ?
                <>
                  <Heading size='$4' ta='center' mt='$2'>Latest Activity</Heading>
                  <>
                    <YStack>
                      {userPosts?.map((post) => {
                        return <PostCard key={`userpost-${post.id}`} post={post} isPreview />;
                        // return <AsyncPostCard key={`userpost-${postId}`} postId={postId} />;
                      })}
                      {showScrollPreserver ? <YStack h={100000} /> : undefined}
                    </YStack>
                  </>
                </>
                : loading ? undefined : <Heading size='$1' ta='center'>No posts yet</Heading>}

              {isWeb && canEdit ? <YStack h={50} /> : undefined}
            </YStack>
          </ScrollView>
          {canEdit ?
            isWeb ? <StickyBox bottom offsetBottom={0} className='blur' style={{ width: '100%' }}>
              <YStack w='100%' opacity={.92} paddingVertical='$2' alignContent='center'>
                <XStack mx='auto' px='$3' w='100%' maw={800}>
                  {/* <XStack f={1} /> */}
                  <Tooltip placement="top-start">
                    <Tooltip.Trigger>
                      <Button icon={Eye} circular mr='$2' als='center'
                        {...themedButtonBackground(editMode ? undefined : navColor, editMode ? undefined : navTextColor)}
                        onPress={() => setEditMode(false)} />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <Heading size='$2'>View {isCurrentUser ? 'your' : 'this'} profile</Heading>
                    </Tooltip.Content>
                  </Tooltip>
                  <Tooltip placement="top-start">
                    <Tooltip.Trigger>
                      <Button icon={Edit} circular mr='$5' als='center'
                        {...themedButtonBackground(!editMode ? undefined : navColor, !editMode ? undefined : navTextColor)}
                        onPress={() => {
                          setEditMode(true);
                          // setShowPermissionsAndVisibility(true);
                          const maxScrollPosition = 270 + (avatar ? fullAvatarHeight : 0);
                          if (window.scrollY > maxScrollPosition) {
                            isClient && window.scrollTo({ top: maxScrollPosition, behavior: 'smooth' });
                          }
                        }} />
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      <Heading size='$2'>Edit {isCurrentUser ? 'your' : 'this'} profile</Heading>
                    </Tooltip.Content>
                  </Tooltip>

                  <XStack f={1} />
                  {/* <YStack animation='quick' o={dirtyData ? 1 : 0} p='$3'>
                      <AlertTriangle color='yellow' />
                    </YStack> */}
                  <ZStack w={48} h={48}>
                    <YStack animation='quick' o={successSaving ? 1 : 0} p='$3'>
                      <CheckCircle color='green' />
                    </YStack>
                    <YStack animation='quick' o={dirtyData ? 1 : 0} p='$3'>
                      <AlertTriangle color='yellow' />
                    </YStack>
                    <YStack animation='quick' o={saving ? 1 : 0} p='$3'>
                      <Spinner size='small' />
                    </YStack>
                  </ZStack>
                  <Button key={`save-color-${primaryColor}`} mr='$3'
                    {...themedButtonBackground(primaryColor, primaryTextColor, saving ? 0.5 : 1)}
                    // disabled={!dirtyData} opacity={dirtyData ? 1 : 0.5}
                    als='center' onPress={saveUser}>
                    <Heading size='$2' color={primaryTextColor}>Save</Heading>
                  </Button>
                  {/* <XStack f={1} /> */}
                </XStack>
              </YStack>
            </StickyBox>

              : <Button mt='$3' backgroundColor={primaryColor} onPress={saveUser}>Save Changes</Button>
            : undefined}
        </>
          : userLoadFailed
            ? <YStack width='100%' maw={800} jc="center" ai="center">
              <Heading size='$5' mb='$3'>The profile for <Text fontFamily='$body' fontSize='$7'>{inputUsername}</Text> could not be loaded.</Heading>
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
  visibility: Visibility,
  setVisibility: (v: Visibility) => void,
  expanded?: boolean;
  editMode: boolean;
  permissionsEditorProps: PermissionsEditorProps;
}

const UserVisibilityPermissions: React.FC<UserVisibilityPermissionsProps> = ({ user, defaultFollowModeration, setDefaultFollowModeration, visibility, setVisibility, editMode, expanded = true, permissionsEditorProps }) => {
  const { dispatch, accountOrServer } = useCredentialDispatch();
  const { server } = accountOrServer;
  const media = useMedia();
  const { primaryColor, primaryTextColor, navColor, navTextColor } = useServerTheme();
  const account = useAccount();
  const isCurrentUser = account && account?.user?.id == user.id;
  const isAdmin = hasAdminPermission(account?.user);
  const canEdit = isCurrentUser || isAdmin;
  const disableInputs = !editMode || !canEdit;

  function doDeleteUser() {
    dispatch(deleteUser({ ...user!, ...accountOrServer }))
      .then(() => window.location.replace('/'));
  }

  const [resetUserPassword, setResetUserPassword] = useState('');
  const [confirmUserPassword, setConfirmUserPassword] = useState('');
  const [showPasswordPlaintext, setShowPasswordPlaintext] = useState(false);
  const toast = useToastController();
  const resetPasswordValid = resetUserPassword.length >= 8 && resetUserPassword == confirmUserPassword;
  const confirmPasswordInvalid = resetUserPassword.length >= 8 && resetUserPassword !== confirmUserPassword;
  function doResetPassword() {
    dispatch(resetPassword({ userId: user.id, password: resetUserPassword, ...accountOrServer }))
      .then(() => toast.show('Password reset.'));
  }

  return <AnimatePresence>
    {expanded ? <YStack animation='standard' key='user-visibility-permissions'
      p='$3'
      ac='center'
      jc='center'
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
      <XStack ac='center' jc='center' mb='$2'>
        {media.gtSm ? <Heading size='$3' marginVertical='auto' f={1} o={disableInputs ? 0.5 : 1}>
          Visibility
        </Heading> : undefined}
        <VisibilityPicker label={`${isCurrentUser ? 'Profile' : 'User'} Visibility`}
          visibility={visibility} onChange={setVisibility}
          disabled={disableInputs}
          visibilityDescription={(v) => {
            switch (v) {
              case Visibility.PRIVATE:
                return `Only ${isCurrentUser ? 'you' : 'they'} can see ${isCurrentUser ? 'your' : 'their'} profile.`;
              case Visibility.LIMITED:
                return `Only followers can see ${isCurrentUser ? 'your' : 'their'} profile.`;
              case Visibility.SERVER_PUBLIC:
                return `Anyone on this server can see ${isCurrentUser ? 'your' : 'their'} profile.`;
              case Visibility.GLOBAL_PUBLIC:
                return `Anyone on the internet can see ${isCurrentUser ? 'your' : 'their'} profile.`;
              default:
                return 'Unknown';
            }
          }} />
      </XStack>
      <ToggleRow name={`Require${editMode && isCurrentUser ? '' : 's'} Permission to Follow`}
        value={pending(defaultFollowModeration)}
        setter={(v) => setDefaultFollowModeration(v ? Moderation.PENDING : Moderation.UNMODERATED)}
        disabled={disableInputs} />
      <XStack h='$1' />
      <PermissionsEditor {...permissionsEditorProps} />
      {isCurrentUser || isAdmin ?
        <>

          <Dialog>
            <Dialog.Trigger asChild>
              <Button icon={<SquareAsterisk />} mb='$2'>
                Reset Password
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
                  <Dialog.Title>Reset Password</Dialog.Title>
                  <Dialog.Description>
                    <YStack space='$2'>
                      <Paragraph size="$2">New Password:</Paragraph>
                      <XStack space='$2'>
                        <Input f={1} textContentType='password' secureTextEntry={!showPasswordPlaintext} placeholder={`Updated password (min 8 characters)`}
                          value={resetUserPassword}
                          onChange={(data) => { setResetUserPassword(data.nativeEvent.text) }} />
                        <Button circular icon={showPasswordPlaintext ? SquareAsterisk : Eye}
                          onPress={() => setShowPasswordPlaintext(!showPasswordPlaintext)} />
                        {/* <Text fontFamily='$body'>weeks</Text> */}

                      </XStack>
                      <Paragraph size="$2">Confirm Password:</Paragraph>
                      <XStack>
                        <Input f={1} textContentType='password' secureTextEntry={!showPasswordPlaintext} placeholder={`Confirm password`}
                          value={confirmUserPassword}
                          onChange={(data) => { setConfirmUserPassword(data.nativeEvent.text) }} />

                        <ZStack w='$2' h='$2' my='auto' ml='$4' mr='$2' pr='$2'>
                          <XStack m='auto' animation='standard' pr='$1'
                            o={resetPasswordValid ? 1 : 0}>
                            <CheckCircle color={navColor} />
                          </XStack>
                          <XStack m='auto' animation='standard' pr='$1'
                            o={confirmPasswordInvalid ? 1 : 0}>
                            <XCircle />
                          </XStack>
                        </ZStack>
                        {/* <Text fontFamily='$body'>weeks</Text> */}
                      </XStack>
                    </YStack>
                  </Dialog.Description>

                  <XStack space="$3" jc="flex-end">
                    <Dialog.Close asChild>
                      <Button>Cancel</Button>
                    </Dialog.Close>
                    {/* <Theme inverse> */}
                    <Dialog.Close asChild>

                      <Button onPress={doResetPassword}
                        {...themedButtonBackground(primaryColor, primaryTextColor)}
                        opacity={resetPasswordValid ? 1 : 0.5}
                        disabled={!resetPasswordValid}>Reset Password</Button>
                    </Dialog.Close>

                    {/* </Theme> */}
                  </XStack>
                </YStack>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
          <Dialog>
            <Dialog.Trigger asChild>
              <Button icon={<Trash />} color="red" mb='$3'>
                Delete Account
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
                  <Dialog.Title>Delete Account</Dialog.Title>
                  <Dialog.Description>
                    Really delete account {user.username} on {server!.host}? Media may take up to 24 hours to be deleted.
                  </Dialog.Description>

                  <XStack space="$3" jc="flex-end">
                    <Dialog.Close asChild>
                      <Button>Cancel</Button>
                    </Dialog.Close>
                    <Theme inverse>
                      <Button onPress={doDeleteUser}>Delete</Button>
                    </Theme>
                  </XStack>
                </YStack>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </> : undefined}
    </YStack> : undefined}
  </AnimatePresence>;
}
