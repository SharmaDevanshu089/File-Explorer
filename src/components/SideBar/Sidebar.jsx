import { invoke } from "@tauri-apps/api/core";

// Accept setCurrentPath as a prop to update the application's active directory
export function Sidebar({ setCurrentPath }) {
  const listDir = ['audio_dir', 'desktop_dir', 'document_dir', 'picture_dir', 'video_dir'];
  const handleFolderClick = async (name) => {
    try {
      const path = await invoke("get_library_path", { name });
      if (path) {
        setCurrentPath(path)
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
        {/* <li>{listDir[0].replace('_dir','')}</li> */}
        {/* //list of list items which onclick then directory will be displayed oon console */}
        <li onClick={()=>handleFolderClick('audio_dir')}>Audio</li>
        <li onClick={()=>handleFolderClick('desktop_dir')}>Desktop</li>
        <li onClick={()=>handleFolderClick("document_dir")}>Documents</li>
        <li onClick={()=>handleFolderClick('picture_dir')
        }>Picture</li>
        <li onClick={()=>handleFolderClick('video_dir')}>Video</li>
      </ul>
    </div>
  );
}