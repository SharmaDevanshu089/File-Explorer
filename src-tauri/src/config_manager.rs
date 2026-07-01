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
// Updatting this to panic instead of returning error , this is a hit once function
pub fn check_if_config_exists_or_create_one(application_directory: PathBuf) {
    let settings_path = application_directory.join(CONFIG_NAME);

    if !settings_path.exists() {
        // Ensureing parent directory exists before writing to it
        if !application_directory.exists() {
            fs::create_dir_all(&application_directory)
                .expect("Failed to create application directory [ERR_CREATE_APP_DIR]");
        }

        // Building Boiler Plate for settings
        let default_settings: Settings = Settings {
            initial_directory: PathBuf::from("C:\\"),
            theme: String::from("dark"),
        };

        // Serializing the Settings struct into a formatted JSON string
        let json_data = serde_json::to_string_pretty(&default_settings)
            .expect("Failed to serialize default settings [ERR_SERIALIZE_CONFIG]");

        fs::write(&settings_path, json_data)
            .expect("There was Problem Writing Settings Config [ERR_DEFAULT_CONFIG_WRITING]");
    }
    println!("created new config path : {:#?}", settings_path);
}

#[tauri::command]
pub fn get_config() {
    // Since the config is built and checked at startup we dont need to check
}
