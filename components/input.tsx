import React, { useRef, useState } from "react";
import { useAppContext } from '@/context/context';

interface InputProps {
    border?: boolean;
    rounded?: boolean;
    className?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    label?: string;
    placeholder?: string;
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
    label,
    placeholder = "Digite aqui...",
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
    const sizeClass = size === 'md' ? `w-[240px] ${isMobile}` : size === 'sm' ? 'w-[72px]' : size === 'lg' && 'w-full';
    const defaultClass = `relative text-default-900 hover:text-default-1000 bg-default-100 hover:bg-default-200 hover:border-primary-600 flex items-center justify-center min-h-[38px] select-none transition cursor-text ${sizeClass}`;

    return (
        <div
            className={`${borderClass} ${roundedClass} ${defaultClass} ${className} flex gap-1 ${label && 'mt-[14px]'}`}
            onClick={handleClick}
        >
            {startContent && <div className="pl-2">{startContent}</div>}
            <div className="relative w-full">
                {label && 
                    <label className={`absolute cursor-text h-full transform -translate-y-[20px] text-default-600 transition-all duration-300 text-sm ${typeInput !== 'number' && 'left-[20px]'} ${value ? "top-[-10px] text-default-950" : `top-[21px]`}`}>
                        {label}
                    </label>
                }
                <input
                    ref={inputRef}
                    className={`w-full bg-transparent outline-none text-sm no-spinner ${value && 'mb-[3px]'} ${startContent ? 'px-1' : endContent ? 'pl-2' : typeInput == 'number' ? 'px-0' : 'px-2'}`}
                    value={!value ? '' : value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    min={min}
                    max={max}
                    type={typeInput}
                    autoComplete={typeInput}
                    style={{ MozAppearance: "textfield" }}
                    placeholder={!label ? placeholder: ''}
                />
            </div>
            {endContent && <div className="pr-2">{endContent}</div>}
        </div>
    );
};

export default Input;
