///
//  Generated code. Do not modify.
//  source: posts.proto
//
// @dart = 2.12
// ignore_for_file: annotate_overrides,camel_case_types,constant_identifier_names,directives_ordering,library_prefixes,non_constant_identifier_names,prefer_final_fields,return_of_invalid_type,unnecessary_const,unnecessary_import,unnecessary_this,unused_import,unused_shown_name

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'google/protobuf/timestamp.pb.dart' as $7;

import 'posts.pbenum.dart';
import 'visibility_moderation.pbenum.dart' as $9;

export 'posts.pbenum.dart';

class GetPostsRequest extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'GetPostsRequest', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'postId')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'authorUserId')
    ..aOS(3, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'groupId')
    ..a<$core.int>(4, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'replyDepth', $pb.PbFieldType.OU3)
    ..e<PostListingType>(10, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'listingType', $pb.PbFieldType.OE, defaultOrMaker: PostListingType.PUBLIC_POSTS, valueOf: PostListingType.valueOf, enumValues: PostListingType.values)
    ..hasRequiredFields = false
  ;

  GetPostsRequest._() : super();
  factory GetPostsRequest({
    $core.String? postId,
    $core.String? authorUserId,
    $core.String? groupId,
    $core.int? replyDepth,
    PostListingType? listingType,
  }) {
    final _result = create();
    if (postId != null) {
      _result.postId = postId;
    }
    if (authorUserId != null) {
      _result.authorUserId = authorUserId;
    }
    if (groupId != null) {
      _result.groupId = groupId;
    }
    if (replyDepth != null) {
      _result.replyDepth = replyDepth;
    }
    if (listingType != null) {
      _result.listingType = listingType;
    }
    return _result;
  }
  factory GetPostsRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GetPostsRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GetPostsRequest clone() => GetPostsRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GetPostsRequest copyWith(void Function(GetPostsRequest) updates) => super.copyWith((message) => updates(message as GetPostsRequest)) as GetPostsRequest; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static GetPostsRequest create() => GetPostsRequest._();
  GetPostsRequest createEmptyInstance() => create();
  static $pb.PbList<GetPostsRequest> createRepeated() => $pb.PbList<GetPostsRequest>();
  @$core.pragma('dart2js:noInline')
  static GetPostsRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GetPostsRequest>(create);
  static GetPostsRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get postId => $_getSZ(0);
  @$pb.TagNumber(1)
  set postId($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasPostId() => $_has(0);
  @$pb.TagNumber(1)
  void clearPostId() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get authorUserId => $_getSZ(1);
  @$pb.TagNumber(2)
  set authorUserId($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasAuthorUserId() => $_has(1);
  @$pb.TagNumber(2)
  void clearAuthorUserId() => clearField(2);

  @$pb.TagNumber(3)
  $core.String get groupId => $_getSZ(2);
  @$pb.TagNumber(3)
  set groupId($core.String v) { $_setString(2, v); }
  @$pb.TagNumber(3)
  $core.bool hasGroupId() => $_has(2);
  @$pb.TagNumber(3)
  void clearGroupId() => clearField(3);

  @$pb.TagNumber(4)
  $core.int get replyDepth => $_getIZ(3);
  @$pb.TagNumber(4)
  set replyDepth($core.int v) { $_setUnsignedInt32(3, v); }
  @$pb.TagNumber(4)
  $core.bool hasReplyDepth() => $_has(3);
  @$pb.TagNumber(4)
  void clearReplyDepth() => clearField(4);

  @$pb.TagNumber(10)
  PostListingType get listingType => $_getN(4);
  @$pb.TagNumber(10)
  set listingType(PostListingType v) { setField(10, v); }
  @$pb.TagNumber(10)
  $core.bool hasListingType() => $_has(4);
  @$pb.TagNumber(10)
  void clearListingType() => clearField(10);
}

class GetPostsResponse extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'GetPostsResponse', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..pc<Post>(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'posts', $pb.PbFieldType.PM, subBuilder: Post.create)
    ..hasRequiredFields = false
  ;

  GetPostsResponse._() : super();
  factory GetPostsResponse({
    $core.Iterable<Post>? posts,
  }) {
    final _result = create();
    if (posts != null) {
      _result.posts.addAll(posts);
    }
    return _result;
  }
  factory GetPostsResponse.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GetPostsResponse.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GetPostsResponse clone() => GetPostsResponse()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GetPostsResponse copyWith(void Function(GetPostsResponse) updates) => super.copyWith((message) => updates(message as GetPostsResponse)) as GetPostsResponse; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static GetPostsResponse create() => GetPostsResponse._();
  GetPostsResponse createEmptyInstance() => create();
  static $pb.PbList<GetPostsResponse> createRepeated() => $pb.PbList<GetPostsResponse>();
  @$core.pragma('dart2js:noInline')
  static GetPostsResponse getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GetPostsResponse>(create);
  static GetPostsResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.List<Post> get posts => $_getList(0);
}

