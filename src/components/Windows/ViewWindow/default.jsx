import { useEffect, useState, useCallback } from "react";
import { useDirectoryStore } from "../../../store/useDirectoryStore";
import { invoke } from "@tauri-apps/api/core";
import "./default.css";
import { Folder, File, ChevronLeft, Home } from "lucide-react";
import { DefaultDialogBox } from "../../UsefulThings/DefaultDialogBox/defaultDialogBox";
import { DropDown } from "../../UsefulThings/DropDown/dropdown";
import { useKeyShortcut } from "../../UsefulThings/Keypresses/keyShortcutandClicks";
import { Toast } from "../../UsefulThings/Toast/toast";

//DONOT try to read it all just tell what u want to know or ask ai

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

  // tracking right clicks coordinates and options array maps
  const [menu, setMenu] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    options: [],
    target: null,
  });
  // self destroying notification strip layout state
  const [toast, setToast] = useState({
    message: "",
    type: "normal",
    duration: 3000,
  });
  // simple copy cut paste structural path holder
  const [clipboard, setClipboard] = useState({ type: null, path: null });
  // open confirmation console specs for deletion and new folder inputs
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "",
    value: "",
    actionType: null,
  });

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

  const refreshDirectory = useCallback(async () => {
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
  }, [currentPath, currentDir]);

  useEffect(() => {
    refreshDirectory();
  }, [refreshDirectory]);

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

  // calculation limits layout window edge checks to stop overflow out of screen
  const getBoundedCoordinates = (clientX, clientY) => {
    const menuWidth = 160;
    const menuHeight = 220;
    let x = clientX;
    let y = clientY;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 12;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 12;
    }
    return { x, y };
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation(); // stop parent events bubble chain reaction to protect context popup menu canvas
    setSelectedItem(item.path);
    const coords = getBoundedCoordinates(e.clientX, e.clientY);
    setMenu({
      isOpen: true,
      x: coords.x,
      y: coords.y,
      options: ["Open", "Cut", "Copy", "Rename", "Properties"],
      target: item,
    });
  };

  const handleBackgroundContextMenu = (e) => {
    e.preventDefault();
    const coords = getBoundedCoordinates(e.clientX, e.clientY);
    setMenu({
      isOpen: true,
      x: coords.x,
      y: coords.y,
      options: ["New Folder", "Paste", "Properties"],
      target: "background",
    });
  };

  const triggerDeleteDialog = (itemPath) => {
    if (!itemPath) return;
    const targetName = itemPath.split(/[\\/]/).pop();
    setDialog({
      isOpen: true,
      title: "Confirm Deletion",
      message: `Are you sure you want to permanently delete "${targetName}"?`,
      type: "confirm",
      value: "",
      actionType: "DELETE",
    });
  };

  const triggerNewFolderDialog = () => {
    setDialog({
      isOpen: true,
      title: "Create New Folder",
      message: "Enter a name for the new folder:",
      type: "input",
      value: "New Folder",
      actionType: "NEW_FOLDER",
    });
  };

  const triggerRenameDialog = (item) => {
    setDialog({
      isOpen: true,
      title: "Rename Item",
      message: `Enter a new name for "${item.name}":`,
      type: "input",
      value: item.name,
      actionType: "RENAME",
    });
  };

  const handleDialogSubmit = async () => {
    const activeDir = currentPath || currentDir;
    setDialog((prev) => ({ ...prev, isOpen: false }));

    // try {
    //   if (dialog.actionType === "DELETE" && selectedItem) {
    //     await invoke("delete_item", { path: selectedItem });
    //     setToast({ message: "Item deleted successfully", type: "normal", duration: 3000 });
    //   }
    //   if (dialog.actionType === "NEW_FOLDER") {
    //     await invoke("create_directory", { parent: activeDir, name: dialog.value });
    //     setToast({ message: "Folder created successfully", type: "normal", duration: 3000 });
    //   }
    //   if (dialog.actionType === "RENAME" && menu.target) {
    //     await invoke("rename_item", { path: menu.target.path, newName: dialog.value });
    //     setToast({ message: "Item renamed successfully", type: "normal", duration: 3000 });
    //   }
    //   setSelectedItem(null);
    //   refreshDirectory();
    // } catch (err) {
    //   console.error(err);
    //   setToast({ message: `Operation failed: ${err}`, type: "error", duration: 4000 });
    // }
  };

  const handlePasteAction = async () => {
    if (!clipboard.path) return;
    const activeDir = currentPath || currentDir;
    // try {
    //   await invoke("paste_item", { source: clipboard.path, destination: activeDir, type: clipboard.type });
    //   setToast({ message: "Pasted successfully", type: "normal", duration: 3000 });
    //   if (clipboard.type === "cut") setClipboard({ type: null, path: null });
    //   refreshDirectory();
    // } catch (err) {
    //   setToast({ message: `Paste failed: ${err}`, type: "error", duration: 4000 });
    // }
  };

  const handleMenuClick = (action) => {
    if (!menu.target) return;

    if (menu.target === "background") {
      if (action === "New Folder") triggerNewFolderDialog();
      if (action === "Paste") handlePasteAction();
      if (action === "Properties") {
        setToast({
          message: `Location: ${currentPath || currentDir || "Unknown"}`,
          type: "normal",
          duration: 4000,
        });
      }
      return;
    }

    if (action === "Open") {
      handleFileDoubleClick(menu.target);
    }
    if (action === "Copy") {
      setClipboard({ type: "copy", path: menu.target.path });
      setToast({
        message: "Copied to clipboard",
        type: "normal",
        duration: 2000,
      });
    }
    if (action === "Cut") {
      setClipboard({ type: "cut", path: menu.target.path });
      setToast({ message: "Cut to clipboard", type: "normal", duration: 2000 });
    }
    if (action === "Rename") {
      triggerRenameDialog(menu.target);
    }
    if (action === "Properties") {
      setToast({
        message: `Path: ${menu.target.path}`,
        type: "normal",
        duration: 4000,
      });
    }
  };

  useKeyShortcut({
    selectedItem,
    actions: {
      onNew: triggerNewFolderDialog,
      onPaste: handlePasteAction,
      onCopy: (path) => {
        setClipboard({ type: "copy", path });
        setToast({
          message: "Copied to clipboard",
          type: "normal",
          duration: 2000,
        });
      },
      onCut: (path) => {
        setClipboard({ type: "cut", path });
        setToast({
          message: "Cut to clipboard",
          type: "normal",
          duration: 2000,
        });
      },
      onEnter: (path) => {
        const item = listFiles.find((f) => f.path === path);
        if (item) handleFileDoubleClick(item);
      },
      onDelete: triggerDeleteDialog,
    },
  });

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

      <div
        className="main-file-area"
        onContextMenu={handleBackgroundContextMenu}
      >
        {listFiles.map((item, index) => {
          if (item.name.startsWith(".")) return null;

          const isSelected = selectedItem === item.path;
          const isContextActive =
            menu.isOpen && menu.target?.path === item.path;

          return (
            <div
              key={`${item.name}-${index}`}
              // in className if we select item then we will add another className so that we can set that selected theme
              // className="a b" that means element has 2 className a and b
              className={`item-list-container ${isSelected ? "item-selected" : ""} ${isContextActive ? "item-context-active" : ""}`}
              onClick={() => handleFileClick(item)}
              onDoubleClick={() => handleFileDoubleClick(item)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            >
              <div className="item-icon-container">
                {item.is_dir ? <Folder size={56} /> : <File size={56} />}
                {/* if is_dir then folder else file */}
              </div>
              <label className="item-name-label" title={item.name}>
                {item.name}
              </label>
            </div>
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
          handleClick: handleMenuClick,
        }}
      />

      <DefaultDialogBox
        stuff={{
          isOpen: dialog.isOpen,
          title: dialog.title,
          message: dialog.message,
          type: dialog.type,
          value: dialog.value,
          setValue: (val) => setDialog((prev) => ({ ...prev, value: val })),
          handleClose: () => setDialog((prev) => ({ ...prev, isOpen: false })),
          handleSubmit: handleDialogSubmit,
        }}
      />

      {toast.message && (
        <Toast
          ToastDet={{
            message: toast.message,
            type: toast.type,
            duration: toast.duration,
            handleClose: () =>
              setToast({ message: "", type: "normal", duration: 3000 }),
          }}
        />
      )}
    </div>
  );
}
