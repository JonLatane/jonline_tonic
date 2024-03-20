import { Permission, Post } from '@jonline/api'
import { Button, Heading, ScrollView, TextArea, Tooltip, XStack, YStack, ZStack, isClient, isWeb, reverseStandardAnimation, useTheme, useToastController, useWindowDimensions } from '@jonline/ui'
import { ChevronRight, Edit3 as Edit, Eye, Send as SendIcon } from '@tamagui/lucide-icons'
import { TamaguiMarkdown } from 'app/components'
import { useAccountOrServerContext } from 'app/contexts'
import { useAccountOrServer, useAppDispatch } from 'app/hooks'
import { RootState, actionFailed, getServerTheme, parseFederatedId, replyToPost, selectPostById, useRootSelector } from 'app/store'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import StickyBox from 'react-sticky-box'
import { AddAccountSheet } from '../accounts/add_account_sheet'
import { MediaRef } from '../media/media_chooser'
import { PostMediaManager } from './post_media_manager'
import { PostMediaRenderer } from './post_media_renderer'
import { useHideNavigation } from '../navigation/use_hide_navigation'
import { themedButtonBackground } from 'app/utils'
import { scrollToCommentsBottom } from './conversation_manager'

interface ReplyAreaProps {
  replyingToPath: string[];
  hidden?: boolean;
  onStopReplying?: () => void;
}

