"use client";

import React, { useRef } from "react";
import Ripple from "react-ripplejs";

interface InputProps {
    border?: boolean;
    rounded?: boolean;
    className?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    label?: string;
    value: string;
    onValueChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
    border = true,
    rounded = true,
    className = "",
    startContent,
    endContent,
    label = "Digite algo...",
    value,
    onValueChange,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onValueChange) {
            onValueChange(event.target.value);
        }
    };

    const borderClass = border ? "border border-default-400" : "";
    const roundedClass = rounded ? "rounded-lg" : "";
    const defaultClass = "relative py-2 text-default-900 hover:text-default-1000 bg-default-100 hover:bg-default-200 flex items-center justify-center h-[44px] min-w-[240px] select-none transition cursor-text";

    return (
        <Ripple
            className={`${borderClass} ${roundedClass} ${defaultClass} ${className}`}
            onClick={handleClick}
        >
            {startContent && <div className="pl-1">{startContent}</div>}
            <div className="relative w-full">
                <label className={`absolute top-1/2 h-full transform -translate-y-1/2 text-default-600 transition-all duration-300 ${value ? "top-[2] left-0 text-xs text-default-800" : "text-base left-4"}`}>
                    {label}
                </label>
                <input
                    ref={inputRef}
                    className="px-1 w-full bg-transparent outline-none text-base"
                    value={value}
                    onChange={handleChange}
                    type="text"
                />
            </div>
            {endContent && <div className="pr-1">{endContent}</div>}
        </Ripple>
    );
};

export default Input;
