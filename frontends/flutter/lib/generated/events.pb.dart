//
//  Generated code. Do not modify.
//  source: events.proto
//
// @dart = 2.12

// ignore_for_file: annotate_overrides, camel_case_types
// ignore_for_file: constant_identifier_names, library_prefixes
// ignore_for_file: non_constant_identifier_names, prefer_final_fields
// ignore_for_file: unnecessary_import, unnecessary_this, unused_import

import 'dart:core' as $core;

import 'package:protobuf/protobuf.dart' as $pb;

import 'events.pbenum.dart';
import 'google/protobuf/timestamp.pb.dart' as $9;
import 'posts.pb.dart' as $7;

export 'events.pbenum.dart';

class GetEventsRequest extends $pb.GeneratedMessage {
  factory GetEventsRequest() => create();
  GetEventsRequest._() : super();
  factory GetEventsRequest.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GetEventsRequest.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'GetEventsRequest', package: const $pb.PackageName(_omitMessageNames ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'eventId')
    ..aOS(2, _omitFieldNames ? '' : 'authorUserId')
    ..aOS(3, _omitFieldNames ? '' : 'groupId')
    ..aOS(4, _omitFieldNames ? '' : 'eventInstanceId')
    ..aOM<TimeFilter>(5, _omitFieldNames ? '' : 'timeFilter', subBuilder: TimeFilter.create)
    ..e<EventListingType>(10, _omitFieldNames ? '' : 'listingType', $pb.PbFieldType.OE, defaultOrMaker: EventListingType.PUBLIC_EVENTS, valueOf: EventListingType.valueOf, enumValues: EventListingType.values)
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GetEventsRequest clone() => GetEventsRequest()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GetEventsRequest copyWith(void Function(GetEventsRequest) updates) => super.copyWith((message) => updates(message as GetEventsRequest)) as GetEventsRequest;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static GetEventsRequest create() => GetEventsRequest._();
  GetEventsRequest createEmptyInstance() => create();
  static $pb.PbList<GetEventsRequest> createRepeated() => $pb.PbList<GetEventsRequest>();
  @$core.pragma('dart2js:noInline')
  static GetEventsRequest getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GetEventsRequest>(create);
  static GetEventsRequest? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get eventId => $_getSZ(0);
  @$pb.TagNumber(1)
  set eventId($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasEventId() => $_has(0);
  @$pb.TagNumber(1)
  void clearEventId() => clearField(1);

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
  $core.String get eventInstanceId => $_getSZ(3);
  @$pb.TagNumber(4)
  set eventInstanceId($core.String v) { $_setString(3, v); }
  @$pb.TagNumber(4)
  $core.bool hasEventInstanceId() => $_has(3);
  @$pb.TagNumber(4)
  void clearEventInstanceId() => clearField(4);

  @$pb.TagNumber(5)
  TimeFilter get timeFilter => $_getN(4);
  @$pb.TagNumber(5)
  set timeFilter(TimeFilter v) { setField(5, v); }
  @$pb.TagNumber(5)
  $core.bool hasTimeFilter() => $_has(4);
  @$pb.TagNumber(5)
  void clearTimeFilter() => clearField(5);
  @$pb.TagNumber(5)
  TimeFilter ensureTimeFilter() => $_ensure(4);

  @$pb.TagNumber(10)
  EventListingType get listingType => $_getN(5);
  @$pb.TagNumber(10)
  set listingType(EventListingType v) { setField(10, v); }
  @$pb.TagNumber(10)
  $core.bool hasListingType() => $_has(5);
  @$pb.TagNumber(10)
  void clearListingType() => clearField(10);
}

class TimeFilter extends $pb.GeneratedMessage {
  factory TimeFilter() => create();
  TimeFilter._() : super();
  factory TimeFilter.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory TimeFilter.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'TimeFilter', package: const $pb.PackageName(_omitMessageNames ? '' : 'jonline'), createEmptyInstance: create)
    ..aOM<$9.Timestamp>(1, _omitFieldNames ? '' : 'startsAfter', subBuilder: $9.Timestamp.create)
    ..aOM<$9.Timestamp>(2, _omitFieldNames ? '' : 'endsAfter', subBuilder: $9.Timestamp.create)
    ..aOM<$9.Timestamp>(3, _omitFieldNames ? '' : 'startsBefore', subBuilder: $9.Timestamp.create)
    ..aOM<$9.Timestamp>(4, _omitFieldNames ? '' : 'endsBefore', subBuilder: $9.Timestamp.create)
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  TimeFilter clone() => TimeFilter()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  TimeFilter copyWith(void Function(TimeFilter) updates) => super.copyWith((message) => updates(message as TimeFilter)) as TimeFilter;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static TimeFilter create() => TimeFilter._();
  TimeFilter createEmptyInstance() => create();
  static $pb.PbList<TimeFilter> createRepeated() => $pb.PbList<TimeFilter>();
  @$core.pragma('dart2js:noInline')
  static TimeFilter getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<TimeFilter>(create);
  static TimeFilter? _defaultInstance;

