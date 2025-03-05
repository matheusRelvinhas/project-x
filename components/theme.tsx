"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/icon";
import Button from "@/components/button";

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
    <div className='fadeIn fixed bottom-4 z-100 right-4 rounded-full z-100'>
      <Button
          onClick={toggleTheme}
          rounded={false}
          className="flex rounded-full items-center justify-center h-[48px] w-[48px] p-1 bg-default-900 hover:bg-default-1000 text-default-200 hover:text-default-50 transition shadow"
        >
          { theme == "light" && <Icon name={"mdi:weather-sunny"} className="text-3xl fadeIn" /> }
          { theme != "light" && <Icon name={"mdi:weather-night"} className="text-3xl fadeIn" /> }
      </Button>
    </div>
  );
};

export default Theme;
