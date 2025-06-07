import { ReactNode, FC, MouseEvent, useEffect } from "react";
import Icon from "./icon";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
    icon?: string;
    children: ReactNode;
}

const Modal: FC<ModalProps> = ({
    isOpen,
    setIsOpen,
    title,
    icon,
    children,
}) => {
    useEffect(() => {
        const body = document.body;
        if (isOpen) body.classList.add("modal-open");
        else body.classList.remove("modal-open");
        return () => {
            body.classList.remove("modal-open");
        };
    }, [isOpen]);
    if (!isOpen) return null;
    const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fadeIn fixed inset-0 z-[999] flex items-start justify-center bg-glass-effect backdrop-blur-sm"
        >
            <div
                className="relative bg-default-100 rounded-2xl shadow-xl w-full max-w-md mx-2 my-12"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex w-full border-b-1 items-center border-default-400 p-2 gap-3">
                    <div className="border-1 border-default-400 rounded-4xl text-default-800 flex items-center justify-center h-[35px] w-[35px]">
                        <Icon
                            name={icon ? icon : "material-symbols:page-info"}
                            className="text-2xl"
                        />
                    </div>
                    <span>{title}</span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-default-600 cursor-pointer hover:text-default-950 transition"
                >
                    <Icon name="material-symbols:close-rounded" className="text-lg" />
                </button>
                <div className="pt-2 pb-3 px-4">{children}</div>
                <div className="flex w-full border-t-1 border-default-400 pb-4"></div>
            </div>
        </div>
    );
};

export default Modal;