  @$pb.TagNumber(1)
  $9.Timestamp get startsAfter => $_getN(0);
  @$pb.TagNumber(1)
  set startsAfter($9.Timestamp v) { setField(1, v); }
  @$pb.TagNumber(1)
  $core.bool hasStartsAfter() => $_has(0);
  @$pb.TagNumber(1)
  void clearStartsAfter() => clearField(1);
  @$pb.TagNumber(1)
  $9.Timestamp ensureStartsAfter() => $_ensure(0);

  @$pb.TagNumber(2)
  $9.Timestamp get endsAfter => $_getN(1);
  @$pb.TagNumber(2)
  set endsAfter($9.Timestamp v) { setField(2, v); }
  @$pb.TagNumber(2)
  $core.bool hasEndsAfter() => $_has(1);
  @$pb.TagNumber(2)
  void clearEndsAfter() => clearField(2);
  @$pb.TagNumber(2)
  $9.Timestamp ensureEndsAfter() => $_ensure(1);

  @$pb.TagNumber(3)
  $9.Timestamp get startsBefore => $_getN(2);
  @$pb.TagNumber(3)
  set startsBefore($9.Timestamp v) { setField(3, v); }
  @$pb.TagNumber(3)
  $core.bool hasStartsBefore() => $_has(2);
  @$pb.TagNumber(3)
  void clearStartsBefore() => clearField(3);
  @$pb.TagNumber(3)
  $9.Timestamp ensureStartsBefore() => $_ensure(2);

  @$pb.TagNumber(4)
  $9.Timestamp get endsBefore => $_getN(3);
  @$pb.TagNumber(4)
  set endsBefore($9.Timestamp v) { setField(4, v); }
  @$pb.TagNumber(4)
  $core.bool hasEndsBefore() => $_has(3);
  @$pb.TagNumber(4)
  void clearEndsBefore() => clearField(4);
  @$pb.TagNumber(4)
  $9.Timestamp ensureEndsBefore() => $_ensure(3);
}

class GetEventsResponse extends $pb.GeneratedMessage {
  factory GetEventsResponse() => create();
  GetEventsResponse._() : super();
  factory GetEventsResponse.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory GetEventsResponse.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'GetEventsResponse', package: const $pb.PackageName(_omitMessageNames ? '' : 'jonline'), createEmptyInstance: create)
    ..pc<Event>(1, _omitFieldNames ? '' : 'events', $pb.PbFieldType.PM, subBuilder: Event.create)
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  GetEventsResponse clone() => GetEventsResponse()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  GetEventsResponse copyWith(void Function(GetEventsResponse) updates) => super.copyWith((message) => updates(message as GetEventsResponse)) as GetEventsResponse;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static GetEventsResponse create() => GetEventsResponse._();
  GetEventsResponse createEmptyInstance() => create();
  static $pb.PbList<GetEventsResponse> createRepeated() => $pb.PbList<GetEventsResponse>();
  @$core.pragma('dart2js:noInline')
  static GetEventsResponse getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<GetEventsResponse>(create);
  static GetEventsResponse? _defaultInstance;

  @$pb.TagNumber(1)
  $core.List<Event> get events => $_getList(0);
}

