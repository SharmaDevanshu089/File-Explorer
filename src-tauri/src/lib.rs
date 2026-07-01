use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Added this for debugging only
            let app_data_path = app.path().app_data_dir()?;

            println!("App data directory: {:?}", app_data_path);
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        // .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
