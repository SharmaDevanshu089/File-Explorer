// create a simple default window export
import { useDirectoryStore } from "../../../store/useDirectoryStore";
export function ViewWindow() {
    //currentpath and currentDir values will come directly from home page (benefit of zustand)
    const currentDir = useDirectoryStore(state=>state.currentDir)
    const currentPath = useDirectoryStore(state=>state.currentPath)
    return (
        <div className="view-window">
            <h2>View Window</h2>
            <p>current Path:{currentDir==''?null:currentDir}{currentPath==''?null:currentPath}</p>   //i just found out this works i can't explain but ya it is short for condition
            <p>This is the default content area for viewing files.</p>
        </div>
    );  
}

export default ViewWindow;