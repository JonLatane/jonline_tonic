/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import {
  AccessTokenRequest,
  AccessTokenResponse,
  CreateAccountRequest,
  LoginRequest,
  RefreshTokenResponse,
} from "./authentication";
import {
  Event,
  EventAttendance,
  EventAttendances,
  GetEventAttendancesRequest,
  GetEventsRequest,
  GetEventsResponse,
} from "./events";
import { GetServiceVersionResponse } from "./federation";
import { Empty } from "./google/protobuf/empty";
import { GetGroupsRequest, GetGroupsResponse, GetMembersRequest, GetMembersResponse, Group } from "./groups";
import { GetMediaRequest, GetMediaResponse, Media } from "./media";
import {
  GetGroupPostsRequest,
  GetGroupPostsResponse,
  GetPostsRequest,
  GetPostsResponse,
  GroupPost,
  Post,
} from "./posts";
import { ServerConfiguration } from "./server_configuration";
import { Follow, GetUsersRequest, GetUsersResponse, Membership, User } from "./users";

export const protobufPackage = "jonline";

/**
 * The internet-facing service implementing the Jonline protocol,
 * generally exposed on port 27707 or 443 (and, when using
 * [HTTP-based client host negotiation](#http-based-client-host-negotiation-for-external-cdns), ports 80 and/or 443).
 * A Jonline server is generally also expected to serve up web apps on ports 80/443, where
 * select APIs are exposed with HTTP interfaces instead of gRPC.
 * (Specifically, [HTTP-based client host negotiation](#http-based-client-host-negotiation-for-external-cdns) again
 * and [Media](#jonline-Media).)
 *
 * ##### Authentication
 * Jonline uses a standard OAuth2 flow for authentication, with rotating `access_token`s
 * and `refresh_token`s.
 * Authenticated calls require an `access_token` in request metadata to be included
 * directly as the value of the `authorization` header (no `Bearer ` prefix).
 *
 * First, use the `CreateAccount` or `Login` RPCs to fetch (and store) an initial
 * `refresh_token` and `access_token`. Clients should use the `access_token` until it expires,
 * then use the `refresh_token` to call the `AccessToken` RPC for a new one. (The `AccessToken` RPC
 * may also return a new `refresh_token`, which should replace the old one in client storage.)
 *
 * ##### HTTP-based client host negotiation (for external CDNs)
 * When first negotiating the gRPC connection to a host, say, `jonline.io`, before attempting
 * to connect to `jonline.io` via gRPC on 27707/443, the client
 * is expected to first attempt to `GET jonline.io/backend_host` over HTTP (port 80) or HTTPS (port 443)
 * (depending upon whether the gRPC server is expected to have TLS). If the `backend_host` string resource
 * is a valid domain, say, `jonline.io.itsj.online`, the client is expected to connect
 * to `jonline.io.itsj.online` on port 27707/443 instead. To users, the server should still *generally* appear to
 * be `jonline.io`. The client can trust `jonline.io/backend_host` to always point to the correct backend host for
 * `jonline.io`.
 *
 * This negotiation enables support for external CDNs as frontends. See https://jonline.io/about?section=cdn for
 * more information about external CDN setup. Developers may wish to review the [React/Tamagui](https://github.com/JonLatane/jonline/blob/main/frontends/tamagui/packages/app/store/clients.ts)
 * and [Flutter](https://github.com/JonLatane/jonline/blob/main/frontends/flutter/lib/models/jonline_clients.dart)
 * client implementations of this negotiation.
 *
 * In the works to be released soon, Jonline will also support a "fully behind CDN" mode, where gRPC is served over port 443 and HTTP over port
 * 80, with no HTTPS web page/media serving (other than the HTTPS that naturally underpins gRPC-Web). This is designed to use Cloudflare's gRPC
 * proxy support. With this, both web and gRPC resources can live behind a CDN.
 *
 * #### gRPC API
 */
