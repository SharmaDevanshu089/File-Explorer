import { TitleBar } from "./components/Titlebar/titleBar";
// Needed to call rust
import { invoke } from "@tauri-apps/api/core";


// This is demo for how to use invoke and contact backend and call rust functions as well as how to get config file
console.log("Learning this execution");
let config_struct = invoke("get_config");
console.log(config_struct);
export default function App() {
  return <TitleBar />;
}