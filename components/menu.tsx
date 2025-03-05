'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import { useAppContext } from '@/context/context';
import Button from '@/components/button';

// Adicionando a tipagem das props
interface MenuProps {
  children: ReactNode;
}

const Menu = ({ children }: MenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { isMobile } = useAppContext();
  const router = useRouter();

  const menuItems = [
    { name: 'Home', href: '/', icon: 'mdi:home' },
    { name: 'Login', href: '/login', icon: 'mdi:user' },
  ];

  const handleNavigation = (href: string) => {
    if (isMobile) setIsOpen(false);
    router.push(href);
  };

  const menuButton = (
    <div className='fadeIn fixed top-4 right-4 z-100'>
        <Button
            onClick={() => setIsOpen(!isOpen)}
            className="transition p-1 flex items-center justify-center h-[44px] w-[44px] bg-default-900 hover:bg-default-1000 text-default-200 hover:text-default-50 shadow"
        >
            {isOpen && <Icon name="mdi:close" className="text-3xl fadeIn" /> } 
            {!isOpen && <Icon name="mdi:menu" className="text-3xl fadeIn" />}
        </Button>
    </div>
  );

  useEffect(() => {
    if (!isMobile) setIsOpen(true); 
    else setIsOpen(false); 
  }, [isMobile])

  return (
    <div className="flex">
      {isMobile && menuButton}

      {isOpen && (
        <div
          className={`fixed glass transition border-e border-default-400 h-full z-90 fadeIn ${
            !isMobile ? 'w-[320px]' : 'w-full'
          }`}
        >
          {menuItems.map((item) => (
            <Button
              key={item.name}
              rounded={false}
              className="flex flex-row pl-6 px-2 py-3 items-center gap-4 border-b border-default-400 text-default-900 hover:text-default-1000 hover:bg-glass-effect font-medium cursor-pointer transition"
              onClick={() => handleNavigation(item.href)}
            >
              <Icon name={item.icon} className="text-2xl" />
              <span>{item.name}</span>
            </Button>
          ))}
        </div>
      )}

      <div
        className={`transition ${isMobile ? 'px-4 pt-6' : 'px-6 pt-8'} ${
          isMobile ? 'w-full' : isOpen ? 'ml-[320px] w-[calc(100%-320px)]' : 'w-full'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Menu;