class Event extends $pb.GeneratedMessage {
  factory Event() => create();
  Event._() : super();
  factory Event.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory Event.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'Event', package: const $pb.PackageName(_omitMessageNames ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'id')
    ..aOM<$7.Post>(2, _omitFieldNames ? '' : 'post', subBuilder: $7.Post.create)
    ..aOM<EventInfo>(3, _omitFieldNames ? '' : 'info', subBuilder: EventInfo.create)
    ..pc<EventInstance>(4, _omitFieldNames ? '' : 'instances', $pb.PbFieldType.PM, subBuilder: EventInstance.create)
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  Event clone() => Event()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  Event copyWith(void Function(Event) updates) => super.copyWith((message) => updates(message as Event)) as Event;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static Event create() => Event._();
  Event createEmptyInstance() => create();
  static $pb.PbList<Event> createRepeated() => $pb.PbList<Event>();
  @$core.pragma('dart2js:noInline')
  static Event getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<Event>(create);
  static Event? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get id => $_getSZ(0);
  @$pb.TagNumber(1)
  set id($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasId() => $_has(0);
  @$pb.TagNumber(1)
  void clearId() => clearField(1);

  @$pb.TagNumber(2)
  $7.Post get post => $_getN(1);
  @$pb.TagNumber(2)
  set post($7.Post v) { setField(2, v); }
  @$pb.TagNumber(2)
  $core.bool hasPost() => $_has(1);
  @$pb.TagNumber(2)
  void clearPost() => clearField(2);
  @$pb.TagNumber(2)
  $7.Post ensurePost() => $_ensure(1);

  @$pb.TagNumber(3)
  EventInfo get info => $_getN(2);
  @$pb.TagNumber(3)
  set info(EventInfo v) { setField(3, v); }
  @$pb.TagNumber(3)
  $core.bool hasInfo() => $_has(2);
  @$pb.TagNumber(3)
  void clearInfo() => clearField(3);
  @$pb.TagNumber(3)
  EventInfo ensureInfo() => $_ensure(2);

  @$pb.TagNumber(4)
  $core.List<EventInstance> get instances => $_getList(3);
}

class EventInfo extends $pb.GeneratedMessage {
  factory EventInfo() => create();
  EventInfo._() : super();
  factory EventInfo.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory EventInfo.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'EventInfo', package: const $pb.PackageName(_omitMessageNames ? '' : 'jonline'), createEmptyInstance: create)
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  EventInfo clone() => EventInfo()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  EventInfo copyWith(void Function(EventInfo) updates) => super.copyWith((message) => updates(message as EventInfo)) as EventInfo;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static EventInfo create() => EventInfo._();
  EventInfo createEmptyInstance() => create();
  static $pb.PbList<EventInfo> createRepeated() => $pb.PbList<EventInfo>();
  @$core.pragma('dart2js:noInline')
  static EventInfo getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<EventInfo>(create);
  static EventInfo? _defaultInstance;
}

