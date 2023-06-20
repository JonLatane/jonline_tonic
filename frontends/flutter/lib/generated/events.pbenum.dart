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

class EventListingType extends $pb.ProtobufEnum {
  static const EventListingType PUBLIC_EVENTS = EventListingType._(0, _omitEnumNames ? '' : 'PUBLIC_EVENTS');
  static const EventListingType FOLLOWING_EVENTS = EventListingType._(1, _omitEnumNames ? '' : 'FOLLOWING_EVENTS');
  static const EventListingType MY_GROUPS_EVENTS = EventListingType._(2, _omitEnumNames ? '' : 'MY_GROUPS_EVENTS');
  static const EventListingType DIRECT_EVENTS = EventListingType._(3, _omitEnumNames ? '' : 'DIRECT_EVENTS');
  static const EventListingType EVENTS_PENDING_MODERATION = EventListingType._(4, _omitEnumNames ? '' : 'EVENTS_PENDING_MODERATION');
  static const EventListingType GROUP_EVENTS = EventListingType._(10, _omitEnumNames ? '' : 'GROUP_EVENTS');
  static const EventListingType GROUP_EVENTS_PENDING_MODERATION = EventListingType._(11, _omitEnumNames ? '' : 'GROUP_EVENTS_PENDING_MODERATION');

  static const $core.List<EventListingType> values = <EventListingType> [
    PUBLIC_EVENTS,
    FOLLOWING_EVENTS,
    MY_GROUPS_EVENTS,
    DIRECT_EVENTS,
    EVENTS_PENDING_MODERATION,
    GROUP_EVENTS,
    GROUP_EVENTS_PENDING_MODERATION,
  ];

  static final $core.Map<$core.int, EventListingType> _byValue = $pb.ProtobufEnum.initByValue(values);
  static EventListingType? valueOf($core.int value) => _byValue[value];

  const EventListingType._($core.int v, $core.String n) : super(v, n);
}

class AttendanceStatus extends $pb.ProtobufEnum {
  static const AttendanceStatus INTERESTED = AttendanceStatus._(0, _omitEnumNames ? '' : 'INTERESTED');
  static const AttendanceStatus GOING = AttendanceStatus._(1, _omitEnumNames ? '' : 'GOING');
  static const AttendanceStatus NOT_GOING = AttendanceStatus._(2, _omitEnumNames ? '' : 'NOT_GOING');
  static const AttendanceStatus REQUESTED = AttendanceStatus._(3, _omitEnumNames ? '' : 'REQUESTED');
  static const AttendanceStatus WENT = AttendanceStatus._(10, _omitEnumNames ? '' : 'WENT');
  static const AttendanceStatus DID_NOT_GO = AttendanceStatus._(11, _omitEnumNames ? '' : 'DID_NOT_GO');

  static const $core.List<AttendanceStatus> values = <AttendanceStatus> [
    INTERESTED,
    GOING,
    NOT_GOING,
    REQUESTED,
    WENT,
    DID_NOT_GO,
  ];

  static final $core.Map<$core.int, AttendanceStatus> _byValue = $pb.ProtobufEnum.initByValue(values);
  static AttendanceStatus? valueOf($core.int value) => _byValue[value];

  const AttendanceStatus._($core.int v, $core.String n) : super(v, n);
}


const _omitEnumNames = $core.bool.fromEnvironment('protobuf.omit_enum_names');
