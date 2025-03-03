'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import { useAppContext } from '@/context/context';

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isMobile } = useAppContext();
    const router = useRouter();

    const menuItems = [
        { name: 'Home', href: '/', icon: 'mdi:home' },
        { name: 'Login', href: '/login', icon: 'mdi:user' },
    ];

    const handleNavigation = (href: string) => {
        setIsOpen(false);
        router.push(href);
    };

    const menuButton = (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`fadeIn p-2 flex items-center justify-center h-[44px] w-[44px] bg-default-900 text-default-200 rounded-md fixed top-4 right-4 z-100`}
        >   
            {isOpen &&<Icon name="mdi:close" className="text-3xl fadeIn" />}
            {!isOpen &&<Icon name="mdi:menu" className="text-3xl fadeIn" />}
        </button>
    )

    return (
        <div>
            {menuButton}
            {isOpen && (
                <div className={`flex flex-col fixed glass transition border-e border-default-400 h-full z-90 fadeIn ${!isMobile ? 'w-[320px]' : 'w-full'}`}>
                        {menuItems.map((item) => (
                            <div
                                key={item.name}
                                className="flex px-2 py-2 items-center gap-4 border-b border-default-400 text-default-900 font-medium cursor-pointer transition hover:bg-default-200"
                                onClick={() => handleNavigation(item.href)}
                            >
                                <Icon name={item.icon} className="text-2xl" />
                                <span>{item.name}</span>
                            </div>
                        ))}
                    
                </div>
            )}
        </div>
    );
};

export default Menu;
