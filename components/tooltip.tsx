import React from "react";

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    position?: "top" | "bottom" | "left" | "right";
};

export default function Tooltip({ text, children, position = "top" }: TooltipProps) {
    const positionClasses = {
        top: "-top-8 left-[50px] -translate-x-1/2",
        bottom: "top-8 left-[50px] -translate-x-1/2",
        left: "left-[-8px] top-[33px] -translate-y-1/2 -translate-x-full",
        right: "right-[-8px] top-[33px] -translate-y-1/2 translate-x-full",
    };

    return (
        <span className="relative group cursor-pointer inline-flex w-[100px] items-center">
            {children}

            <span
                className={`
                    absolute hidden group-hover:flex ${positionClasses[position]}
                    bg-default-900 text-default-50 text-xs px-2 py-1 rounded whitespace-nowrap
                    shadow-lg z-10 transition-opacity duration-200`
                }
            >
                {text}
            </span>
        </span>
    );
};
