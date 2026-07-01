import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import './title-bar.css';

const appWindow = getCurrentWindow();
export function TitleBar() {
  const [maximized, setMaximized] = useState(false);
  const maximizeIcon = maximized ? '==' : '=';

  return (
    <div className="Titlebar-window">
      <button onClick={do_minimize}>-</button>
      {/* TODO: Fix this please , call the below function , do not invoke */}
      <button onClick={() => { const nextMaximized = !maximized; setMaximized(nextMaximized); invoke(`${nextMaximized ? "to_expand" : "to_contract"}`).catch(console.error) }}>{maximizeIcon}</button>
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