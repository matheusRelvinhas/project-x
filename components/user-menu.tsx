'use client';

import Icon from '@/components/icon';
import { useAppContext } from '@/context/context';
import Button from '@/components/button';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface UserMenuProps {
    isMobile: boolean;
    isExpanded: boolean;
    handleNavigation: (href: string) => void;
}

const UserMenu = ({ isMobile, isExpanded, handleNavigation }: UserMenuProps) => {
    const { user } = useAppContext();
    const pathname = usePathname();

    return (
        <Button
            rounded={false}
            border={false}
            className={`flex flex-row transition items-center h-[48px] gap-4 border-b border-default-400 text-default-900 hover:text-default-1000 hover:bg-glass-effect font-medium cursor-pointer transition ${
                (isExpanded || isMobile) ? 'pl-6 px-2 py-3' : 'justify-center px-2 py-3'
            }`}
            onClick={() => handleNavigation(`${user.logged ? '/profile' : '/login'}`)}
        >   
            {(pathname === '/login' || pathname === '/profile') && <div className='absolute fadeIn left-0 flex h-full w-full border-l-4 border-primary-500'>{''}</div>}
            <Icon name="mdi:account-circle" className="text-3xl fadeIn rounded-full" />
            {(isExpanded || isMobile) && (
                <div className="flex fadeIn flex-col justify-center">
                    <p className="font-medium">{user.logged ? (user.name ? user.name : user.email) : 'User'}</p>
                    <p className="text-default-800 text-xs">{`ID: ${user.logged ? user.id : '#'}`}</p>
                </div>
            )}
        </Button>
    );
};

export default UserMenu;
