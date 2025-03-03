import { useState } from "react";

export default function RegisterForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Função para validar a senha
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (regex.test(password)) {
      setPasswordError(""); // Senha válida, limpa o erro
    } else {
      setPasswordError("A senha precisa ter pelo menos 8 caracteres, incluir uma letra e um número.");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setMessage("Preencha todos os campos.");
      return;
    }

    if (passwordError) {
      setMessage("Corrija os erros antes de continuar.");
      return;
    }

    // Aqui você pode enviar os dados para uma API de cadastro
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black mb-2"
              />
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black mb-2"
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mt-2"
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
