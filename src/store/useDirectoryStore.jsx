import { create } from "zustand";
//zustand state creation,create customstate
export const useDirectoryStore = create(
  set=>({
    currentWindow:"ViewWindow",
    currentDir:"",
    currentPath:'',
    searchQuery:'',
    filteredQuery:[],

    setCurrentWindow:(win)=>set({currentWindow:win}),
    setSearchQuery:(win)=>set({searchQuery:win}),
    setCurrentDir:(win)=>set({currentDir:win}),
    setCurrentPath:(res)=>set({currentPath:res}),
    setFilteredQuery:(res)=>set({filteredQuery:res})
  })
)