import { ExternalCDNConfig, Media, Permission, ServerConfiguration } from '@jonline/api'
import { Button, Heading, Input, Paragraph, ScrollView, Switch, Text, TextArea, XStack, YStack, formatError, isWeb, useWindowDimensions } from '@jonline/ui'
import { Github, Info } from '@tamagui/lucide-icons'
import { JonlineServer, RootState, getCredentialClient, selectServer, selectServerById, serverID, setAllowServerSelection, upsertServer, useServerTheme, useTypedDispatch, useTypedSelector } from 'app/store'
import React, { useEffect, useState } from 'react'
import { HexColorPicker } from "react-colorful"
import StickyBox from "react-sticky-box"
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { colorMeta } from '../../store'
import { TamaguiMarkdown } from '../post/tamagui_markdown'
import { AppSection } from '../tabs/features_navigation'
import { TabsNavigation } from '../tabs/tabs_navigation'
import { PermissionsEditor, PermissionsEditorProps } from '../user/permissions_editor'
import ServerCard from './server_card'
import { SingleMediaChooser } from './single_media_chooser'
import { MediaRenderer } from '../media/media_renderer'
import { themedButtonBackground } from '../../utils/themed_button_background';
import { hasAdminPermission } from 'app/utils/permission_utils'
import { MediaRef } from '../media/media_chooser'

const { useParam } = createParam<{ id: string }>()

export function ServerDetailsScreen() {
  return BaseServerDetailsScreen();
}

