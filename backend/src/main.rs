#[macro_use]
extern crate diesel;
extern crate bcrypt;
extern crate bs58;
extern crate diesel_migrations;
extern crate dotenv;
extern crate futures;
extern crate itertools;
extern crate log;
extern crate env_logger;
extern crate markdown;
extern crate prost_types;
extern crate prost_wkt_types;
extern crate regex;
extern crate ring;
extern crate rocket;
extern crate rocket_async_compression;
extern crate rocket_cache_response;
extern crate serde;
extern crate serde_json;
extern crate tonic_web;
#[macro_use]
extern crate lazy_static;
extern crate tokio_stream;

pub mod auth;
pub mod marshaling;
pub mod db_connection;
pub mod jonline;
pub mod logic;
pub mod models;
pub mod protos;
pub mod rpcs;
pub mod schema;
pub mod web;
pub mod servers;

use std::sync::Arc;
use futures::future::join_all;
use servers::{start_tonic_server, start_rocket_secure, start_rocket_unsecured};
use ::jonline::{env_var, report_error, init_service_logging};

#[rocket::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    init_service_logging();
    db_connection::migrate_database();
    let pool1 = Arc::new(db_connection::establish_pool());
    let pool2 = pool1.clone();
    let pool3 = pool1.clone();
    let pool4 = pool1.clone();

    let secure_mode = start_tonic_server(pool1)?;

    let rocket_unsecure_8000 = start_rocket_unsecured(8000, pool2, secure_mode);
    let rocket_unsecure_80 = start_rocket_unsecured(80, pool3, secure_mode);
    let rocket_secure = start_rocket_secure(pool4);

    join_all::<_>([
        // tonic_server,
        rocket_unsecure_8000,
        rocket_unsecure_80,
        rocket_secure,
    ])
    .await;

    Ok(())
}