class EventInstance extends $pb.GeneratedMessage {
  factory EventInstance() => create();
  EventInstance._() : super();
  factory EventInstance.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory EventInstance.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'EventInstance', package: const $pb.PackageName(_omitMessageNames ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'id')
    ..aOS(2, _omitFieldNames ? '' : 'eventId')
    ..aOM<$7.Post>(3, _omitFieldNames ? '' : 'post', subBuilder: $7.Post.create)
    ..aOM<EventInstanceInfo>(4, _omitFieldNames ? '' : 'info', subBuilder: EventInstanceInfo.create)
    ..aOM<$9.Timestamp>(5, _omitFieldNames ? '' : 'startsAt', subBuilder: $9.Timestamp.create)
    ..aOM<$9.Timestamp>(6, _omitFieldNames ? '' : 'endsAt', subBuilder: $9.Timestamp.create)
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  EventInstance clone() => EventInstance()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  EventInstance copyWith(void Function(EventInstance) updates) => super.copyWith((message) => updates(message as EventInstance)) as EventInstance;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static EventInstance create() => EventInstance._();
  EventInstance createEmptyInstance() => create();
  static $pb.PbList<EventInstance> createRepeated() => $pb.PbList<EventInstance>();
  @$core.pragma('dart2js:noInline')
  static EventInstance getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<EventInstance>(create);
  static EventInstance? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get id => $_getSZ(0);
  @$pb.TagNumber(1)
  set id($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasId() => $_has(0);
  @$pb.TagNumber(1)
  void clearId() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get eventId => $_getSZ(1);
  @$pb.TagNumber(2)
  set eventId($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasEventId() => $_has(1);
  @$pb.TagNumber(2)
  void clearEventId() => clearField(2);

  @$pb.TagNumber(3)
  $7.Post get post => $_getN(2);
  @$pb.TagNumber(3)
  set post($7.Post v) { setField(3, v); }
  @$pb.TagNumber(3)
  $core.bool hasPost() => $_has(2);
  @$pb.TagNumber(3)
  void clearPost() => clearField(3);
  @$pb.TagNumber(3)
  $7.Post ensurePost() => $_ensure(2);

  @$pb.TagNumber(4)
  EventInstanceInfo get info => $_getN(3);
  @$pb.TagNumber(4)
  set info(EventInstanceInfo v) { setField(4, v); }
  @$pb.TagNumber(4)
  $core.bool hasInfo() => $_has(3);
  @$pb.TagNumber(4)
  void clearInfo() => clearField(4);
  @$pb.TagNumber(4)
  EventInstanceInfo ensureInfo() => $_ensure(3);

  @$pb.TagNumber(5)
  $9.Timestamp get startsAt => $_getN(4);
  @$pb.TagNumber(5)
  set startsAt($9.Timestamp v) { setField(5, v); }
  @$pb.TagNumber(5)
  $core.bool hasStartsAt() => $_has(4);
  @$pb.TagNumber(5)
  void clearStartsAt() => clearField(5);
  @$pb.TagNumber(5)
  $9.Timestamp ensureStartsAt() => $_ensure(4);

  @$pb.TagNumber(6)
  $9.Timestamp get endsAt => $_getN(5);
  @$pb.TagNumber(6)
  set endsAt($9.Timestamp v) { setField(6, v); }
  @$pb.TagNumber(6)
  $core.bool hasEndsAt() => $_has(5);
  @$pb.TagNumber(6)
  void clearEndsAt() => clearField(6);
  @$pb.TagNumber(6)
  $9.Timestamp ensureEndsAt() => $_ensure(5);
}

class EventInstanceInfo extends $pb.GeneratedMessage {
  factory EventInstanceInfo() => create();
  EventInstanceInfo._() : super();
  factory EventInstanceInfo.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory EventInstanceInfo.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'EventInstanceInfo', package: const $pb.PackageName(_omitMessageNames ? '' : 'jonline'), createEmptyInstance: create)
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  EventInstanceInfo clone() => EventInstanceInfo()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  EventInstanceInfo copyWith(void Function(EventInstanceInfo) updates) => super.copyWith((message) => updates(message as EventInstanceInfo)) as EventInstanceInfo;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static EventInstanceInfo create() => EventInstanceInfo._();
  EventInstanceInfo createEmptyInstance() => create();
  static $pb.PbList<EventInstanceInfo> createRepeated() => $pb.PbList<EventInstanceInfo>();
  @$core.pragma('dart2js:noInline')
  static EventInstanceInfo getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<EventInstanceInfo>(create);
  static EventInstanceInfo? _defaultInstance;
}

class EventAttendance extends $pb.GeneratedMessage {
  factory EventAttendance() => create();
  EventAttendance._() : super();
  factory EventAttendance.fromBuffer($core.List<$core.int> i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromBuffer(i, r);
  factory EventAttendance.fromJson($core.String i, [$pb.ExtensionRegistry r = $pb.ExtensionRegistry.EMPTY]) => create()..mergeFromJson(i, r);

  static final $pb.BuilderInfo _i = $pb.BuilderInfo(_omitMessageNames ? '' : 'EventAttendance', package: const $pb.PackageName(_omitMessageNames ? '' : 'jonline'), createEmptyInstance: create)
    ..aOS(1, _omitFieldNames ? '' : 'eventInstanceId')
    ..aOS(2, _omitFieldNames ? '' : 'userId')
    ..e<AttendanceStatus>(3, _omitFieldNames ? '' : 'status', $pb.PbFieldType.OE, defaultOrMaker: AttendanceStatus.INTERESTED, valueOf: AttendanceStatus.valueOf, enumValues: AttendanceStatus.values)
    ..aOS(4, _omitFieldNames ? '' : 'invitingUserId')
    ..aOM<$9.Timestamp>(10, _omitFieldNames ? '' : 'createdAt', subBuilder: $9.Timestamp.create)
    ..aOM<$9.Timestamp>(11, _omitFieldNames ? '' : 'updatedAt', subBuilder: $9.Timestamp.create)
    ..hasRequiredFields = false
  ;

  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.deepCopy] instead. '
  'Will be removed in next major version')
  EventAttendance clone() => EventAttendance()..mergeFromMessage(this);
  @$core.Deprecated(
  'Using this can add significant overhead to your binary. '
  'Use [GeneratedMessageGenericExtensions.rebuild] instead. '
  'Will be removed in next major version')
  EventAttendance copyWith(void Function(EventAttendance) updates) => super.copyWith((message) => updates(message as EventAttendance)) as EventAttendance;

