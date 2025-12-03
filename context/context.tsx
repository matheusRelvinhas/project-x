'use client';

import { axiosGet } from '@/utils/axios';
import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface User {
    id: number | null;
    name: string | null;
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
    accessToken: string|null;
    setAccessToken: (t:string|null) => void;
    loading: boolean;
    setLoading: (l:boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [accessToken, setAccessToken] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const defaultUser = {
        id: null,
        name: null,
        email: null,
        premium: null,
        logged: null
    };

    const [user, setUser] = useState<User>(defaultUser);

    useEffect(() => {
        const storedToken = localStorage.getItem("token_access");
        if (!storedToken && !accessToken) return;
        if (accessToken && accessToken !== storedToken) {
            localStorage.setItem("token_access", accessToken);
        };
        const finalToken = accessToken ?? storedToken;
        if (!finalToken || finalToken === "not_user") {
            setUser(defaultUser);
            return;
        };
        axiosGet(`/login/check_auth?token=${finalToken}`, (data) => {
            setUser({
                id: data.user_id,
                name: data.name,
                email: data.email,
                logged: data.logged,
                premium: data.premium
            });
        });
    }, [accessToken]);

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
            accessToken,
            setAccessToken,
            loading,
            setLoading
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
