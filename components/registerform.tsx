import { useState } from "react";
import { validatePassword, validateEmail, validatePhone } from "../utils/formValidation"; // Importando as funções de validação

export default function RegisterForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // Campo de celular
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState(""); // Erro de email
  const [phoneError, setPhoneError] = useState(""); // Erro de telefone

  // Funções de validação em tempo real
  const handlePasswordChange = (password: string) => {
    setPassword(password);
    setPasswordError(validatePassword(password)); // Valida a senha
  };

  const handleEmailChange = (email: string) => {
    setEmail(email);
    setEmailError(validateEmail(email)); // Valida o email
  };

  const handlePhoneChange = (phone: string) => {
    setPhone(phone);
    setPhoneError(validatePhone(phone)); // Valida o telefone
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    if (passwordError || emailError || phoneError) {
      setMessage("Corrija os erros antes de continuar.");
      return;
    }

    setMessage("Cadastro realizado com sucesso! Verifique seu e-mail.");
  };

  return (
    <div className="text-center">
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        Cadastrar
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h3 className="text-lg font-semibold text-gray-700">Criar Conta</h3>
            <form onSubmit={handleSubmit} className="mt-2">
              <input
                type="text"
                placeholder="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black mb-2"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)} // Usando a função de validação de email
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black mb-2"
              />
              {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)} // Usando a função de validação de senha
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black mb-2"
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              <input
                type="tel"
                placeholder="Celular (opcional)"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)} // Usando a função de validação de telefone
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black mb-2"
              />
              {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
              {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-2"
                disabled={!!passwordError || !!emailError || !!phoneError || !name || !email || !password}
              >
                Criar Conta
              </button>
            </form>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
