"use client";
import { useState, useEffect, use} from "react";
import { set } from "zod";

export function useChangeTheme(){
    const [theme, setTheme] = useState("tomorrow");
      useEffect(() => {
        const checkIsDarkSchemePreferred = () =>
          window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
        const initialTheme = checkIsDarkSchemePreferred() ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", initialTheme);
        setTheme(initialTheme === "dark" ? "twilight" : "tomorrow");

        const updateTheme = () => {
          const theme = document.documentElement.getAttribute("data-theme");
          setTheme(theme === "dark" ? "twilight" : "tomorrow");
        };
    
        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme"],
        });
    
    
        return () => observer.disconnect();
      }, []);
    return theme;

};
export function ThemeToggle() {
  const [isChecked, setIsChecked] = useState(false);
  const theme = useChangeTheme();
  useEffect(() => {
    setIsChecked(theme === "twilight");
  }, [theme]);
  
  return (
    <label className="flex cursor-pointer gap-2" style={{ marginLeft: "1em" }}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <path
      d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
    <input
      type="checkbox"
      checked={isChecked}
      className="toggle theme-controller"
      onChange={(e) => {
        const isdark = e.target.checked;
        setIsChecked(isdark);
        const theme = isdark ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", theme);
      }}
    />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
</label>
  );
}
