import { invoke } from "@tauri-apps/api/core";

// Accept setCurrentPath as a prop to update the application's active directory
export function Sidebar({ setCurrentPath }) {
  const listDir = ['audio_dir', 'desktop_dir', 'document_dir', 'picture_dir', 'video_dir'];

  const handleFolderClick = async (name) => {
    try {
      const path = await invoke("get_library_path", { name });
      if (path) {
        console.log(`Application directed to: ${path}`);
      } else {
        console.warn(`OS does not support library path: ${name}`);
      }
    } catch (err) {
      console.error(`Tauri invoke failed for ${name}:`, err);
    }
  };

  return (
    <div className="sidebar-container">
      <button onClick={() => handleFolderClick('home_dir')}>Home</button>
      <ul>
        {listDir.map(data => (
          <li key={data} onClick={() => handleFolderClick(data)}>
            {data.replace("_dir", "")}
          </li>
        ))}
      </ul>
    </div>
  );
}