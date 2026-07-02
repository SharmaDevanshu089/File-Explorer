import { create } from "zustand";
//zustand state creation,create customstate
export const useDirectoryStore = create(
  set=>({
    currentWindow:"ViewWindow",
    currentDir:"",
    currentPath:'',

    setCurrentWindow:(win)=>set({currentWindow:win}),
    setCurrentDir:(win)=>set({currentDir:win}),
    setCurrentPath:(res)=>set({currentPath:res})
  })
)