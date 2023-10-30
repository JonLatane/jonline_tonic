/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Permission, permissionFromJSON, permissionToJSON } from "./permissions";
import {
  Moderation,
  moderationFromJSON,
  moderationToJSON,
  Visibility,
  visibilityFromJSON,
  visibilityToJSON,
} from "./visibility_moderation";

export const protobufPackage = "jonline";

export enum AuthenticationFeature {
  AUTHENTICATION_FEATURE_UNKNOWN = 0,
  /** CREATE_ACCOUNT - Users can sign up for an account. */
  CREATE_ACCOUNT = 1,
  /** LOGIN - Users can sign in with an existing account. */
  LOGIN = 2,
  UNRECOGNIZED = -1,
}

export function authenticationFeatureFromJSON(object: any): AuthenticationFeature {
  switch (object) {
    case 0:
    case "AUTHENTICATION_FEATURE_UNKNOWN":
      return AuthenticationFeature.AUTHENTICATION_FEATURE_UNKNOWN;
    case 1:
    case "CREATE_ACCOUNT":
      return AuthenticationFeature.CREATE_ACCOUNT;
    case 2:
    case "LOGIN":
      return AuthenticationFeature.LOGIN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return AuthenticationFeature.UNRECOGNIZED;
  }
}

export function authenticationFeatureToJSON(object: AuthenticationFeature): string {
  switch (object) {
    case AuthenticationFeature.AUTHENTICATION_FEATURE_UNKNOWN:
      return "AUTHENTICATION_FEATURE_UNKNOWN";
    case AuthenticationFeature.CREATE_ACCOUNT:
      return "CREATE_ACCOUNT";
    case AuthenticationFeature.LOGIN:
      return "LOGIN";
    case AuthenticationFeature.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum PrivateUserStrategy {
  /**
   * ACCOUNT_IS_FROZEN - `PRIVATE` Users can't see other Users (only `PUBLIC_GLOBAL` Visilibity Users/Posts/Events).
   * Other users can't see them.
   */
  ACCOUNT_IS_FROZEN = 0,
  /**
   * LIMITED_CREEPINESS - Users can see other users they follow, but only `PUBLIC_GLOBAL` Visilibity Posts/Events.
   * Other users can't see them.
   */
  LIMITED_CREEPINESS = 1,
  /**
   * LET_ME_CREEP_ON_PPL - Users can see other users they follow, including their `PUBLIC_SERVER` Posts/Events.
   * Other users can't see them.
   */
  LET_ME_CREEP_ON_PPL = 2,
  UNRECOGNIZED = -1,
}

export function privateUserStrategyFromJSON(object: any): PrivateUserStrategy {
  switch (object) {
    case 0:
    case "ACCOUNT_IS_FROZEN":
      return PrivateUserStrategy.ACCOUNT_IS_FROZEN;
    case 1:
    case "LIMITED_CREEPINESS":
      return PrivateUserStrategy.LIMITED_CREEPINESS;
    case 2:
    case "LET_ME_CREEP_ON_PPL":
      return PrivateUserStrategy.LET_ME_CREEP_ON_PPL;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PrivateUserStrategy.UNRECOGNIZED;
  }
}

export function privateUserStrategyToJSON(object: PrivateUserStrategy): string {
  switch (object) {
    case PrivateUserStrategy.ACCOUNT_IS_FROZEN:
      return "ACCOUNT_IS_FROZEN";
    case PrivateUserStrategy.LIMITED_CREEPINESS:
      return "LIMITED_CREEPINESS";
    case PrivateUserStrategy.LET_ME_CREEP_ON_PPL:
      return "LET_ME_CREEP_ON_PPL";
    case PrivateUserStrategy.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Offers a choice of web UIs. All */
export enum WebUserInterface {
  /** FLUTTER_WEB - Uses Flutter Web. Loaded from /app. */
  FLUTTER_WEB = 0,
  /**
   * HANDLEBARS_TEMPLATES - Uses Handlebars templates. Deprecated; will revert to Tamagui UI if chosen.
   *
   * @deprecated
   */
  HANDLEBARS_TEMPLATES = 1,
  /** REACT_TAMAGUI - React UI using Tamagui (a React Native UI library). */
  REACT_TAMAGUI = 2,
  UNRECOGNIZED = -1,
}

export function webUserInterfaceFromJSON(object: any): WebUserInterface {
  switch (object) {
    case 0:
    case "FLUTTER_WEB":
      return WebUserInterface.FLUTTER_WEB;
    case 1:
    case "HANDLEBARS_TEMPLATES":
      return WebUserInterface.HANDLEBARS_TEMPLATES;
    case 2:
    case "REACT_TAMAGUI":
      return WebUserInterface.REACT_TAMAGUI;
    case -1:
    case "UNRECOGNIZED":
    default:
      return WebUserInterface.UNRECOGNIZED;
  }
}

export function webUserInterfaceToJSON(object: WebUserInterface): string {
  switch (object) {
    case WebUserInterface.FLUTTER_WEB:
      return "FLUTTER_WEB";
    case WebUserInterface.HANDLEBARS_TEMPLATES:
      return "HANDLEBARS_TEMPLATES";
    case WebUserInterface.REACT_TAMAGUI:
      return "REACT_TAMAGUI";
    case WebUserInterface.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/** Configuration for a Jonline server instance. */
export interface ServerConfiguration {
  /** The name, description, logo, color scheme, etc. of the server. */
  serverInfo?:
    | ServerInfo
    | undefined;
  /**
   * Permissions for a user who isn't logged in to the server. Allows
   * admins to disable certain features for anonymous users. Valid values are
   * `VIEW_USERS`, `VIEW_GROUPS`, `VIEW_POSTS`, and `VIEW_EVENTS`.
   */
  anonymousUserPermissions: Permission[];
  /**
   * Default user permissions given to a new user. Users with `MODERATE_USERS` permission can also
   * grant/revoke these permissions for others. Valid values are
   * `VIEW_USERS`, `PUBLISH_USERS_LOCALLY`, `PUBLISH_USERS_GLOBALLY`,
   * `VIEW_GROUPS`, `CREATE_GROUPS`, `PUBLISH_GROUPS_LOCALLY`, `PUBLISH_GROUPS_GLOBALLY`, `JOIN_GROUPS`,
   * `VIEW_POSTS`, `CREATE_POSTS`, `PUBLISH_POSTS_LOCALLY`, `PUBLISH_POSTS_GLOBALLY`,
   * `VIEW_EVENTS`, `CREATE_EVENTS`, `PUBLISH_EVENTS_LOCALLY`, and `PUBLISH_EVENTS_GLOBALLY`.
   */
  defaultUserPermissions: Permission[];
  /**
   * Permissions grantable by a user with the `GRANT_BASIC_PERMISSIONS` permission. Valid values are
   * `VIEW_USERS`, `PUBLISH_USERS_LOCALLY`, `PUBLISH_USERS_GLOBALLY`,
   * `VIEW_GROUPS`, `CREATE_GROUPS`, `PUBLISH_GROUPS_LOCALLY`, `PUBLISH_GROUPS_GLOBALLY`, `JOIN_GROUPS`,
   * `VIEW_POSTS`, `CREATE_POSTS`, `PUBLISH_POSTS_LOCALLY`, `PUBLISH_POSTS_GLOBALLY`,
   * `VIEW_EVENTS`, `CREATE_EVENTS`, `PUBLISH_EVENTS_LOCALLY`, and `PUBLISH_EVENTS_GLOBALLY`.
   */
  basicUserPermissions: Permission[];
  /**
   * If default visibility is `GLOBAL_PUBLIC`, default_user_permissions *must*
   * contain `PUBLISH_USERS_GLOBALLY`.
   */
  peopleSettings:
    | FeatureSettings
    | undefined;
  /**
   * If default visibility is `GLOBAL_PUBLIC`, default_user_permissions *must*
   * contain `PUBLISH_GROUPS_GLOBALLY`.
   */
  groupSettings:
    | FeatureSettings
    | undefined;
  /**
   * If default visibility is `GLOBAL_PUBLIC`, default_user_permissions *must*
   * contain `PUBLISH_POSTS_GLOBALLY`.
   */
  postSettings:
    | PostSettings
    | undefined;
  /**
   * If default visibility is `GLOBAL_PUBLIC`, default_user_permissions *must*
   * contain `PUBLISH_EVENTS_GLOBALLY`.
   */
  eventSettings:
    | FeatureSettings
    | undefined;
  /**
   * If default visibility is `GLOBAL_PUBLIC`, default_user_permissions *must*
   * contain `PUBLISH_EVENTS_GLOBALLY`.
   */
  mediaSettings:
    | FeatureSettings
    | undefined;
  /**
   * If set, enables External CDN support for the server. This means that the
   * non-secure HTTP server (on port 80) will *not* redirect to the secure server,
   * and instead serve up Tamagui Web/Flutter clients directly. This allows you
   * to point Cloudflare's "CNAME HTTPS Proxy" feature at your Jonline server to serve
   * up HTML/CS/JS and Media files with caching from Cloudflare's CDN.
   *
   * See ExternalCDNConfig for more details on securing this setup.
   */
  externalCdnConfig?:
    | ExternalCDNConfig
    | undefined;
  /** Strategy when a user sets their visibility to `PRIVATE`. Defaults to `ACCOUNT_IS_FROZEN`. */
  privateUserStrategy: PrivateUserStrategy;
  /**
   * (TODO) Allows admins to enable/disable creating accounts and logging in.
   * Eventually, external auth too hopefully!
   */
  authenticationFeatures: AuthenticationFeature[];
}

/**
 * Useful for setting your Jonline instance up to run underneath a CDN.
 * By default, the web client uses `window.location.hostname` to determine the backend server.
 * If set, the web client will use this value instead. NOTE: Only applies to Tamagui web client for now.
 */
export interface ExternalCDNConfig {
  /**
   * The domain where the frontend is hosted. For example, jonline.io. Typically
   * your CDN (like Cloudflare) should own the DNS for this domain.
   */
  frontendHost: string;
  /**
   * The domain where the backend is hosted. For example, jonline.io.itsj.online.
   * Typically your Kubernetes provider should own DNS for this domain.
   */
  backendHost: string;
  /**
   * (TODO) When set, the HTTP `GET /media/<id>?<authorization>` endpoint will be disabled by default on the
   * HTTP (non-secure) server that sends data to the CDN. Only requests from IPs in
   * `media_ipv4_allowlist` and `media_ipv6_allowlist` will be allowed.
   */
  secureMedia: boolean;
  /**
   * Whitespace- and/or comma- separated list of IPv4 addresses/ranges
   * to whom media data may be served. Only applicable if `secure_media` is `true`.
   * For reference, Cloudflare's are at https://www.cloudflare.com/ips-v4.
   */
  mediaIpv4Allowlist?:
    | string
    | undefined;
  /**
   * Whitespace- and/or comma- separated list of IPv6 addresses/ranges
   * to whom media data may be served. Only applicable if `secure_media` is `true`.
   * For reference, Cloudflare's are at https://www.cloudflare.com/ips-v6.
   */
  mediaIpv6Allowlist?:
    | string
    | undefined;
  /**
   * (TODO) When implemented, this actually changes the whole Jonline protocol (in terms of ports).
   * When enabled, Jonline should *not* server a secure site on HTTPS, and instead serve
   * the Tonic gRPC server there (on port 443). Jonine clients will need to be updated to
   * always seek out a secure client on port 443 when this feature is enabled.
   * This would let Jonline leverage Cloudflare's DDOS protection and performance on gRPC as well as HTTP.
   * (This is a Cloudflare-specific feature requirement.)
   */
  cdnGrpc: boolean;
}

export interface FeatureSettings {
  /** Hide the Posts or Events tab from the user with this flag. */
  visible: boolean;
  /**
   * Only `UNMODERATED` and `PENDING` are valid.
   * When `UNMODERATED`, user reports may transition status to `PENDING`.
   * When `PENDING`, users' SERVER_PUBLIC or `GLOBAL_PUBLIC` posts will not
   * be visible until a moderator approves them. `LIMITED` visiblity
   * posts are always visible to targeted users (who have not blocked
   * the author) regardless of default_moderation.
   */
  defaultModeration: Moderation;
  /**
   * Only `SERVER_PUBLIC` and `GLOBAL_PUBLIC` are valid. `GLOBAL_PUBLIC` is only valid
   * if default_user_permissions contains `GLOBALLY_PUBLISH_[USERS|GROUPS|POSTS|EVENTS]`
   * as appropriate.
   */
  defaultVisibility: Visibility;
  customTitle?: string | undefined;
}

export interface PostSettings {
  /** Hide the Posts or Events tab from the user with this flag. */
  visible: boolean;
  /**
   * Only `UNMODERATED` and `PENDING` are valid.
   * When `UNMODERATED`, user reports may transition status to `PENDING`.
   * When `PENDING`, users' SERVER_PUBLIC or `GLOBAL_PUBLIC` posts will not
   * be visible until a moderator approves them. `LIMITED` visiblity
   * posts are always visible to targeted users (who have not blocked
   * the author) regardless of default_moderation.
   */
  defaultModeration: Moderation;
  /**
   * Only `SERVER_PUBLIC` and `GLOBAL_PUBLIC` are valid. `GLOBAL_PUBLIC` is only valid
   * if default_user_permissions contains `GLOBALLY_PUBLISH_[USERS|GROUPS|POSTS|EVENTS]`
   * as appropriate.
   */
  defaultVisibility: Visibility;
  customTitle?:
    | string
    | undefined;
  /**
   * Controls whether replies are shown in the UI. Note that users' ability to reply
   * is controlled by the `REPLY_TO_POSTS` permission.
   */
  enableReplies: boolean;
}

/** User-facing information about the server displayed on the "about" page. */
export interface ServerInfo {
  /** Name of the server. */
  name?: string | undefined;
  shortName?: string | undefined;
  description?: string | undefined;
  privacyPolicy?: string | undefined;
  logo?: ServerLogo | undefined;
  webUserInterface?: WebUserInterface | undefined;
  colors?: ServerColors | undefined;
  mediaPolicy?: string | undefined;
  recommendedServerHosts: string[];
}

export interface ServerLogo {
  squareMediaId?: string | undefined;
  squareMediaIdDark?: string | undefined;
  wideMediaId?: string | undefined;
  wideMediaIdDark?: string | undefined;
}

/** Color in ARGB hex format (i.e `0xAARRGGBB`). */
export interface ServerColors {
  /** App Bar/primary accent color. */
  primary?:
    | number
    | undefined;
  /** Nav/secondary accent color. */
  navigation?:
    | number
    | undefined;
  /** Color used on author of a post in discussion threads for it. */
  author?:
    | number
    | undefined;
  /** Color used on author for admin posts. */
  admin?:
    | number
    | undefined;
  /** Color used on author for moderator posts. */
  moderator?: number | undefined;
}

function createBaseServerConfiguration(): ServerConfiguration {
  return {
    serverInfo: undefined,
    anonymousUserPermissions: [],
    defaultUserPermissions: [],
    basicUserPermissions: [],
    peopleSettings: undefined,
    groupSettings: undefined,
    postSettings: undefined,
    eventSettings: undefined,
    mediaSettings: undefined,
    externalCdnConfig: undefined,
    privateUserStrategy: 0,
    authenticationFeatures: [],
  };
}

export const ServerConfiguration = {
  encode(message: ServerConfiguration, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serverInfo !== undefined) {
      ServerInfo.encode(message.serverInfo, writer.uint32(10).fork()).ldelim();
    }
    writer.uint32(82).fork();
    for (const v of message.anonymousUserPermissions) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(90).fork();
    for (const v of message.defaultUserPermissions) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(98).fork();
    for (const v of message.basicUserPermissions) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.peopleSettings !== undefined) {
      FeatureSettings.encode(message.peopleSettings, writer.uint32(162).fork()).ldelim();
    }
    if (message.groupSettings !== undefined) {
      FeatureSettings.encode(message.groupSettings, writer.uint32(170).fork()).ldelim();
    }
    if (message.postSettings !== undefined) {
      PostSettings.encode(message.postSettings, writer.uint32(178).fork()).ldelim();
    }
    if (message.eventSettings !== undefined) {
      FeatureSettings.encode(message.eventSettings, writer.uint32(186).fork()).ldelim();
    }
    if (message.mediaSettings !== undefined) {
      FeatureSettings.encode(message.mediaSettings, writer.uint32(194).fork()).ldelim();
    }
    if (message.externalCdnConfig !== undefined) {
      ExternalCDNConfig.encode(message.externalCdnConfig, writer.uint32(722).fork()).ldelim();
    }
    if (message.privateUserStrategy !== 0) {
      writer.uint32(800).int32(message.privateUserStrategy);
    }
    writer.uint32(810).fork();
    for (const v of message.authenticationFeatures) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerConfiguration {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerConfiguration();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.serverInfo = ServerInfo.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag === 80) {
            message.anonymousUserPermissions.push(reader.int32() as any);

            continue;
          }

          if (tag === 82) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.anonymousUserPermissions.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 11:
          if (tag === 88) {
            message.defaultUserPermissions.push(reader.int32() as any);

            continue;
          }

          if (tag === 90) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.defaultUserPermissions.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 12:
          if (tag === 96) {
            message.basicUserPermissions.push(reader.int32() as any);

            continue;
          }

          if (tag === 98) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.basicUserPermissions.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 20:
          if (tag !== 162) {
            break;
          }

          message.peopleSettings = FeatureSettings.decode(reader, reader.uint32());
          continue;
        case 21:
          if (tag !== 170) {
            break;
          }

          message.groupSettings = FeatureSettings.decode(reader, reader.uint32());
          continue;
        case 22:
          if (tag !== 178) {
            break;
          }

          message.postSettings = PostSettings.decode(reader, reader.uint32());
          continue;
        case 23:
          if (tag !== 186) {
            break;
          }

          message.eventSettings = FeatureSettings.decode(reader, reader.uint32());
          continue;
        case 24:
          if (tag !== 194) {
            break;
          }

          message.mediaSettings = FeatureSettings.decode(reader, reader.uint32());
          continue;
        case 90:
          if (tag !== 722) {
            break;
          }

          message.externalCdnConfig = ExternalCDNConfig.decode(reader, reader.uint32());
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }

          message.privateUserStrategy = reader.int32() as any;
          continue;
        case 101:
          if (tag === 808) {
            message.authenticationFeatures.push(reader.int32() as any);

            continue;
          }

          if (tag === 810) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.authenticationFeatures.push(reader.int32() as any);
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerConfiguration {
    return {
      serverInfo: isSet(object.serverInfo) ? ServerInfo.fromJSON(object.serverInfo) : undefined,
      anonymousUserPermissions: globalThis.Array.isArray(object?.anonymousUserPermissions)
        ? object.anonymousUserPermissions.map((e: any) => permissionFromJSON(e))
        : [],
      defaultUserPermissions: globalThis.Array.isArray(object?.defaultUserPermissions)
        ? object.defaultUserPermissions.map((e: any) => permissionFromJSON(e))
        : [],
      basicUserPermissions: globalThis.Array.isArray(object?.basicUserPermissions)
        ? object.basicUserPermissions.map((e: any) => permissionFromJSON(e))
        : [],
      peopleSettings: isSet(object.peopleSettings) ? FeatureSettings.fromJSON(object.peopleSettings) : undefined,
      groupSettings: isSet(object.groupSettings) ? FeatureSettings.fromJSON(object.groupSettings) : undefined,
      postSettings: isSet(object.postSettings) ? PostSettings.fromJSON(object.postSettings) : undefined,
      eventSettings: isSet(object.eventSettings) ? FeatureSettings.fromJSON(object.eventSettings) : undefined,
      mediaSettings: isSet(object.mediaSettings) ? FeatureSettings.fromJSON(object.mediaSettings) : undefined,
      externalCdnConfig: isSet(object.externalCdnConfig)
        ? ExternalCDNConfig.fromJSON(object.externalCdnConfig)
        : undefined,
      privateUserStrategy: isSet(object.privateUserStrategy)
        ? privateUserStrategyFromJSON(object.privateUserStrategy)
        : 0,
      authenticationFeatures: globalThis.Array.isArray(object?.authenticationFeatures)
        ? object.authenticationFeatures.map((e: any) => authenticationFeatureFromJSON(e))
        : [],
    };
  },

  toJSON(message: ServerConfiguration): unknown {
    const obj: any = {};
    if (message.serverInfo !== undefined) {
      obj.serverInfo = ServerInfo.toJSON(message.serverInfo);
    }
    if (message.anonymousUserPermissions?.length) {
      obj.anonymousUserPermissions = message.anonymousUserPermissions.map((e) => permissionToJSON(e));
    }
    if (message.defaultUserPermissions?.length) {
      obj.defaultUserPermissions = message.defaultUserPermissions.map((e) => permissionToJSON(e));
    }
    if (message.basicUserPermissions?.length) {
      obj.basicUserPermissions = message.basicUserPermissions.map((e) => permissionToJSON(e));
    }
    if (message.peopleSettings !== undefined) {
      obj.peopleSettings = FeatureSettings.toJSON(message.peopleSettings);
    }
    if (message.groupSettings !== undefined) {
      obj.groupSettings = FeatureSettings.toJSON(message.groupSettings);
    }
    if (message.postSettings !== undefined) {
      obj.postSettings = PostSettings.toJSON(message.postSettings);
    }
    if (message.eventSettings !== undefined) {
      obj.eventSettings = FeatureSettings.toJSON(message.eventSettings);
    }
    if (message.mediaSettings !== undefined) {
      obj.mediaSettings = FeatureSettings.toJSON(message.mediaSettings);
    }
    if (message.externalCdnConfig !== undefined) {
      obj.externalCdnConfig = ExternalCDNConfig.toJSON(message.externalCdnConfig);
    }
    if (message.privateUserStrategy !== 0) {
      obj.privateUserStrategy = privateUserStrategyToJSON(message.privateUserStrategy);
    }
    if (message.authenticationFeatures?.length) {
      obj.authenticationFeatures = message.authenticationFeatures.map((e) => authenticationFeatureToJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServerConfiguration>, I>>(base?: I): ServerConfiguration {
    return ServerConfiguration.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServerConfiguration>, I>>(object: I): ServerConfiguration {
    const message = createBaseServerConfiguration();
    message.serverInfo = (object.serverInfo !== undefined && object.serverInfo !== null)
      ? ServerInfo.fromPartial(object.serverInfo)
      : undefined;
    message.anonymousUserPermissions = object.anonymousUserPermissions?.map((e) => e) || [];
    message.defaultUserPermissions = object.defaultUserPermissions?.map((e) => e) || [];
    message.basicUserPermissions = object.basicUserPermissions?.map((e) => e) || [];
    message.peopleSettings = (object.peopleSettings !== undefined && object.peopleSettings !== null)
      ? FeatureSettings.fromPartial(object.peopleSettings)
      : undefined;
    message.groupSettings = (object.groupSettings !== undefined && object.groupSettings !== null)
      ? FeatureSettings.fromPartial(object.groupSettings)
      : undefined;
    message.postSettings = (object.postSettings !== undefined && object.postSettings !== null)
      ? PostSettings.fromPartial(object.postSettings)
      : undefined;
    message.eventSettings = (object.eventSettings !== undefined && object.eventSettings !== null)
      ? FeatureSettings.fromPartial(object.eventSettings)
      : undefined;
    message.mediaSettings = (object.mediaSettings !== undefined && object.mediaSettings !== null)
      ? FeatureSettings.fromPartial(object.mediaSettings)
      : undefined;
    message.externalCdnConfig = (object.externalCdnConfig !== undefined && object.externalCdnConfig !== null)
      ? ExternalCDNConfig.fromPartial(object.externalCdnConfig)
      : undefined;
    message.privateUserStrategy = object.privateUserStrategy ?? 0;
    message.authenticationFeatures = object.authenticationFeatures?.map((e) => e) || [];
    return message;
  },
};

function createBaseExternalCDNConfig(): ExternalCDNConfig {
  return {
    frontendHost: "",
    backendHost: "",
    secureMedia: false,
    mediaIpv4Allowlist: undefined,
    mediaIpv6Allowlist: undefined,
    cdnGrpc: false,
  };
}

export const ExternalCDNConfig = {
  encode(message: ExternalCDNConfig, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.frontendHost !== "") {
      writer.uint32(10).string(message.frontendHost);
    }
    if (message.backendHost !== "") {
      writer.uint32(18).string(message.backendHost);
    }
    if (message.secureMedia === true) {
      writer.uint32(24).bool(message.secureMedia);
    }
    if (message.mediaIpv4Allowlist !== undefined) {
      writer.uint32(34).string(message.mediaIpv4Allowlist);
    }
    if (message.mediaIpv6Allowlist !== undefined) {
      writer.uint32(42).string(message.mediaIpv6Allowlist);
    }
    if (message.cdnGrpc === true) {
      writer.uint32(48).bool(message.cdnGrpc);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExternalCDNConfig {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExternalCDNConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.frontendHost = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.backendHost = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.secureMedia = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.mediaIpv4Allowlist = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.mediaIpv6Allowlist = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.cdnGrpc = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ExternalCDNConfig {
    return {
      frontendHost: isSet(object.frontendHost) ? globalThis.String(object.frontendHost) : "",
      backendHost: isSet(object.backendHost) ? globalThis.String(object.backendHost) : "",
      secureMedia: isSet(object.secureMedia) ? globalThis.Boolean(object.secureMedia) : false,
      mediaIpv4Allowlist: isSet(object.mediaIpv4Allowlist) ? globalThis.String(object.mediaIpv4Allowlist) : undefined,
      mediaIpv6Allowlist: isSet(object.mediaIpv6Allowlist) ? globalThis.String(object.mediaIpv6Allowlist) : undefined,
      cdnGrpc: isSet(object.cdnGrpc) ? globalThis.Boolean(object.cdnGrpc) : false,
    };
  },

  toJSON(message: ExternalCDNConfig): unknown {
    const obj: any = {};
    if (message.frontendHost !== "") {
      obj.frontendHost = message.frontendHost;
    }
    if (message.backendHost !== "") {
      obj.backendHost = message.backendHost;
    }
    if (message.secureMedia === true) {
      obj.secureMedia = message.secureMedia;
    }
    if (message.mediaIpv4Allowlist !== undefined) {
      obj.mediaIpv4Allowlist = message.mediaIpv4Allowlist;
    }
    if (message.mediaIpv6Allowlist !== undefined) {
      obj.mediaIpv6Allowlist = message.mediaIpv6Allowlist;
    }
    if (message.cdnGrpc === true) {
      obj.cdnGrpc = message.cdnGrpc;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ExternalCDNConfig>, I>>(base?: I): ExternalCDNConfig {
    return ExternalCDNConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ExternalCDNConfig>, I>>(object: I): ExternalCDNConfig {
    const message = createBaseExternalCDNConfig();
    message.frontendHost = object.frontendHost ?? "";
    message.backendHost = object.backendHost ?? "";
    message.secureMedia = object.secureMedia ?? false;
    message.mediaIpv4Allowlist = object.mediaIpv4Allowlist ?? undefined;
    message.mediaIpv6Allowlist = object.mediaIpv6Allowlist ?? undefined;
    message.cdnGrpc = object.cdnGrpc ?? false;
    return message;
  },
};

function createBaseFeatureSettings(): FeatureSettings {
  return { visible: false, defaultModeration: 0, defaultVisibility: 0, customTitle: undefined };
}

export const FeatureSettings = {
  encode(message: FeatureSettings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.visible === true) {
      writer.uint32(8).bool(message.visible);
    }
    if (message.defaultModeration !== 0) {
      writer.uint32(16).int32(message.defaultModeration);
    }
    if (message.defaultVisibility !== 0) {
      writer.uint32(24).int32(message.defaultVisibility);
    }
    if (message.customTitle !== undefined) {
      writer.uint32(34).string(message.customTitle);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeatureSettings {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeatureSettings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.visible = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.defaultModeration = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.defaultVisibility = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.customTitle = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FeatureSettings {
    return {
      visible: isSet(object.visible) ? globalThis.Boolean(object.visible) : false,
      defaultModeration: isSet(object.defaultModeration) ? moderationFromJSON(object.defaultModeration) : 0,
      defaultVisibility: isSet(object.defaultVisibility) ? visibilityFromJSON(object.defaultVisibility) : 0,
      customTitle: isSet(object.customTitle) ? globalThis.String(object.customTitle) : undefined,
    };
  },

  toJSON(message: FeatureSettings): unknown {
    const obj: any = {};
    if (message.visible === true) {
      obj.visible = message.visible;
    }
    if (message.defaultModeration !== 0) {
      obj.defaultModeration = moderationToJSON(message.defaultModeration);
    }
    if (message.defaultVisibility !== 0) {
      obj.defaultVisibility = visibilityToJSON(message.defaultVisibility);
    }
    if (message.customTitle !== undefined) {
      obj.customTitle = message.customTitle;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FeatureSettings>, I>>(base?: I): FeatureSettings {
    return FeatureSettings.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FeatureSettings>, I>>(object: I): FeatureSettings {
    const message = createBaseFeatureSettings();
    message.visible = object.visible ?? false;
    message.defaultModeration = object.defaultModeration ?? 0;
    message.defaultVisibility = object.defaultVisibility ?? 0;
    message.customTitle = object.customTitle ?? undefined;
    return message;
  },
};

function createBasePostSettings(): PostSettings {
  return { visible: false, defaultModeration: 0, defaultVisibility: 0, customTitle: undefined, enableReplies: false };
}

export const PostSettings = {
  encode(message: PostSettings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.visible === true) {
      writer.uint32(8).bool(message.visible);
    }
    if (message.defaultModeration !== 0) {
      writer.uint32(16).int32(message.defaultModeration);
    }
    if (message.defaultVisibility !== 0) {
      writer.uint32(24).int32(message.defaultVisibility);
    }
    if (message.customTitle !== undefined) {
      writer.uint32(34).string(message.customTitle);
    }
    if (message.enableReplies === true) {
      writer.uint32(40).bool(message.enableReplies);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PostSettings {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePostSettings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.visible = reader.bool();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.defaultModeration = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.defaultVisibility = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.customTitle = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.enableReplies = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PostSettings {
    return {
      visible: isSet(object.visible) ? globalThis.Boolean(object.visible) : false,
      defaultModeration: isSet(object.defaultModeration) ? moderationFromJSON(object.defaultModeration) : 0,
      defaultVisibility: isSet(object.defaultVisibility) ? visibilityFromJSON(object.defaultVisibility) : 0,
      customTitle: isSet(object.customTitle) ? globalThis.String(object.customTitle) : undefined,
      enableReplies: isSet(object.enableReplies) ? globalThis.Boolean(object.enableReplies) : false,
    };
  },

  toJSON(message: PostSettings): unknown {
    const obj: any = {};
    if (message.visible === true) {
      obj.visible = message.visible;
    }
    if (message.defaultModeration !== 0) {
      obj.defaultModeration = moderationToJSON(message.defaultModeration);
    }
    if (message.defaultVisibility !== 0) {
      obj.defaultVisibility = visibilityToJSON(message.defaultVisibility);
    }
    if (message.customTitle !== undefined) {
      obj.customTitle = message.customTitle;
    }
    if (message.enableReplies === true) {
      obj.enableReplies = message.enableReplies;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PostSettings>, I>>(base?: I): PostSettings {
    return PostSettings.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PostSettings>, I>>(object: I): PostSettings {
    const message = createBasePostSettings();
    message.visible = object.visible ?? false;
    message.defaultModeration = object.defaultModeration ?? 0;
    message.defaultVisibility = object.defaultVisibility ?? 0;
    message.customTitle = object.customTitle ?? undefined;
    message.enableReplies = object.enableReplies ?? false;
    return message;
  },
};

function createBaseServerInfo(): ServerInfo {
  return {
    name: undefined,
    shortName: undefined,
    description: undefined,
    privacyPolicy: undefined,
    logo: undefined,
    webUserInterface: undefined,
    colors: undefined,
    mediaPolicy: undefined,
    recommendedServerHosts: [],
  };
}

export const ServerInfo = {
  encode(message: ServerInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== undefined) {
      writer.uint32(10).string(message.name);
    }
    if (message.shortName !== undefined) {
      writer.uint32(18).string(message.shortName);
    }
    if (message.description !== undefined) {
      writer.uint32(26).string(message.description);
    }
    if (message.privacyPolicy !== undefined) {
      writer.uint32(34).string(message.privacyPolicy);
    }
    if (message.logo !== undefined) {
      ServerLogo.encode(message.logo, writer.uint32(42).fork()).ldelim();
    }
    if (message.webUserInterface !== undefined) {
      writer.uint32(48).int32(message.webUserInterface);
    }
    if (message.colors !== undefined) {
      ServerColors.encode(message.colors, writer.uint32(58).fork()).ldelim();
    }
    if (message.mediaPolicy !== undefined) {
      writer.uint32(66).string(message.mediaPolicy);
    }
    for (const v of message.recommendedServerHosts) {
      writer.uint32(74).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.shortName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.description = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.privacyPolicy = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.logo = ServerLogo.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.webUserInterface = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.colors = ServerColors.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.mediaPolicy = reader.string();
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.recommendedServerHosts.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerInfo {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : undefined,
      shortName: isSet(object.shortName) ? globalThis.String(object.shortName) : undefined,
      description: isSet(object.description) ? globalThis.String(object.description) : undefined,
      privacyPolicy: isSet(object.privacyPolicy) ? globalThis.String(object.privacyPolicy) : undefined,
      logo: isSet(object.logo) ? ServerLogo.fromJSON(object.logo) : undefined,
      webUserInterface: isSet(object.webUserInterface) ? webUserInterfaceFromJSON(object.webUserInterface) : undefined,
      colors: isSet(object.colors) ? ServerColors.fromJSON(object.colors) : undefined,
      mediaPolicy: isSet(object.mediaPolicy) ? globalThis.String(object.mediaPolicy) : undefined,
      recommendedServerHosts: globalThis.Array.isArray(object?.recommendedServerHosts)
        ? object.recommendedServerHosts.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: ServerInfo): unknown {
    const obj: any = {};
    if (message.name !== undefined) {
      obj.name = message.name;
    }
    if (message.shortName !== undefined) {
      obj.shortName = message.shortName;
    }
    if (message.description !== undefined) {
      obj.description = message.description;
    }
    if (message.privacyPolicy !== undefined) {
      obj.privacyPolicy = message.privacyPolicy;
    }
    if (message.logo !== undefined) {
      obj.logo = ServerLogo.toJSON(message.logo);
    }
    if (message.webUserInterface !== undefined) {
      obj.webUserInterface = webUserInterfaceToJSON(message.webUserInterface);
    }
    if (message.colors !== undefined) {
      obj.colors = ServerColors.toJSON(message.colors);
    }
    if (message.mediaPolicy !== undefined) {
      obj.mediaPolicy = message.mediaPolicy;
    }
    if (message.recommendedServerHosts?.length) {
      obj.recommendedServerHosts = message.recommendedServerHosts;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServerInfo>, I>>(base?: I): ServerInfo {
    return ServerInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServerInfo>, I>>(object: I): ServerInfo {
    const message = createBaseServerInfo();
    message.name = object.name ?? undefined;
    message.shortName = object.shortName ?? undefined;
    message.description = object.description ?? undefined;
    message.privacyPolicy = object.privacyPolicy ?? undefined;
    message.logo = (object.logo !== undefined && object.logo !== null)
      ? ServerLogo.fromPartial(object.logo)
      : undefined;
    message.webUserInterface = object.webUserInterface ?? undefined;
    message.colors = (object.colors !== undefined && object.colors !== null)
      ? ServerColors.fromPartial(object.colors)
      : undefined;
    message.mediaPolicy = object.mediaPolicy ?? undefined;
    message.recommendedServerHosts = object.recommendedServerHosts?.map((e) => e) || [];
    return message;
  },
};

function createBaseServerLogo(): ServerLogo {
  return { squareMediaId: undefined, squareMediaIdDark: undefined, wideMediaId: undefined, wideMediaIdDark: undefined };
}

export const ServerLogo = {
  encode(message: ServerLogo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.squareMediaId !== undefined) {
      writer.uint32(10).string(message.squareMediaId);
    }
    if (message.squareMediaIdDark !== undefined) {
      writer.uint32(18).string(message.squareMediaIdDark);
    }
    if (message.wideMediaId !== undefined) {
      writer.uint32(26).string(message.wideMediaId);
    }
    if (message.wideMediaIdDark !== undefined) {
      writer.uint32(34).string(message.wideMediaIdDark);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerLogo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerLogo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.squareMediaId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.squareMediaIdDark = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.wideMediaId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.wideMediaIdDark = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerLogo {
    return {
      squareMediaId: isSet(object.squareMediaId) ? globalThis.String(object.squareMediaId) : undefined,
      squareMediaIdDark: isSet(object.squareMediaIdDark) ? globalThis.String(object.squareMediaIdDark) : undefined,
      wideMediaId: isSet(object.wideMediaId) ? globalThis.String(object.wideMediaId) : undefined,
      wideMediaIdDark: isSet(object.wideMediaIdDark) ? globalThis.String(object.wideMediaIdDark) : undefined,
    };
  },

  toJSON(message: ServerLogo): unknown {
    const obj: any = {};
    if (message.squareMediaId !== undefined) {
      obj.squareMediaId = message.squareMediaId;
    }
    if (message.squareMediaIdDark !== undefined) {
      obj.squareMediaIdDark = message.squareMediaIdDark;
    }
    if (message.wideMediaId !== undefined) {
      obj.wideMediaId = message.wideMediaId;
    }
    if (message.wideMediaIdDark !== undefined) {
      obj.wideMediaIdDark = message.wideMediaIdDark;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServerLogo>, I>>(base?: I): ServerLogo {
    return ServerLogo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServerLogo>, I>>(object: I): ServerLogo {
    const message = createBaseServerLogo();
    message.squareMediaId = object.squareMediaId ?? undefined;
    message.squareMediaIdDark = object.squareMediaIdDark ?? undefined;
    message.wideMediaId = object.wideMediaId ?? undefined;
    message.wideMediaIdDark = object.wideMediaIdDark ?? undefined;
    return message;
  },
};

function createBaseServerColors(): ServerColors {
  return { primary: undefined, navigation: undefined, author: undefined, admin: undefined, moderator: undefined };
}

export const ServerColors = {
  encode(message: ServerColors, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.primary !== undefined) {
      writer.uint32(8).uint32(message.primary);
    }
    if (message.navigation !== undefined) {
      writer.uint32(16).uint32(message.navigation);
    }
    if (message.author !== undefined) {
      writer.uint32(24).uint32(message.author);
    }
    if (message.admin !== undefined) {
      writer.uint32(32).uint32(message.admin);
    }
    if (message.moderator !== undefined) {
      writer.uint32(40).uint32(message.moderator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerColors {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerColors();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.primary = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.navigation = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.author = reader.uint32();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.admin = reader.uint32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.moderator = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerColors {
    return {
      primary: isSet(object.primary) ? globalThis.Number(object.primary) : undefined,
      navigation: isSet(object.navigation) ? globalThis.Number(object.navigation) : undefined,
      author: isSet(object.author) ? globalThis.Number(object.author) : undefined,
      admin: isSet(object.admin) ? globalThis.Number(object.admin) : undefined,
      moderator: isSet(object.moderator) ? globalThis.Number(object.moderator) : undefined,
    };
  },

  toJSON(message: ServerColors): unknown {
    const obj: any = {};
    if (message.primary !== undefined) {
      obj.primary = Math.round(message.primary);
    }
    if (message.navigation !== undefined) {
      obj.navigation = Math.round(message.navigation);
    }
    if (message.author !== undefined) {
      obj.author = Math.round(message.author);
    }
    if (message.admin !== undefined) {
      obj.admin = Math.round(message.admin);
    }
    if (message.moderator !== undefined) {
      obj.moderator = Math.round(message.moderator);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ServerColors>, I>>(base?: I): ServerColors {
    return ServerColors.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ServerColors>, I>>(object: I): ServerColors {
    const message = createBaseServerColors();
    message.primary = object.primary ?? undefined;
    message.navigation = object.navigation ?? undefined;
    message.author = object.author ?? undefined;
    message.admin = object.admin ?? undefined;
    message.moderator = object.moderator ?? undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
