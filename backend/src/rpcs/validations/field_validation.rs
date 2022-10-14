use tonic::Status;
use super::string_length_validation::validate_length;
use super::matching_validation::*;
use super::matching_validation::validate_all_word_chars;

pub fn validate_username(value: &str) -> Result<(), Status> {
  validate_length(&value, "username", 1, 47)?;
  validate_all_word_chars(&value, "username")?;
  // A "standard" way to represent a federated Jonline user is federatedserver.com/username. But we also want
  // federatedserver.com/events and federatedserver.com/post/asdf123, etc. to be able to point to valid things.
  validate_reserved_values(&value, "username", &["events", "event", "e", "posts", "post", "p", "groups", "group", "g", "people", "person"])
}

pub fn validate_password(value: &str) -> Result<(), Status> {
  validate_length(&value, "password", 8, 128)
}

pub fn validate_email(value: &Option<String>) -> Result<(), Status> {
  match value {
    Some(value) => validate_length(&value, "email", 1, 255),
    None => Ok(()),
  }
}
pub fn validate_phone(value: &Option<String>) -> Result<(), Status> {
  match value {
    Some(value) => validate_length(&value, "phone", 1, 128),
    None => Ok(()),
  }
}