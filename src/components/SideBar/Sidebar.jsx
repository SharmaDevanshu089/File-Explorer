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
    <div className="sidebar-container">

      {/* BELOW I HAVE LISTED ALL SIDEBAR LIBRARIES OPTION FOR YOU
       
       home_dir = USer Home
       audio_dir = Music Directory
       desktop_dir = Desktop Directory
       documents_dir = Documents Directory
       downloads_dir = Downloads Directory
       pictures_dir = Pictures Directory
       videos_dir = Videos Directory
       
       How the application is gonna work:

       -> USER CLICK ON A OPTION
       -> YOU FETCH THE PATH OF THE RESPECTIVE FOLDER
       -> YOU SIGNAL THE APPLICATION WINDOW TO MOVE TO THAT DIRECTORY
       (HOW WILL YOU DO THAT WITH THE HELP OF MAYBE CHANGING STATE WHICH KEEPS THE PATH, I HAVE PROVIDED ENDPOINT TO YOU) 
      */}
    </div>
  )
}