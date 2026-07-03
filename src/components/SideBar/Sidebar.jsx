import { invoke } from "@tauri-apps/api/core";
import "./sidebar.css";
import { useDirectoryStore } from "../../store/useDirectoryStore";
import { useState, useEffect } from "react";
import { Folder, Search, X, File } from "lucide-react";
import { DropDown } from "../UsefulThings/DropDown/dropdown";

export function Sidebar() {
  const currentDir = useDirectoryStore((state) => state.currentDir);
  const currentPath = useDirectoryStore((state) => state.currentPath);
  const setCurrentPath = useDirectoryStore((state) => state.setCurrentPath);
  const searchQuery = useDirectoryStore((state) => state.searchQuery);
  const setSearchQuery = useDirectoryStore((state) => state.setSearchQuery);
  
  const [listFiles, setListFiles] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menu, setMenu] = useState({ isOpen: false, x: 0, y: 0, options: [], target: null, isStatic: false });

  const handleFolderClick = async (name) => {
    try {
      const path = await invoke("get_library_path", { name });
      if (path) setCurrentPath(path);
    } catch (err) {
      console.error(`Problem getting path ${name}:`, err);
    }
  };

  useEffect(() => {
    const trackingData = async () => {
      const activeTargetedDir = currentPath || currentDir;
      if (!activeTargetedDir) return;

      try {
        const content = await invoke("list_all_files", { directory: activeTargetedDir });
        setListFiles(content);
      } catch (err) {
        console.error("Issue tracking folder content:", err);
        setListFiles([]);
      }
    };
    trackingData();
  }, [currentPath, currentDir]);

  const handleStaticContextMenu = (e, name) => {
    e.preventDefault();
    setMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      options: ["Open", "Copy", "Properties"],
      target: name,
      isStatic: true
    });
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      options: ["Open", "Copy", "Properties"],
      target: item,
      isStatic: false
    });
  };

  const handleMenuClick = (action) => {
    if (!menu.target) return;

    if (action === "Open") {
      if (menu.isStatic) {
        handleFolderClick(menu.target);
      } else if (menu.target.is_dir) {
        setCurrentPath(menu.target.path);
      }
    } else if (action === "Copy") {
      console.log("Copy:", menu.isStatic ? menu.target : menu.target.path);
    } else if (action === "Properties") {
      console.log("Properties:", menu.isStatic ? menu.target : menu.target.path);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="search-btn">
        {isSearchOpen ? (
          <div className="search-btn-opened">
            <input 
              type="text" 
              value={searchQuery} 
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={(e) => e.preventDefault()}><Search size={18} /></button>
            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}><X size={16} /></button>
          </div>
        ) : (
          <button onClick={() => setIsSearchOpen(true)}><Search size={18} /></button>
        )}
      </div>

      <button 
        onClick={() => handleFolderClick("home_dir")}
        onContextMenu={(e) => handleStaticContextMenu(e, "home_dir")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <label>Home</label>
      </button>
      <hr />
      
      <ul>
        <li 
          onClick={() => handleFolderClick("desktop_dir")}
          onContextMenu={(e) => handleStaticContextMenu(e, "desktop_dir")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="9" y1="4" x2="9" y2="20" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          <label>Desktop</label>
        </li>
        <li 
          onClick={() => handleFolderClick("download_dir")}
          onContextMenu={(e) => handleStaticContextMenu(e, "download_dir")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          <label>Downloads</label>
        </li>
        <li 
          onClick={() => handleFolderClick("audio_dir")}
          onContextMenu={(e) => handleStaticContextMenu(e, "audio_dir")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6" /></svg>
          <label>Audio</label>
        </li>
        <li 
          onClick={() => handleFolderClick("document_dir")}
          onContextMenu={(e) => handleStaticContextMenu(e, "document_dir")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          <label>Documents</label>
        </li>
        <li 
          onClick={() => handleFolderClick("picture_dir")}
          onContextMenu={(e) => handleStaticContextMenu(e, "picture_dir")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          <label>Picture</label>
        </li>
        <li 
          onClick={() => handleFolderClick("video_dir")}
          onContextMenu={(e) => handleStaticContextMenu(e, "video_dir")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
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
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              {item.is_dir ? <Folder size={20} /> : <File size={20} />}
              <label>{item.name}</label>
            </button>
          );
        })}
      </div>

      <DropDown 
        functionality={{
          isOpen: menu.isOpen,
          x: menu.x,
          y: menu.y,
          options: menu.options,
          handleClose: () => setMenu({ ...menu, isOpen: false }),
          handleClick: handleMenuClick
        }} 
      />
    </div>
  );
}