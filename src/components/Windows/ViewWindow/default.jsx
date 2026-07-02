// create a simple default window export
import { useDirectoryStore } from "../../../store/useDirectoryStore";
import './default.css'
export function ViewWindow() {
    //currentpath and currentDir values will come directly from home page (benefit of zustand)
    const currentDir = useDirectoryStore(state=>state.currentDir)
    const currentPath = useDirectoryStore(state=>state.currentPath)
    return (
        <div className="view-window">
            <p className="File-path">{currentDir==''?null:currentDir}{currentPath==''?null:currentPath}</p>
               {/* //i just found out this works i can't explain but ya it is short for condition */}
{/* other files will come later */}
            
        </div>
    );  
}

export default ViewWindow;