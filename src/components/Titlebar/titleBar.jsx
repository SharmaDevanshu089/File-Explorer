import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import './title-bar.css';

export function TitleBar() {
  const [maximized, setMaximized] = useState(false);
  const maximizeIcon = maximized ? '==' : '=';

  return (
    <div className="Titlebar-window">
      <button onClick={()=>invoke('do_minimize').catch(console.error)}>-</button>
      <button onClick={() => {const nextMaximized = !maximized;setMaximized(nextMaximized);invoke(`${nextMaximized?"to_expand":"to_contract"}`).catch(console.error)}}>{maximizeIcon}</button>
      <button onClick={() => invoke("close_window").catch(console.error)}>x</button>
    </div>
  );
}