'use client'

import Icon from '@/components/icon';
import { useState, useEffect } from "react";
import { validateEmail, validatePassword } from "@/utils/formValidation";
import Input from "@/components/input";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { axiosGet } from "@/utils/axios";
import { useAppContext } from "@/context/context";
import LogoButton from './logo-button';

export default function Login() {

    const { setAccessToken } = useAppContext();

    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false);

    const [forgotPassword, setForgotPassword] = useState<boolean>(false);
    const [isRegister, setIsRegister] = useState<boolean>(false);
    const [recoverPassword, setRecoverPassword] = useState<string|null>(null);

    const [email, setEmail] = useState<string>("");
    const [isEmail, setIsEmail] = useState<boolean>(false);

    const [confirmEmail, setConfirmEmail] = useState<string>("");
    const [isConfirmEmail, setIsConfirmEmail] = useState<boolean>(false);

    const [password, setPassword] = useState<string>("");
    const [isPassword, setIsPassword] = useState<boolean>(false);
    const [seePassword, setSeePassword] = useState<boolean>(false);

    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isConfirmPassword, setIsConfirmPassword] = useState<boolean>(false);
    const [seeConfirmPassword, setSeeConfirmPassword] = useState<boolean>(false);

    const [newPassword, setNewPassword] = useState<string>("");
    const [isNewPassword, setIsNewPassword] = useState<boolean>(false);
    const [seeNewPassword, setSeeNewPassword] = useState<boolean>(false);

    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [isConfirmNewPassword, setIsConfirmNewPassword] = useState<boolean>(false);
    const [seeConfirmNewPassword, setSeeConfirmNewPassword] = useState<boolean>(false);

    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

    const socialsLinks = [
        { name_id: 'google', icon: 'flat-color-icons:google', name: 'Google', active: true },
        { name_id: 'instagram', icon: 'skill-icons:instagram', name: 'Instagram', active: false },
        { name_id: 'facebook', icon: 'logos:facebook', name: 'Facebook', active: false },
        { name_id: 'tiktok', icon: 'logos:tiktok-icon', name: 'Tiktok', active: false },
        { name_id: 'twitter', icon: 'ri:twitter-x-line', name: 'Twitter', active: false },
    ];

    useEffect(() => {
        setIsEmail(validateEmail(email));
    }, [email]);

    useEffect(() => {
        setIsConfirmEmail(validateEmail(confirmEmail) && email == confirmEmail);
    }, [confirmEmail]);

    useEffect(() => {
        setIsPassword(validatePassword(password));
    }, [password]);

    useEffect(() => {
        setIsConfirmPassword(validatePassword(confirmPassword) && password == confirmPassword);
    }, [confirmPassword]);

    useEffect(() => {
        setIsNewPassword(validatePassword(newPassword));
    }, [newPassword]);

    useEffect(() => {
        setIsConfirmNewPassword(validatePassword(confirmNewPassword) && newPassword == confirmNewPassword);
    }, [confirmNewPassword]);

    const handleSubmit = (typeLogin:string='default') => {
        toast.dismiss();
        if (typeLogin=='default') {
            let loginForm = 'login';
            if (!isEmail) return toast.error("Email inválido.");
            if (!isPassword) return toast.error("Senha precisa ter no mínimo 8 carácteres, 1 letra e 1 número.");
            if(isRegister) {
                if (!isConfirmPassword) return toast.error("Confirme sua senha, para continuar.");
                if (!acceptTerms) return toast.error("Você precisa aceitar os termos e políticas de privacidade, para continuar.");
                loginForm = 'register';
            }
            axiosGet(`/login?email=${email}&pwd=${password}&login_type=${loginForm}`, (data) => {
                if (data.message == 'user_registered') toast.success('Usuário registrado e logado com sucesso.');
                if (data.message == 'login_success') toast.success('Usuário logado.');
                localStorage.setItem("token_access", data.token);
                setAccessToken(data.token);
            }, (error) => {
                if (error.error == 'invalid_email_password') toast.error('Email ou senha inválidos.');
                if (error.error == 'user_exists') toast.error('Usuário já existe.');
                if (error.error == 'user_not_found') {
                    handleParam ('register=1');
                    toast.error('Usuário não cadastrado, faça registro.');
                }
            });
        } else if (typeLogin=='google') {
            if (isRegister && !acceptTerms) return toast.error("Você precisa aceitar os termos e políticas de privacidade, para continuar.");
            window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login/google`;
        };
    };

    const handleRecoverPassword = () => {
        setLoading(true);
        toast.dismiss();
        if (!isEmail) return toast.error("Email inválido.");
        if (!isConfirmEmail) return toast.error("Confirme seu email.");
        axiosGet(`/login/recover_password?email=${email}`, (data) => {
            if (data.message == 'email_sent') {
                toast.success("Email enviado, verifique seu email.");
            };
            setLoading(false);
            handleParam('');
        }, (error) => {
            if (error.error == 'invalid_email') toast.error('Email inválido.');
            if (error.error == 'error_recover_password') toast.error('Error ao enviar email.');
            setLoading(false);
        });
        
    };

    const handleAttPassword = () => {
        toast.dismiss();
        if (!isNewPassword) return toast.error("Digite um nova senha.");
        if (!isConfirmNewPassword) return toast.error("Confirme sua nova senha.");
        axiosGet(`/login/reset_password?recover_token=${recoverPassword}&new_password=${newPassword}`, (data) => {
            if (data.message == 'password_updated') {
                toast.success("Senha atualizada com sucesso!");
                handleParam('');
            }
        }, (error) => {
            if (error.error == 'token_expired') {
                toast.error('Token expirado, envie novamente email.');
                handleParam('forgot_password=1');
            }
            if (error.error == 'error_reset_password') toast.error('Error ao atualizar senha.');
        });
    };

    const handleParam = (param: string) => {
        const currentUrl = window.location.pathname;
        router.push(`${currentUrl}?${param}`);
    };

    useEffect(() => {
        setForgotPassword(searchParams.get("forgot_password") == "1");
        setIsRegister(searchParams.get("register") == "1"); 
        setRecoverPassword(searchParams.get("recover_token") ? searchParams.get("recover_token") : null);
        const token = searchParams.get("token");
        const loginType = searchParams.get("login_type");
        if (token) {
            localStorage.setItem("token_access", token);
            setAccessToken(token);
            setTimeout(() => {
                if (loginType == 'login') toast.success("Usuário logado.");
                else if (loginType == 'register') toast.success("Usuário registrado.");
            }, 500);
        };
    }, [searchParams]);

    return (
        <div className="flex h-full w-full flex-col justify-between gap-4 items-center fadeIn select-none">
            <div className='flex w-full max-w-md'>
                <LogoButton
                    isExpanded={true}
                    isMobile={false}
                    handleNavigation={(() => {})}
                    isFooter={true}
                />
            </div>
            <div className="flex flex-col min-w-xs max-w-md w-full p-6 bg-default-200 shadow-xl rounded">
                <span className="text-lg font-bold text-default-950">{isRegister ? 'Registrar' : forgotPassword  ? 'Recuperar senha' : recoverPassword ? 'Recuperar senha' : 'Login'}</span>
                <form className="flex gap-3 flex-col mt-4" onSubmit={(e) => {e.preventDefault(); handleSubmit('default')}}>
                    {!recoverPassword && (
                        <div className="flex items-center justify-center gap-2">
                            <Input
                                value={email}
                                onValueChange={(val) => setEmail(val as string)}
                                label="E-mail"
                                typeInput="email"
                                size="lg"
                                endContent={
                                    <div className="flex pr-2 text-xl">
                                        {(!isEmail && email) && <Icon name="mdi:close" className="fadeIn text-red-400" />}
                                        {(isEmail) && <Icon name="mdi:check" className="fadeIn text-green-600" />}
                                    </div>
                                }
                            />
                            <Icon name="mdi:email" className="text-[26px] text-default-950 mt-3" />
                        </div>
                    )}
                    {forgotPassword ? (
                        <div className="fadeIn flex gap-3 flex-col">
                            {(isEmail || confirmEmail) && (
                                <div className="flex items-center justify-center gap-2 fadeIn">
                                    <Input
                                        value={confirmEmail}
                                        onValueChange={(val) => setConfirmEmail(val as string)}
                                        label="Confirme seu e-mail"
                                        typeInput="email"
                                        size="lg"
                                        endContent={
                                            <div className="flex pr-2 text-xl">
                                                {(!isConfirmEmail && confirmEmail) && <Icon name="mdi:close" className="fadeIn text-red-400" />}
                                                {(isConfirmEmail) && <Icon name="mdi:check" className="fadeIn text-green-600" />}
                                            </div>
                                        }
                                    />
                                    <Icon name="mdi:email" className="text-[26px] text-default-950 mt-3" />
                                </div>
                            )}
                            <div className='pt-2'>
                                <Button
                                    typeButton="primary"
                                    onClick={() => handleRecoverPassword()}
                                    isDisabled={!isEmail || !isConfirmEmail || loading}
                                    
                                >
                                    Recuperar senha
                                </Button>
                            </div>
                            <div className="flex">
                                <span onClick={() => handleParam('forgot_password=0')} className="flex cursor-pointer text-sm transition text-primary-600 hover:text-primary-700 font-semibold">
                                    Voltar
                                </span>
                            </div>
                        </div> 
                    ) : recoverPassword ? (
                        <div className="fadeIn flex gap-3 flex-col">
                            <div className="flex items-center justify-center gap-2">
                                <Input
                                    value={newPassword}
                                    onValueChange={(val) => setNewPassword(val as string)}
                                    label="Nova senha"
                                    typeInput={`${seeNewPassword ? 'text' : 'password'}`}
                                    size="lg"
                                    endContent={
                                        <div className="flex pr-2 text-xl">
                                            {(!isNewPassword && newPassword) && <Icon name="mdi:close" className="fadeIn text-red-400" />}
                                            {(isNewPassword) && <Icon name="mdi:check" className="fadeIn text-green-600" />}
                                        </div>
                                    }
                                />
                                <Button
                                    border={false}
                                    rounded={false}
                                    padding='p-0'
                                    className="rounded-full cursor-pointer mt-3 min-w-[24px] max-w-[24px]"
                                    onClick={() => setSeeNewPassword(!seeNewPassword)}
                                >
                                    {seeNewPassword && <Icon name="lsicon:view-filled" className="text-2xl fadeIn text-default-950" />}
                                    {!seeNewPassword && <Icon name="lsicon:view-off-filled" className="text-2xl fadeIn text-default-950" />}
                                </Button>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Input
                                    value={confirmNewPassword}
                                    onValueChange={(val) => setConfirmNewPassword(val as string)}
                                    label="Confirme nova senha"
                                    typeInput={`${seeConfirmNewPassword ? 'text' : 'password'}`}
                                    size="lg"
                                    endContent={
                                        <div className="flex pr-2 text-xl">
                                            {(!isConfirmNewPassword && confirmNewPassword) && <Icon name="mdi:close" className="fadeIn text-red-400" />}
                                            {(isConfirmNewPassword) && <Icon name="mdi:check" className="fadeIn text-green-600" />}
                                        </div>
                                    }
                                />
                                <Button
                                    border={false}
                                    rounded={false}
                                    padding='p-0'
                                    className="rounded-full cursor-pointer mt-3 min-w-[24px] max-w-[24px]"
                                    onClick={() => setSeeConfirmNewPassword(!seeConfirmNewPassword)}
                                >
                                    {seeConfirmNewPassword && <Icon name="lsicon:view-filled" className="text-2xl fadeIn text-default-950" />}
                                    {!seeConfirmNewPassword && <Icon name="lsicon:view-off-filled" className="text-2xl fadeIn text-default-950" />}
                                </Button>
                            </div>
                            <div className='pt-2'>
                                <Button
                                    typeButton="primary"
                                    onClick={() => {handleAttPassword()}}
                                    isSubmit={true}
                                    isDisabled={!isNewPassword || !isConfirmNewPassword}
                                >
                                    {'Atualizar senha'}
                                </Button>
                            </div>
                            <div className="flex">
                                <span onClick={() => handleParam('')} className="flex cursor-pointer text-sm transition text-primary-600 hover:text-primary-700 font-semibold">
                                    Voltar
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="fadeIn flex gap-3 flex-col">
                            <div className="flex items-center justify-center gap-2">
                                <Input
                                    value={password}
                                    onValueChange={(val) => setPassword(val as string)}
                                    label="Senha"
                                    typeInput={`${seePassword ? 'text' : 'password'}`}
                                    size="lg"
                                    endContent={
                                        <div className="flex pr-2 text-xl">
                                            {(!isPassword && password) && <Icon name="mdi:close" className="fadeIn text-red-400" />}
                                            {(isPassword) && <Icon name="mdi:check" className="fadeIn text-green-600" />}
                                        </div>
                                    }
                                />
                                <Button
                                    border={false}
                                    rounded={false}
                                    padding='p-0'
                                    className="rounded-full cursor-pointer mt-3 min-w-[24px] max-w-[24px]"
                                    onClick={() => setSeePassword(!seePassword)}
                                >
                                    {seePassword && <Icon name="lsicon:view-filled" className="text-2xl fadeIn text-default-950" />}
                                    {!seePassword && <Icon name="lsicon:view-off-filled" className="text-2xl fadeIn text-default-950" />}
                                </Button>
                            </div>
                            {((email && isEmail && password && isPassword && isRegister) || (confirmPassword&&isRegister)) && (
                                <div className="flex items-center justify-center gap-2 fadeIn">
                                    <Input
                                        value={confirmPassword}
                                        onValueChange={(val) => setConfirmPassword(val as string)}
                                        label="Confirme sua senha"
                                        typeInput={`${seeConfirmPassword ? 'text' : 'password'}`}
                                        size="lg"
                                        endContent={
                                            <div className="flex pr-2 text-xl">
                                                {(!isConfirmPassword && confirmPassword) && <Icon name="mdi:close" className="fadeIn text-red-400" />}
                                                {(isConfirmPassword) && <Icon name="mdi:check" className="fadeIn text-green-600" />}
                                            </div>
                                        }
                                    />
                                    <Button
                                        border={false}
                                        rounded={false}
                                        className="rounded-full cursor-pointer mt-3 min-w-[24px] max-w-[24px]"
                                        padding='p-0'
                                        onClick={() => setSeeConfirmPassword(!seeConfirmPassword)}
                                    >
                                        {seeConfirmPassword && <Icon name="lsicon:view-filled" className="text-2xl fadeIn text-default-950" />}
                                        {!seeConfirmPassword && <Icon name="lsicon:view-off-filled" className="text-2xl fadeIn text-default-950" />}
                                    </Button>
                                </div>
                            )}
                            {isRegister && <div className="flex items-center gap-3 fadeIn">
                                <Checkbox checked={acceptTerms} onChange={setAcceptTerms} />
                                <div className="text-default-950 text-sm">
                                    <span>Eu concordo com os </span>
                                    <Link className="transition text-primary-600 hover:text-primary-700 font-semibold" href={'/terms'}>
                                        termos
                                    </Link>
                                    <span> e </span>
                                    <Link className="transition text-primary-600 hover:text-primary-700 font-semibold" href={'/terms'}>
                                        políticas de privacidade
                                    </Link>
                                    <span>.</span>
                                </div>
                            </div>}
                            <div className={isRegister ? '' : 'pt-2'}>
                                <Button
                                    typeButton="primary"
                                    onClick={() => {handleSubmit('default')}}
                                    isSubmit={true}
                                    isDisabled={((!isEmail || !isPassword) && !isRegister) || ((!isEmail || !isPassword || !isConfirmPassword || !acceptTerms) &&isRegister)}
                                >
                                    { `${isRegister ? 'Registrar' : 'Entrar'}` }
                                </Button>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <div className="flex w-full border-b border-default-400"></div>
                                <span className="text-default-500 font-medium">OU</span>
                                <div className="flex w-full border-b border-default-400"></div>
                            </div>
                            {socialsLinks.map((social) => (social.active &&
                                <Button
                                    typeButton="default"
                                    onClick={() => handleSubmit(social.name_id)}
                                    key={`${social.name_id}${social.icon}`}
                                    isDisabled={isRegister && !acceptTerms}
                                >
                                    <div className="flex w-full items-center justify-start gap-3">
                                        <Icon name={social.icon} className="w-[100px] text-2xl text-default-950" />
                                        <span className="flex w-full items-center justify-center pr-20">{social.name}</span>
                                    </div>
                                </Button>
                            ))}
                            <div className="flex">
                                <span onClick={() => handleParam('forgot_password=1')} className="flex cursor-pointer text-sm transition text-primary-600 hover:text-primary-700 font-semibold">
                                    Esqueceu a senha?
                                </span>
                            </div>
                            <div className="flex">
                                <span onClick={() => handleParam(`register=${!isRegister ? '1' : '0'}`)} className="flex cursor-pointer text-sm transition text-primary-600 hover:text-primary-700 font-semibold">
                                    {!isRegister ? 'Cadastre-se' : 'Login'}
                                </span>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            <div className="px-3 py-4 text-center text-xs text-default-600">
                {`© ${new Date().getFullYear()} REDONDO — Todos os direitos reservados.`}
            </div>
        </div>
    );
}
