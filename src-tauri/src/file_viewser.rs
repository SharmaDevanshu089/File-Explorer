use serde::Serialize;
use std::fs;
use std::path::Path;

#[derive(Serialize)]
pub struct FileInfo {
    name: String,
    path: String,
    is_dir: bool,
}

#[tauri::command]
pub fn list_all_files(directory: String) -> Result<Vec<FileInfo>, String> {
    let path = Path::new(&directory);
    if !path.exists() {
        return Err(format!("Directory does not exist: {}", directory));
    }
    if !path.is_dir() {
        return Err(format!("Path is not a directory: {}", directory));
    }

    let entries = fs::read_dir(path).map_err(|e| format!("Failed to read directory: {}", e))?;

    let mut files = Vec::new();
    for entry in entries {
        if let Ok(entry) = entry {
            let name = entry.file_name().to_string_lossy().into_owned();
            let path_str = entry.path().to_string_lossy().into_owned();
            let is_dir = entry.file_type().map(|t| t.is_dir()).unwrap_or(false);
            files.push(FileInfo {
                name,
                path: path_str,
                is_dir,
            });
        }
    }

    // Sort: directories first, then files, both alphabetically (case-insensitive)
    files.sort_by(|a, b| {
        if a.is_dir != b.is_dir {
            b.is_dir.cmp(&a.is_dir)
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });
    println!("files: {:?}", files);
    Ok(files)
}
