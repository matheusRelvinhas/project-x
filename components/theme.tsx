"use client";

import { useEffect } from "react";
import Icon from "@/components/icon";
import { useAppContext } from "@/context/context";
import Ripple from "react-ripplejs";

const Theme = () => {
    const { theme, setTheme } = useAppContext();

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
        <Ripple
            className='flex flex-col transition select-none cursor-pointer items-center justify-center py-1 border-t-1 border-l-1 border-default-400 min-h-[64px] max-h-[64px] min-w-[64px] text-default-900 hover:text-default-1000 hover:bg-glass-effect'
            onClick={toggleTheme}
        >  
                {theme == "light" && <Icon name={"material-symbols:wb-sunny"} className="text-4xl fadeIn" />}
                {theme != "light" && <Icon name={"material-symbols:clear-night"} className="text-4xl fadeIn" />}
        </Ripple>
    );
};

export default Theme;
