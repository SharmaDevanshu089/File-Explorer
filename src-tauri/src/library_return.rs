use std::path::PathBuf;

#[tauri::command]
pub fn get_library_path(name: String) -> Option<PathBuf> {
    match name.as_str() {
        "home_dir" => dirs::home_dir(),
        "cache_dir" => dirs::cache_dir(),
        "config_dir" => dirs::config_dir(),
        "config_local_dir" => dirs::config_local_dir(),
        "data_dir" => dirs::data_dir(),
        "data_local_dir" => dirs::data_local_dir(),
        "executable_dir" => dirs::executable_dir(),
        "preference_dir" => dirs::preference_dir(),
        "runtime_dir" => dirs::runtime_dir(),
        "state_dir" => dirs::state_dir(),
        "audio_dir" => dirs::audio_dir(),
        "desktop_dir" => dirs::desktop_dir(),
        "document_dir" => dirs::document_dir(),
        "download_dir" => dirs::download_dir(),
        "font_dir" => dirs::font_dir(),
        "picture_dir" => dirs::picture_dir(),
        "public_dir" => dirs::public_dir(),
        "template_dir" => dirs::template_dir(),
        "video_dir" => dirs::video_dir(),
        _ => None,
    }
}
