import { useEffect } from "react";

export function useKeyShortcut({ selectedItem, actions }) {
  useEffect(() => {
    const handleKeyPresses = (e) => {
      const key = e.key.toLowerCase();

      if (e.ctrlKey && key === "n") {
        e.preventDefault();
        actions.onNew?.();
      }
      if (e.ctrlKey && key === "v") {
        e.preventDefault();
        actions.onPaste?.();
      }
      if (!selectedItem) return;
      if (e.ctrlKey && key === "c") {
        e.preventDefault();
        actions.onCopy?.(selectedItem);
        return;
      }
      if (e.ctrlKey && key === "x") {
        e.preventDefault();
        actions.onCut?.(selectedItem);
        return;
      }
      if (key === "enter") {
        actions.onEnter?.(selectedItem);
        return;
      }
      if (key === "delete") {
        actions.onDelete?.(selectedItem);
        return;
      }
    };
    window.addEventListener("keydown", handleKeyPresses);
    return () => window.removeEventListener("keydown", handleKeyPresses);
  }, [selectedItem, actions]);
}
