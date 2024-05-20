/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { FederatedAccount } from "./federation";
import { Timestamp } from "./google/protobuf/timestamp";
import { MediaReference } from "./media";
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

/** Ways of listing users. */
export enum UserListingType {
  /** EVERYONE - Get all users. */
  EVERYONE = 0,
  /** FOLLOWING - Get users the current user is following. */
  FOLLOWING = 1,
  /** FRIENDS - Get users who follow and are followed by the current user. */
  FRIENDS = 2,
  /** FOLLOWERS - Get users who follow the current user. */
  FOLLOWERS = 3,
  /** FOLLOW_REQUESTS - Get users who have requested to follow the current user. */
  FOLLOW_REQUESTS = 4,
  UNRECOGNIZED = -1,
}

export function userListingTypeFromJSON(object: any): UserListingType {
  switch (object) {
    case 0:
    case "EVERYONE":
      return UserListingType.EVERYONE;
    case 1:
    case "FOLLOWING":
      return UserListingType.FOLLOWING;
    case 2:
    case "FRIENDS":
      return UserListingType.FRIENDS;
    case 3:
    case "FOLLOWERS":
      return UserListingType.FOLLOWERS;
    case 4:
    case "FOLLOW_REQUESTS":
      return UserListingType.FOLLOW_REQUESTS;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UserListingType.UNRECOGNIZED;
  }
}

