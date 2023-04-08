use std::{fs, sync::Arc};

use crate::{web, report_error};
use crate::{db_connection::PgPool, env_var};

use rocket::*;
use tokio::task::JoinHandle;
use ::log::{info, warn};

pub fn start_rocket_secure(pool: Arc<PgPool>) -> JoinHandle<()> {
    let cert = env_var("TLS_CERT");
    let key = env_var("TLS_KEY");

    let server_build = match (cert, key) {
        (Some(cert), Some(key)) => {
            info!("Configuring Rocket TLS...");

            fs::write(".tls.crt", cert).expect("Unable to write TLS certificate");
            fs::write(".tls.key", key).expect("Unable to write TLS key");
            let figment = rocket::Config::figment()
                .merge(("port", 443))
                .merge(("address", "0.0.0.0"))
                .merge(("tls.certs", ".tls.crt"))
                .merge(("tls.key", ".tls.key"));
            Some(create_rocket(figment, pool))
        }
        _ => None,
    };

    rocket::tokio::spawn(async {
        match server_build {
            None => (),
            Some(rocket) => match rocket.launch().await {
                Ok(_) => (),
                Err(e) => {
                    warn!("Unable to start secure Rocket server on port 443");
                    report_error(e);
                }
            },
        };
        ()
    })
}

pub fn start_rocket_unsecured(
    port: i32,
    pool: Arc<PgPool>,
    https_redirect: bool,
) -> JoinHandle<()> {
    let figment = rocket::Config::figment()
        .merge(("port", port))
        .merge(("address", "0.0.0.0"));
    let server_build = if https_redirect {
        create_rocket_https_redirect(figment, pool)
    } else {
        create_rocket(figment, pool)
    };

    rocket::tokio::spawn(async move {
        match server_build.launch().await
        {
            Ok(_) => (),
            Err(e) => {
                warn!("Unable to start Rocket server on port {}", port);
                report_error(e);
            }
        };
        ()
    })
}

fn create_rocket<T: rocket::figment::Provider>(
    figment: T,
    pool: Arc<PgPool>,
) -> rocket::Rocket<rocket::Build> {
    let mut routes = routes![web::main_index::main_index,];
    routes.append(&mut (*web::SEO_PAGES).clone());
    routes.append(&mut (*web::FLUTTER_PAGES).clone());
    routes.append(&mut (*web::TAMAGUI_PAGES).clone());
    let server = rocket::custom(figment)
        .manage(web::RocketState { pool })
        .mount("/", routes)
        .register("/", catchers![web::catchers::not_found]);
    if cfg!(debug_assertions) {
        server
    } else {
        server.attach(rocket_async_compression::CachedCompression::fairing(vec![
            "main.dart.js",
            ".otf",
            "manifest.json",
            "flutter.js",
            "app",
        ]))
    }
}

fn create_rocket_https_redirect<T: rocket::figment::Provider>(
    figment: T,
    pool: Arc<PgPool>,
) -> rocket::Rocket<rocket::Build> {
    rocket::custom(figment)
        .manage(web::RocketState { pool })
        .mount("/", routes![web::redirect_to_secure,])
        .register("/", catchers![web::catchers::not_found])
}

// fn create_tonic_router(pool: Arc<PgPool>) -> (tonic::transport::server::Router, bool) {
// }