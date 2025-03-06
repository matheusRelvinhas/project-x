export const validationMessages = {
  password: "A senha precisa ter pelo menos 8 caracteres, incluir uma letra e um número.",
  email: "Por favor, insira um e-mail válido.",
  phone: "Número de telefone inválido. Insira 10 ou 11 dígitos.",
};

export const validateField = (value: string, regex: RegExp, errorMessage: string): string => {
  if (value === "") {
    return ""; // Não mostrar mensagem se o campo estiver vazio
  }
  return regex.test(value) ? "" : errorMessage; // Se o valor não for válido, retorna a mensagem de erro
};

export const validatePassword = (password: string): string => {
  return validateField(password, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, validationMessages.password);
};

export const validateEmail = (email: string): string => {
  return validateField(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, validationMessages.email);
};

export const validatePhone = (phone: string): string => {
  return validateField(phone, /^[0-9]{10,11}$/, validationMessages.phone);
};
