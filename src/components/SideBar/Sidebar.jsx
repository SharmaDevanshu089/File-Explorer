import { invoke } from "@tauri-apps/api/core"
import { useEffect } from "react"
export function Sidebar(){
  useEffect(()=>{
    const FetchData = async (name)=>{
      const path = await invoke("get_library_path",{name}).then(fn => console.log(fn)).finally(console.log("finisshed"))
    }
    FetchData("home_dir");
  },[])
 return(
  <div>
 
  </div>
 )
}