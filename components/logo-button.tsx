"use client";

import Button from "./button";
import { useAppContext } from "@/context/context";

interface LogoButtonProps {
	isExpanded: boolean;
	isMobile: boolean;
	handleNavigation: (path: string) => void;
}

export default function LogoButton({
	isExpanded,
	isMobile,
	handleNavigation,
}: LogoButtonProps) {
	const { theme } = useAppContext();

	return (
		<Button
			onClick={() => handleNavigation("/")}
			border={false}
			rounded={false}
			className={`flex flex-row gap-4 transition items-center min-h-[48px] max-h-[48px] border-b border-default-400 text-default-900 hover:text-default-1000 hover:bg-glass-effect font-medium cursor-pointer ${isExpanded || isMobile ? "pl-6 px-2 py-3" : "justify-center px-2 py-3"}`}
		>
			<img className="h-[44px] animate-float" src={`/img/logo-${theme}.png`} />
            {(isExpanded || isMobile) && (
                <div className="flex flex-col w-full justify-center fadeIn-menu">
                    <span>{'Project-x'}</span>
                    <span className="text-xs text-default-800">{'AI analytics e-sports stats'}</span>
                </div>
            )}
		</Button>
	);
}
