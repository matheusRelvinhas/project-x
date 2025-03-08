'use client';

import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface User {
    name: string | null;
    id: number | null;
    email: string | null;
    premium: boolean | null;
    logged: boolean | null;
}

interface AppContextType {
    isMobile: boolean;
    theme: "light" | "dark";
    setTheme: (t: "light" | "dark") => void;
    user: User;
    setUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const [user, setUser] = useState<User>({
        name: null,
        id: null,
        email: null,
        premium: null,
        logged: null,
    });


    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1040);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <AppContext.Provider value={{
            isMobile,
            theme,
            setTheme,
            user,
            setUser,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
