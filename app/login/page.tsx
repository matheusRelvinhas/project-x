'use client';

import { signIn } from "next-auth/react";
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

export default function LoginPage() {

    const { setAccessToken } = useAppContext();

    const router = useRouter();
    const searchParams = useSearchParams();
    const [forgotPassword, setForgotPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);

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

    const [acceptTerms, setAcceptTerms] = useState<boolean>(false);


    const [loading, setLoading] = useState(false);

    const socialsLinks = [
        { name_id: 'google', icon: 'flat-color-icons:google', name: 'Google' },
        { name_id: 'instagram', icon: 'skill-icons:instagram', name: 'Instagram' },
        { name_id: 'facebook', icon: 'logos:facebook', name: 'Facebook' },
        { name_id: 'tiktok', icon: 'logos:tiktok-icon', name: 'Tiktok' },
        { name_id: 'twitter', icon: 'ri:twitter-x-line', name: 'Twitter' },
    ]

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
        } else {
            if(isRegister) {
                if (!acceptTerms) return toast.error("Você precisa aceitar os termos e políticas de privacidade, para continuar.");
                toast.success("Usuário registrado.");
            }
            signIn(typeLogin);
            toast.success("Usuário logado.");
        }
    };

    const handleRecoverPassword = () => {
        if (!isEmail) return toast.error("Email inválido.");
        if (!isConfirmEmail) return toast.error("Confirme seu email.");
        toast.success("Email enviado, verifique seu email.");
    };

    const handleParam = (param: string) => {
        const currentUrl = window.location.pathname;
        router.push(`${currentUrl}?${param}`);
    };

    useEffect(() => {
        setForgotPassword(searchParams.get("forgot_password") === "1");
        setIsRegister(searchParams.get("register") === "1");
    }, [searchParams]);

    return (
        <div className="flex h-full w-full flex-row justify-center items-center fadeIn select-none">
            <div className="min-w-xs max-w-md w-full p-6 bg-default-200 shadow-xl rounded-lg">
                <span className="text-lg font-bold text-default-950">{isRegister ? 'Registrar' : forgotPassword  ? 'Recuperar senha' : 'Login'}</span>
                <form className="flex gap-3 flex-col mt-8" onSubmit={(e) => {e.preventDefault(); handleSubmit('default')}}>
                    <div className="flex items-center justify-center gap-2">
                        <Input
                            value={email}
                            onValueChange={setEmail}
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
                        <Icon name="mdi:email" className="text-2xl text-default-950 mt-3" />
                    </div>
                    {forgotPassword ? (
                        <div className="fadeIn flex gap-3 flex-col">
                            {(isEmail || confirmEmail) && (
                                <div className="flex items-center justify-center gap-2 fadeIn">
                                    <Input
                                        value={confirmEmail}
                                        onValueChange={setConfirmEmail}
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
                                    <Icon name="mdi:email" className="text-2xl text-default-950 mt-3" />
                                </div>
                            )}
                            <div className='pt-2'>
                                <Button
                                    typeButton="primary"
                                    onClick={() => handleRecoverPassword()}
                                    isDisabled={!isEmail || !isConfirmEmail}
                                    
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
                    ) : (
                        <div className="fadeIn flex gap-3 flex-col">
                            <div className="flex items-center justify-center gap-2">
                                <Input
                                    value={password}
                                    onValueChange={setPassword}
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
                                    className="rounded-full cursor-pointer mt-3 min-w-[24px]"
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
                                        onValueChange={setConfirmPassword}
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
                                        className="rounded-full cursor-pointer mt-3 min-w-[24px]"
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
                                    {loading ? (
                                        <span className="loader">Carregando...</span>
                                    ) : (
                                        `${isRegister ? 'Registrar' : 'Entrar'}`
                                    )}
                                </Button>
                            </div>
                            <div className="flex w-full items-center gap-3">
                                <div className="flex w-full border-b border-default-400"></div>
                                <span className="text-default-500 font-medium">OU</span>
                                <div className="flex w-full border-b border-default-400"></div>
                            </div>
                            {socialsLinks.map((social) => (
                                <Button
                                    typeButton="default"
                                    onClick={() => handleSubmit(social.name_id)}
                                    key={`${social.name_id}${social.icon}`}
                                    isDisabled={!acceptTerms}
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
        </div>
    );
}
