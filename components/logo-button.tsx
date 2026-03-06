import { useMounted } from "@/utils/utils";
import Button from "./button";
import { useAppContext } from "@/context/context";

interface LogoButtonProps {
	isExpanded: boolean;
	isMobile: boolean;
	handleNavigation: (path: string) => void;
	isFooter?: boolean;
}

export default function LogoButton({
	isExpanded,
	isMobile,
	handleNavigation,
	isFooter = false,
}: LogoButtonProps) {
	const { theme } = useAppContext();

	const mounted = useMounted();
    if (!mounted) return null;
	
	return (
		<Button
			onClick={() => handleNavigation("/")}
			border={false}
			rounded={false}
			className={`flex flex-row w-full gap-4 transition items-center min-h-[48px] max-h-[48px] font-medium cursor-pointer text-primary-600 ${!isFooter ?  'border-b border-default-400 hover:bg-glass-effect' : 'rounded-md'} ${isExpanded || isMobile ? "pl-6 px-2 py-3" : "justify-center px-2 py-3"}`}
		>
			<img className="h-[36px] w-[36px] animate-float" src={`/img/logo-${theme}.png`} />
            {(isExpanded || isMobile) && (
                <div className="flex flex-col w-full justify-center fadeIn-menu">
                    <span className="font-black">{'REDONDO.GG'}</span>
                    <span className="text-xs text-default-700">{'E-sports stats'}</span>
                </div>
            )}
		</Button>
	);
}
