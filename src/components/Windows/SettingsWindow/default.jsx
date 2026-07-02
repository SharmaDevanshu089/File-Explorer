// This React will house the settings window
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import './default.css';


export function SettingsWindow() {
    // Imma update this to use state
    // let initial_directory_panel_text = "LOADING...";


    const [initial_directory_path, set_initial_directory_path] = useState("Loading ... ");

    //DONE
    // I svelte just updates this automatically but i dont know how to do this in here, i know there is something called usestate but i need to learn how to do this
    // THis is just for debugging
useEffect(() => {
  const loadDefDir=async()=>{
    //wiat until backend respond
    try{const data = await invoke("get_default_current_directory");
      console.log("Fetched directory:", data);
      set_initial_directory_path(data);
        
}catch(err){
      console.error("Failed to fetch default directory:", err);
    };
}
loadDefDir();
return ()=>{};
}, []);


    function resetAllToDefaults() {
        console.log("Resetting all to defaults");
        //commented this if u dins useful u can do i haven't read that instruction
        // async function resetingAlltoDefault(){
        //     try{
        //         // await invoke()
        //         // const defPath = await invoke(get_default_current_directory)
        //         // set_initial_directory_path(defPath)
        //     }catch(err){
        //         console.error("Error from Backend babu...",err)
        //     }
        // }
    }

    // Asynchronous click handler for the initial directory input field.
    // This calls the backend Tauri command `update_initial_directory` to open a folder picker,
    // and then re-queries the configuration to update the frontend state with the new value.
    async function handleInputClick() {
        console.log("Initial directory input has been clicked. Opening folder dialog...");
        try {
            await invoke("update_initial_directory");
            console.log("Backend directory update completed. Re-fetching directory...");
            const data = await invoke("get_default_current_directory");
            set_initial_directory_path(data);
        } catch (err) {
            console.error("Failed to update initial directory:", err);
        }
    }


    // I am Writing the backend functions in the meantime i want you to focus on frontend , make a textbox , keep it disabled and get its value from backend , on click of it push its value to backend . 
    return (
        <div className="setting-panel">
            <div className="setting-header">
                <h1>Settings</h1>
                <button onClick={() => resetAllToDefaults()}>Reset to Default</button>
            </div>
            {/* This will contains all the componets that needed to be tweaked  */}
            <div className="Config_panel">
                <div className="initial_directory_panel">
                    <div className="setting-info">
                        <h3>Initial Directory</h3>
                        <p>
                            This is the Startup or Default Directory for the application. Default this is your home directory.
                        </p>
                    </div>
                    {/*
                      We use 'readOnly={true}' instead of 'disabled' so that mouse click events (onClick)
                      are still dispatched by the browser. This allows the user to click the field to log/trigger
                      the async function while preventing direct keyboard edits to the text box.
                    */}
                    <input 
                        type="text" 
                        readOnly={true} 
                        onClick={handleInputClick} 
                        value={initial_directory_path} 
                    />
                </div>
            </div>
        </div>
    );
}