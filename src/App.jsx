import { TitleBar } from "./components/Titlebar/titleBar";
// Needed to call rust
import { invoke } from "@tauri-apps/api/core";
import { TopBar } from "./components/Topbar/topbar";
import { Sidebar } from "./components/SideBar/Sidebar";
import './App.css'
import { useEffect, useState } from "react";

// This is demo for how to use invoke and contact backend and call rust functions as well as how to get config file
console.log("Learning this execution");
// USe await if you need application to stop and wait for function,  in this case you should use await.
// You should also catch and report all the error this function has errors reporting
export default function App() {
  const [currentPath,setCurrentPath]=useState('')
  const [initialDir,setInitialDir] = useState("")
  const [completePath,setCompletePath] = useState('')
  useEffect(
    ()=>{
 const fetchTheDir = async()=>{
  try{
    const response = await invoke("get_config")
    if(response.initial_directory){setInitialDir(response.initial_directory)} 
  }catch(err){
    console.log("Some error on backend that is failed to load config or read yourself:  :",err)
  }
 };fetchTheDir()
    },[]
  )
  // dont change this useEFfect else it will create infinite renders
  useEffect(() => {
    setCompletePath(`${initialDir}${currentPath}`); 
    console.log(completePath);
  }, [initialDir, currentPath]);
  return (
    <div className="app-container">
      <div className="main-area-partitioning">
        <div className="Sidebar-area"><Sidebar setCurrentPath={setCurrentPath}/></div>
        <div className="Topbar-area"><TitleBar /></div>
      </div>
    </div>
  );
}