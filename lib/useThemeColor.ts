import { useEffect, useState } from "react";
import { applyColorTheme, hexToOklch } from "./colorTheme";

/**
 * Hook to manage theme color changes
 */
export function useThemeColor() {
  const [color, setColor] = useState<string>("#0ea5e9"); // default cyan

  const updateTheme = (newColor: string) => {
    const oklch = hexToOklch(newColor);
    if (oklch) {
      setColor(newColor);
      applyColorTheme(newColor);
      // Optionally persist to localStorage
      localStorage.setItem("themeColor", newColor);
    }
  };

  // Load saved color on mount
  useEffect(() => {
    const saved = localStorage.getItem("themeColor");
    if (saved) {
      updateTheme(saved);
    } else {
      // Apply default on first load
      applyColorTheme(color);
    }
  }, []);

  return { color, updateTheme };
}
