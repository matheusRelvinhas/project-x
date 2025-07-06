'use client'

import React from 'react';
import { useAppContext } from "@/context/context";

const Loader: React.FC = () => {
    const { loading } = useAppContext();

    if (!loading) return null;

    return (
        <div className="fixed z-[9999] bg-glass-effect m-4 flex  justify-center p-4 rounded-lg items-start pt-4">
            <div className="loader" />
        </div>
    );
};

export default Loader;
