'use client';
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import RegisterForm from "@/components/registerform";
import ForgotPassword from "@/components/forgotpassword";
import Icon from '@/components/icon';
import { useState } from "react";
import { useAppContext } from "@/context/context";
import Image from "next/image";

export default function LoginPage() {
  const { message } = useAppContext();
  
  // Estados para senha e erro de senha
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Estados para o e-mail e erro de e-mail
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Função de validação de senha
  const validatePassword = (password: string) => {
    // Regex para validar senha: mínimo de 8 caracteres, pelo menos 1 número e pelo menos 1 letra
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (regex.test(password)) {
      setPasswordError(""); // Limpar erro se a senha for válida
    } else {
      setPasswordError("A senha precisa ter pelo menos 8 caracteres, incluir uma letra e um número.");
    }
  };

  // Função de validação de e-mail
  const validateEmail = (email: string) => {
    // Regex para validar um e-mail básico
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (regex.test(email)) {
      setEmailError(""); // Limpar erro se o e-mail for válido
    } else {
      setEmailError("Por favor, insira um e-mail válido.");
    }
  };

  // Função para lidar com a mudança no campo de e-mail
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setEmail(value);
    validateEmail(value); // Valida o e-mail sempre que for alterado
  };

  // Função para lidar com a mudança no campo de senha
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
    validatePassword(value); // Valida a senha sempre que for alterada
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Login</h2>
        
        {/* Mensagem de erro ou informações gerais */}
        <div className="text-center text-red-500 mb-4">
          {message}
        </div>

        {/* Formulário de Login */}
        <form>
          {/* Campo de Login (Email) */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Login</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}  // Atualiza o valor do e-mail
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {/* Exibir a mensagem de erro, se houver */}
            {emailError && (
              <div className="text-sm text-red-600 mt-2">{emailError}</div>
            )}
          </div>

          {/* Campo de Senha */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}  // Atualiza o valor da senha
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {/* Exibir a mensagem de erro, se houver */}
            {passwordError && (
              <div className="text-sm text-red-600 mt-2">{passwordError}</div>
            )}
          </div>

          {/* Botão de Entrar */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!!emailError || !!passwordError}  // Desabilitar o botão se houver erro no email ou senha
          >
            Entrar
          </button>
        </form>

        {/* Links de navegação */}
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700"><ForgotPassword /></a>
        </div>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700"><RegisterForm/></a>
        </div>

        {/* Entrar com o Google */}
      <div className="mt-6 text-center">
        <button
        onClick={() => signIn("google")} // Chama o processo de login com Google
        className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
        <Icon name="flat-color-icons:google" className="w-6 h-6 mr-2" />
        Entrar com Google
        </button>
      </div>
      </div>
    </div>
  );
}
