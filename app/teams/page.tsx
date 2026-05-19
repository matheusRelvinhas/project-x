import { Metadata } from "next";
import TeamsPage from "./teams-page";

export const metadata: Metadata = {
    title: "Times de CS2 e Estatísticas das Equipes",
    description:
        "Explore times profissionais de Counter-Strike 2 no REDONDO STATS. Veja estatísticas das equipes, lineups, jogadores, partidas, resultados e desempenho no cenário competitivo de CS2.",
    keywords: [
        "cs2 teams", "counter strike 2 teams", "cs2 team stats", "cs2 esports teams", "cs2 professional teams",
        "counter strike 2 team statistics", "cs2 team rankings", "cs2 team analytics", "cs2 team performance", "cs2 team results", 
        "cs2 team matches", "cs2 team roster", "cs2 esports organizations", "cs2 pro teams","cs2 competitive teams", 
        "times cs2", "equipes cs2", "times counter strike 2", "estatísticas times cs2", "estatísticas equipes cs2", 
        "times profissionais cs2", "ranking times cs2", "análise times cs2", "desempenho equipes cs2", "resultados times cs2", 
        "partidas times cs2", "lineup times cs2", "elenco times cs2", "organizações esports cs2", "times competitivos cs2",
    ],
    openGraph: {
        title: "Times de CS2 e Estatísticas das Equipes | REDONDO STATS",
        description:
            "Descubra times profissionais de Counter-Strike 2 e explore estatísticas avançadas, lineups, rankings e desempenho no cenário competitivo.",
        type: "website",
        siteName: "REDONDO STATS",
    },
    twitter: {
        card: "summary_large_image",
        title: "Times de CS2 e Estatísticas das Equipes | REDONDO STATS",
        description:
            "Explore estatísticas de times de Counter-Strike 2, lineups, rankings e desempenho competitivo.",
    },
};

export default function Teams() {
    return <TeamsPage />;
};
