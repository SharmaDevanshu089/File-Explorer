use crate::config_manager::get_config;
use crate::config_manager::Settings;
use std::path::PathBuf;
use tauri::Manager;
use std::fs;
use rfd::FileDialog;

#[tauri::command]
pub fn get_default_current_directory(app: tauri::AppHandle) -> PathBuf {
    let current_settings: Settings = get_config(app).expect("Unable to read config.");
    return current_settings.initial_directory;
}

#[tauri::command]
pub async fn update_initial_directory(app: tauri::AppHandle) {
    // Read the current settings to get the starting directory for the file picker
    let mut current_settings: Settings = get_config(app.clone()).expect("Unable to read config.");
    let start_dir = current_settings.initial_directory.clone();

    // Open a folder picker dialog using RFD (Rust File Dialog)
    let picked_folder = FileDialog::new()
        .set_title("Select Initial Directory")
        .set_directory(&start_dir)
        .pick_folder();

    if let Some(folder_path) = picked_folder {
        current_settings.initial_directory = folder_path;

        let config_dir = app.path().app_config_dir().expect("Failed to get app config directory");
        let config_file = config_dir.join("settings.json");

        // Serialize the updated settings back to pretty JSON
        let json_data = serde_json::to_string_pretty(&current_settings)
            .expect("Failed to serialize settings [ERR_SERIALIZE_CONFIG]");

        // Ensure the config directory exists before writing
        if !config_dir.exists() {
            fs::create_dir_all(&config_dir)
                .expect("Failed to create application directory [ERR_CREATE_APP_DIR]");
        }

        // Write the updated settings back to the config file
        fs::write(&config_file, json_data)
            .expect("Problem writing settings config file [ERR_CONFIG_WRITING]");
    }
}