export type JonlineDefinition = typeof JonlineDefinition;
export const JonlineDefinition = {
  name: "Jonline",
  fullName: "jonline.Jonline",
  methods: {
    /** Get the version (from Cargo) of the Jonline service. *Publicly accessible.* */
    getServiceVersion: {
      name: "GetServiceVersion",
      requestType: Empty,
      requestStream: false,
      responseType: GetServiceVersionResponse,
      responseStream: false,
      options: {},
    },
    /** Gets the Jonline server's configuration. *Publicly accessible.* */
    getServerConfiguration: {
      name: "GetServerConfiguration",
      requestType: Empty,
      requestStream: false,
      responseType: ServerConfiguration,
      responseStream: false,
      options: {},
    },
    /** Creates a user account and provides a `refresh_token` (along with an `access_token`). *Publicly accessible.* */
    createAccount: {
      name: "CreateAccount",
      requestType: CreateAccountRequest,
      requestStream: false,
      responseType: RefreshTokenResponse,
      responseStream: false,
      options: {},
    },
    /** Logs in a user and provides a `refresh_token` (along with an `access_token`). *Publicly accessible.* */
    login: {
      name: "Login",
      requestType: LoginRequest,
      requestStream: false,
      responseType: RefreshTokenResponse,
      responseStream: false,
      options: {},
    },
    /** Gets a new `access_token` (and possibly a new `refresh_token`, which should replace the old one in client storage), given a `refresh_token`. *Publicly accessible.* */
    accessToken: {
      name: "AccessToken",
      requestType: AccessTokenRequest,
      requestStream: false,
      responseType: AccessTokenResponse,
      responseStream: false,
      options: {},
    },
    /** Gets the current user. *Authenticated.* */
    getCurrentUser: {
      name: "GetCurrentUser",
      requestType: Empty,
      requestStream: false,
      responseType: User,
      responseStream: false,
      options: {},
    },
    /** Gets Media (Images, Videos, etc) uploaded/owned by the current user. *Authenticated.* To upload/download actual Media blob/binary data, use the [HTTP Media APIs](#media). */
    getMedia: {
      name: "GetMedia",
      requestType: GetMediaRequest,
      requestStream: false,
      responseType: GetMediaResponse,
      responseStream: false,
      options: {},
    },
    /**
     * Deletes a media item by ID. *Authenticated.* Note that media may still be accessible for 12 hours after deletes are requested, as separate jobs clean it up from S3/MinIO.
     * Deleting other users' media requires `ADMIN` permissions.
     */
    deleteMedia: {
      name: "DeleteMedia",
      requestType: Media,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /**
     * Gets Users. *Publicly accessible **or** Authenticated.*
     * Unauthenticated calls only return Users of `GLOBAL_PUBLIC` visibility.
     */
    getUsers: {
      name: "GetUsers",
      requestType: GetUsersRequest,
      requestStream: false,
      responseType: GetUsersResponse,
      responseStream: false,
      options: {},
    },
    /**
     * Update a user by ID. *Authenticated.*
     * Updating other users requires `ADMIN` permissions.
     */
    updateUser: {
      name: "UpdateUser",
      requestType: User,
      requestStream: false,
      responseType: User,
      responseStream: false,
      options: {},
    },
    /**
     * Deletes a user by ID. *Authenticated.*
     * Deleting other users requires `ADMIN` permissions.
     */
    deleteUser: {
      name: "DeleteUser",
      requestType: User,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /** Follow (or request to follow) a user. *Authenticated.* */
    createFollow: {
      name: "CreateFollow",
      requestType: Follow,
      requestStream: false,
      responseType: Follow,
      responseStream: false,
      options: {},
    },
    /** Used to approve follow requests. *Authenticated.* */
    updateFollow: {
      name: "UpdateFollow",
      requestType: Follow,
      requestStream: false,
      responseType: Follow,
      responseStream: false,
      options: {},
    },
    /** Unfollow (or unrequest) a user. *Authenticated.* */
    deleteFollow: {
      name: "DeleteFollow",
      requestType: Follow,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /**
     * Gets Groups. *Publicly accessible **or** Authenticated.*
     * Unauthenticated calls only return Groups of `GLOBAL_PUBLIC` visibility.
     */
    getGroups: {
      name: "GetGroups",
      requestType: GetGroupsRequest,
      requestStream: false,
      responseType: GetGroupsResponse,
      responseStream: false,
      options: {},
    },
    /**
     * Creates a group with the current user as its admin. *Authenticated.*
     * Requires the `CREATE_GROUPS` permission.
     */
    createGroup: {
      name: "CreateGroup",
      requestType: Group,
      requestStream: false,
      responseType: Group,
      responseStream: false,
      options: {},
    },
    /**
     * Update a Groups's information, default membership permissions or moderation. *Authenticated.*
     * Requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
     */
    updateGroup: {
      name: "UpdateGroup",
      requestType: Group,
      requestStream: false,
      responseType: Group,
      responseStream: false,
      options: {},
    },
    /**
     * Delete a Group. *Authenticated.*
     * Requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
     */
    deleteGroup: {
      name: "DeleteGroup",
      requestType: Group,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /** Get Members (User+Membership) of a Group. *Authenticated.* */
    getMembers: {
      name: "GetMembers",
      requestType: GetMembersRequest,
      requestStream: false,
      responseType: GetMembersResponse,
      responseStream: false,
      options: {},
    },
    /**
     * Requests to join a group (or joins it), or sends an invite to the user. *Authenticated.*
     * Memberships and moderations are set to their defaults.
     */
    createMembership: {
      name: "CreateMembership",
      requestType: Membership,
      requestStream: false,
      responseType: Membership,
      responseStream: false,
      options: {},
    },
    /**
     * Update aspects of a user's membership. *Authenticated.*
     * Updating permissions requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
     * Updating moderation (approving/denying/banning) requires the same, or `MODERATE_USERS` permissions within the group.
     */
    updateMembership: {
      name: "UpdateMembership",
      requestType: Membership,
      requestStream: false,
      responseType: Membership,
      responseStream: false,
      options: {},
    },
    /** Leave a group (or cancel membership request). *Authenticated.* */
    deleteMembership: {
      name: "DeleteMembership",
      requestType: Membership,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /**
     * Gets Posts. *Publicly accessible **or** Authenticated.*
     * Unauthenticated calls only return Posts of `GLOBAL_PUBLIC` visibility.
     */
    getPosts: {
      name: "GetPosts",
      requestType: GetPostsRequest,
      requestStream: false,
      responseType: GetPostsResponse,
      responseStream: false,
      options: {},
    },
    /** Creates a Post. *Authenticated.* */
    createPost: {
      name: "CreatePost",
      requestType: Post,
      requestStream: false,
      responseType: Post,
      responseStream: false,
      options: {},
    },
    /** Updates a Post. *Authenticated.* */
    updatePost: {
      name: "UpdatePost",
      requestType: Post,
      requestStream: false,
      responseType: Post,
      responseStream: false,
      options: {},
    },
    /** (TODO) (Soft) deletes a Post. Returns the deleted version of the Post. *Authenticated.* */
    deletePost: {
      name: "DeletePost",
      requestType: Post,
      requestStream: false,
      responseType: Post,
      responseStream: false,
      options: {},
    },
    /** Get GroupPosts for a Post (and optional group). *Publicly accessible **or** Authenticated.* */
    getGroupPosts: {
      name: "GetGroupPosts",
      requestType: GetGroupPostsRequest,
      requestStream: false,
      responseType: GetGroupPostsResponse,
      responseStream: false,
      options: {},
    },
    /** Cross-post a Post to a Group. *Authenticated.* */
    createGroupPost: {
      name: "CreateGroupPost",
      requestType: GroupPost,
      requestStream: false,
      responseType: GroupPost,
      responseStream: false,
      options: {},
    },
    /** Group Moderators: Approve/Reject a GroupPost. *Authenticated.* */
    updateGroupPost: {
      name: "UpdateGroupPost",
      requestType: GroupPost,
      requestStream: false,
      responseType: GroupPost,
      responseStream: false,
      options: {},
    },
    /** Delete a GroupPost. *Authenticated.* */
    deleteGroupPost: {
      name: "DeleteGroupPost",
      requestType: GroupPost,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /**
     * Gets Events. *Publicly accessible **or** Authenticated.*
     * Unauthenticated calls only return Events of `GLOBAL_PUBLIC` visibility.
     */
    getEvents: {
      name: "GetEvents",
      requestType: GetEventsRequest,
      requestStream: false,
      responseType: GetEventsResponse,
      responseStream: false,
      options: {},
    },
    /** Creates an Event. *Authenticated.* */
    createEvent: {
      name: "CreateEvent",
      requestType: Event,
      requestStream: false,
      responseType: Event,
      responseStream: false,
      options: {},
    },
    /** Updates an Event. *Authenticated.* */
    updateEvent: {
      name: "UpdateEvent",
      requestType: Event,
      requestStream: false,
      responseType: Event,
      responseStream: false,
      options: {},
    },
    /** (TODO) (Soft) deletes a Event. Returns the deleted version of the Event. *Authenticated.* */
    deleteEvent: {
      name: "DeleteEvent",
      requestType: Event,
      requestStream: false,
      responseType: Event,
      responseStream: false,
      options: {},
    },
    /** Gets EventAttendances for an EventInstance. *Publicly accessible **or** Authenticated.* */
    getEventAttendances: {
      name: "GetEventAttendances",
      requestType: GetEventAttendancesRequest,
      requestStream: false,
      responseType: EventAttendances,
      responseStream: false,
      options: {},
    },
    /**
     * Upsert an EventAttendance. *Publicly accessible **or** Authenticated, with anonymous RSVP support.*
     * See [EventAttendance](#jonline-EventAttendance) and [AnonymousAttendee](#jonline-AnonymousAttendee)
     * for details. tl;dr: Anonymous RSVPs may updated/deleted with the `AnonymousAttendee.auth_token`
     * returned by this RPC (the client should save this for the user, and ideally, offer a link
     * with the token).
     */
    upsertEventAttendance: {
      name: "UpsertEventAttendance",
      requestType: EventAttendance,
      requestStream: false,
      responseType: EventAttendance,
      responseStream: false,
      options: {},
    },
    /** Delete an EventAttendance.  *Publicly accessible **or** Authenticated, with anonymous RSVP support.* */
    deleteEventAttendance: {
      name: "DeleteEventAttendance",
      requestType: EventAttendance,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /**
     * Configure the server (i.e. the response to GetServerConfiguration). *Authenticated.*
     * Requires `ADMIN` permissions.
     */
    configureServer: {
      name: "ConfigureServer",
      requestType: ServerConfiguration,
      requestStream: false,
      responseType: ServerConfiguration,
      responseStream: false,
      options: {},
    },
    /**
     * Delete ALL Media, Posts, Groups and Users except the user who performed the RPC. *Authenticated.*
     * Requires `ADMIN` permissions.
     * Note: Server Configuration is not deleted.
     */
    resetData: {
      name: "ResetData",
      requestType: Empty,
      requestStream: false,
      responseType: Empty,
      responseStream: false,
      options: {},
    },
    /** (TODO) Reply streaming interface. Currently just streams fake example data. */
    streamReplies: {
      name: "StreamReplies",
      requestType: Post,
      requestStream: false,
      responseType: Post,
      responseStream: true,
      options: {},
    },
  },
} as const;

export interface JonlineServiceImplementation<CallContextExt = {}> {
  /** Get the version (from Cargo) of the Jonline service. *Publicly accessible.* */
  getServiceVersion(
    request: Empty,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetServiceVersionResponse>>;
  /** Gets the Jonline server's configuration. *Publicly accessible.* */
  getServerConfiguration(
    request: Empty,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ServerConfiguration>>;
  /** Creates a user account and provides a `refresh_token` (along with an `access_token`). *Publicly accessible.* */
  createAccount(
    request: CreateAccountRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<RefreshTokenResponse>>;
  /** Logs in a user and provides a `refresh_token` (along with an `access_token`). *Publicly accessible.* */
  login(request: LoginRequest, context: CallContext & CallContextExt): Promise<DeepPartial<RefreshTokenResponse>>;
  /** Gets a new `access_token` (and possibly a new `refresh_token`, which should replace the old one in client storage), given a `refresh_token`. *Publicly accessible.* */
  accessToken(
    request: AccessTokenRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<AccessTokenResponse>>;
  /** Gets the current user. *Authenticated.* */
  getCurrentUser(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<User>>;
  /** Gets Media (Images, Videos, etc) uploaded/owned by the current user. *Authenticated.* To upload/download actual Media blob/binary data, use the [HTTP Media APIs](#media). */
  getMedia(request: GetMediaRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetMediaResponse>>;
  /**
   * Deletes a media item by ID. *Authenticated.* Note that media may still be accessible for 12 hours after deletes are requested, as separate jobs clean it up from S3/MinIO.
   * Deleting other users' media requires `ADMIN` permissions.
   */
  deleteMedia(request: Media, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  /**
   * Gets Users. *Publicly accessible **or** Authenticated.*
   * Unauthenticated calls only return Users of `GLOBAL_PUBLIC` visibility.
   */
  getUsers(request: GetUsersRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetUsersResponse>>;
  /**
   * Update a user by ID. *Authenticated.*
   * Updating other users requires `ADMIN` permissions.
   */
  updateUser(request: User, context: CallContext & CallContextExt): Promise<DeepPartial<User>>;
  /**
   * Deletes a user by ID. *Authenticated.*
   * Deleting other users requires `ADMIN` permissions.
   */
  deleteUser(request: User, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  /** Follow (or request to follow) a user. *Authenticated.* */
  createFollow(request: Follow, context: CallContext & CallContextExt): Promise<DeepPartial<Follow>>;
  /** Used to approve follow requests. *Authenticated.* */
  updateFollow(request: Follow, context: CallContext & CallContextExt): Promise<DeepPartial<Follow>>;
  /** Unfollow (or unrequest) a user. *Authenticated.* */
  deleteFollow(request: Follow, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  /**
   * Gets Groups. *Publicly accessible **or** Authenticated.*
   * Unauthenticated calls only return Groups of `GLOBAL_PUBLIC` visibility.
   */
  getGroups(request: GetGroupsRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetGroupsResponse>>;
  /**
   * Creates a group with the current user as its admin. *Authenticated.*
   * Requires the `CREATE_GROUPS` permission.
   */
  createGroup(request: Group, context: CallContext & CallContextExt): Promise<DeepPartial<Group>>;
  /**
   * Update a Groups's information, default membership permissions or moderation. *Authenticated.*
   * Requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
   */
  updateGroup(request: Group, context: CallContext & CallContextExt): Promise<DeepPartial<Group>>;
  /**
   * Delete a Group. *Authenticated.*
   * Requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
   */
  deleteGroup(request: Group, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  /** Get Members (User+Membership) of a Group. *Authenticated.* */
  getMembers(
    request: GetMembersRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetMembersResponse>>;
  /**
   * Requests to join a group (or joins it), or sends an invite to the user. *Authenticated.*
   * Memberships and moderations are set to their defaults.
   */
  createMembership(request: Membership, context: CallContext & CallContextExt): Promise<DeepPartial<Membership>>;
  /**
   * Update aspects of a user's membership. *Authenticated.*
   * Updating permissions requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
   * Updating moderation (approving/denying/banning) requires the same, or `MODERATE_USERS` permissions within the group.
   */
  updateMembership(request: Membership, context: CallContext & CallContextExt): Promise<DeepPartial<Membership>>;
  /** Leave a group (or cancel membership request). *Authenticated.* */
  deleteMembership(request: Membership, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  /**
   * Gets Posts. *Publicly accessible **or** Authenticated.*
   * Unauthenticated calls only return Posts of `GLOBAL_PUBLIC` visibility.
   */
  getPosts(request: GetPostsRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetPostsResponse>>;
  /** Creates a Post. *Authenticated.* */
  createPost(request: Post, context: CallContext & CallContextExt): Promise<DeepPartial<Post>>;
  /** Updates a Post. *Authenticated.* */
  updatePost(request: Post, context: CallContext & CallContextExt): Promise<DeepPartial<Post>>;
  /** (TODO) (Soft) deletes a Post. Returns the deleted version of the Post. *Authenticated.* */
  deletePost(request: Post, context: CallContext & CallContextExt): Promise<DeepPartial<Post>>;
  /** Get GroupPosts for a Post (and optional group). *Publicly accessible **or** Authenticated.* */
  getGroupPosts(
    request: GetGroupPostsRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<GetGroupPostsResponse>>;
  /** Cross-post a Post to a Group. *Authenticated.* */
  createGroupPost(request: GroupPost, context: CallContext & CallContextExt): Promise<DeepPartial<GroupPost>>;
  /** Group Moderators: Approve/Reject a GroupPost. *Authenticated.* */
  updateGroupPost(request: GroupPost, context: CallContext & CallContextExt): Promise<DeepPartial<GroupPost>>;
  /** Delete a GroupPost. *Authenticated.* */
  deleteGroupPost(request: GroupPost, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  /**
   * Gets Events. *Publicly accessible **or** Authenticated.*
   * Unauthenticated calls only return Events of `GLOBAL_PUBLIC` visibility.
   */
  getEvents(request: GetEventsRequest, context: CallContext & CallContextExt): Promise<DeepPartial<GetEventsResponse>>;
  /** Creates an Event. *Authenticated.* */
  createEvent(request: Event, context: CallContext & CallContextExt): Promise<DeepPartial<Event>>;
  /** Updates an Event. *Authenticated.* */
  updateEvent(request: Event, context: CallContext & CallContextExt): Promise<DeepPartial<Event>>;
  /** (TODO) (Soft) deletes a Event. Returns the deleted version of the Event. *Authenticated.* */
  deleteEvent(request: Event, context: CallContext & CallContextExt): Promise<DeepPartial<Event>>;
  /** Gets EventAttendances for an EventInstance. *Publicly accessible **or** Authenticated.* */
  getEventAttendances(
    request: GetEventAttendancesRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<EventAttendances>>;
  /**
   * Upsert an EventAttendance. *Publicly accessible **or** Authenticated, with anonymous RSVP support.*
   * See [EventAttendance](#jonline-EventAttendance) and [AnonymousAttendee](#jonline-AnonymousAttendee)
   * for details. tl;dr: Anonymous RSVPs may updated/deleted with the `AnonymousAttendee.auth_token`
   * returned by this RPC (the client should save this for the user, and ideally, offer a link
   * with the token).
   */
  upsertEventAttendance(
    request: EventAttendance,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<EventAttendance>>;
  /** Delete an EventAttendance.  *Publicly accessible **or** Authenticated, with anonymous RSVP support.* */
  deleteEventAttendance(request: EventAttendance, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  /**
   * Configure the server (i.e. the response to GetServerConfiguration). *Authenticated.*
   * Requires `ADMIN` permissions.
   */
  configureServer(
    request: ServerConfiguration,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<ServerConfiguration>>;
  /**
   * Delete ALL Media, Posts, Groups and Users except the user who performed the RPC. *Authenticated.*
   * Requires `ADMIN` permissions.
   * Note: Server Configuration is not deleted.
   */
  resetData(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
  /** (TODO) Reply streaming interface. Currently just streams fake example data. */
  streamReplies(request: Post, context: CallContext & CallContextExt): ServerStreamingMethodResult<DeepPartial<Post>>;
}

export interface JonlineClient<CallOptionsExt = {}> {
  /** Get the version (from Cargo) of the Jonline service. *Publicly accessible.* */
  getServiceVersion(
    request: DeepPartial<Empty>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetServiceVersionResponse>;
  /** Gets the Jonline server's configuration. *Publicly accessible.* */
  getServerConfiguration(
    request: DeepPartial<Empty>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ServerConfiguration>;
  /** Creates a user account and provides a `refresh_token` (along with an `access_token`). *Publicly accessible.* */
  createAccount(
    request: DeepPartial<CreateAccountRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<RefreshTokenResponse>;
  /** Logs in a user and provides a `refresh_token` (along with an `access_token`). *Publicly accessible.* */
  login(request: DeepPartial<LoginRequest>, options?: CallOptions & CallOptionsExt): Promise<RefreshTokenResponse>;
  /** Gets a new `access_token` (and possibly a new `refresh_token`, which should replace the old one in client storage), given a `refresh_token`. *Publicly accessible.* */
  accessToken(
    request: DeepPartial<AccessTokenRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<AccessTokenResponse>;
  /** Gets the current user. *Authenticated.* */
  getCurrentUser(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<User>;
  /** Gets Media (Images, Videos, etc) uploaded/owned by the current user. *Authenticated.* To upload/download actual Media blob/binary data, use the [HTTP Media APIs](#media). */
  getMedia(request: DeepPartial<GetMediaRequest>, options?: CallOptions & CallOptionsExt): Promise<GetMediaResponse>;
  /**
   * Deletes a media item by ID. *Authenticated.* Note that media may still be accessible for 12 hours after deletes are requested, as separate jobs clean it up from S3/MinIO.
   * Deleting other users' media requires `ADMIN` permissions.
   */
  deleteMedia(request: DeepPartial<Media>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  /**
   * Gets Users. *Publicly accessible **or** Authenticated.*
   * Unauthenticated calls only return Users of `GLOBAL_PUBLIC` visibility.
   */
  getUsers(request: DeepPartial<GetUsersRequest>, options?: CallOptions & CallOptionsExt): Promise<GetUsersResponse>;
  /**
   * Update a user by ID. *Authenticated.*
   * Updating other users requires `ADMIN` permissions.
   */
  updateUser(request: DeepPartial<User>, options?: CallOptions & CallOptionsExt): Promise<User>;
  /**
   * Deletes a user by ID. *Authenticated.*
   * Deleting other users requires `ADMIN` permissions.
   */
  deleteUser(request: DeepPartial<User>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  /** Follow (or request to follow) a user. *Authenticated.* */
  createFollow(request: DeepPartial<Follow>, options?: CallOptions & CallOptionsExt): Promise<Follow>;
  /** Used to approve follow requests. *Authenticated.* */
  updateFollow(request: DeepPartial<Follow>, options?: CallOptions & CallOptionsExt): Promise<Follow>;
  /** Unfollow (or unrequest) a user. *Authenticated.* */
  deleteFollow(request: DeepPartial<Follow>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  /**
   * Gets Groups. *Publicly accessible **or** Authenticated.*
   * Unauthenticated calls only return Groups of `GLOBAL_PUBLIC` visibility.
   */
  getGroups(request: DeepPartial<GetGroupsRequest>, options?: CallOptions & CallOptionsExt): Promise<GetGroupsResponse>;
  /**
   * Creates a group with the current user as its admin. *Authenticated.*
   * Requires the `CREATE_GROUPS` permission.
   */
  createGroup(request: DeepPartial<Group>, options?: CallOptions & CallOptionsExt): Promise<Group>;
  /**
   * Update a Groups's information, default membership permissions or moderation. *Authenticated.*
   * Requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
   */
  updateGroup(request: DeepPartial<Group>, options?: CallOptions & CallOptionsExt): Promise<Group>;
  /**
   * Delete a Group. *Authenticated.*
   * Requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
   */
  deleteGroup(request: DeepPartial<Group>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  /** Get Members (User+Membership) of a Group. *Authenticated.* */
  getMembers(
    request: DeepPartial<GetMembersRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetMembersResponse>;
  /**
   * Requests to join a group (or joins it), or sends an invite to the user. *Authenticated.*
   * Memberships and moderations are set to their defaults.
   */
  createMembership(request: DeepPartial<Membership>, options?: CallOptions & CallOptionsExt): Promise<Membership>;
  /**
   * Update aspects of a user's membership. *Authenticated.*
   * Updating permissions requires `ADMIN` permissions within the group, or `ADMIN` permissions for the user.
   * Updating moderation (approving/denying/banning) requires the same, or `MODERATE_USERS` permissions within the group.
   */
  updateMembership(request: DeepPartial<Membership>, options?: CallOptions & CallOptionsExt): Promise<Membership>;
  /** Leave a group (or cancel membership request). *Authenticated.* */
  deleteMembership(request: DeepPartial<Membership>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  /**
   * Gets Posts. *Publicly accessible **or** Authenticated.*
   * Unauthenticated calls only return Posts of `GLOBAL_PUBLIC` visibility.
   */
  getPosts(request: DeepPartial<GetPostsRequest>, options?: CallOptions & CallOptionsExt): Promise<GetPostsResponse>;
  /** Creates a Post. *Authenticated.* */
  createPost(request: DeepPartial<Post>, options?: CallOptions & CallOptionsExt): Promise<Post>;
  /** Updates a Post. *Authenticated.* */
  updatePost(request: DeepPartial<Post>, options?: CallOptions & CallOptionsExt): Promise<Post>;
  /** (TODO) (Soft) deletes a Post. Returns the deleted version of the Post. *Authenticated.* */
  deletePost(request: DeepPartial<Post>, options?: CallOptions & CallOptionsExt): Promise<Post>;
  /** Get GroupPosts for a Post (and optional group). *Publicly accessible **or** Authenticated.* */
  getGroupPosts(
    request: DeepPartial<GetGroupPostsRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<GetGroupPostsResponse>;
  /** Cross-post a Post to a Group. *Authenticated.* */
  createGroupPost(request: DeepPartial<GroupPost>, options?: CallOptions & CallOptionsExt): Promise<GroupPost>;
  /** Group Moderators: Approve/Reject a GroupPost. *Authenticated.* */
  updateGroupPost(request: DeepPartial<GroupPost>, options?: CallOptions & CallOptionsExt): Promise<GroupPost>;
  /** Delete a GroupPost. *Authenticated.* */
  deleteGroupPost(request: DeepPartial<GroupPost>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  /**
   * Gets Events. *Publicly accessible **or** Authenticated.*
   * Unauthenticated calls only return Events of `GLOBAL_PUBLIC` visibility.
   */
  getEvents(request: DeepPartial<GetEventsRequest>, options?: CallOptions & CallOptionsExt): Promise<GetEventsResponse>;
  /** Creates an Event. *Authenticated.* */
  createEvent(request: DeepPartial<Event>, options?: CallOptions & CallOptionsExt): Promise<Event>;
  /** Updates an Event. *Authenticated.* */
  updateEvent(request: DeepPartial<Event>, options?: CallOptions & CallOptionsExt): Promise<Event>;
  /** (TODO) (Soft) deletes a Event. Returns the deleted version of the Event. *Authenticated.* */
  deleteEvent(request: DeepPartial<Event>, options?: CallOptions & CallOptionsExt): Promise<Event>;
  /** Gets EventAttendances for an EventInstance. *Publicly accessible **or** Authenticated.* */
  getEventAttendances(
    request: DeepPartial<GetEventAttendancesRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<EventAttendances>;
  /**
   * Upsert an EventAttendance. *Publicly accessible **or** Authenticated, with anonymous RSVP support.*
   * See [EventAttendance](#jonline-EventAttendance) and [AnonymousAttendee](#jonline-AnonymousAttendee)
   * for details. tl;dr: Anonymous RSVPs may updated/deleted with the `AnonymousAttendee.auth_token`
   * returned by this RPC (the client should save this for the user, and ideally, offer a link
   * with the token).
   */
  upsertEventAttendance(
    request: DeepPartial<EventAttendance>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<EventAttendance>;
  /** Delete an EventAttendance.  *Publicly accessible **or** Authenticated, with anonymous RSVP support.* */
  deleteEventAttendance(request: DeepPartial<EventAttendance>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  /**
   * Configure the server (i.e. the response to GetServerConfiguration). *Authenticated.*
   * Requires `ADMIN` permissions.
   */
  configureServer(
    request: DeepPartial<ServerConfiguration>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<ServerConfiguration>;
  /**
   * Delete ALL Media, Posts, Groups and Users except the user who performed the RPC. *Authenticated.*
   * Requires `ADMIN` permissions.
   * Note: Server Configuration is not deleted.
   */
  resetData(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
  /** (TODO) Reply streaming interface. Currently just streams fake example data. */
  streamReplies(request: DeepPartial<Post>, options?: CallOptions & CallOptionsExt): AsyncIterable<Post>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

export type ServerStreamingMethodResult<Response> = { [Symbol.asyncIterator](): AsyncIterator<Response, void> };
