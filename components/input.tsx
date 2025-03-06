"use client";

import React, { useRef } from "react";
import Ripple from "react-ripplejs";
import { useAppContext } from '@/context/context';

interface InputProps {
    border?: boolean;
    rounded?: boolean;
    className?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
    typeInput?: 'text' | 'number';
    min?: number | undefined;
    max?: number | undefined;
    value: string|number|null|any;
    onValueChange?: (value: string|number|null|any) => void;
}

const Input: React.FC<InputProps> = ({
    border = true,
    rounded = true,
    className = "",
    startContent,
    endContent,
    label = "Digite aqui...",
    size='md',
    typeInput='text',
    min=undefined,
    max=undefined,
    value,
    onValueChange,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { isMobile } = useAppContext();

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
    const sizeClass = size=='md' ? `min-w-[240px] ${isMobile}` : size=='sm' ? 'w-[72px]' : size == 'lg' && 'w-full';
    const defaultClass = `relative py-2 text-default-900 hover:text-default-1000 bg-default-100 hover:bg-default-200 hover:border-primary-600 flex items-center justify-center h-[44px] select-none transition cursor-text ${sizeClass}`;

    return (
        <Ripple
            className={`${borderClass} ${roundedClass} ${defaultClass} ${className}`}
            onClick={handleClick}
        >
            {startContent && <div className="pl-1">{startContent}</div>}
            <div className="relative w-full">
                <label className={`absolute top-1/2 h-full transform -translate-y-6/13 text-default-600 transition-all duration-300 ${value ? "top-[0] left-0 text-xs text-default-800" : "text-sm left-1"}`}>
                    {label}
                </label>
                <input
                    ref={inputRef}
                    className="px-1 w-full bg-transparent outline-none text-base no-spinner"
                    value={!value ? '' : value}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    type={typeInput}
                    style={{ MozAppearance: "textfield" }}
                />
            </div>
            {endContent && <div className="pr-1">{endContent}</div>}
        </Ripple>
    );
};

export default Input;
