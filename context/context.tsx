'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface AppContextType {
  message: string;
  setMessage: (message: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string>('LOGIN');

  return (
    <AppContext.Provider value={{ 
      message, 
      setMessage 
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
