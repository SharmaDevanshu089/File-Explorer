// This React will house the settings window
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function SettingsWindow() {
    // I am Writing the backend functions in the meantime i want you to focus on frontend , make a textbox , keep it disabled and get its value from backend , on click of it push its value to backend . 
    return (
        <div>
            <h1>Settings Window</h1>
        </div>
    );
}