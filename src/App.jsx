import { TitleBar } from "./components/Titlebar/titleBar";
// Needed to call rust
import { invoke } from "@tauri-apps/api/core";
import { TopBar } from "./components/Topbar/topbar";


// This is demo for how to use invoke and contact backend and call rust functions as well as how to get config file
console.log("Learning this execution");
// USe await if you need application to stop and wait for function,  in this case you should use await.
// You should also catch and report all the error this function has errors reporting
let config_struct = invoke("get_config");
console.log(config_struct);
export default function App() {
  return (
    <div className="app-container">
      <TitleBar />
      <TopBar />
    </div>
  );
}