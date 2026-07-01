use tauri::Manager;

mod config_manager;
mod library_return;
mod misc_function;
mod settings_manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Added this for debugging only
            let app_data_path = app.path().app_config_dir().unwrap();
            // I need to ping the function as it will panic if not working
            config_manager::check_if_config_exists_or_create_one(app_data_path);
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            config_manager::get_config,
            misc_function::get_username,
            settings_manager::get_default_current_directory,
            library_return::get_library_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
