import type { Metadata } from "next";
import { AppProvider } from "@/context/context";
import Menu from "@/components/menu";
import Toast from "@/components/toast";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "REDONDO",
        template: "%s | REDONDO",
    },
    description:
        "REDONDO é uma plataforma de estatísticas avançadas de Counter-Strike 2. Analise jogadores, times, campeonatos e partidas com métricas detalhadas e insights competitivos.",
    keywords: [
        "cs2 stats", "counter strike 2 stats", "estatísticas cs2", "cs2 analytics", "cs2 jogadores", "cs2 teams stats",
        "cs2 esports stats", "counter strike 2 analytics", "estatísticas counter strike 2", "cs2 jogos", "counter strike 2 matches",
        "cs2 partidas", "cs2 match stats", "cs2 resultados", "cs2 mapas estatísticas", "cs2 campeonatos", "counter strike 2 tournaments",
        "cs2 leagues", "cs2 torneios", "cs2 esports campeonatos", "estatísticas torneios cs2", "cs2 teams", "times cs2",
        "counter strike 2 teams stats", "estatísticas times cs2", "cs2 team analytics", "ranking times cs2", "cs2 players stats",
        "jogadores cs2", "counter strike 2 players", "estatísticas jogadores cs2", "cs2 pro players stats", "cs2 player analytics",
        "cs2 stats", "counter strike 2 stats", "cs2 statistics", "cs2 analytics", "cs2 players", "cs2 team stats", "cs2 esports stats",
        "counter strike 2 analytics", "counter strike 2 statistics", "cs2 games", "counter strike 2 matches", "cs2 matches",
        "cs2 match stats", "cs2 results", "cs2 map statistics", "cs2 tournaments", "counter strike 2 tournaments", "cs2 leagues",
        "cs2 esports tournaments", "cs2 tournament statistics", "cs2 teams", "counter strike 2 teams", "counter strike 2 team stats",
        "cs2 team statistics", "cs2 team analytics", "cs2 team rankings", "cs2 player stats", "cs2 players stats", "counter strike 2 players",
        "counter strike 2 player statistics", "cs2 pro player stats", "cs2 player analytics"
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const classFull = 'transition flex min-h-full w-full bg-default-100 text-default-950';
    return (
        <html lang="pt" className={classFull}>
            <AppProvider>
                <body className={classFull}>
                    <Toast />
                    <Menu>
                        {children}
                    </Menu>
                </body>
            </AppProvider>
        </html>
    );
};
