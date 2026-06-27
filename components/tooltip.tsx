'use client';

import { useState, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps {
    message: string;
    children?: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delayDuration?: number;
}

export default function Tooltip({ 
    message, 
    children, 
    position = 'top',
    delayDuration = 200
}: TooltipProps) {
    const [isOpenMobile, setIsOpenMobile] = useState(false);

    const sideMap = {
        top: 'top' as const,
        bottom: 'bottom' as const,
        left: 'left' as const,
        right: 'right' as const,
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpenMobile(!isOpenMobile);
    };

    return (
        <TooltipPrimitive.Provider>
            <TooltipPrimitive.Root delayDuration={delayDuration} open={isOpenMobile} onOpenChange={setIsOpenMobile}>
                <TooltipPrimitive.Trigger 
                    asChild
                    onTouchStart={handleTouchStart}
                >
                    <span className="cursor-pointer inline-flex items-center z-10 relative">
                        {children || <span className="text-default-600 font-bold text-sm">ⓘ</span>}
                    </span>
                </TooltipPrimitive.Trigger>

                <TooltipPrimitive.Content
                    side={sideMap[position]}
                    sideOffset={8}
                    className="z-[100] px-3 py-2 text-xs text-default-100 bg-default-900 rounded-md shadow-lg whitespace-nowrap animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 pointer-events-none"
                >
                    {message}
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
