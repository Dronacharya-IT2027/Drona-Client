import { useEffect, useState } from "react";

export default function DisableInspect({ children }) {
  const isProduction = import.meta.env.MODE === "production";
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  useEffect(() => {
    if (!isProduction) return;

    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();

    // Disable keys
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Disable copy/paste/cut
    const handleCopyPaste = (e) => e.preventDefault();

    // Disable text selection
    const disableSelection = () => false;

    // Disable drag
    const disableDrag = (e) => e.preventDefault();

    // Detect DevTools (smart technique)
    const devToolsDetector = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    }, 500);

    // Add listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("dragstart", disableDrag);
    document.onselectstart = disableSelection;

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("dragstart", disableDrag);
      document.onselectstart = null;
      clearInterval(devToolsDetector);
    };
  }, [isProduction]);

  useEffect(() => {
    if (!isProduction) return;

    if (devToolsOpen) {
      // Option 1: Blur screen
      document.body.style.filter = "blur(6px)";

      // Option 2: Auto redirect (enable if you want)
      window.location.href = "https://google.com";

    } else {
      document.body.style.filter = "none";
    }
  }, [devToolsOpen, isProduction]);

  return children;
}
