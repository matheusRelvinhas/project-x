"use client";

import React, { useRef, useState } from "react";
import { useAppContext } from '@/context/context';

interface InputProps {
    border?: boolean;
    rounded?: boolean;
    className?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    typeInput?: string | 'number';
    min?: number | undefined;
    max?: number | undefined;
    value: string | number | null | any;
    onValueChange?: (value: string | number | null | any) => void;
}

const Input: React.FC<InputProps> = ({
    border = true,
    rounded = true,
    className = "",
    startContent,
    endContent,
    label = "Digite aqui...",
    size = 'md',
    typeInput = 'text',
    min = undefined,
    max = undefined,
    value,
    onValueChange,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { isMobile } = useAppContext();
    const [isFocused, setIsFocused] = useState(false);

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

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const borderClass = border ? `border ${isFocused ? "border-primary-600" : "border-default-400"}` : "";
    const roundedClass = rounded ? "rounded-lg" : "";
    const sizeClass = size === 'md' ? `min-w-[240px] ${isMobile}` : size === 'sm' ? 'w-[72px]' : size === 'lg' && 'w-full';
    const defaultClass = `relative py-2 text-default-900 hover:text-default-1000 bg-default-100 hover:bg-default-200 hover:border-primary-600 flex items-center justify-center h-[44px] select-none transition cursor-text ${sizeClass}`;

    return (
        <div
            className={`${borderClass} ${roundedClass} ${defaultClass} ${className} flex gap-1 mt-4`}
            onClick={handleClick}
        >
            {startContent && <div className="pl-1">{startContent}</div>}
            <div className="relative w-full">
                <label className={`absolute cursor-text h-full transform -translate-y-[20px] text-default-600 transition-all duration-300 text-sm ${typeInput !== 'number' && 'left-[20px]'} ${value ? "top-[-13px] text-default-950" : `top-[21px]`}`}>
                    {label}
                </label>
                <input
                    ref={inputRef}
                    className={`w-full bg-transparent outline-none text-base no-spinner ${((!startContent || !endContent) && typeInput !== 'number') && 'px-3'}`}
                    value={!value ? '' : value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    min={min}
                    max={max}
                    type={typeInput}
                    autoComplete={typeInput}
                    style={{ MozAppearance: "textfield" }}
                />
            </div>
            {endContent && <div className="pr-1">{endContent}</div>}
        </div>
    );
};

export default Input;
