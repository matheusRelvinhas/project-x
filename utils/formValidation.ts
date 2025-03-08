export const validateField = (value: string, regex: RegExp): boolean => {
    if (!value) return false;
    return regex.test(value);
};

export const validatePassword = (password: string): boolean => {
    return validateField(password, /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
};

export const validateEmail = (email: string): boolean => {
    return validateField(email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
};

export const validatePhone = (phone: string): boolean => {
    return validateField(phone, /^[0-9]{10,11}$/);
};