class CreatePostRequest extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'CreatePostRequest', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'title')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'link')
    ..aOS(3, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'content')
    ..aOS(4, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'replyToPostId')
    ..hasRequiredFields = false
  ;

  CreatePostRequest._() : super();
  factory CreatePostRequest({
    $core.String? title,
    $core.String? link,
    $core.String? content,
    $core.String? replyToPostId,
  }) {
    final _result = create();
    if (title != null) {
      _result.title = title;
    }
    if (link != null) {
      _result.link = link;
    }
    if (content != null) {
      _result.content = content;
    }
    if (replyToPostId != null) {
      _result.replyToPostId = replyToPostId;
    }
    return _result;
  }
  factory CreatePostRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory CreatePostRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  CreatePostRequest clone() => CreatePostRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  CreatePostRequest copyWith(void Function(CreatePostRequest) updates) => super.copyWith((message) => updates(message as CreatePostRequest)) as CreatePostRequest; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static CreatePostRequest create() => CreatePostRequest._();
  CreatePostRequest createEmptyInstance() => create();
  static $pb.PbList<CreatePostRequest> createRepeated() => $pb.PbList<CreatePostRequest>();
  @$core.pragma('dart2js:noInline')
  static CreatePostRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<CreatePostRequest>(create);
  static CreatePostRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get title => $_getSZ(0);
  @$pb.TagNumber(1)
  set title($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasTitle() => $_has(0);
  @$pb.TagNumber(1)
  void clearTitle() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get link => $_getSZ(1);
  @$pb.TagNumber(2)
  set link($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasLink() => $_has(1);
  @$pb.TagNumber(2)
  void clearLink() => clearField(2);

  @$pb.TagNumber(3)
  $core.String get content => $_getSZ(2);
  @$pb.TagNumber(3)
  set content($core.String v) { $_setString(2, v); }
  @$pb.TagNumber(3)
  $core.bool hasContent() => $_has(2);
  @$pb.TagNumber(3)
  void clearContent() => clearField(3);

  @$pb.TagNumber(4)
  $core.String get replyToPostId => $_getSZ(3);
  @$pb.TagNumber(4)
  set replyToPostId($core.String v) { $_setString(3, v); }
  @$pb.TagNumber(4)
  $core.bool hasReplyToPostId() => $_has(3);
  @$pb.TagNumber(4)
  void clearReplyToPostId() => clearField(4);
}

class Post extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'Post', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'id')
    ..aOM<Author>(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'author', subBuilder: Author.create)
    ..aOS(3, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'replyToPostId')
    ..aOS(4, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'title')
    ..aOS(5, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'link')
    ..aOS(6, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'content')
    ..a<$core.int>(7, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'responseCount', $pb.PbFieldType.O3)
    ..a<$core.int>(8, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'replyCount', $pb.PbFieldType.O3)
    ..pc<Post>(9, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'replies', $pb.PbFieldType.PM, subBuilder: Post.create)
    ..a<$core.List<$core.int>>(10, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'previewImage', $pb.PbFieldType.OY)
    ..e<$9.Visibility>(11, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'visibility', $pb.PbFieldType.OE, defaultOrMaker: $9.Visibility.VISIBILITY_UNKNOWN, valueOf: $9.Visibility.valueOf, enumValues: $9.Visibility.values)
    ..e<$9.Moderation>(12, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'moderation', $pb.PbFieldType.OE, defaultOrMaker: $9.Moderation.MODERATION_UNKNOWN, valueOf: $9.Moderation.valueOf, enumValues: $9.Moderation.values)
    ..a<$core.int>(14, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'groupCount', $pb.PbFieldType.O3)
    ..aOM<GroupPost>(15, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'currentGroupPost', subBuilder: GroupPost.create)
    ..aOM<$7.Timestamp>(20, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'createdAt', subBuilder: $7.Timestamp.create)
    ..aOM<$7.Timestamp>(21, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'updatedAt', subBuilder: $7.Timestamp.create)
    ..hasRequiredFields = false
  ;

  Post._() : super();
  factory Post({
    $core.String? id,
    Author? author,
    $core.String? replyToPostId,
    $core.String? title,
    $core.String? link,
    $core.String? content,
    $core.int? responseCount,
    $core.int? replyCount,
    $core.Iterable<Post>? replies,
    $core.List<$core.int>? previewImage,
    $9.Visibility? visibility,
    $9.Moderation? moderation,
    $core.int? groupCount,
    GroupPost? currentGroupPost,
    $7.Timestamp? createdAt,
    $7.Timestamp? updatedAt,
  }) {
    final _result = create();
    if (id != null) {
      _result.id = id;
    }
    if (author != null) {
      _result.author = author;
    }
    if (replyToPostId != null) {
      _result.replyToPostId = replyToPostId;
    }
    if (title != null) {
      _result.title = title;
    }
    if (link != null) {
      _result.link = link;
    }
    if (content != null) {
      _result.content = content;
    }
    if (responseCount != null) {
      _result.responseCount = responseCount;
    }
    if (replyCount != null) {
      _result.replyCount = replyCount;
    }
    if (replies != null) {
      _result.replies.addAll(replies);
    }
    if (previewImage != null) {
      _result.previewImage = previewImage;
    }
    if (visibility != null) {
      _result.visibility = visibility;
    }
    if (moderation != null) {
      _result.moderation = moderation;
    }
    if (groupCount != null) {
      _result.groupCount = groupCount;
    }
    if (currentGroupPost != null) {
      _result.currentGroupPost = currentGroupPost;
    }
    if (createdAt != null) {
      _result.createdAt = createdAt;
    }
    if (updatedAt != null) {
      _result.updatedAt = updatedAt;
    }
    return _result;
  }
  factory Post.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory Post.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  Post clone() => Post()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  Post copyWith(void Function(Post) updates) => super.copyWith((message) => updates(message as Post)) as Post; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static Post create() => Post._();
  Post createEmptyInstance() => create();
  static $pb.PbList<Post> createRepeated() => $pb.PbList<Post>();
  @$core.pragma('dart2js:noInline')
  static Post getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<Post>(create);
  static Post? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get id => $_getSZ(0);
  @$pb.TagNumber(1)
  set id($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasId() => $_has(0);
  @$pb.TagNumber(1)
  void clearId() => clearField(1);

  @$pb.TagNumber(2)
  Author get author => $_getN(1);
  @$pb.TagNumber(2)
  set author(Author v) { setField(2, v); }
  @$pb.TagNumber(2)
  $core.bool hasAuthor() => $_has(1);
  @$pb.TagNumber(2)
  void clearAuthor() => clearField(2);
  @$pb.TagNumber(2)
  Author ensureAuthor() => $_ensure(1);

  @$pb.TagNumber(3)
  $core.String get replyToPostId => $_getSZ(2);
  @$pb.TagNumber(3)
  set replyToPostId($core.String v) { $_setString(2, v); }
  @$pb.TagNumber(3)
  $core.bool hasReplyToPostId() => $_has(2);
  @$pb.TagNumber(3)
  void clearReplyToPostId() => clearField(3);

  @$pb.TagNumber(4)
  $core.String get title => $_getSZ(3);
  @$pb.TagNumber(4)
  set title($core.String v) { $_setString(3, v); }
  @$pb.TagNumber(4)
  $core.bool hasTitle() => $_has(3);
  @$pb.TagNumber(4)
  void clearTitle() => clearField(4);

  @$pb.TagNumber(5)
  $core.String get link => $_getSZ(4);
  @$pb.TagNumber(5)
  set link($core.String v) { $_setString(4, v); }
  @$pb.TagNumber(5)
  $core.bool hasLink() => $_has(4);
  @$pb.TagNumber(5)
  void clearLink() => clearField(5);

  @$pb.TagNumber(6)
  $core.String get content => $_getSZ(5);
  @$pb.TagNumber(6)
  set content($core.String v) { $_setString(5, v); }
  @$pb.TagNumber(6)
  $core.bool hasContent() => $_has(5);
  @$pb.TagNumber(6)
  void clearContent() => clearField(6);

  @$pb.TagNumber(7)
  $core.int get responseCount => $_getIZ(6);
  @$pb.TagNumber(7)
  set responseCount($core.int v) { $_setSignedInt32(6, v); }
  @$pb.TagNumber(7)
  $core.bool hasResponseCount() => $_has(6);
  @$pb.TagNumber(7)
  void clearResponseCount() => clearField(7);

  @$pb.TagNumber(8)
  $core.int get replyCount => $_getIZ(7);
  @$pb.TagNumber(8)
  set replyCount($core.int v) { $_setSignedInt32(7, v); }
  @$pb.TagNumber(8)
  $core.bool hasReplyCount() => $_has(7);
  @$pb.TagNumber(8)
  void clearReplyCount() => clearField(8);

  @$pb.TagNumber(9)
  $core.List<Post> get replies => $_getList(8);

  @$pb.TagNumber(10)
  $core.List<$core.int> get previewImage => $_getN(9);
  @$pb.TagNumber(10)
  set previewImage($core.List<$core.int> v) { $_setBytes(9, v); }
  @$pb.TagNumber(10)
  $core.bool hasPreviewImage() => $_has(9);
  @$pb.TagNumber(10)
  void clearPreviewImage() => clearField(10);

  @$pb.TagNumber(11)
  $9.Visibility get visibility => $_getN(10);
  @$pb.TagNumber(11)
  set visibility($9.Visibility v) { setField(11, v); }
  @$pb.TagNumber(11)
  $core.bool hasVisibility() => $_has(10);
  @$pb.TagNumber(11)
  void clearVisibility() => clearField(11);

  @$pb.TagNumber(12)
  $9.Moderation get moderation => $_getN(11);
  @$pb.TagNumber(12)
  set moderation($9.Moderation v) { setField(12, v); }
  @$pb.TagNumber(12)
  $core.bool hasModeration() => $_has(11);
  @$pb.TagNumber(12)
  void clearModeration() => clearField(12);

  @$pb.TagNumber(14)
  $core.int get groupCount => $_getIZ(12);
  @$pb.TagNumber(14)
  set groupCount($core.int v) { $_setSignedInt32(12, v); }
  @$pb.TagNumber(14)
  $core.bool hasGroupCount() => $_has(12);
  @$pb.TagNumber(14)
  void clearGroupCount() => clearField(14);

  @$pb.TagNumber(15)
  GroupPost get currentGroupPost => $_getN(13);
  @$pb.TagNumber(15)
  set currentGroupPost(GroupPost v) { setField(15, v); }
  @$pb.TagNumber(15)
  $core.bool hasCurrentGroupPost() => $_has(13);
  @$pb.TagNumber(15)
  void clearCurrentGroupPost() => clearField(15);
  @$pb.TagNumber(15)
  GroupPost ensureCurrentGroupPost() => $_ensure(13);

  @$pb.TagNumber(20)
  $7.Timestamp get createdAt => $_getN(14);
  @$pb.TagNumber(20)
  set createdAt($7.Timestamp v) { setField(20, v); }
  @$pb.TagNumber(20)
  $core.bool hasCreatedAt() => $_has(14);
  @$pb.TagNumber(20)
  void clearCreatedAt() => clearField(20);
  @$pb.TagNumber(20)
  $7.Timestamp ensureCreatedAt() => $_ensure(14);

  @$pb.TagNumber(21)
  $7.Timestamp get updatedAt => $_getN(15);
  @$pb.TagNumber(21)
  set updatedAt($7.Timestamp v) { setField(21, v); }
  @$pb.TagNumber(21)
  $core.bool hasUpdatedAt() => $_has(15);
  @$pb.TagNumber(21)
  void clearUpdatedAt() => clearField(21);
  @$pb.TagNumber(21)
  $7.Timestamp ensureUpdatedAt() => $_ensure(15);
}

