import { invoke } from "@tauri-apps/api/core"
import { useEffect } from "react"
export function Sidebar() {
  // I dont know what are you trying to do here but lione 9 would use Invoke rather than FetchData to get from homedir
  // useEffect(()=>{
  //   const FetchData = async (name)=>{
  //     const path = await invoke("get_library_path",{name}).then(fn => console.log(fn)).finally(console.log("finisshed"))
  //   }
  //   FetchData("home_dir");
  // },[])
  return (
    <div class="sidebar-container">

      {/* BELOW I HAVE LISTED ALL SIDEBAR LIBRARIES OPTION FOR YOU
       
       home_dir = USer Home
       audio_dir = Music Directory
       desktop_dir = Desktop Directory
       documents_dir = Documents Directory
       downloads_dir = Downloads Directory
       pictures_dir = Pictures Directory
       videos_dir = Videos Directory
       
       
      */}
    </div>
  )
}