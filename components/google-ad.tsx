'use client';

import { useEffect, useRef } from 'react';

interface GoogleAdProps {
    adSlot: string;
    adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
    fullWidthResponsive?: boolean;
    className?: string;
}

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
    adSlot,
    adFormat = 'auto',
    fullWidthResponsive = true,
    className = '',
}) => {
    const adRef = useRef<HTMLModElement>(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error('AdSense error:', e);
        }
    }, []);

    return (
        <div className={`w-full bg-default-100 border border-default-200 rounded overflow-hidden ${className}`}>
            <div className="flex items-center justify-center px-2 py-0.5 bg-default-200">
                <span className="text-default-600 text-[10px]">Publicidade</span>
            </div>
            <ins
                ref={adRef}
                className="adsbygoogle block"
                data-ad-client="ca-pub-5377852341726601"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
            />
        </div>
    );
};

export default GoogleAd;