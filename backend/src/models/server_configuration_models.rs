use std::time::SystemTime;

use crate::protos::*;
use crate::schema::server_configurations;

#[derive(Debug, Queryable, Identifiable, AsChangeset)]
pub struct ServerConfiguration {
    pub id: i32,

    pub active: bool,

    pub server_info: serde_json::Value,
    pub default_user_permissions: serde_json::Value,
    pub people_settings: serde_json::Value,
    pub group_settings: serde_json::Value,
    pub post_settings: serde_json::Value,
    pub event_settings: serde_json::Value,
    pub private_user_strategy: String,
    pub authentication_features: serde_json::Value,

    pub created_at: SystemTime,
    pub updated_at: SystemTime,
}
#[derive(Debug, Insertable)]
#[diesel(table_name = server_configurations)]
pub struct NewServerConfiguration {
    pub server_info: serde_json::Value,
    pub default_user_permissions: serde_json::Value,
    pub people_settings: serde_json::Value,
    pub group_settings: serde_json::Value,
    pub post_settings: serde_json::Value,
    pub event_settings: serde_json::Value,
    pub private_user_strategy: String,
    pub authentication_features: serde_json::Value,
}

pub fn default_server_configuration() -> NewServerConfiguration {
    return NewServerConfiguration {
        server_info: serde_json::to_value(ServerInfo {
            name: None,
            short_name: None,
            description: None,
            privacy_policy_link: None,
            about_link: None,
            logo: None,
            colors: Some(ServerColors {
                primary: Some(0xFF2E86AB),
                navigation: Some(0xFFA23B72),
                ..Default::default()
            }),
        })
        .unwrap(),
        default_user_permissions: serde_json::to_value(
            [
                Permission::FollowUsers,
                Permission::CreateGroups,
                Permission::JoinGroups,
                Permission::ViewPosts,
                Permission::CreatePosts,
                Permission::ViewEvents,
                Permission::CreateEvents,
            ]
            .iter()
            .map(|it| it.as_str_name())
            .collect::<Vec<&str>>(),
        )
        .unwrap(),
        people_settings: serde_json::to_value(FeatureSettings {
            visible: true,
            default_moderation: Moderation::Unmoderated as i32,
            default_visibility: Visibility::ServerPublic as i32,
            custom_title: None,
        })
        .unwrap(),
        group_settings: serde_json::to_value(FeatureSettings {
            visible: true,
            default_moderation: Moderation::Unmoderated as i32,
            default_visibility: Visibility::ServerPublic as i32,
            custom_title: None,
        }).unwrap(),
        post_settings: serde_json::to_value(FeatureSettings {
            visible: true,
            default_moderation: Moderation::Unmoderated as i32,
            default_visibility: Visibility::ServerPublic as i32,
            custom_title: None,
        })
        .unwrap(),
        event_settings: serde_json::to_value(FeatureSettings {
            visible: true,
            default_moderation: Moderation::Unmoderated as i32,
            default_visibility: Visibility::ServerPublic as i32,
            custom_title: None,
        })
        .unwrap(),
        private_user_strategy: PrivateUserStrategy::AccountIsFrozen
            .as_str_name()
            .to_string(),
        authentication_features: serde_json::to_value(
            [
                AuthenticationFeature::Login,
                AuthenticationFeature::CreateAccount,
            ]
            .iter()
            .map(|it| it.as_str_name())
            .collect::<Vec<&str>>(),
        )
        .unwrap(),
    };
}