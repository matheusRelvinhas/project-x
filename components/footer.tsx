"use client";

import { useAppContext } from "@/context/context";
import LogoButton from "./logo-button";

interface FooterProps {
    handleNavigation?: (href: string) => void;
}

const Footer = ({ handleNavigation }: FooterProps) => {

    const { isOpen, isMobile } = useAppContext();

    return (
        <footer className={`flex flex-col w-full border-t border-default-400 transition ${isOpen && isMobile ? 'bg-default-50' : 'bg-[#0f0f0f]'}`}>
            <div className="max-w-7xl mx-auto container px-6 pt-8 pb-3 flex flex-wrap gap-6 justify-between">
                <div className="flex flex-col gap-3 max-w-md">
                    <div className="text-sm text-default-600 leading-relaxed">
                        <span className="font-semibold text-[#f0f0f0]">{'REDONDO'}</span>
                        <span>{' é uma plataforma de estatísticas avançadas e análise com inteligência artificial focada no cenário competitivo de '}</span>
                        <span className="font-medium text-[#f0f0f0]">{'Counter-Strike 2'}</span>
                        <span>{'. Especializada em campeonatos High Tier S e A, fornecemos métricas detalhadas e insights estratégicos sobre jogadores, times e campeonatos.'}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-sm">
                    <span className="font-semibold text-[#f0f0f0]">{'Plataforma'}</span>
                    <span className="text-default-600">{'Estatísticas Avançadas'}</span>
                    <span className="text-default-600">{'Análise de IA'}</span>
                    <span className="text-default-600">{'Desemepnho de jogadores e equipes'}</span>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 text-sm">
                        <span className="font-semibold text-[#f0f0f0]">{'Contato'}</span>
                        <a
                            href="mailto:contact@REDONDO"
                            className="text-default-600 hover:text-primary-600 transition"
                        >{'contato.REDONDO@gmail.com'}</a>

                        <span className="text-default-600 text-xs">{'Respondemos em até 48h'}</span>
                    </div>
                    <LogoButton
                        isExpanded={true}
                        isMobile={false}
                        handleNavigation={(() => {})}
                        isFooter={true}
                    />
                </div>
            </div>
            <div className="px-3 py-4 text-center text-xs text-default-600">
                {`© ${new Date().getFullYear()} REDONDO — Todos os direitos reservados.`}
            </div>
        </footer>
    );
};

export default Footer;
