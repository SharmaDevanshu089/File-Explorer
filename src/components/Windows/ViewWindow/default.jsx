import { useEffect, useState } from "react";
import { useDirectoryStore } from "../../../store/useDirectoryStore";
import { invoke } from "@tauri-apps/api/core";

export function ViewWindow() {
  const currentDir = useDirectoryStore((state) => state.currentDir);
  const currentPath = useDirectoryStore((state) => state.currentPath);
  const setCurrentPath = useDirectoryStore((state) => state.setCurrentPath);
  
  const [listFiles, setListFiles] = useState([]);

  useEffect(() => {
    const takingData = async () => {
      // Prioritize navigation path; fallback to initial directory if empty
      const activeTargetDir = currentPath || currentDir;
      if (!activeTargetDir) return;

      try {
        const content = await invoke("list_all_files", {
          directory: activeTargetDir,
        });
        setListFiles(content);
        console.log(content);
      } catch (err) {
        console.log("first error=>", err);
        const errorMessage = err.toString();
        
        if (errorMessage.includes("Directory does not exist")) {
          if (currentPath === "/home/krishna") {
            console.error("Critical: The emergency fallback directory also does not exist!");
            return;
          }
          console.log("Redirecting system environment to emergency fallback node...");
          setCurrentPath("/home/krishna");
        }
      }
    };
    takingData();
  }, [currentPath, currentDir, setCurrentPath]);

  const handleFileClick = (e) => {
    e.preventDefault();
  };

  const handleFileDoubleClick = (item) => {
    if (item.is_dir) {
      const base = currentPath || currentDir;
      if (!base) return;

      // Automatically format trailing slashes cleanly. 
      // Rust/Tauri natively supports forward slashes cross-platform (even on Windows).
      const newPath = base.endsWith("/") || base.endsWith("\\")
        ? `${base}${item.name}`
        : `${base}/${item.name}`;

      setCurrentPath(newPath);
    }
  };

  return (
    <div className="view-window">
      <button onClick={() => {
        const p = currentPath || currentDir;
        setCurrentPath(p.substring(0, Math.max(p.lastIndexOf('/'), p.lastIndexOf('\\'))) || '/');
      }}>⬅</button>
      
      <p>
        {currentDir === "" ? null : currentDir}
        {currentPath === "" ? null : currentPath}
      </p>
    
      {listFiles.map((items, index) => {
        return (
          <button 
            key={`${items.name}-${index}`} 
            onClick={handleFileClick} 
            onDoubleClick={() => handleFileDoubleClick(items)}
          >
            {items.is_dir ? "> " : null}
            {items.name}
          </button>
        );
      })}
    </div>
  );
}

export default ViewWindow;