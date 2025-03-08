"use client";

import { useAppContext } from "@/context/context";
import { ToastContainer } from "react-toastify";

const Toast = () => {
    const { theme } = useAppContext();
    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme}
        />
    );
};

export default Toast;
