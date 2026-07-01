// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config_manager;

fn main() {
    config_manager::check_if_config_exists();
    file_viewer_lib::run()
}
