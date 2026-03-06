import Icon from '@/components/icon';
import { useAppContext } from '@/context/context';
import { axiosGet } from '@/utils/axios';
import { toast } from "react-toastify";
import Ripple from 'react-ripplejs';

interface LogoutProps {
    handleNavigation: (href: string) => void;
}

const Logout = ({ handleNavigation }: LogoutProps) => {
    
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
        <Ripple
            className='flex flex-col transition select-none cursor-pointer items-center justify-center py-1 border-t-1 border-l-1 border-default-400 min-h-[64px] max-h-[64px] min-w-[64px] text-default-900 hover:text-default-1000 hover:bg-glass-effect'
            onClick={() => logout()}
        >
            <Icon name="ri:logout-circle-r-line" className="text-3xl fadeIn rounded-full" />
            <span className='font-bold text-[10px]'>Sair</span>
        </Ripple>
    );
};

export default Logout;
