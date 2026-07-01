use crate::config_manager::get_config;
use crate::config_manager::Settings;
use std::path::PathBuf;
use tauri::Manager;

#[tauri::command]
pub fn get_default_current_directory(app: tauri::AppHandle) -> PathBuf {
    let current_settings: Settings = get_config(app).expect("Unable to read config.");
    return current_settings.initial_directory;
}
