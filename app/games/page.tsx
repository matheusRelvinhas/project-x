import { Metadata } from "next";
import GamesPage from "./games-page";

export const metadata: Metadata = {
    title: "Jogos e Estatísticas de CS2",
    description:
        "Explore estatísticas detalhadas de partidas de Counter-Strike 2 no REDONDO.FUN. Analise jogos, resultados, mapas, rounds e desempenho de times em partidas profissionais de CS2.",
    keywords: [
        "cs2 matches", "counter strike 2 matches", "cs2 match statistics", "cs2 game stats", "cs2 results", "cs2 match analytics",
        "counter strike 2 game statistics", "cs2 map statistics", "cs2 rounds stats", "cs2 match results", "cs2 pro matches",
        "cs2 esports matches", "cs2 match history", "counter strike 2 results", "cs2 competitive matches", "cs2 game analytics",
        "cs2 match insights", "cs2 team match stats", "cs2 match breakdown", "cs2 esports statistics",
        "cs2 jogos", "cs2 partidas", "counter strike 2 partidas", "estatísticas cs2", "cs2 match stats", "cs2 resultados",
        "estatísticas partidas cs2", "cs2 resultados partidas", "cs2 mapas estatísticas", "cs2 rounds stats",
        "cs2 jogos profissionais", "cs2 esports partidas", "cs2 match analytics", "counter strike 2 resultados",
        "cs2 partidas competitivas", "cs2 estatísticas de jogos", "cs2 estatísticas partidas", "cs2 análise partidas",
        "cs2 desempenho times", "cs2 match breakdown"
    ],
    openGraph: {
        title: "CS2 Matches & Game Statistics | REDONDO.FUN",
        description:
            "Analyze Counter-Strike 2 matches with advanced statistics, results, map performance, and team analytics.",
        type: "website",
        siteName: "REDONDO.FUN",
    },
    twitter: {
        card: "summary_large_image",
        title: "CS2 Matches & Game Statistics | REDONDO.FUN",
        description:
            "Explore advanced Counter-Strike 2 match statistics, results, and analytics.",
    },
};

export default function Games() {
    return <GamesPage />
};
