import { invoke } from "@tauri-apps/api/core";
import "./sidebar.css";
import { useDirectoryStore } from "../../store/useDirectoryStore";
import { useState, useEffect } from "react";
import { Folder, Search, X,File } from "lucide-react";

export function Sidebar() {
  const currentDir = useDirectoryStore((state) => state.currentDir);
  const currentPath = useDirectoryStore((state) => state.currentPath);
  const [listFiles, setListFiles] = useState([]);
  const setCurrentPath = useDirectoryStore((state) => state.setCurrentPath);
  
  const searchQuery = useDirectoryStore((state) => state.searchQuery);
  const setSearchQuery = useDirectoryStore((state) => state.setSearchQuery);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleFolderClick = async (name) => {
    try {
      const path = await invoke("get_library_path", { name });
      if (path) setCurrentPath(path);
    } catch (err) {
      console.error(`Problem is getting path ${name}:`, err);
    }
  };

  useEffect(() => {
    const trackingData = async () => {
      const activeTargetedDir = currentPath || currentDir;
      if (!activeTargetedDir) return;

      const cleanPath = activeTargetedDir;

      try {
        const content = await invoke("list_all_files", {
          directory: cleanPath,
        });
        setListFiles(content);
      } catch (err) {
        console.error("Some issue in tracking list of all files...:", err);
        setListFiles([]);
      }
    };
    trackingData();
  }, [currentPath, currentDir]);

  const handleClick = (item) => {
    setCurrentPath(item.path);
  };

  const handleSearchQuery = (e) => {
    e.preventDefault();
  };

  return (
    <div className="sidebar-container">
      <div className="search-btn">
        {isSearchOpen && (
          <div className="search-btn-opened">
            <input 
              type="text" 
              value={searchQuery} 
              autoFocus={true}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearchQuery}>
              <Search size={18} />
            </button>
            <button onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery(""); // FIXED: Flushes search text cleanly when closed
            }}>
              <X size={16} />
            </button>
          </div>
        )}
        
        {!isSearchOpen && (
          <button onClick={() => setIsSearchOpen(true)}>
            <Search size={18} />
          </button>
        )}
      </div>

      {/* Home Button */}
      <button onClick={() => handleFolderClick("home_dir")}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <label>Home</label>
      </button>
      <hr />
      
      <ul>
        {/* Desktop */}
        <li onClick={() => handleFolderClick("desktop_dir")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <line x1="9" y1="4" x2="9" y2="20" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <label>Desktop</label>
        </li>

        {/* Downloads */}
        <li onClick={() => handleFolderClick("download_dir")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <label>Downloads</label>
        </li>

        {/* Audio */}
        <li onClick={() => handleFolderClick("audio_dir")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6" />
          </svg>
          <label>Audio</label>
        </li>

        {/* Documents */}
        <li onClick={() => handleFolderClick("document_dir")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <label>Documents</label>
        </li>

        {/* Picture */}
        <li onClick={() => handleFolderClick("picture_dir")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <label>Picture</label>
        </li>

        {/* Video */}
        <li onClick={() => handleFolderClick("video_dir")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" />
          </svg>
          <label>Video</label>
        </li>
      </ul>
      <hr />

      <div className="folder-list">
        {listFiles.map((item, index) => {
          if (item.name.startsWith('.')) return null;
          if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return null;

          return (
            <button 
              key={`${item.name}-${index}`} 
              className="folders" 
              onClick={() => setCurrentPath(item.path)}
            >
              {item.is_dir ? <Folder size={20} /> : <File size={20} />}
              <label>{item.name}</label>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// TODO for me -> change the icons and folder images, recheck css, add items to filtered query, then display on screen, change colors of settings,find a way to change the color of scroll bar, develop enter and click key events
// every TODO is a currently issue
//ISSUE - nothing good is present at corners
//newTODO -> change color of folder