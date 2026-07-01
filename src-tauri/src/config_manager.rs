use std::fs;
use std::path::Path;
use std::path::PathBuf;
use tauri::Manager;

const CONFIG_NAME: &str = "settings.json";
pub struct Settings {
    // This is Intital Directory where the application will start at
    pub initial_directory: PathBuf,
    // May be used may not be , but this is theme of application
    pub theme: String,
}

// Should Return by Checking if Path Exists
pub fn check_if_config_exists() {
    // let app_data_dirs = app.path().app_data_dir()?;
    // println!("{}", app_data_dirs);
}
pub fn load_config() {}