class Author extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'Author', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'userId')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'username')
    ..hasRequiredFields = false
  ;

  Author._() : super();
  factory Author({
    $core.String? userId,
    $core.String? username,
  }) {
    final _result = create();
    if (userId != null) {
      _result.userId = userId;
    }
    if (username != null) {
      _result.username = username;
    }
    return _result;
  }
  factory Author.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory Author.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  Author clone() => Author()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  Author copyWith(void Function(Author) updates) => super.copyWith((message) => updates(message as Author)) as Author; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static Author create() => Author._();
  Author createEmptyInstance() => create();
  static $pb.PbList<Author> createRepeated() => $pb.PbList<Author>();
  @$core.pragma('dart2js:noInline')
  static Author getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<Author>(create);
  static Author? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get userId => $_getSZ(0);
  @$pb.TagNumber(1)
  set userId($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasUserId() => $_has(0);
  @$pb.TagNumber(1)
  void clearUserId() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get username => $_getSZ(1);
  @$pb.TagNumber(2)
  set username($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasUsername() => $_has(1);
  @$pb.TagNumber(2)
  void clearUsername() => clearField(2);
}

class GroupPost extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'GroupPost', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'groupId')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'postId')
    ..aOS(3, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'userId')
    ..e<$9.Moderation>(4, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'groupModeration', $pb.PbFieldType.OE, defaultOrMaker: $9.Moderation.MODERATION_UNKNOWN, valueOf: $9.Moderation.valueOf, enumValues: $9.Moderation.values)
    ..aOM<$7.Timestamp>(5, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'createdAt', subBuilder: $7.Timestamp.create)
    ..hasRequiredFields = false
  ;

  GroupPost._() : super();
  factory GroupPost({
    $core.String? groupId,
    $core.String? postId,
    $core.String? userId,
    $9.Moderation? groupModeration,
    $7.Timestamp? createdAt,
  }) {
    final _result = create();
    if (groupId != null) {
      _result.groupId = groupId;
    }
    if (postId != null) {
      _result.postId = postId;
    }
    if (userId != null) {
      _result.userId = userId;
    }
    if (groupModeration != null) {
      _result.groupModeration = groupModeration;
    }
    if (createdAt != null) {
      _result.createdAt = createdAt;
    }
    return _result;
  }
  factory GroupPost.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GroupPost.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GroupPost clone() => GroupPost()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GroupPost copyWith(void Function(GroupPost) updates) => super.copyWith((message) => updates(message as GroupPost)) as GroupPost; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static GroupPost create() => GroupPost._();
  GroupPost createEmptyInstance() => create();
  static $pb.PbList<GroupPost> createRepeated() => $pb.PbList<GroupPost>();
  @$core.pragma('dart2js:noInline')
  static GroupPost getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GroupPost>(create);
  static GroupPost? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get groupId => $_getSZ(0);
  @$pb.TagNumber(1)
  set groupId($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasGroupId() => $_has(0);
  @$pb.TagNumber(1)
  void clearGroupId() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get postId => $_getSZ(1);
  @$pb.TagNumber(2)
  set postId($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasPostId() => $_has(1);
  @$pb.TagNumber(2)
  void clearPostId() => clearField(2);

  @$pb.TagNumber(3)
  $core.String get userId => $_getSZ(2);
  @$pb.TagNumber(3)
  set userId($core.String v) { $_setString(2, v); }
  @$pb.TagNumber(3)
  $core.bool hasUserId() => $_has(2);
  @$pb.TagNumber(3)
  void clearUserId() => clearField(3);

  @$pb.TagNumber(4)
  $9.Moderation get groupModeration => $_getN(3);
  @$pb.TagNumber(4)
  set groupModeration($9.Moderation v) { setField(4, v); }
  @$pb.TagNumber(4)
  $core.bool hasGroupModeration() => $_has(3);
  @$pb.TagNumber(4)
  void clearGroupModeration() => clearField(4);

  @$pb.TagNumber(5)
  $7.Timestamp get createdAt => $_getN(4);
  @$pb.TagNumber(5)
  set createdAt($7.Timestamp v) { setField(5, v); }
  @$pb.TagNumber(5)
  $core.bool hasCreatedAt() => $_has(4);
  @$pb.TagNumber(5)
  void clearCreatedAt() => clearField(5);
  @$pb.TagNumber(5)
  $7.Timestamp ensureCreatedAt() => $_ensure(4);
}

class UserPost extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'UserPost', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'groupId')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'userId')
    ..aOM<$7.Timestamp>(3, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'createdAt', subBuilder: $7.Timestamp.create)
    ..hasRequiredFields = false
  ;

  UserPost._() : super();
  factory UserPost({
    $core.String? groupId,
    $core.String? userId,
    $7.Timestamp? createdAt,
  }) {
    final _result = create();
    if (groupId != null) {
      _result.groupId = groupId;
    }
    if (userId != null) {
      _result.userId = userId;
    }
    if (createdAt != null) {
      _result.createdAt = createdAt;
    }
    return _result;
  }
  factory UserPost.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory UserPost.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  UserPost clone() => UserPost()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  UserPost copyWith(void Function(UserPost) updates) => super.copyWith((message) => updates(message as UserPost)) as UserPost; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static UserPost create() => UserPost._();
  UserPost createEmptyInstance() => create();
  static $pb.PbList<UserPost> createRepeated() => $pb.PbList<UserPost>();
  @$core.pragma('dart2js:noInline')
  static UserPost getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<UserPost>(create);
  static UserPost? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get groupId => $_getSZ(0);
  @$pb.TagNumber(1)
  set groupId($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasGroupId() => $_has(0);
  @$pb.TagNumber(1)
  void clearGroupId() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get userId => $_getSZ(1);
  @$pb.TagNumber(2)
  set userId($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasUserId() => $_has(1);
  @$pb.TagNumber(2)
  void clearUserId() => clearField(2);

  @$pb.TagNumber(3)
  $7.Timestamp get createdAt => $_getN(2);
  @$pb.TagNumber(3)
  set createdAt($7.Timestamp v) { setField(3, v); }
  @$pb.TagNumber(3)
  $core.bool hasCreatedAt() => $_has(2);
  @$pb.TagNumber(3)
  void clearCreatedAt() => clearField(3);
  @$pb.TagNumber(3)
  $7.Timestamp ensureCreatedAt() => $_ensure(2);
}

class GetGroupPostsRequest extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'GetGroupPostsRequest', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'postId')
    ..aOS(2, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'groupId')
    ..hasRequiredFields = false
  ;

  GetGroupPostsRequest._() : super();
  factory GetGroupPostsRequest({
    $core.String? postId,
    $core.String? groupId,
  }) {
    final _result = create();
    if (postId != null) {
      _result.postId = postId;
    }
    if (groupId != null) {
      _result.groupId = groupId;
    }
    return _result;
  }
  factory GetGroupPostsRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GetGroupPostsRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GetGroupPostsRequest clone() => GetGroupPostsRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GetGroupPostsRequest copyWith(void Function(GetGroupPostsRequest) updates) => super.copyWith((message) => updates(message as GetGroupPostsRequest)) as GetGroupPostsRequest; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static GetGroupPostsRequest create() => GetGroupPostsRequest._();
  GetGroupPostsRequest createEmptyInstance() => create();
  static $pb.PbList<GetGroupPostsRequest> createRepeated() => $pb.PbList<GetGroupPostsRequest>();
  @$core.pragma('dart2js:noInline')
  static GetGroupPostsRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GetGroupPostsRequest>(create);
  static GetGroupPostsRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get postId => $_getSZ(0);
  @$pb.TagNumber(1)
  set postId($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasPostId() => $_has(0);
  @$pb.TagNumber(1)
  void clearPostId() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get groupId => $_getSZ(1);
  @$pb.TagNumber(2)
  set groupId($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasGroupId() => $_has(1);
  @$pb.TagNumber(2)
  void clearGroupId() => clearField(2);
}

class GetGroupPostsResponse extends $pb.GeneratedMessage {
  static final $pb.BuilderInfo _i = $pb.BuilderInfo(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'GetGroupPostsResponse', package: const $pb.PackageName(const $core.bool.fromEnvironment('protobuf.omit_message_names') ? '' : 'jonline'), createEmptyInstance: create)
    ..pc<GroupPost>(1, const $core.bool.fromEnvironment('protobuf.omit_field_names') ? '' : 'groupPosts', $pb.PbFieldType.PM, subBuilder: GroupPost.create)
    ..hasRequiredFields = false
  ;

  GetGroupPostsResponse._() : super();
  factory GetGroupPostsResponse({
    $core.Iterable<GroupPost>? groupPosts,
  }) {
    final _result = create();
    if (groupPosts != null) {
      _result.groupPosts.addAll(groupPosts);
    }
    return _result;
  }
  factory GetGroupPostsResponse.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GetGroupPostsResponse.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GetGroupPostsResponse clone() => GetGroupPostsResponse()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GetGroupPostsResponse copyWith(void Function(GetGroupPostsResponse) updates) => super.copyWith((message) => updates(message as GetGroupPostsResponse)) as GetGroupPostsResponse; // ignore: deprecated_member_use
  $pb.BuilderInfo get info_ => _i;
  @$core.pragma('dart2js:noInline')
  static GetGroupPostsResponse create() => GetGroupPostsResponse._();
  GetGroupPostsResponse createEmptyInstance() => create();
  static $pb.PbList<GetGroupPostsResponse> createRepeated() => $pb.PbList<GetGroupPostsResponse>();
  @$core.pragma('dart2js:noInline')
  static GetGroupPostsResponse getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GetGroupPostsResponse>(create);
  static GetGroupPostsResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.List<GroupPost> get groupPosts => $_getList(0);
}
