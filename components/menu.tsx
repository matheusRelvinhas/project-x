'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Icon from '@/components/icon';
import { useAppContext } from '@/context/context';
import Button from '@/components/button';
import UserMenu from '@/components/user-menu';
import Loader from "@/components/loader";
import LogoButton from './logo-button';
import Ripple from 'react-ripplejs';
import Footer from './footer';

interface MenuProps {
    children: ReactNode;
}

const Menu = ({ children }: MenuProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const { isMobile, isOpen, setIsOpen } = useAppContext();
    const [isLoginPage, setIsLoginPage] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    const { user } = useAppContext();

    const menuItems = [
        { name: 'Jogos', href: '/games', navId: '/game', icon: 'simple-icons:counterstrike' },
        { name: 'Campeonatos', href: '/leagues', navId: '/league', icon: 'game-icons:trophy' },
        { name: 'Times', href: '/teams', navId: '/team', icon: 'heroicons:user-group-solid' },
        { name: 'Jogadores', href: '/players', navId: '/player', icon: 'heroicons:user-solid' },
    ];

    const handleNavigation = (href: string) => {
        if (isMobile) setIsOpen(false);
        //if (!isMobile) setIsExpanded(false);
        router.push(href);
    };

    useEffect(() => {
        if (user.logged && pathname === '/login') {
            handleNavigation('/');
        } else if (!user.logged && pathname === '/profile') {
            handleNavigation('/login');
        }
        if(pathname === '/login') setIsLoginPage(true);
        else setIsLoginPage(false);
        if (pathname === '/profile') {
            handleNavigation('/games');
        }

    }, [pathname, user.logged]);

    const menuButton = (
        <div className={`fadeIn fixed flex w-full justify-between min-h-[64px] max-h-[64px] z-100 ${!isOpen ? 'bg-default-100' : 'bg-transparent'}`}>
            <LogoButton isExpanded={isExpanded} isMobile={isMobile} handleNavigation={handleNavigation} />
            <Ripple
                className='flex flex-col transition select-none cursor-pointer items-center justify-center py-1 border-b-1 border-l-1  border-default-400 min-h-[64px] max-h-[64px] min-w-[64px] text-default-900 hover:text-default-1000 hover:bg-glass-effect'
                onClick={() => setIsOpen(!isOpen)}
            >  
                {isOpen && <Icon name="mdi:close" className="text-4xl fadeIn" />}
                {!isOpen && <Icon name="mdi:menu" className="text-4xl fadeIn" />}
            </Ripple>

        </div>
    );

    useEffect(() => {
        if (!isMobile) setIsOpen(true);
        else setIsOpen(false);
    }, [isMobile]);

    useEffect(() => {
        const body = document.body;
        if (isOpen && isMobile) body.classList.add("modal-open");
        else body.classList.remove("modal-open");
        return () => {
            body.classList.remove("modal-open");
        };
    }, [isOpen, isMobile]);

    return (
        <div className="flex flex-col w-full h-full">
            {!isLoginPage && isMobile && menuButton}

            {!isLoginPage && isOpen && (
                <div
                    onMouseEnter={() => !isMobile && setIsExpanded(true)}
                    onMouseLeave={() => !isMobile && setIsExpanded(false)}
                    className={`fixed fadeIn glass overflow-x-hidden overflow-y-hidden transition-all duration-300 border-e border-default-400 h-full z-90 flex flex-col ${
                        !isMobile ? (isExpanded ? 'w-[320px]' : 'w-[88px]') : 'w-full'
                    }`}
                >   
                    <div className={`${isMobile ? 'opacity-0' : 'opacity-100'}`}>
                        <LogoButton isExpanded={isExpanded} isMobile={isMobile} handleNavigation={handleNavigation} />
                    </div>
                    <div className='flex flex-col h-full overflow-x-hidden overflow-y-auto'>
                        {menuItems.map((item) => (
                            <Button
                                key={item.name}
                                rounded={false}
                                border={false}
                                className={`flex flex-row transition items-center min-h-[64px] max-h-[64px] gap-4 border-b border-default-400 text-default-900 hover:text-default-1000 hover:bg-glass-effect font-medium cursor-pointer transition ${(isExpanded || isMobile) ? 'pl-6 px-2 py-3' : 'justify-center px-2 py-3'}`}
                                onClick={() => handleNavigation(item.href)}
                            >
                                {pathname.startsWith(item.navId) && <div className='absolute fadeIn left-0 flex h-full w-full border-l-4 border-primary-600'>{''}</div>}
                                <Icon name={item.icon} className="text-3xl min-w-[30px]" />
                                {(isExpanded || isMobile) && <span className='fadeIn-menu truncate'>{item.name}</span>}
                            </Button>
                        ))}
                    </div>
                    <UserMenu isExpanded={isExpanded} isMobile={isMobile} handleNavigation={handleNavigation} />
                </div>
            )}

            <div
                className={`flex transition h-full ${isLoginPage ? ''
                    : isMobile ? 'w-full'
                    : isOpen ? isExpanded ? 'ml-[320px] w-[calc(100%-320px)]' 
                    : 'ml-[88px] w-[calc(100%-88px)]'
                    : 'w-full'
                    }`
                }
            >
                <Loader />
                <div className='flex w-full flex-col flex-1'>
                    <div className={`flex w-full h-full mx-auto container ${isMobile ? 'pt-20 pb-4 px-4' : 'px-6 py-8'}`}>
                        {children}
                    </div>
                    {!isLoginPage && <Footer handleNavigation={handleNavigation} />}
                </div>
            </div>
        </div>
    );
};

export default Menu;