export function userListingTypeToJSON(object: UserListingType): string {
  switch (object) {
    case UserListingType.EVERYONE:
      return "EVERYONE";
    case UserListingType.FOLLOWING:
      return "FOLLOWING";
    case UserListingType.FRIENDS:
      return "FRIENDS";
    case UserListingType.FOLLOWERS:
      return "FOLLOWERS";
    case UserListingType.FOLLOW_REQUESTS:
      return "FOLLOW_REQUESTS";
    case UserListingType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

/**
 * Model for a Jonline user. This user may have [`Media`](#jonline-Media), [`Group`](#jonline-Group) [`Membership`](#jonline-Membership)s,
 * [`Post`](#jonline-Post)s, [`Event`](#jonline-Event)s, and other objects associated with them.
 */
export interface User {
  /** Permanent string ID for the user. Will never contain a `@` symbol. */
  id: string;
  /** Impermanent string username for the user. Will never contain a `@` symbol. */
  username: string;
  /** The user's real name. */
  realName: string;
  /** The user's email address. */
  email?:
    | ContactMethod
    | undefined;
  /** The user's phone number. */
  phone?:
    | ContactMethod
    | undefined;
  /** The user's permissions. See [`Permission`](#jonline-Permission) for details. */
  permissions: Permission[];
  /**
   * The user's avatar. Note that its visibility is managed by the User and thus
   * it may not be accessible to the current user.
   */
  avatar?:
    | MediaReference
    | undefined;
  /** The user's bio. */
  bio: string;
  /**
   * User visibility is a bit different from Post visibility.
   * LIMITED means the user can only be seen by users they follow
   * (as opposed to Posts' individualized visibilities).
   * PRIVATE visibility means no one can see the user.
   * See server_configuration.proto for details about PRIVATE
   * users' ability to creep.
   */
  visibility: Visibility;
  /** The user's moderation status. See [`Moderation`](#jonline-Moderation) for details. */
  moderation: Moderation;
  /** Only PENDING or UNMODERATED are valid. */
  defaultFollowModeration: Moderation;
  /** The number of users following this user. */
  followerCount?:
    | number
    | undefined;
  /** The number of users this user is following. */
  followingCount?:
    | number
    | undefined;
  /** The number of groups this user is a member of. */
  groupCount?:
    | number
    | undefined;
  /** The number of posts this user has made. */
  postCount?:
    | number
    | undefined;
  /** The number of responses to `Post`s and `Event`s this user has made. */
  responseCount?:
    | number
    | undefined;
  /**
   * Presence indicates the current user is following
   * or has a pending follow request for this user.
   */
  currentUserFollow?:
    | Follow
    | undefined;
  /**
   * Presence indicates this user is following or has
   * a pending follow request for the current user.
   */
  targetCurrentUserFollow?:
    | Follow
    | undefined;
  /**
   * Returned by `GetMembers` calls, for use when managing [`Group`](#jonline-Group) [`Membership`](#jonline-Membership)s.
   * The `Membership` should match the `Group` from the originating [`GetMembersRequest`](#jonline-GetMembersRequest),
   * providing whether the user is a member of that `Group`, has been invited, requested to join, etc..
   */
  currentGroupMembership?:
    | Membership
    | undefined;
  /** Indicates that `federated_profiles` has been loaded. */
  hasAdvancedData: boolean;
  /**
   * Federated profiles for the user. *Not always loaded.* This is a list of profiles from other servers
   * that the user has connected to their account. Managed by the user via
   * `Federate`
   */
  federatedProfiles: FederatedAccount[];
  /** The time the user was created. */
  createdAt:
    | string
    | undefined;
  /** The time the user was last updated. */
  updatedAt?: string | undefined;
}

/**
 * Post/authorship-centric version of User. UI can cross-reference user details
 * from its own cache (for things like admin/bot icons).
 */
export interface Author {
  /** Permanent string ID for the user. Will never contain a `@` symbol. */
  userId: string;
  /** Impermanent string username for the user. Will never contain a `@` symbol. */
  username?:
    | string
    | undefined;
  /** The user's avatar. */
  avatar?: MediaReference | undefined;
}

/** Model for a user's follow of another user. */
export interface Follow {
  /** The follower in the relationship. */
  userId: string;
  /** The user being followed. */
  targetUserId: string;
  /** Tracks whether the target user needs to approve the follow. */
  targetUserModeration: Moderation;
  /** The time the follow was created. */
  createdAt:
    | string
    | undefined;
  /** The time the follow was last updated. */
  updatedAt?: string | undefined;
}

/**
 * Model for a user's membership in a group. Memberships are generically
 * included as part of User models when relevant in Jonline, but UIs should use the group_id
 * to reconcile memberships with groups.
 */
export interface Membership {
  /** The member (or requested/invited member). */
  userId: string;
  /** The group the membership pertains to. */
  groupId: string;
  /** Valid Membership Permissions are:  `VIEW_POSTS`, `CREATE_POSTS`, `MODERATE_POSTS`, `VIEW_EVENTS`, CREATE_EVENTS, `MODERATE_EVENTS`, `ADMIN`, `RUN_BOTS`, and `MODERATE_USERS` */
  permissions: Permission[];
  /** Tracks whether group moderators need to approve the membership. */
  groupModeration: Moderation;
  /** Tracks whether the user needs to approve the membership. */
  userModeration: Moderation;
  /** The time the membership was created. */
  createdAt:
    | string
    | undefined;
  /** The time the membership was last updated. */
  updatedAt?: string | undefined;
}

/**
 * A contact method for a user. Models designed to support verification,
 * but verification RPCs are not yet implemented.
 */
export interface ContactMethod {
  /** Either a `mailto:` or `tel:` URL. */
  value?:
    | string
    | undefined;
  /** The visibility of the contact method. */
  visibility: Visibility;
  /**
   * Server-side flag indicating whether the server can verify
   * (and otherwise interact via) the contact method.
   */
  supportedByServer: boolean;
  /**
   * Indicates the user has completed verification of the contact method.
   * Verification requires `supported_by_server` to be `true`.
   */
  verified: boolean;
}

/**
 * Request to get one or more users by a variety of parameters.
 * Supported parameters depend on `listing_type`.
 */
export interface GetUsersRequest {
  /** The username to search for. Substrings are supported. */
  username?:
    | string
    | undefined;
  /** The user ID to search for. */
  userId?:
    | string
    | undefined;
  /** The page of results to return. Pages are 0-indexed. */
  page?:
    | number
    | undefined;
  /** The number of results to return per page. */
  listingType: UserListingType;
}

/** Response to a `GetUsersRequest`. */
export interface GetUsersResponse {
  /** The users matching the request. */
  users: User[];
  /** Whether there are more pages of results. */
  hasNextPage: boolean;
}

function createBaseUser(): User {
  return {
    id: "",
    username: "",
    realName: "",
    email: undefined,
    phone: undefined,
    permissions: [],
    avatar: undefined,
    bio: "",
    visibility: 0,
    moderation: 0,
    defaultFollowModeration: 0,
    followerCount: undefined,
    followingCount: undefined,
    groupCount: undefined,
    postCount: undefined,
    responseCount: undefined,
    currentUserFollow: undefined,
    targetCurrentUserFollow: undefined,
    currentGroupMembership: undefined,
    hasAdvancedData: false,
    federatedProfiles: [],
    createdAt: undefined,
    updatedAt: undefined,
  };
}

export const User = {
  encode(message: User, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.username !== "") {
      writer.uint32(18).string(message.username);
    }
    if (message.realName !== "") {
      writer.uint32(26).string(message.realName);
    }
    if (message.email !== undefined) {
      ContactMethod.encode(message.email, writer.uint32(34).fork()).ldelim();
    }
    if (message.phone !== undefined) {
      ContactMethod.encode(message.phone, writer.uint32(42).fork()).ldelim();
    }
    writer.uint32(50).fork();
    for (const v of message.permissions) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.avatar !== undefined) {
      MediaReference.encode(message.avatar, writer.uint32(58).fork()).ldelim();
    }
    if (message.bio !== "") {
      writer.uint32(66).string(message.bio);
    }
    if (message.visibility !== 0) {
      writer.uint32(160).int32(message.visibility);
    }
    if (message.moderation !== 0) {
      writer.uint32(168).int32(message.moderation);
    }
    if (message.defaultFollowModeration !== 0) {
      writer.uint32(240).int32(message.defaultFollowModeration);
    }
    if (message.followerCount !== undefined) {
      writer.uint32(248).int32(message.followerCount);
    }
    if (message.followingCount !== undefined) {
      writer.uint32(256).int32(message.followingCount);
    }
    if (message.groupCount !== undefined) {
      writer.uint32(264).int32(message.groupCount);
    }
    if (message.postCount !== undefined) {
      writer.uint32(272).int32(message.postCount);
    }
    if (message.responseCount !== undefined) {
      writer.uint32(280).int32(message.responseCount);
    }
    if (message.currentUserFollow !== undefined) {
      Follow.encode(message.currentUserFollow, writer.uint32(402).fork()).ldelim();
    }
    if (message.targetCurrentUserFollow !== undefined) {
      Follow.encode(message.targetCurrentUserFollow, writer.uint32(410).fork()).ldelim();
    }
    if (message.currentGroupMembership !== undefined) {
      Membership.encode(message.currentGroupMembership, writer.uint32(418).fork()).ldelim();
    }
    if (message.hasAdvancedData !== false) {
      writer.uint32(640).bool(message.hasAdvancedData);
    }
    for (const v of message.federatedProfiles) {
      FederatedAccount.encode(v!, writer.uint32(650).fork()).ldelim();
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(802).fork()).ldelim();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(810).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): User {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.username = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.realName = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.email = ContactMethod.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.phone = ContactMethod.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag === 48) {
            message.permissions.push(reader.int32() as any);

            continue;
          }

          if (tag === 50) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.permissions.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.avatar = MediaReference.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.bio = reader.string();
          continue;
        case 20:
          if (tag !== 160) {
            break;
          }

          message.visibility = reader.int32() as any;
          continue;
        case 21:
          if (tag !== 168) {
            break;
          }

          message.moderation = reader.int32() as any;
          continue;
        case 30:
          if (tag !== 240) {
            break;
          }

          message.defaultFollowModeration = reader.int32() as any;
          continue;
        case 31:
          if (tag !== 248) {
            break;
          }

          message.followerCount = reader.int32();
          continue;
        case 32:
          if (tag !== 256) {
            break;
          }

          message.followingCount = reader.int32();
          continue;
        case 33:
          if (tag !== 264) {
            break;
          }

          message.groupCount = reader.int32();
          continue;
        case 34:
          if (tag !== 272) {
            break;
          }

          message.postCount = reader.int32();
          continue;
        case 35:
          if (tag !== 280) {
            break;
          }

          message.responseCount = reader.int32();
          continue;
        case 50:
          if (tag !== 402) {
            break;
          }

          message.currentUserFollow = Follow.decode(reader, reader.uint32());
          continue;
        case 51:
          if (tag !== 410) {
            break;
          }

          message.targetCurrentUserFollow = Follow.decode(reader, reader.uint32());
          continue;
        case 52:
          if (tag !== 418) {
            break;
          }

          message.currentGroupMembership = Membership.decode(reader, reader.uint32());
          continue;
        case 80:
          if (tag !== 640) {
            break;
          }

          message.hasAdvancedData = reader.bool();
          continue;
        case 81:
          if (tag !== 650) {
            break;
          }

          message.federatedProfiles.push(FederatedAccount.decode(reader, reader.uint32()));
          continue;
        case 100:
          if (tag !== 802) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 101:
          if (tag !== 810) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): User {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      realName: isSet(object.realName) ? globalThis.String(object.realName) : "",
      email: isSet(object.email) ? ContactMethod.fromJSON(object.email) : undefined,
      phone: isSet(object.phone) ? ContactMethod.fromJSON(object.phone) : undefined,
      permissions: globalThis.Array.isArray(object?.permissions)
        ? object.permissions.map((e: any) => permissionFromJSON(e))
        : [],
      avatar: isSet(object.avatar) ? MediaReference.fromJSON(object.avatar) : undefined,
      bio: isSet(object.bio) ? globalThis.String(object.bio) : "",
      visibility: isSet(object.visibility) ? visibilityFromJSON(object.visibility) : 0,
      moderation: isSet(object.moderation) ? moderationFromJSON(object.moderation) : 0,
      defaultFollowModeration: isSet(object.defaultFollowModeration)
        ? moderationFromJSON(object.defaultFollowModeration)
        : 0,
      followerCount: isSet(object.followerCount) ? globalThis.Number(object.followerCount) : undefined,
      followingCount: isSet(object.followingCount) ? globalThis.Number(object.followingCount) : undefined,
      groupCount: isSet(object.groupCount) ? globalThis.Number(object.groupCount) : undefined,
      postCount: isSet(object.postCount) ? globalThis.Number(object.postCount) : undefined,
      responseCount: isSet(object.responseCount) ? globalThis.Number(object.responseCount) : undefined,
      currentUserFollow: isSet(object.currentUserFollow) ? Follow.fromJSON(object.currentUserFollow) : undefined,
      targetCurrentUserFollow: isSet(object.targetCurrentUserFollow)
        ? Follow.fromJSON(object.targetCurrentUserFollow)
        : undefined,
      currentGroupMembership: isSet(object.currentGroupMembership)
        ? Membership.fromJSON(object.currentGroupMembership)
        : undefined,
      hasAdvancedData: isSet(object.hasAdvancedData) ? globalThis.Boolean(object.hasAdvancedData) : false,
      federatedProfiles: globalThis.Array.isArray(object?.federatedProfiles)
        ? object.federatedProfiles.map((e: any) => FederatedAccount.fromJSON(e))
        : [],
      createdAt: isSet(object.createdAt) ? globalThis.String(object.createdAt) : undefined,
      updatedAt: isSet(object.updatedAt) ? globalThis.String(object.updatedAt) : undefined,
    };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.realName !== "") {
      obj.realName = message.realName;
    }
    if (message.email !== undefined) {
      obj.email = ContactMethod.toJSON(message.email);
    }
    if (message.phone !== undefined) {
      obj.phone = ContactMethod.toJSON(message.phone);
    }
    if (message.permissions?.length) {
      obj.permissions = message.permissions.map((e) => permissionToJSON(e));
    }
    if (message.avatar !== undefined) {
      obj.avatar = MediaReference.toJSON(message.avatar);
    }
    if (message.bio !== "") {
      obj.bio = message.bio;
    }
    if (message.visibility !== 0) {
      obj.visibility = visibilityToJSON(message.visibility);
    }
    if (message.moderation !== 0) {
      obj.moderation = moderationToJSON(message.moderation);
    }
    if (message.defaultFollowModeration !== 0) {
      obj.defaultFollowModeration = moderationToJSON(message.defaultFollowModeration);
    }
    if (message.followerCount !== undefined) {
      obj.followerCount = Math.round(message.followerCount);
    }
    if (message.followingCount !== undefined) {
      obj.followingCount = Math.round(message.followingCount);
    }
    if (message.groupCount !== undefined) {
      obj.groupCount = Math.round(message.groupCount);
    }
    if (message.postCount !== undefined) {
      obj.postCount = Math.round(message.postCount);
    }
    if (message.responseCount !== undefined) {
      obj.responseCount = Math.round(message.responseCount);
    }
    if (message.currentUserFollow !== undefined) {
      obj.currentUserFollow = Follow.toJSON(message.currentUserFollow);
    }
    if (message.targetCurrentUserFollow !== undefined) {
      obj.targetCurrentUserFollow = Follow.toJSON(message.targetCurrentUserFollow);
    }
    if (message.currentGroupMembership !== undefined) {
      obj.currentGroupMembership = Membership.toJSON(message.currentGroupMembership);
    }
    if (message.hasAdvancedData !== false) {
      obj.hasAdvancedData = message.hasAdvancedData;
    }
    if (message.federatedProfiles?.length) {
      obj.federatedProfiles = message.federatedProfiles.map((e) => FederatedAccount.toJSON(e));
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt;
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<User>, I>>(base?: I): User {
    return User.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<User>, I>>(object: I): User {
    const message = createBaseUser();
    message.id = object.id ?? "";
    message.username = object.username ?? "";
    message.realName = object.realName ?? "";
    message.email = (object.email !== undefined && object.email !== null)
      ? ContactMethod.fromPartial(object.email)
      : undefined;
    message.phone = (object.phone !== undefined && object.phone !== null)
      ? ContactMethod.fromPartial(object.phone)
      : undefined;
    message.permissions = object.permissions?.map((e) => e) || [];
    message.avatar = (object.avatar !== undefined && object.avatar !== null)
      ? MediaReference.fromPartial(object.avatar)
      : undefined;
    message.bio = object.bio ?? "";
    message.visibility = object.visibility ?? 0;
    message.moderation = object.moderation ?? 0;
    message.defaultFollowModeration = object.defaultFollowModeration ?? 0;
    message.followerCount = object.followerCount ?? undefined;
    message.followingCount = object.followingCount ?? undefined;
    message.groupCount = object.groupCount ?? undefined;
    message.postCount = object.postCount ?? undefined;
    message.responseCount = object.responseCount ?? undefined;
    message.currentUserFollow = (object.currentUserFollow !== undefined && object.currentUserFollow !== null)
      ? Follow.fromPartial(object.currentUserFollow)
      : undefined;
    message.targetCurrentUserFollow =
      (object.targetCurrentUserFollow !== undefined && object.targetCurrentUserFollow !== null)
        ? Follow.fromPartial(object.targetCurrentUserFollow)
        : undefined;
    message.currentGroupMembership =
      (object.currentGroupMembership !== undefined && object.currentGroupMembership !== null)
        ? Membership.fromPartial(object.currentGroupMembership)
        : undefined;
    message.hasAdvancedData = object.hasAdvancedData ?? false;
    message.federatedProfiles = object.federatedProfiles?.map((e) => FederatedAccount.fromPartial(e)) || [];
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    return message;
  },
};

function createBaseAuthor(): Author {
  return { userId: "", username: undefined, avatar: undefined };
}

export const Author = {
  encode(message: Author, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.username !== undefined) {
      writer.uint32(18).string(message.username);
    }
    if (message.avatar !== undefined) {
      MediaReference.encode(message.avatar, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Author {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.username = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.avatar = MediaReference.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Author {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      username: isSet(object.username) ? globalThis.String(object.username) : undefined,
      avatar: isSet(object.avatar) ? MediaReference.fromJSON(object.avatar) : undefined,
    };
  },

  toJSON(message: Author): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.username !== undefined) {
      obj.username = message.username;
    }
    if (message.avatar !== undefined) {
      obj.avatar = MediaReference.toJSON(message.avatar);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Author>, I>>(base?: I): Author {
    return Author.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Author>, I>>(object: I): Author {
    const message = createBaseAuthor();
    message.userId = object.userId ?? "";
    message.username = object.username ?? undefined;
    message.avatar = (object.avatar !== undefined && object.avatar !== null)
      ? MediaReference.fromPartial(object.avatar)
      : undefined;
    return message;
  },
};

function createBaseFollow(): Follow {
  return { userId: "", targetUserId: "", targetUserModeration: 0, createdAt: undefined, updatedAt: undefined };
}

export const Follow = {
  encode(message: Follow, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.targetUserId !== "") {
      writer.uint32(18).string(message.targetUserId);
    }
    if (message.targetUserModeration !== 0) {
      writer.uint32(24).int32(message.targetUserModeration);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(34).fork()).ldelim();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Follow {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFollow();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.targetUserId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.targetUserModeration = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Follow {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      targetUserId: isSet(object.targetUserId) ? globalThis.String(object.targetUserId) : "",
      targetUserModeration: isSet(object.targetUserModeration) ? moderationFromJSON(object.targetUserModeration) : 0,
      createdAt: isSet(object.createdAt) ? globalThis.String(object.createdAt) : undefined,
      updatedAt: isSet(object.updatedAt) ? globalThis.String(object.updatedAt) : undefined,
    };
  },

  toJSON(message: Follow): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.targetUserId !== "") {
      obj.targetUserId = message.targetUserId;
    }
    if (message.targetUserModeration !== 0) {
      obj.targetUserModeration = moderationToJSON(message.targetUserModeration);
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt;
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Follow>, I>>(base?: I): Follow {
    return Follow.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Follow>, I>>(object: I): Follow {
    const message = createBaseFollow();
    message.userId = object.userId ?? "";
    message.targetUserId = object.targetUserId ?? "";
    message.targetUserModeration = object.targetUserModeration ?? 0;
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    return message;
  },
};

function createBaseMembership(): Membership {
  return {
    userId: "",
    groupId: "",
    permissions: [],
    groupModeration: 0,
    userModeration: 0,
    createdAt: undefined,
    updatedAt: undefined,
  };
}

export const Membership = {
  encode(message: Membership, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.groupId !== "") {
      writer.uint32(18).string(message.groupId);
    }
    writer.uint32(26).fork();
    for (const v of message.permissions) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.groupModeration !== 0) {
      writer.uint32(32).int32(message.groupModeration);
    }
    if (message.userModeration !== 0) {
      writer.uint32(40).int32(message.userModeration);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(50).fork()).ldelim();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Membership {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMembership();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.groupId = reader.string();
          continue;
        case 3:
          if (tag === 24) {
            message.permissions.push(reader.int32() as any);

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.permissions.push(reader.int32() as any);
            }

            continue;
          }

          break;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.groupModeration = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.userModeration = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Membership {
    return {
      userId: isSet(object.userId) ? globalThis.String(object.userId) : "",
      groupId: isSet(object.groupId) ? globalThis.String(object.groupId) : "",
      permissions: globalThis.Array.isArray(object?.permissions)
        ? object.permissions.map((e: any) => permissionFromJSON(e))
        : [],
      groupModeration: isSet(object.groupModeration) ? moderationFromJSON(object.groupModeration) : 0,
      userModeration: isSet(object.userModeration) ? moderationFromJSON(object.userModeration) : 0,
      createdAt: isSet(object.createdAt) ? globalThis.String(object.createdAt) : undefined,
      updatedAt: isSet(object.updatedAt) ? globalThis.String(object.updatedAt) : undefined,
    };
  },

  toJSON(message: Membership): unknown {
    const obj: any = {};
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.groupId !== "") {
      obj.groupId = message.groupId;
    }
    if (message.permissions?.length) {
      obj.permissions = message.permissions.map((e) => permissionToJSON(e));
    }
    if (message.groupModeration !== 0) {
      obj.groupModeration = moderationToJSON(message.groupModeration);
    }
    if (message.userModeration !== 0) {
      obj.userModeration = moderationToJSON(message.userModeration);
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt;
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Membership>, I>>(base?: I): Membership {
    return Membership.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Membership>, I>>(object: I): Membership {
    const message = createBaseMembership();
    message.userId = object.userId ?? "";
    message.groupId = object.groupId ?? "";
    message.permissions = object.permissions?.map((e) => e) || [];
    message.groupModeration = object.groupModeration ?? 0;
    message.userModeration = object.userModeration ?? 0;
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    return message;
  },
};

function createBaseContactMethod(): ContactMethod {
  return { value: undefined, visibility: 0, supportedByServer: false, verified: false };
}

export const ContactMethod = {
  encode(message: ContactMethod, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== undefined) {
      writer.uint32(10).string(message.value);
    }
    if (message.visibility !== 0) {
      writer.uint32(16).int32(message.visibility);
    }
    if (message.supportedByServer !== false) {
      writer.uint32(24).bool(message.supportedByServer);
    }
    if (message.verified !== false) {
      writer.uint32(32).bool(message.verified);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContactMethod {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContactMethod();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.value = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.visibility = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.supportedByServer = reader.bool();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.verified = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContactMethod {
    return {
      value: isSet(object.value) ? globalThis.String(object.value) : undefined,
      visibility: isSet(object.visibility) ? visibilityFromJSON(object.visibility) : 0,
      supportedByServer: isSet(object.supportedByServer) ? globalThis.Boolean(object.supportedByServer) : false,
      verified: isSet(object.verified) ? globalThis.Boolean(object.verified) : false,
    };
  },

  toJSON(message: ContactMethod): unknown {
    const obj: any = {};
    if (message.value !== undefined) {
      obj.value = message.value;
    }
    if (message.visibility !== 0) {
      obj.visibility = visibilityToJSON(message.visibility);
    }
    if (message.supportedByServer !== false) {
      obj.supportedByServer = message.supportedByServer;
    }
    if (message.verified !== false) {
      obj.verified = message.verified;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContactMethod>, I>>(base?: I): ContactMethod {
    return ContactMethod.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContactMethod>, I>>(object: I): ContactMethod {
    const message = createBaseContactMethod();
    message.value = object.value ?? undefined;
    message.visibility = object.visibility ?? 0;
    message.supportedByServer = object.supportedByServer ?? false;
    message.verified = object.verified ?? false;
    return message;
  },
};

function createBaseGetUsersRequest(): GetUsersRequest {
  return { username: undefined, userId: undefined, page: undefined, listingType: 0 };
}

export const GetUsersRequest = {
  encode(message: GetUsersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== undefined) {
      writer.uint32(10).string(message.username);
    }
    if (message.userId !== undefined) {
      writer.uint32(18).string(message.userId);
    }
    if (message.page !== undefined) {
      writer.uint32(792).int32(message.page);
    }
    if (message.listingType !== 0) {
      writer.uint32(800).int32(message.listingType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUsersRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUsersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 99:
          if (tag !== 792) {
            break;
          }

          message.page = reader.int32();
          continue;
        case 100:
          if (tag !== 800) {
            break;
          }

          message.listingType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUsersRequest {
    return {
      username: isSet(object.username) ? globalThis.String(object.username) : undefined,
      userId: isSet(object.userId) ? globalThis.String(object.userId) : undefined,
      page: isSet(object.page) ? globalThis.Number(object.page) : undefined,
      listingType: isSet(object.listingType) ? userListingTypeFromJSON(object.listingType) : 0,
    };
  },

  toJSON(message: GetUsersRequest): unknown {
    const obj: any = {};
    if (message.username !== undefined) {
      obj.username = message.username;
    }
    if (message.userId !== undefined) {
      obj.userId = message.userId;
    }
    if (message.page !== undefined) {
      obj.page = Math.round(message.page);
    }
    if (message.listingType !== 0) {
      obj.listingType = userListingTypeToJSON(message.listingType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUsersRequest>, I>>(base?: I): GetUsersRequest {
    return GetUsersRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUsersRequest>, I>>(object: I): GetUsersRequest {
    const message = createBaseGetUsersRequest();
    message.username = object.username ?? undefined;
    message.userId = object.userId ?? undefined;
    message.page = object.page ?? undefined;
    message.listingType = object.listingType ?? 0;
    return message;
  },
};

function createBaseGetUsersResponse(): GetUsersResponse {
  return { users: [], hasNextPage: false };
}

export const GetUsersResponse = {
  encode(message: GetUsersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.users) {
      User.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.hasNextPage !== false) {
      writer.uint32(16).bool(message.hasNextPage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUsersResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUsersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.users.push(User.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.hasNextPage = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUsersResponse {
    return {
      users: globalThis.Array.isArray(object?.users) ? object.users.map((e: any) => User.fromJSON(e)) : [],
      hasNextPage: isSet(object.hasNextPage) ? globalThis.Boolean(object.hasNextPage) : false,
    };
  },

  toJSON(message: GetUsersResponse): unknown {
    const obj: any = {};
    if (message.users?.length) {
      obj.users = message.users.map((e) => User.toJSON(e));
    }
    if (message.hasNextPage !== false) {
      obj.hasNextPage = message.hasNextPage;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUsersResponse>, I>>(base?: I): GetUsersResponse {
    return GetUsersResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUsersResponse>, I>>(object: I): GetUsersResponse {
    const message = createBaseGetUsersResponse();
    message.users = object.users?.map((e) => User.fromPartial(e)) || [];
    message.hasNextPage = object.hasNextPage ?? false;
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

function toTimestamp(dateStr: string): Timestamp {
  const date = new globalThis.Date(dateStr);
  const seconds = Math.trunc(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): string {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis).toISOString();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
