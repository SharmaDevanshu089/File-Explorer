use whoami;

#[tauri::command]
pub fn get_username() -> String {
    let username = whoami::username().expect("Unable to get username");
    username
}
