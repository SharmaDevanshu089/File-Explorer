import { TitleBar } from "./components/Titlebar/titleBar";
// Needed to call rust
import { invoke } from "@tauri-apps/api/core";
import { TopBar } from "./components/Topbar/topbar";
import { Sidebar } from "./components/SideBar/Sidebar";
import { SettingsWindow } from "./components/Windows/SettingsWindow/default";
import './App.css'

/*
  IMP FEATURE REQUEST

    I think we need to use Context or Any other Store what you prefer , to store 2 things 
     CURRENTWINDOW:
     this will store what current window of application is the user on, like ViewWindow or SettingsWindow,
     defualt will be ViewWindow , we may or may not add more later.

     CURRENTDIRECTORY:
     this will store what current directory of application is the user on,
     we will need this for sidebar to work, as well as for ViewWindow
     
*/


// This is demo for how to use invoke and contact backend and call rust functions as well as how to get config file
console.log("Learning this execution");
// USe await if you need application to stop and wait for function,  in this case you should use await.
// You should also catch and report all the error this function has errors reporting
let config_struct = invoke("get_config");
console.log(config_struct);


export default function App() {
  return (
    <div className="app-container">
      <div className="main-area-partitioning">
        <div className="Sidebar-area"><Sidebar /></div>
        {/* TOPBAR SHOULD BE INSIDE APP-WINDOW NOT DIRECTOLY INHERITING BELOW  */}
        <div className="app-window">
          <TitleBar />
          {/* For DEBUG PURPOSES I AM HARDCODING ,WILL CHANGE AFTER APPLICATION PAGE IS DONE */}
          <SettingsWindow />
        </div>
      </div>
    </div>
  );
}