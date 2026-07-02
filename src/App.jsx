import { TitleBar } from "./components/Titlebar/titleBar";
// Needed to call rust
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { TopBar } from "./components/Topbar/topbar";
import { Sidebar } from "./components/SideBar/Sidebar";
import { SettingsWindow } from "./components/Windows/SettingsWindow/default";
import './App.css'
import {useDirectoryStore} from './store/useDirectoryStore';   
import {ViewWindow} from "./components/Windows/ViewWindow/default";
/*
  IMP FEATURE REQUEST

    I think we need to use Context or Any other Store what you prefer , to store 2 things 
     CURRENTWINDOW:
     this will store what current window of application is the user on, like ViewWindow or SettingsWindow,
     defualt will be ViewWindow , we may or may not add more later.

     CURRENTDIRECTORY:
     this will store what current directory of application is the user on,
     we will need this for sidebar to work, as well as for ViewWindow.



     TODO for me : FIX the Reset Button
     
*/


// This is demo for how to use invoke and contact backend and call rust functions as well as how to get config file
console.log("Learning this execution");
//DONE
// USe await if you need application to stop and wait for function,  in this case you should use await.
// You should also catch and report all the error this function has errors reporting
// const config_struct = invoke("get_config");
// console.log(config_struct);
  

export default function App() {
  //check store folder in that already declared 3 things current window current dir current path and to change them set function like useState
  const currentWindow = useDirectoryStore(state=>state.currentWindow)
  const setCurrentWindow = useDirectoryStore(state=>state.setCurrentWindow)
  const setCurrentDir = useDirectoryStore(state=>state.setCurrentDir)
  const currentDir = useDirectoryStore(state=>state.currentDir)
  const currentPath = useDirectoryStore(state=>state.currentPath)
  const setCurrentPath = useDirectoryStore(state=>state.setCurrentPath)
  //for every restart it sets initial path to be home  
  useEffect(()=>{
    setCurrentWindow("ViewWindow")
  },[])
  useEffect(() => {
    setCurrentPath('');  
  }, []);//[setCurrentPath] if u want to check for every refresh
  useEffect(() => {
  const loadConfig = async () => {
    async function AppConfig() {

    try {
      //whatif he suddenly closed the app in middle while navigating
      if(currentDir){
        console.log("Directory is already loaded")
      }

      const response = await invoke("get_config");
      console.log("Configuration loaded successfully:", response);
      
      // Save it to our state or Zustand store here
      if(response.initial_directory) {setCurrentDir(response.initial_directory)}
      // setCurrentDirectory(response.initial_directory); 
      
    } catch (err) {
      console.error("Critical: Failed to invoke get_config from backend:", err);
    }
    }; AppConfig()
  };
  loadConfig();
  }, [setCurrentDir,currentDir]);

  console.log('you clicked path',currentPath)

  return (
    <div className="app-container">
      <div className="main-area-partitioning">
        <div className="Sidebar-area"><Sidebar setCurrentPath={setCurrentPath}/></div>
        {/* TOPBAR SHOULD BE INSIDE APP-WINDOW NOT DIRECTOLY INHERITING BELOW  */}
        <div className="app-window">
          <div className="title-bar"><TitleBar /></div>
          {/* For DEBUG PURPOSES I AM HARDCODING ,WILL CHANGE AFTER APPLICATION PAGE IS DONE */}
          <div className="main-body">
            {/* //just for check for switching*/}
            <button onClick={()=>setCurrentWindow(currentWindow=="ViewWindow"?"SettingsWindow":"ViewWindow")}>Window switch</button>
            {/* //added condition for both Windows */}
            {currentWindow=="ViewWindow"&&<ViewWindow/>}
            {currentWindow=="SettingsWindow"&& <SettingsWindow/>}
          </div>
        </div>
      </div>
    </div>
  );
}