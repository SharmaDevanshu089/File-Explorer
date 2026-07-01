use serde::Deserialize;
use serde::Serialize;
use std::fs;
use std::path::Path;
use std::path::PathBuf;
// use tauri::Manager;

const CONFIG_NAME: &str = "settings.json";
const DEBUG: bool = true;

#[derive(Debug, Serialize, Deserialize)]
pub struct Settings {
    // This is Intital Directory where the application will start at
    pub initial_directory: PathBuf,
    // May be used may not be , but this is theme of application
    pub theme: String,
}

// Should Return by Checking if Path Exists
// Updatting this to panic instead of returning error , this is a hit function
pub fn check_if_config_exists_or_create_one(application_directory: PathBuf) {
    let settings_path = application_directory.join(CONFIG_NAME);

    if !settings_path.exists() {
        if DEBUG {
            println!("{:?}", settings_path);
        }
    }
}
pub fn load_config() {}
