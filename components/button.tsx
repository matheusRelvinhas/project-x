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

const Button: React.FC<BtnProps> = ({ onClick, children, border = false, rounded = true, className = '' }) => {
    const borderClass = border ? 'border-1 border-default-400' : '';
    const roundedClass = rounded ? 'rounded-lg' : '';
    const defaultClass = className ? className : ''

    return (
        <Ripple
            className={`transition ${borderClass} ${rounded && roundedClass} ${defaultClass}`}
            onClick={onClick}
        >
            {children}
        </Ripple>
    );
};

export default Button;