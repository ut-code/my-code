"use client";
import { useState, useEffect } from "react";

export function ChangeTheme(){
    const [theme, setTheme] = useState("tomorrow");
      useEffect(() => {
        const updateTheme = () => {
          const theme = document.documentElement.getAttribute("data-theme");
          setTheme(theme === "dark" ? "twilight" : "tomorrow");
        };
    
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme"],
        });
    
        updateTheme(); // 初回実行
    
        return () => observer.disconnect();
      }, []);
    return theme;

};
export function ThemeToggle() {
  return (
    <input
      type="checkbox"
      className="toggle theme-controller"
      style={{ marginLeft: "1em" }}
      onChange={(e) => {
        const isDark = e.target.checked;
        const theme = isDark ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
      }}
    />
  );
}
