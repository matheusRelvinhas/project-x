import Icon from '@/components/icon';
import { useAppContext } from '@/context/context';
import Button from '@/components/button';
import { axiosGet } from '@/utils/axios';
import { toast } from "react-toastify";

interface LogoutProps {
    isMobile: boolean;
    isExpanded: boolean;
    handleNavigation: (href: string) => void;
}

const Logout = ({ isMobile, isExpanded, handleNavigation }: LogoutProps) => {
    
    const { setAccessToken } = useAppContext();

    const logout = () => {
        axiosGet(`/login/logout`, (data) => {
            if(data.message == 'logout_success') {
                localStorage.setItem("token_access", 'not_user');
                setAccessToken('not_user');
                handleNavigation('/');
                toast.error('Usuário deslogado');
            }
        }, () => {}, true);
    };

    return (
        <Button
            rounded={false}
            border={false}
            className={`flex fadeIn flex-row transition items-center h-[48px] gap-4 border-t border-default-400 text-default-900 hover:text-default-1000 hover:bg-glass-effect font-medium cursor-pointer transition ${
                (isExpanded || isMobile) ? 'pl-6 px-2 py-3' : 'justify-center px-2 py-3'
            }`}
            onClick={() => logout()}
        >   
            <Icon name="ri:logout-circle-r-line" className="text-3xl fadeIn rounded-full" />
            {(isExpanded || isMobile) && <span className='fadeIn'>Sair</span>}
        </Button>
    );
};

export default Logout;
