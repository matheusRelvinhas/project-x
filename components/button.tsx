"use client";

import React, { ReactNode } from 'react';
import Ripple from 'react-ripplejs';

interface BtnProps {
    onClick: () => void;
    children: ReactNode;
    border?: boolean;
    rounded?: boolean;
    typeButton?: 'primary' | 'default' | null;
    className?: string;
    isDisabled?: boolean;
    isSubmit?: boolean;
};

const Button: React.FC<BtnProps> = ({ onClick, children, border = true, rounded = true, typeButton=null, className = '', isDisabled=false, isSubmit=false }) => {
    const borderClass = border ? 'border-1 border-default-400' : '';
    const roundedClass = rounded ? 'rounded-lg' : '';
    const primaryBtnClass = 'flex items-center justify-center px-4 py-[6px] h-[40px] min-w-[80px] bg-primary-600 text-white hover:bg-primary-700 hover:border-primary-700'
    const defaultBtnClass = 'flex items-center justify-center px-4 py-[6px] h-[40px] min-w-[80px] bg-default-300 text-default-950 hover:bg-glass-effect hover:border-primary-600'
    const disabledBtnClass = 'flex items-center justify-center px-4 py-[6px] h-[40px] min-w-[80px] bg-default-100 text-default-500 hover:border-primary-600'
    const defaultClass = isDisabled ? disabledBtnClass : typeButton=='default' ? defaultBtnClass : typeButton=='primary' ? primaryBtnClass : className ? className : defaultBtnClass;

    return (
        <Ripple
            className={`relative transition cursor-pointer select-none ${borderClass} ${rounded && roundedClass} ${defaultClass}`}
            onClick={onClick}
        >
            {children}
            {isSubmit && <button className='fixed top-0' type={'submit'}></button>}
        </Ripple>
    );
};

export default Button;