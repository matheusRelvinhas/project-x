import { Metadata } from "next";
import LeaguesPage from "./leagues-page";

export const metadata: Metadata = {
    title: "Campeonatos e Estatísticas de CS2",
    description:
        "Explore campeonatos de Counter-Strike 2 no REDONDO. Veja estatísticas de torneios, ligas, times participantes, resultados e desempenho em competições de CS2.",
    keywords: [
        "cs2 tournaments", "counter strike 2 tournaments", "cs2 leagues", "counter strike 2 leagues", "cs2 esports tournaments",
        "cs2 tournament stats", "cs2 league statistics", "cs2 esports events", "cs2 competitions", "counter strike 2 competitions",
        "cs2 professional tournaments", "cs2 event statistics", "cs2 tournament analytics", "campeonatos cs2", "torneios cs2",
        "ligas cs2", "campeonatos counter strike 2", "torneios counter strike 2", "estatísticas campeonatos cs2",      
        "estatísticas torneios cs2", "eventos esports cs2", "competições cs2", "ligas esports cs2",
    ],
    openGraph: {
        title: "Campeonatos e Estatísticas de CS2",
        description:
            "Descubra campeonatos de Counter-Strike 2 com estatísticas completas de torneios, ligas, times e resultados.",
        type: "website",
        siteName: "REDONDO",
    },
    twitter: {
        card: "summary_large_image",
        title: "Campeonatos e Estatísticas de CS2",
        description:
            "Explore ligas e campeonatos de Counter-Strike 2 com estatísticas completas de torneios e equipes.",
    },
};

export default function Leagues() {
    return <LeaguesPage />;
};
