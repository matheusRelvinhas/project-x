'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Icon from '@/components/icon';
import { useAppContext } from '@/context/context';
import Button from '@/components/button';
import UserMenu from '@/components/user-menu';
import Logout from './logout';

interface MenuProps {
    children: ReactNode;
}

const Menu = ({ children }: MenuProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const { isMobile } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    const { user } = useAppContext();

    const menuItems = [
        { name: 'Players', href: '/players', icon: 'heroicons:user-solid' },
        { name: 'Teams', href: '/teams', icon: 'heroicons:user-group-solid' },
        { name: 'Ligas', href: '/leagues', icon: 'game-icons:trophy' },
        { name: 'Home', href: '/', icon: 'mdi:hand-heart' }
    ];

    const handleNavigation = (href: string) => {
        if (isMobile) setIsOpen(false);
        if (!isMobile) setIsExpanded(false);
        router.push(href);
    };

    useEffect(() => {
        if (user.logged && pathname === '/login') {
            handleNavigation('/profile');
        } else if (!user.logged && pathname === '/profile') {
            handleNavigation('/login');
        }
    }, [pathname, user.logged, handleNavigation]);

    const menuButton = (
        <div className='fadeIn fixed top-4 right-4 z-100'>
            <Button
                border={false}
                rounded={true}
                onClick={() => setIsOpen(!isOpen)}
                className="transition p-1 flex items-center justify-center h-[44px] w-[44px] bg-default-900 hover:bg-default-1000 text-default-200 hover:text-default-50 shadow"
            >
                {isOpen && <Icon name="mdi:close" className="text-3xl fadeIn" />}
                {!isOpen && <Icon name="mdi:menu" className="text-3xl fadeIn" />}
            </Button>
        </div>
    );

    const expandButton = (
        <Button
            onClick={!isMobile ? () => setIsExpanded(!isExpanded) : ()=>{}}
            border={false}
            rounded={false}
            className="flex transition items-center justify-between w-full h-[48px] pl-3 pe-1 border-b border-default-400 text-default-900 hover:text-default-1000 hover:bg-glass-effect font-medium"
        >   
            <img src="/img/logo.png" className={`flex transition ${isMobile ? 'w-[120px]' : isExpanded ? 'w-[120px]' : 'w-[0px]'}`} alt="logo" /> 
            {!isMobile && <Icon
                name="material-symbols:arrow-back-ios-new"
                className={`text-2xl h-[48px] transition-transform ${isExpanded && 'rotate-180'}`}
            />}
        </Button>
    );

    useEffect(() => {
        if (!isMobile) setIsOpen(true);
        else setIsOpen(false);
    }, [isMobile]);

    return (
        <div className="flex w-full h-full">
            {isMobile && menuButton}

            {isOpen && (
                <div
                    className={`fixed fadeIn glass overflow-x-hidden transition border-e border-default-400 h-full z-90 fadeIn flex flex-col ${!isMobile ? (isExpanded ? 'w-[320px]' : 'w-[88px]') : 'w-full'}`}
                >
                    {expandButton}

                    <UserMenu isExpanded={isExpanded} isMobile={isMobile} handleNavigation={handleNavigation} />
                    <div className='flex flex-col h-full overflow-x-hidden overflow-y-auto'>
                        {menuItems.map((item) => (
                            <Button
                                key={item.name}
                                rounded={false}
                                border={false}
                                className={`flex flex-row transition items-center h-[48px] gap-4 border-b border-default-400 text-default-900 hover:text-default-1000 hover:bg-glass-effect font-medium cursor-pointer transition ${(isExpanded || isMobile) ? 'pl-6 px-2 py-3' : 'justify-center px-2 py-3'}`}
                                onClick={() => handleNavigation(item.href)}
                            >
                                {pathname == item.href && <div className='absolute fadeIn left-0 flex h-full w-full border-l-4 border-primary-500'>{''}</div>}
                                <Icon name={item.icon} className="text-3xl" />
                                {(isExpanded || isMobile) && <span className='fadeIn'>{item.name}</span>}
                            </Button>
                        ))}
                    </div>
                    {user.logged && <Logout isExpanded={isExpanded} isMobile={isMobile} handleNavigation={handleNavigation}/>}
                </div>
            )}

            <div
                className={`flex transition h-full ${isMobile
                    ? 'w-full'
                    : isOpen
                        ? isExpanded
                            ? 'ml-[320px] w-[calc(100%-320px)]'
                            : 'ml-[88px] w-[calc(100%-88px)]'
                        : 'w-full'
                    }`}
            >
                <div className={`flex w-full h-full ${isMobile ? 'pt-12 pb-4 px-4' : 'px-6 py-8'}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Menu;