  $pb.BuilderInfo get info_ => _i;

  @$core.pragma('dart2js:noInline')
  static EventAttendance create() => EventAttendance._();
  EventAttendance createEmptyInstance() => create();
  static $pb.PbList<EventAttendance> createRepeated() => $pb.PbList<EventAttendance>();
  @$core.pragma('dart2js:noInline')
  static EventAttendance getDefault() => _defaultInstance ??= $pb.GeneratedMessage.$_defaultFor<EventAttendance>(create);
  static EventAttendance? _defaultInstance;

  @$pb.TagNumber(1)
  $core.String get eventInstanceId => $_getSZ(0);
  @$pb.TagNumber(1)
  set eventInstanceId($core.String v) { $_setString(0, v); }
  @$pb.TagNumber(1)
  $core.bool hasEventInstanceId() => $_has(0);
  @$pb.TagNumber(1)
  void clearEventInstanceId() => clearField(1);

  @$pb.TagNumber(2)
  $core.String get userId => $_getSZ(1);
  @$pb.TagNumber(2)
  set userId($core.String v) { $_setString(1, v); }
  @$pb.TagNumber(2)
  $core.bool hasUserId() => $_has(1);
  @$pb.TagNumber(2)
  void clearUserId() => clearField(2);

  @$pb.TagNumber(3)
  AttendanceStatus get status => $_getN(2);
  @$pb.TagNumber(3)
  set status(AttendanceStatus v) { setField(3, v); }
  @$pb.TagNumber(3)
  $core.bool hasStatus() => $_has(2);
  @$pb.TagNumber(3)
  void clearStatus() => clearField(3);

  @$pb.TagNumber(4)
  $core.String get invitingUserId => $_getSZ(3);
  @$pb.TagNumber(4)
  set invitingUserId($core.String v) { $_setString(3, v); }
  @$pb.TagNumber(4)
  $core.bool hasInvitingUserId() => $_has(3);
  @$pb.TagNumber(4)
  void clearInvitingUserId() => clearField(4);

  @$pb.TagNumber(10)
  $9.Timestamp get createdAt => $_getN(4);
  @$pb.TagNumber(10)
  set createdAt($9.Timestamp v) { setField(10, v); }
  @$pb.TagNumber(10)
  $core.bool hasCreatedAt() => $_has(4);
  @$pb.TagNumber(10)
  void clearCreatedAt() => clearField(10);
  @$pb.TagNumber(10)
  $9.Timestamp ensureCreatedAt() => $_ensure(4);

  @$pb.TagNumber(11)
  $9.Timestamp get updatedAt => $_getN(5);
  @$pb.TagNumber(11)
  set updatedAt($9.Timestamp v) { setField(11, v); }
  @$pb.TagNumber(11)
  $core.bool hasUpdatedAt() => $_has(5);
  @$pb.TagNumber(11)
  void clearUpdatedAt() => clearField(11);
  @$pb.TagNumber(11)
  $9.Timestamp ensureUpdatedAt() => $_ensure(5);
}


const _omitFieldNames = $core.bool.fromEnvironment('protobuf.omit_field_names');
const _omitMessageNames = $core.bool.fromEnvironment('protobuf.omit_message_names');