export function BaseServerDetailsScreen(specificServer?: string) {
  const [requestedServerUrl] = specificServer ? [specificServer] : useParam('id');
  const requestedServerUrlParts = requestedServerUrl?.split(':')
  const requestedServerUrlValid = requestedServerUrlParts?.length == 2
    && ['http', 'https'].includes(requestedServerUrlParts[0]!);
  // debugger
  // const linkProps = useLink({ href: '/' })
  const dispatch = useTypedDispatch();
  const app = useTypedSelector((state: RootState) => state.app);
  const server: JonlineServer | undefined = useTypedSelector((state: RootState) => selectServerById(state.servers, requestedServerUrl!));
  const selectedServer = useTypedSelector((state: RootState) => state.servers.server);
  const account = useTypedSelector((state: RootState) => state.accounts.account);
  const serverIsSelected = server && selectedServer &&
    serverID(server) == serverID(selectedServer);
  const isAdmin = account && server && serverID(account.server) == serverID(server) &&
    hasAdminPermission(account?.user);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const aboutJonlineLink = useLink({ href: '/about_jonline' })

  const { serviceVersion, serverConfiguration } = server || {};
  const [_, githubVersion] = serviceVersion?.version?.split('-') ?? [];
  const githubLink = useLink({ href: `https://github.com/JonLatane/jonline/commit/${githubVersion}` });

  const serverName = serverConfiguration?.serverInfo?.name;
  const [name, setName] = useState(serverName || undefined);
  // if (serverName && name != serverName && name == undefined) {
  //   setName(serverName);
  // }

  useEffect(() => {
    document.title = `About ${specificServer ? 'Community' : 'Server'}${serverName && serverName != '' ? ` | ${serverName}` : ''}`;
  }, [serverName]);

  const serverDescription = serverConfiguration?.serverInfo?.description;
  const [description, setDescription] = useState(serverDescription || undefined);
  // if (serverDescription && description != serverDescription && description == undefined) {
  //   setDescription(serverDescription);
  // }
  const serverPrivacyPolicy = serverConfiguration?.serverInfo?.privacyPolicy;
  const [privacyPolicy, setPrivacyPolicy] = useState(serverPrivacyPolicy || undefined);
  const serverLogo = serverConfiguration?.serverInfo?.logo;
  const [logo, setLogo] = useState(serverLogo || undefined);

  const serverExternalCdnConfig = serverConfiguration?.externalCdnConfig;
  const [externalCdnConfig, setExternalCdnConfig] = useState(serverExternalCdnConfig || undefined);
  // if (defaultClientDomain && name != serverName && name == undefined) {
  //   setName(serverName);
  // }


  const primaryColorInt = serverConfiguration?.serverInfo?.colors?.primary ?? 0x424242;
  const primaryColor = `#${primaryColorInt.toString(16).slice(-6)}`;
  const [primaryColorHex, setPrimaryColorHex] = useState(primaryColor);
  const primaryColorValid = /^#[0-9A-Fa-f]{6}$/i.test(primaryColorHex);

  // if (primaryColorHex != primaryColor && primaryColorHex == '#424242') {
  //   setPrimaryColorHex(primaryColor);
  // }

  const navColorInt = serverConfiguration?.serverInfo?.colors?.navigation ?? 0xFFFFFF;
  const navColor = `#${navColorInt.toString(16).slice(-6)}`;
  const [navColorHex, setNavColorHex] = useState(navColor);
  const navColorValid = /^#[0-9A-Fa-f]{6}$/i.test(navColorHex);
  // if (navColorHex != navColor && navColorHex == '#FFFFFF') {
  //   setNavColorHex(navColor);
  // }
  const { textColor: primaryTextColor } = colorMeta(primaryColor);
  const { textColor: navTextColor } = colorMeta(navColor);
  const { warningAnchorColor } = useServerTheme();

  const serverDefaultPermissions = serverConfiguration?.defaultUserPermissions;
  const [_defaultPermissions, setDefaultPermissions] = useState(serverDefaultPermissions);
  // if (serverDefaultPermissions && _defaultPermissions == undefined) {
  //   setDefaultPermissions(serverDefaultPermissions);
  // }

  const inputsValid = primaryColorValid && navColorValid;


  useEffect(() => {
    setName(serverName);
    setDescription(serverDescription);
    setPrivacyPolicy(serverPrivacyPolicy);
    setLogo(serverLogo);
    setExternalCdnConfig(serverExternalCdnConfig);
    setDefaultPermissions(serverDefaultPermissions);
    setPrimaryColorHex(primaryColor);
    setNavColorHex(navColor);

  }, [serverConfiguration]);

  const defaultPermissions = _defaultPermissions || [];
  function selectDefaultPermission(permission: Permission) {
    if (defaultPermissions.includes(permission)) {
      setDefaultPermissions(defaultPermissions.filter(p => p != permission));
    } else {
      setDefaultPermissions([...defaultPermissions, permission]);
    }
  }
  function deselectDefaultPermission(permission: Permission) {
    setDefaultPermissions(defaultPermissions.filter(p => p != permission));
  }
  const configurableUserPermissions = [
    Permission.VIEW_USERS,
    Permission.PUBLISH_USERS_LOCALLY,
    Permission.PUBLISH_USERS_GLOBALLY,
    Permission.VIEW_GROUPS,
    Permission.CREATE_GROUPS,
    Permission.VIEW_MEDIA,
    Permission.CREATE_MEDIA,
    Permission.PUBLISH_MEDIA_LOCALLY,
    Permission.PUBLISH_MEDIA_GLOBALLY,
    Permission.PUBLISH_GROUPS_LOCALLY,
    Permission.PUBLISH_GROUPS_GLOBALLY,
    Permission.JOIN_GROUPS,
    Permission.VIEW_POSTS,
    Permission.CREATE_POSTS,
    Permission.PUBLISH_POSTS_LOCALLY,
    Permission.PUBLISH_POSTS_GLOBALLY,
    Permission.VIEW_EVENTS,
    Permission.CREATE_EVENTS,
    Permission.PUBLISH_EVENTS_LOCALLY,
    Permission.PUBLISH_EVENTS_GLOBALLY,
  ];
  const defaultPermissionsEditorProps: PermissionsEditorProps = {
    selectablePermissions: configurableUserPermissions,
    selectedPermissions: defaultPermissions,
    selectPermission: selectDefaultPermission,
    deselectPermission: deselectDefaultPermission,
    editMode: isAdmin ?? false
  };

  async function updateServer() {
    setUpdating(true);
    setUpdateError('');
    //TODO: get the latest config and merge our changes into it?

    let newPrimaryColorInt = parseInt(primaryColorHex.slice(1), 16) + 0xFF000000;
    let newNavColorInt = parseInt(navColorHex.slice(1), 16) + 0xFF000000;

    let updatedConfiguration: ServerConfiguration = {
      ...serverConfiguration!,
      serverInfo: {
        ...serverConfiguration!.serverInfo,
        name,
        description,
        privacyPolicy,
        logo,
        colors: {
          ...serverConfiguration!.serverInfo!.colors,
          primary: newPrimaryColorInt, navigation: newNavColorInt
        }
      },
      externalCdnConfig: externalCdnConfig
    };

    let client = await getCredentialClient({ account });
    try {
      let returnedConfiguration = await client.configureServer(updatedConfiguration, client.credential);
      dispatch(upsertServer({ ...server!, serverConfiguration: returnedConfiguration }));
    } catch (e) {
      console.log(e);
      setUpdateError(formatError(e.message));
    } finally {
      setUpdating(false);
    }
  }

  const windowHeight = useWindowDimensions().height;
  return (
    <TabsNavigation appSection={AppSection.INFO} onlyShowServer={server}>
      <YStack f={1} jc="center" ai="center" space w='100%'>
        {server ?
          <YStack mb='$2' w='100%' jc="center" ai="center" >
            <ScrollView w='100%'>
              <YStack space='$2' w='100%' maw={800} paddingHorizontal='$3' als='center' marginHorizontal='auto'>
                {serverIsSelected ? undefined : <>
                  <Heading mt='$3' size='$3' als='center' color={warningAnchorColor} ta='center'>Currently browsing on a different server</Heading>

                  <Heading whiteSpace="nowrap" maw={200} overflow='hidden' als='center' color={warningAnchorColor} opacity={selectedServer?.serverConfiguration?.serverInfo?.name ? 1 : 0.5}>
                    {selectedServer?.serverConfiguration?.serverInfo?.name || 'Unnamed'}
                  </Heading>
                  <Heading size='$3' als='center' marginTop='$2' color={warningAnchorColor}>
                    {selectedServer?.host}
                  </Heading>
                  <Button onPress={() => dispatch(selectServer(server))} mt='$3' theme='active' size='$3'>
                    Switch to&nbsp;<Heading size='$3'>{server.host}</Heading>
                  </Button>
                </>}
                <Heading size='$10' als='center' mt='$3'>About {specificServer ? 'Community' : 'Server'}</Heading>
                <ServerCard server={server!} />
                <XStack mt='$4'>
                  <Heading size='$3' f={1}>Service Version</Heading>
                  <Paragraph>{serviceVersion?.version}</Paragraph>
                </XStack>
                {githubVersion
                  ? <Button {...githubLink} mt='$2' {...themedButtonBackground(navColor, navTextColor)} size='$3' iconAfter={Github}>
                    <Heading size='$2' color={navTextColor}>View {githubVersion} on GitHub</Heading>
                  </Button>
                  : undefined}
                <Button {...aboutJonlineLink} mt='$2' backgroundColor={navColor} hoverStyle={{ backgroundColor: navColor }} pressStyle={{ backgroundColor: navColor }} color={navTextColor} size='$3' iconAfter={Info}>
                  <Heading size='$2' color={navTextColor}>About Jonline...</Heading>
                </Button>
                <Heading size='$3'>Name</Heading>
                {isAdmin
                  ? <Input value={name ?? ''} opacity={name && name != '' ? 1 : 0.5}
                    placeholder='The name of your community.' onChangeText={t => setName(t)} />
                  : <Heading opacity={name && name != '' ? 1 : 0.5}>{name || 'Unnamed'}</Heading>}

                <Heading size='$3'>Description</Heading>
                {isAdmin ?
                  <TextArea value={description ?? ''} opacity={description && description != '' ? 1 : 0.5}
                    onChangeText={t => setDescription(t)} h='$14'
                    placeholder='A description of the purpose of your community, any general guidelines, etc.' />
                  : description && description != ''
                    ? <TamaguiMarkdown text={description} />
                    : <Paragraph opacity={0.5}>No description set.</Paragraph>}

                <Heading size='$3'>Privacy Policy</Heading>
                {isAdmin ?
                  <TextArea value={privacyPolicy ?? ''} opacity={privacyPolicy && privacyPolicy != '' ? 1 : 0.5}
                    onChangeText={t => setPrivacyPolicy(t)} h='$14'
                    placeholder='A privacy policy stating how you plan to use user data.' />
                  : privacyPolicy && privacyPolicy != ''
                    ? <TamaguiMarkdown text={privacyPolicy} />
                    : <Paragraph opacity={0.5}>No privacy policy set.</Paragraph>}

                {/* <AnimatePresence> */}

                {isAdmin || logo?.squareMediaId || logo?.wideMediaId
                  ? <>
                    <Heading size='$3' mt='$2'>Server Logo</Heading>
                    {isAdmin || logo?.wideMediaId
                      ? <Heading size='$2' mt='$2'>Wide</Heading>
                      : undefined}
                    {logo?.wideMediaId ?
                      <MediaRenderer media={Media.create({ id: logo?.wideMediaId })} />
                      : undefined}
                    {isAdmin
                      ? <SingleMediaChooser mediaUseName='Wide Logo'
                        selectedMedia={logo ? { id: logo.wideMediaId } as MediaRef : undefined}
                        setSelectedMedia={v => setLogo({ ...(logo ?? {}), wideMediaId: v?.id })} />
                      : undefined}
                    {isAdmin || logo?.wideMediaId
                      ? <Heading size='$2' mt='$2'>Square</Heading>
                      : undefined}
                    {logo?.squareMediaId ?
                      <MediaRenderer media={Media.create({ id: logo?.squareMediaId })} />
                      : undefined}
                    {isAdmin
                      ? <SingleMediaChooser mediaUseName='Square Logo'
                        selectedMedia={logo ? { id: logo.squareMediaId } as MediaRef : undefined}
                        setSelectedMedia={v => setLogo({ ...(logo ?? {}), squareMediaId: v?.id })} />
                      : undefined}
                  </>
                  : undefined}
                {/* </AnimatePresence> */}
                <XStack mt='$2'>
                  <Heading my='auto' size='$3' f={1}>Primary Color</Heading>
                  {isAdmin
                    ? <Input mr='$2' my='auto' w={100} value={primaryColorHex} color={primaryColorValid ? undefined : 'red'} onChange={(e) => setPrimaryColorHex(e.nativeEvent.text)} />
                    : <Paragraph mr='$2' my='auto'>{primaryColorHex}</Paragraph>}
                  <XStack my='auto' w={50} h={30} backgroundColor={primaryColorHex} />
                </XStack>
                {isAdmin ? <XStack als='center'>
                  <HexColorPicker color={primaryColorHex} onChange={setPrimaryColorHex} />
                </XStack> : undefined}

                <XStack mt='$2'>
                  <Heading my='auto' size='$3' f={1}>Navigation Color</Heading>
                  {isAdmin
                    ? <Input mr='$2' my='auto' w={100} value={navColorHex} color={navColorValid ? undefined : 'red'} onChange={(e) => setNavColorHex(e.nativeEvent.text)} />
                    : <Paragraph mr='$2' my='auto' >{navColorHex}</Paragraph>}
                  <XStack my='auto' w={50} h={30} backgroundColor={navColorHex} />
                </XStack>
                {isAdmin ? <XStack als='center'>
                  <HexColorPicker color={navColorHex} onChange={setNavColorHex} />
                </XStack> : undefined}
                <XStack mt='$3' />

                {<PermissionsEditor label='Default Permissions'
                  {...defaultPermissionsEditorProps} />}

                <XStack mt='$3'>
                  <Heading size='$3' my='auto' f={1}>External CDN Support</Heading>
                  <Switch size="$5" margin='auto'
                    defaultChecked={externalCdnConfig != undefined}
                    checked={externalCdnConfig != undefined}
                    value={(externalCdnConfig != undefined).toString()}
                    disabled={!isAdmin}
                    opacity={isAdmin ? 1 : 0.5}
                    onCheckedChange={(checked) => setExternalCdnConfig(
                      checked ? ExternalCDNConfig.fromPartial({ backendHost: '', frontendHost: '' }) : undefined
                    )}>
                    <Switch.Thumb animation="quick" backgroundColor='black' />
                  </Switch>
                </XStack>
                {/* {isAdmin ? <> */}
                <Paragraph size='$1'>
                  To improve performance, administrators can put their Jonline server's HTML
                  and Media behind Cloudflare, using a separate host as the gRPC backend.
                </Paragraph>
                <Paragraph size='$1'>
                  For instance, to use Cloudflare to point jonline.io to a backend
                  at jonline.io.itsj.online, you would:
                </Paragraph>
                {[
                  'Setup and secure your instance on jonline.io.itsj.online, whose DNS is probably managed by your Kubernetes provider (I use DigitalOcean), so you can secure it with Cert-Manager.',
                  'For extra security: apply a firewall with your Kubernetes provider on the jonline.io.itsj.online host that allows all traffic on port 27707, and only traffic from Cloudflare IPs otherwise.',
                  'Turn on External CDN Support, set the Backend Domain below to jonline.io.itsj.online, Frontend Domain to jonline.io, and press Update Server.',
                  'Restart your deployment in Kubernetes. (Maybe we can remove this step one day!)',
                  'For jonline.io, whose DNS is managed by Cloudflare, create a CNAME record in Cloudflare for jonline.io pointing to notj.online. Turn on Cloudflare\'s HTTPS "proxy" feature, and add a Page Rule for "Cache Level: Cache Everything" for jonline.io/*.'
                ].map((text, index) => <XStack ml='$3' mb='$2'>
                  <Text fontFamily='$body' fontSize='$1' mr='$2'>{`${index + 1}.`}</Text>
                  <Text fontFamily='$body' fontSize='$1' >{text}</Text>
                </XStack>)}
                {/* </> : undefined} */}
                {isAdmin || externalCdnConfig
                  ? <YStack>
                    <Heading size='$2' f={1}>Frontend Host</Heading>
                    <Paragraph size='$1'></Paragraph>
                    {isAdmin
                      ? <Input editable={externalCdnConfig != undefined}
                        opacity={externalCdnConfig && externalCdnConfig.frontendHost.length > 0 ? 1 : 0.5}
                        value={externalCdnConfig?.frontendHost ?? ''}
                        placeholder='e.g.: jonline.io'
                        onChangeText={t => externalCdnConfig && setExternalCdnConfig({ ...(externalCdnConfig!), frontendHost: t })} />
                      : <Paragraph opacity={externalCdnConfig && externalCdnConfig.frontendHost.length > 0 ? 1 : 0.5}>
                        {externalCdnConfig?.frontendHost || ''}
                      </Paragraph>}
                    <Heading mt='$2' size='$2' f={1}>Backend Host</Heading>
                    <Paragraph size='$1'></Paragraph>
                    {isAdmin
                      ? <Input editable={externalCdnConfig != undefined}
                        opacity={externalCdnConfig && externalCdnConfig.backendHost.length > 0 ? 1 : 0.5}
                        value={externalCdnConfig?.backendHost ?? ''}
                        placeholder='e.g.: jonline.io.itsj.online'
                        onChangeText={t => externalCdnConfig && setExternalCdnConfig({ ...(externalCdnConfig!), backendHost: t })} />
                      : <Paragraph opacity={externalCdnConfig && externalCdnConfig.backendHost.length > 0 ? 1 : 0.5}>
                        {externalCdnConfig?.backendHost || ''}
                      </Paragraph>}
                  </YStack>
                  : undefined}

                {isWeb && isAdmin ? <YStack h={50} /> : undefined}
              </YStack>
            </ScrollView>

            {isAdmin ?
              isWeb ? <StickyBox bottom offsetBottom={0} className='blur' style={{ width: '100%', zIndex: 10 }}>
                <YStack w='100%' opacity={.92} paddingVertical='$2' backgroundColor='$background' alignContent='center'>
                  <Button maw={600} als='center'
                    disabled={updating || !inputsValid}
                    {...themedButtonBackground(primaryColor)}
                    opacity={updating || !inputsValid ? 0.5 : 1}
                    onPress={updateServer}  >
                    <Heading size='$1' color={primaryTextColor}>Update Server</Heading>
                  </Button>
                </YStack>
              </StickyBox>
                : <Button maw={600} mt='$3' als='center' backgroundColor={primaryColor} onPress={updateServer} disabled={updating} opacity={updating ? 0.5 : 1}>Update Server</Button>
              : undefined}

          </YStack>
          : app.allowServerSelection || serverIsSelected ? <>
            <Heading ta="center" fow="800">Server not configured. Add it through your Accounts screen, or autoconfigure it, first.</Heading>
            <Paragraph ta="center" fow="800">{`Server URL: ${requestedServerUrl}`}</Paragraph>
            {requestedServerUrlValid ? <Button theme='active' mt='$2' onPress={() => {
              let [newServerProtocol, newServerHost] = requestedServerUrlParts;
              let newServerSecure = newServerProtocol == 'https';
              dispatch(upsertServer({
                host: newServerHost!,
                secure: newServerSecure,
              }));
            }}>
              Autoconfigure Server <Heading size='$3'>{requestedServerUrl}</Heading>
            </Button>
              : <>
                <Heading color={warningAnchorColor} size='$3' ta={'center'}>Server URL is invalid.</Heading>
                <Heading color={warningAnchorColor} size='$3' ta={'center'}>Server URL format: [http|https]:valid_hostname</Heading>
              </>}
          </> :
            <>
              <Heading ta="center" fow="800">Enable "Allow Server Selection" in your settings to continue.</Heading>
              <Paragraph ta="center" fow="800">{`Server URL: ${requestedServerUrl}`}</Paragraph>
              <Button theme='active' mt='$2' onPress={() => dispatch(setAllowServerSelection(true))}>
                Enable "Allow Server Selection"
              </Button>
            </>}
        {/* <Button {...linkProps} icon={ChevronLeft}>
          Go Home
        </Button> */}
      </YStack>
    </TabsNavigation>
  )
}
