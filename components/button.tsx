"use client";

import React, { ReactNode } from 'react';
import Ripple from 'react-ripplejs';

interface BtnProps {
    onClick: () => void;
    children: ReactNode;
    border?: boolean;
    rounded?: boolean;
    className?: string;
}

const Button: React.FC<BtnProps> = ({ onClick, children, border = true, rounded = true, className = '' }) => {
    const borderClass = border ? 'border-1 border-default-400' : '';
    const roundedClass = rounded ? 'rounded-lg' : '';
    const defaultClass = className ? className : 'flex items-center justify-center px-4 py-[6px] h-[40px] min-w-[80px] bg-primary-600 text-white hover:bg-primary-700 hover:border-primary-700'

    return (
        <Ripple
            className={`transition cursor-pointer select-none ${borderClass} ${rounded && roundedClass} ${defaultClass}`}
            onClick={onClick}
        >
            {children}
        </Ripple>
    );
};

export default Button;