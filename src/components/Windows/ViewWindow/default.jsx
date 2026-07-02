import { useEffect, useState, useCallback } from "react";
import { useDirectoryStore } from "../../../store/useDirectoryStore";
import { invoke } from "@tauri-apps/api/core";
import "./default.css";
import { Folder, File, ChevronLeft, Home } from "lucide-react";

// Things mentioned by gemini
// it create this normalized function
// it gave the idea to useCallback
// and the one where we will play with strings

//i mostly never use else{} cuz it doesn't look good and if(){} after that i write whatever that is my else condition

//I sent gemini to spot any error it told to add this function u can remove if you want
// This is regex ik yk but still i will tell you
const WINDOWS_DRIVE_RE = /^[A-Za-z]:[\\/]?$/;

// it's sole purpose is to clean the path
function normalizePath(rawPath) {
  if (!rawPath) return rawPath;

  // Dynamically inspect the string to see if it belongs to a Windows environment
  const isWindows = rawPath.includes(":");

  if (isWindows) {
    // Windows requires native backslashes for absolute system roots
    let cleanPath = rawPath.replace(/\//g, "\\");
    if (/^[A-Za-z]:$/.test(cleanPath)) {
      cleanPath += "\\";
    }
    return cleanPath;
  }
  //for linux
  let cleanPath = rawPath.replace(/\\/g, "/");
  return cleanPath;
}

export function ViewWindow() {
  const currentDir = useDirectoryStore((state) => state.currentDir);
  const currentPath = useDirectoryStore((state) => state.currentPath);
  const setCurrentPath = useDirectoryStore((state) => state.setCurrentPath);
  const setCurrentDir = useDirectoryStore((state) => state.setCurrentDir);

  const [listFiles, setListFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  // gemini idea to add error state
  const [error, setError] = useState(null);

  //Fetch the home dir path from get_config
  useEffect(() => {
    const initializeStore = async () => {
      if (currentPath) return; // to stop overwriting

      try {
        const config = await invoke("get_config");
        if (config.initial_directory) {
          setCurrentPath(normalizePath(config.initial_directory));
          // setCurrentPath(config.initial_directory)
        }
      } catch (err) {
        console.error("Failed to read initial_directory", err);
        setError("Could not load starting directory from config.");
      }
    };
    initializeStore();
  }, [currentPath, setCurrentPath]);

  // retake config fresh and jump back to real home dir.
  //useCallback is used when we don't want function to rerun on every re remder and only run when given condition changes so we don't have to invoke that get_config every now and then hence latency will decrease
  const goHome = useCallback(async () => {
    try {
      const config = await invoke("get_config");
      if (config.initial_directory) {
        const home = normalizePath(config.initial_directory);
        setCurrentDir(home);
        setCurrentPath(home);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to get home directory:", err);
      setError("Can't get the home directory");
    }
  }, [setCurrentDir, setCurrentPath]);

  useEffect(() => {
    const trackingData = async () => {
      // if(currentPath) else:currentDir
      const activeTargetedDir = currentPath || currentDir;
      if (!activeTargetedDir) return;

      const cleanPath = normalizePath(activeTargetedDir);

      try {
        const content = await invoke("list_all_files", {
          directory: cleanPath,
        });
        setListFiles(content);
        setError(null);
      } catch (err) {
        console.error("Some issue in tracking list of all files...:", err);
        setListFiles([]);
        setError(`Can't get "${cleanPath}"`);
      }
    };
    trackingData();
  }, [currentPath, currentDir]);

  const handleFileClick = (item) => {
    setSelectedItem(item.path);
  };

  const handleFileDoubleClick = (item) => {
    if (item.is_dir) {
      setCurrentPath(item.path);
      setSelectedItem(null);
    }
    //TODO : condition to open the file
  };

  const handleBack = () => {
    const p = currentPath || currentDir;
    if (!p) return; //this condition if p is empty then it would stop running code for this (return always must be the last function statement)

    let cleanPath = normalizePath(p);

    // gemini idea to add this condition else if you saw my code u would have killed me
    const WinRoot = WINDOWS_DRIVE_RE.test(cleanPath); //check with regex whether it matches or not, output is bool
    const LinuxRoot = cleanPath === "/"; // check the condition after ===, result bool

    if (WinRoot || LinuxRoot) return; // if root user then end function here don't run below commands

    // we are checking whether it include : or not  if yes then mostly it will be of windows
    if (cleanPath.includes(":")) {
      if (cleanPath.endsWith("\\")) {
        cleanPath = cleanPath.slice(0, -1); //this is to rmeove that last / or \ so that back button works nicely and won't stuck if we remove this the back button will get stuck
      }

      const lastSlash = cleanPath.lastIndexOf("\\");
      // lastIndexOf is used for (as specified in it's name)

      if (lastSlash <= 2) {
        //in short the substring is just used to extract required amout of string from the string
        setCurrentPath(cleanPath.substring(0, 2) + "\\");
        return; // Stops here
      }

      setCurrentPath(cleanPath.substring(0, lastSlash));
      return; // Complete execution block immediately
    }
    // now we are checking is this linux
    if (cleanPath.endsWith("/")) {
      cleanPath = cleanPath.slice(0, -1);
    }
    const lastSlash = cleanPath.lastIndexOf("/");
    // Similar is anything happen in linux
    setCurrentPath(cleanPath.substring(0, lastSlash) || "/");
  };

  return (
    <div className="view-window">
      <div className="view-win-top-loc">
        <button className="back-button" onClick={handleBack}>
          <ChevronLeft size={16} />
          {/* from lucide-react */}
        </button>
        <div className="File-path">
          <p className="path-display">
            {/* //if (currentPath) return currentPath
          //if(...)... same for all 3 */}
            {currentPath || currentDir || "Loading workspace..."}
          </p>
        </div>
        <button className="gohome-btn" onClick={goHome}>
          <Home size={16} />
        </button>
      </div>

      {/* if conditiion 1 is correct then 2nd will be given else it won't */}
      {error && (
        <div className="error-msg">
          <p>{error}</p>
          <button onClick={goHome}>Go Home</button>
        </div>
      )}

      <div className="main-file-area">
        {listFiles.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            // in className if we select item then we will add another className so that we can set that selected theme
            // className="a b" that means element has 2 className a and b
            className={`item-list-container ${selectedItem === item.path ? "item-selected" : ""}`}
            onClick={() => handleFileClick(item)}
            onDoubleClick={() => handleFileDoubleClick(item)}
          >
            <div className="item-icon-container">
              {item.is_dir ? <Folder size={56} /> : <File size={56} />}
              {/* if is_dir then folder else file */}
            </div>
            <label className="item-name-label" title={item.name}>
              {item.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
