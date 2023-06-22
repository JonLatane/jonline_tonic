use std::path::PathBuf;

use rocket::{get, response::Redirect, State};

use super::{configured_backend_domain, headers::HostHeader, RocketState};

#[get("/<path..>")]
pub fn redirect_to_secure(state: &State<RocketState>, host: HostHeader<'_>, path: PathBuf) -> Redirect {
    let configured_backend_domain = configured_backend_domain(state, host);
    let redirect_url = format!(
        "https://{}/{}",
        configured_backend_domain,
        path.to_string_lossy()
    );
    // format!("Hello from {}. Redirecting to {}", domain, redirect_url)
    Redirect::to(redirect_url)
}
