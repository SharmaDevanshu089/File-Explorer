import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import './title-bar.css';

const appWindow = getCurrentWindow();
export function TitleBar() {
  const [maximized, setMaximized] = useState(false);
  const maximizeIcon = maximized ? '==' : '=';

  return (
    // The data below is needed to allow dragging of the window
    <div className="Titlebar-window" data-tauri-drag-region >
      <button onClick={do_minimize}>-</button>
      {/* Call the local window functions directly, do not invoke backend commands */}
      <button onClick={() => {
        const nextMaximized = !maximized;
        setMaximized(nextMaximized);
        if (nextMaximized) {
          to_expand();
        } else {
          to_contract();
        }
      }}>{maximizeIcon}</button>
      <button onClick={close_window}>x</button>
    </div>
  );
}


function close_window() {
  appWindow.close();
}

function do_minimize() {
  appWindow.minimize();
}

function to_expand() {
  appWindow.maximize();
}

function to_contract() {
  appWindow.unmaximize();
}