'use client';
import { useSession, signIn } from "next-auth/react";
import RegisterForm from "@/components/registerform";
import ForgotPassword from "@/components/forgotpassword";
import Icon from '@/components/icon';
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/context";
import { validateEmail, validatePassword } from "@/utils/formValidation"; // Importar as funções de validação
import Image from "next/image";

export default function LoginPage() {
  const { message } = useAppContext();
  
  // Estados para senha e erro de senha
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Estados para o e-mail e erro de e-mail
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Estado de carregamento
  const [loading, setLoading] = useState(false);

  // UseEffect para validar a senha e o e-mail sempre que mudarem
  useEffect(() => {
    setPasswordError(validatePassword(password));
  }, [password]);

  useEffect(() => {
    setEmailError(validateEmail(email));
  }, [email]);

  // Função de envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailError && !passwordError) {
      setLoading(true);
      console.log("Tentando fazer login com e-mail:", email);
      // Realiza o login com as credenciais
      signIn("credentials", { email, password })
        .then(() => {
          setLoading(false);
          // Limpar campos após envio
          setEmail("");
          setPassword("");
          setEmailError("");
          setPasswordError("");
        })
        .catch((error) => {
          setLoading(false);
          console.error("Erro no login:", error);
        });
    }
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
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Login</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className={`w-full px-4 py-2 mt-1 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              aria-describedby="email-error"
            />
            {emailError && (
              <div id="email-error" className="text-sm text-red-600 mt-2">{emailError}</div>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className={`w-full px-4 py-2 mt-1 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              aria-describedby="password-error"
            />
            {passwordError && (
              <div id="password-error" className="text-sm text-red-600 mt-2">{passwordError}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!!emailError || !!passwordError || !email || !password || loading}
          >
            {loading ? (
              <span className="loader">Carregando...</span> // Pode adicionar um spinner de carregamento aqui
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700"><ForgotPassword /></a>
        </div>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-700"><RegisterForm/></a>
        </div>

        {/* Entrar com o Google */}
        <div className="mt-6 text-center">
          <button
            onClick={() => signIn("google")}
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <Icon name="flat-color-icons:google" className="w-6 h-6 mr-2" />
            Entrar com Google
          </button>
        </div>

        {/* Entrar com o Instagram */}
        <div className="mt-6 text-center">
          <button
            onClick={() => signIn("instagram")}
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <Icon name="logos:instagram" className="w-6 h-6 mr-2" />
            Entrar com Instagram
          </button>
        </div>

        {/* Entrar com o Facebook */}
        <div className="mt-6 text-center">
          <button
            onClick={() => signIn("facebook")}
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <Icon name="logos:facebook" className="w-6 h-6 mr-2" />
            Entrar com Facebook
          </button>
        </div>

        {/* Entrar com o TikTok */}
        <div className="mt-6 text-center">
          <button
            onClick={() => signIn("tiktok")}
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <Icon name="logos:tiktok" className="w-6 h-6 mr-2" />
            Entrar com TikTok
          </button>
        </div>

        {/* Entrar com o X (Twitter) - com o ícone do X */}
        <div className="mt-6 text-center">
          <button
            onClick={() => signIn("twitter")}
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            <Icon name="logos:x" className="w-6 h-6 mr-2" /> {/* Alterado para o ícone do X */}
            Entrar com X
          </button>
        </div>
      </div>
    </div>
  );
}
