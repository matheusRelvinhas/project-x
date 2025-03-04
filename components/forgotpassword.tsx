import { useState } from "react";

export default function ForgotPassword() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState(""); // Novo estado para erro de e-mail

  // Função para validar e-mail
  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setEmailError("Por favor, insira um e-mail.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("E-mail inválido.");
      return;
    }

    setEmailError(""); // Remove qualquer erro se o e-mail for válido

    // Aqui você pode chamar uma API para enviar o e-mail de recuperação de senha
    setMessage("Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.");
  };

  return (
    <div className="text-center">
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        Esqueceu a senha?
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-white shadow-md rounded-md">
          <h3 className="text-lg font-semibold text-gray-700">Recuperar senha</h3>
          <form onSubmit={handleSubmit} className="mt-2">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(""); // Remove o erro enquanto o usuário digita
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
            {emailError && <p className="text-sm text-red-500 mt-2">{emailError}</p>}
            {message && !emailError && <p className="text-sm text-green-500 mt-2">{message}</p>}
            <button
              type="submit"
              className="w-full mt-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Enviar
            </button>
          </form>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
