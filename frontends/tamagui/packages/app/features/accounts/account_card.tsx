import { Permission } from "@jonline/api";
import { Button, Card, Dialog, Heading, Paragraph, Theme, XStack, YStack, Image, useMedia } from "@jonline/ui";

import { Bot, Shield, Trash, User as UserIcon } from "@tamagui/lucide-icons";
import { useMediaUrl } from "app/hooks/use_media_url";
import { accountId, JonlineAccount, removeAccount, selectAccount, selectServer, store, useTypedDispatch } from "app/store";
import React from "react";
import { View } from "react-native";
import { useLink } from "solito/link";
import { FadeInView } from "../post/fade_in_view";

interface Props {
  account: JonlineAccount;
}

const AccountCard: React.FC<Props> = ({ account }) => {
  const dispatch = useTypedDispatch();
  let selected = accountId(store.getState().accounts.account) == accountId(account);

  const primaryColorInt = account.server.serverConfiguration?.serverInfo?.colors?.primary;
  const primaryColor = `#${(primaryColorInt)?.toString(16).slice(-6) || '424242'}`;
  const profileLinkProps = useLink({ href: `/${account.user.username}` });

  function doSelectAccount() {
    if (store.getState().servers.server?.host != account.server.host) {
      dispatch(selectServer(account.server));
    }
    dispatch(selectAccount(account));
  }

  function doLogout() {
    dispatch(selectAccount(undefined));
  }
  const avatarUrl = useMediaUrl(account.user.avatarMediaId, {account, server: account.server});
  const mediaQuery = useMedia();

  return (
    <Theme inverse={selected}>
      <Card theme="dark" elevate size="$4" bordered

        animation="bouncy"
        // w={250}
        // h={50}
        scale={0.9}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
        onClick={doSelectAccount}
      >
        <Card.Header>
          <XStack>
          {(avatarUrl && avatarUrl != '') ?
        
            <XStack w={mediaQuery.gtXs || true ? 50 : 26} h={mediaQuery.gtXs || true ? 50 : 26}
              mr={mediaQuery.gtXs || true ? '$3' : '$2'}>
              <Image
                pos="absolute"
                width={mediaQuery.gtXs || true ? 50 : 26}
                // opacity={0.25}
                height={mediaQuery.gtXs || true ? 50 : 26}
                borderRadius={mediaQuery.gtXs || true ? 25 : 13}
                resizeMode="cover"
                als="flex-start"
                source={{ uri: avatarUrl }}
              // blurRadius={1.5}
              // borderRadius={5}
              />
            </XStack>
      : undefined}
            <YStack style={{ flex: 1 }}>
              <Heading size="$1" style={{ marginRight: 'auto' }}>{account.server.host}/</Heading>
              <Heading size="$7" style={{ marginRight: 'auto' }}>{account.user.username}</Heading>
            </YStack>
            {/* {account.server.secure ? <Lock/> : <Unlock/>} */}
            {account.user.permissions.includes(Permission.ADMIN) ? <Shield /> : undefined}
            {account.user.permissions.includes(Permission.RUN_BOTS) ? <Bot /> : undefined}

          </XStack>
        </Card.Header>
        <Card.Footer>
          <XStack width='100%'>
            <YStack>
              <Heading size="$1" alignSelf="center">Account ID</Heading>
              <Paragraph size='$1' alignSelf="center">{account.user.id}</Paragraph>
            </YStack>
            <View style={{ flex: 1 }} />
            {selected ? <Button onClick={(e) => { e.stopPropagation(); doLogout(); }} mr='$1'>Logout</Button> : undefined}

            <Button circular {...profileLinkProps} icon={<UserIcon />} mr='$1' />
            <Dialog>
              <Dialog.Trigger asChild>
                <Button icon={<Trash />} circular onClick={(e) => { e.stopPropagation(); }} color="red" />
              </Dialog.Trigger>
              <Dialog.Portal>
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
                  enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                  exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                  x={0}
                  scale={1}
                  opacity={1}
                  y={0}
                >
                  <YStack space>
                    <Dialog.Title>Remove Account</Dialog.Title>
                    <Dialog.Description>
                      Really remove account {account.user.username} on {account.server.host}?
                    </Dialog.Description>

                    <XStack space="$3" jc="flex-end">
                      <Dialog.Close asChild>
                        <Button>Cancel</Button>
                      </Dialog.Close>
                      {/* <Dialog.Action asChild> */}
                      <Button theme="active" onClick={() => dispatch(removeAccount(accountId(account)!))}>Remove</Button>
                      {/* </Dialog.Action> */}
                    </XStack>
                  </YStack>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog>
          </XStack>
        </Card.Footer>
        <Card.Background>
          <YStack h='100%' w={5} backgroundColor={primaryColor} />
        </Card.Background>
      </Card>
    </Theme>
    // <a style={Styles.borderlessButton} onClick={() => dispatch(selectServer(server))}>
    // </a>
  );
};

export default AccountCard;
