import Icon from '@/components/icon';
import { useAppContext } from '@/context/context';
import Button from '@/components/button';
import { usePathname } from 'next/navigation';
import Logout from './logout';
import Theme from './theme';

interface UserMenuProps {
    isMobile: boolean;
    isExpanded: boolean;
    handleNavigation: (href: string) => void;
}

const UserMenu = ({ isMobile, isExpanded, handleNavigation }: UserMenuProps) => {
    const { user } = useAppContext();
    const pathname = usePathname();

    return (
        <div className='flex w-full justify-between'>
            <Button
                rounded={false}
                border={false}
                className={`flex flex-row w-full transition items-center min-h-[64px] max-h-[64px] gap-4 border-t-1 border-default-400 text-default-900 hover:text-default-1000 hover:bg-glass-effect font-medium cursor-pointer transition ${
                    (isExpanded || isMobile) ? 'pl-6 px-2 py-3' : 'justify-center px-2 py-3'
                }`}
                onClick={() => handleNavigation(`${user.logged ? '/' : '/login'}`)}
            >   
                {(pathname === '/login' || pathname === '/profile') && <div className='absolute fadeIn left-0 flex h-full w-full border-l-4 border-primary-600'>{''}</div>}
                <Icon name="mdi:account-circle" className="text-4xl fadeIn rounded-full" />
                {(isExpanded || isMobile) && (
                    <span className="flex fadeIn-menu text-xs font-medium">
                    {user?.logged
                        ? ((user?.name ?? user?.email ?? "User").length > 16
                            ? (user?.name ?? user?.email ?? "User").slice(0, 16) + "..."
                            : (user?.name ?? user?.email ?? "User"))
                        : "User"}
                    </span>
                )}
            </Button>
            {(isExpanded || isMobile) && <Theme />}
            
            {(user.logged && (isExpanded || isMobile)) && <Logout handleNavigation={handleNavigation}/>}
            
        </div>
    );
};

export default UserMenu;
