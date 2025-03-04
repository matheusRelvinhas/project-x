"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/icon";

const Theme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed flex items-center justify-center h-[48px] w-[48px] bottom-4 z-100 right-4 p-3 bg-default-900 text-default-200 rounded-full shadow-md transition duration-300"
    >
      {theme == "light" && 
        <Icon name={"mdi:weather-sunny"} className="text-2xl fadeIn" />
      }
      {theme != "light" && 
        <Icon name={"mdi:weather-night"} className="text-2xl fadeIn" />
      }

    </button>
  );
};

export default Theme;