export const ReplyArea: React.FC<ReplyAreaProps> = ({ replyingToPath, hidden, onStopReplying }) => {
  const dispatch = useAppDispatch();
  const currentAccountOrServer = useAccountOrServer();
  const accountOrServer = useAccountOrServerContext() ?? currentAccountOrServer;
  const { primaryColor, primaryTextColor, navColor, navTextColor } = getServerTheme(accountOrServer.server, useTheme());
  const [media, setMedia] = useState([] as MediaRef[]);
  const [embedLink, setEmbedLink] = useState(false);

  const [replyText, setReplyText] = useState('');
  const [previewReply, setPreviewReply] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const textAreaRef = React.createRef<TextInput>();
  const chatUI = useRootSelector((state: RootState) => state.app.discussionChatUI);
  const [showMedia, setShowMedia] = useState(true);
  const maxPreviewHeight = (useWindowDimensions().height - 80 - (showMedia && media.length > 0 ? 100 : 0)) * 0.5;

  const [replyTextFocused, _setReplyTextFocused] = useState(false);
  const [hasReplyTextFocused, setHasReplyTextFocused] = useState(false);
  function setReplyTextFocused(focused: boolean) {
    _setReplyTextFocused(focused);
    if (focused && !hasReplyTextFocused) {
      setHasReplyTextFocused(true);
    }
  }
  useEffect(() => {
    if (!hasReplyTextFocused && showMedia) {
      setShowMedia(false);
    }
  }, [hasReplyTextFocused]);
  const toast = useToastController();
  function sendReply() {
    setIsSendingReply(true);

    dispatch(replyToPost({
      ...accountOrServer,
      postIdPath: replyingToPath,
      content: replyText,
      media: media
    })).then(action => {
      setIsSendingReply(false);
      if (actionFailed(action)) {
        toast.show('Failed to send reply.');
        return;
      }
      setHasReplyTextFocused(false);
      setMedia([]);
      setReplyText('');
      if (chatUI && isClient) {
        scrollToCommentsBottom(replyingToPath[0]!.split("@")[0]!);
        // window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    });
  }
  let pathIndex = 0;
  const rootPost = useRootSelector((state: RootState) => selectPostById(state.posts, replyingToPath[pathIndex++]!));
  const targetPostId = replyingToPath[replyingToPath.length - 1];
  let targetPost = rootPost as Post | undefined;
  while (targetPost != null && targetPost?.id != targetPostId) {
    const replyId = replyingToPath[pathIndex++];
    targetPost = targetPost?.replies?.find(reply => reply.id == replyId);
  }
  const replyingToPost = targetPost;
  // useEffect(() => {
  //   if (previewReply && replyText == '') {
  //     setPreviewReply(false);
  //   }
  // }, [previewReply, replyText]);
  const canSend = replyText.length > 0 || media.length > 0;
  const canComment = (accountOrServer.account?.user?.permissions?.includes(Permission.REPLY_TO_POSTS)
    || accountOrServer.account?.user?.permissions?.includes(Permission.CREATE_POSTS));

  const hideNavigation = useHideNavigation();
  const hide = hidden || hideNavigation;
  return hide ? <></> : isWeb ? canComment
    ? <YStack w='100%' pl='$2' paddingVertical='$2' backgroundColor='$background' alignContent='center'>
      {hasReplyTextFocused || media.length > 0
        ? <>
          <Button size='$1' onPress={() => setShowMedia(!showMedia)}>
            <XStack animation='quick' rotate={showMedia ? '90deg' : '0deg'}>
              <ChevronRight size='$1' />
            </XStack>
            <Heading size='$1' f={1}>Media {media.length > 0 ? `(${media.length})` : undefined}</Heading>
          </Button>
          {showMedia
            ? <PostMediaManager
              {...{ media, setMedia, embedLink, setEmbedLink }}
              disableInputs={isSendingReply}
            />
            : undefined}
        </>
        : undefined}
      {previewReply
        ? <YStack px='$3' py='$1' f={1} backgroundColor='$background' animation='standard' {...reverseStandardAnimation}>
          <ScrollView maxHeight={maxPreviewHeight}>
            {!showMedia && media.length > 0
              ? <PostMediaRenderer {...{
                post: Post.create({ id: '', media, embedLink })
              }} />
              : undefined}
            <TamaguiMarkdown text={replyText} shrink />
          </ScrollView>
        </YStack>
        : undefined}
      {replyingToPath.length > 1
        ? <XStack w='100%'>
          <Heading size='$1' f={1}>Replying to {replyingToPost?.author?.username ?? ''}</Heading>
          {onStopReplying ? <Button size='$1' onPress={onStopReplying}>Cancel</Button> : undefined}
          <XStack f={1} />
        </XStack>
        : undefined}
      <XStack>
        <YStack f={1} mt='$1'>
          <TextArea f={1} value={replyText} ref={textAreaRef}
            disabled={isSendingReply} opacity={isSendingReply || !canSend ? 0.5 : 1}
            onChangeText={t => setReplyText(t)}
            onFocus={() => setReplyTextFocused(true)}
            onBlur={() => setReplyTextFocused(false)}
            placeholder={`Reply to this post. Markdown is supported.`} />
        </YStack>
        <YStack mr='$2' ml='$2' mt='auto' ac='flex-end' >
          <YStack f={1} />
          <Tooltip placement="top-end" key={`preview-button-${previewReply}`}>
            <Tooltip.Trigger>
              <Button circular mb='$2' icon={Eye}
                {...themedButtonBackground(previewReply ? navColor : undefined, previewReply ? navTextColor : undefined)}
                // backgroundColor={navColor} color={navTextColor}
                disabled={!canSend} opacity={!canSend ? 0.5 : 1}
                onPress={() => {
                  setPreviewReply(!previewReply);
                  if (previewReply) {
                    setTimeout(() => textAreaRef.current?.focus(), 100);
                  }
                }} />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Heading size='$2'>{previewReply ? 'Hide Preview' : 'Show Preview'}</Heading>
            </Tooltip.Content>
          </Tooltip>
          {/* <YStack f={1}/> */}
          <Button circular icon={SendIcon}
            backgroundColor={primaryColor} color={primaryTextColor}
            disabled={isSendingReply || !canSend}
            opacity={isSendingReply || !canSend ? 0.5 : 1}
            onPress={sendReply} />
        </YStack>
      </XStack>
    </YStack>
    : accountOrServer.account ? <YStack w='100%' opacity={.92} paddingVertical='$2' backgroundColor='$background' alignContent='center'>
      <Heading size='$1'>You do not have permission to {chatUI ? 'chat' : 'comment'}.</Heading>
    </YStack>
      : <YStack w='100%' opacity={.92} p='$3' backgroundColor='$background' alignContent='center'>
        {/* <Button backgroundColor={primaryColor} color={primaryTextColor}>
            Login or Sign Up to Comment
          </Button> */}
        <AddAccountSheet operation={chatUI ? 'Chat' : 'Comment'}
          server={accountOrServer.server} />
      </YStack>
    : <Button mt='$3' circular icon={SendIcon} backgroundColor={primaryColor} onPress={() => { }} />

}
// var lastScrollTop = 0;

// // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
// isClient && window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
//    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
//    if (st > lastScrollTop) {
//       // downscroll code
//    } else if (st < lastScrollTop) {
//       // upscroll code
//    } // else was horizontal scroll
//    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
// }, false);
