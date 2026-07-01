import { useState } from "react";
import './title-bar.css';

export function TitleBar() {
  const [maximized, setMaximized] = useState(false);
  const maximizeIcon = maximized ? '==' : '=';

  return (
    <div className="Titlebar-window">
      <button>-</button>
      <button onClick={() => setMaximized(!maximized)}>{maximizeIcon}</button>
      <button>x</button>
    </div>
  );
}