import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "./../../../Libreria/libreria.css";
import "./ColorMode.css"; 

export function ColorMode() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button 
      className="color-mode-toggle" 
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle Dark Mode"
    >
      {theme === "light" ? <FaMoon className="icon moon" /> : <FaSun className="icon sun" />}
    </button>
  );
}
