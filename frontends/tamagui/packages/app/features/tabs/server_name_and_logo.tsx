import { Media } from "@jonline/api";
import { Heading, Paragraph, XStack, YStack, isSafari, useMedia } from "@jonline/ui";
import { JonlineServer, useServer } from "app/store";
import { MediaRenderer } from "../media/media_renderer";

export type ServerNameAndLogoProps = {
  shrink?: boolean;
  server?: JonlineServer;
  enlargeSmallText?: boolean;
};

export function ServerNameAndLogo({
  shrink,
  server: selectedServer,
  enlargeSmallText = false
}: ServerNameAndLogoProps) {
  const mediaQuery = useMedia()

  const currentServer = useServer();
  const server = selectedServer ?? currentServer;
  // console.log('ServerNameAndLogo', server?.host)

  const serverName = server?.serverConfiguration?.serverInfo?.name || 'Jonline';
  const serverNameEmoji = serverName.match(/\p{Emoji}/u)?.at(0);
  const [serverNameBeforeEmoji, serverNameAfterEmoji] = serverName
    .split(serverNameEmoji ?? '|', 2)
    .map(x => x.replace(/[^\x20-\x7E]/g, '').trim())
    ;
  const veryShortServername = serverNameBeforeEmoji!.length < 10;
  const shortServername = serverNameBeforeEmoji!.length < 12;
  const largeServername = veryShortServername && (['', undefined].includes(serverNameAfterEmoji));

  const maxWidth = enlargeSmallText
    ? undefined
    : mediaQuery.gtXs
      ? 270
      : 200;
  const maxWidthAfterServerName = maxWidth ? maxWidth - (serverNameEmoji ? 50 : 0) : undefined;
  const logo = server?.serverConfiguration?.serverInfo?.logo;

  const canUseLogo = logo?.wideMediaId != undefined || logo?.squareMediaId != undefined;
  const useSquareLogo = canUseLogo && logo?.squareMediaId != undefined;
  const useWideLogo = canUseLogo && logo?.wideMediaId != undefined && !shrink;
  const useEmoji = serverNameEmoji && serverNameEmoji !== '';

  return shrink
    ? useSquareLogo
      ? <XStack h='100%'
        scale={1.1}
        transform={[
          { translateY: 1.5 },
          { translateX: isSafari() ? 8.0 : 2.0 }]
        } >
        <MediaRenderer server={server} forceImage media={Media.create({ id: logo?.squareMediaId })} failQuietly />
      </XStack>
      : <XStack h={'100%'} maw={maxWidthAfterServerName}>
        <Heading my='auto' whiteSpace="nowrap">{serverNameEmoji ?? ''}</Heading>
        {/* <Paragraph size='$1' lineHeight='$1' my='auto'>{serverNameWithoutEmoji}</Paragraph> */}
      </XStack>
    : <XStack h={'100%'} w='100%' space='$5' maw={maxWidthAfterServerName}>
      {useWideLogo
        ? <XStack h='100%' scale={1.05} transform={[{ translateY: 1.0 }, { translateX: 2.0 }]}>
          <MediaRenderer server={server} forceImage media={Media.create({ id: logo?.wideMediaId })} failQuietly />
        </XStack>
        : <>
          {useSquareLogo
            ? <XStack w={enlargeSmallText ? '$6' : '$3'} h={enlargeSmallText ? '$6' : '$3'} ml='$2' mr='$1' my='auto'>
              <MediaRenderer server={server} forceImage media={Media.create({ id: logo?.squareMediaId })} failQuietly />
            </XStack>
            : serverNameEmoji && serverNameEmoji != ''
              ? <Heading size={enlargeSmallText ? '$10' : undefined}
                my='auto' ml='$2' mr='$2' whiteSpace="nowrap">{serverNameEmoji}</Heading>
              : undefined}
          <YStack f={1} my='auto' mr='$2' space={enlargeSmallText ? '$2' : '$0'}>
            {largeServername
              ? <Heading my='auto' whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{serverNameBeforeEmoji}</Heading>
              : <Paragraph size={enlargeSmallText ? '$7' : '$1'}
                fontWeight='700' lineHeight={12} >{serverNameBeforeEmoji}{useSquareLogo && serverNameEmoji && serverNameEmoji != '' ? ` ${serverNameEmoji}` : undefined}</Paragraph>}
            {!largeServername && serverNameAfterEmoji && serverNameAfterEmoji !== '' && (mediaQuery.gtXs || shortServername)
              ? <Paragraph
                size={enlargeSmallText
                  ? serverNameAfterEmoji.length > 10 ? '$3' : '$7'
                  : '$1'
                }
                lineHeight={enlargeSmallText ? '$1' : 12}
              >
                {serverNameAfterEmoji}
              </Paragraph>
              : undefined}
          </YStack>
        </>}
    </XStack>;
}