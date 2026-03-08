import { Metadata } from "next";
import PlayersPage from "./players-page";

export const metadata: Metadata = {
    title: "Jogadores e Estatísticas de CS2",
    description:
        "Explore professional Counter-Strike 2 players on REDONDO. Analyze player statistics, performance, rankings, match history and advanced CS2 esports analytics.",
    keywords: [
        "cs2 players", "counter strike 2 players", "cs2 player stats", "cs2 pro players", "counter strike 2 player statistics",
        "cs2 esports players", "cs2 player rankings", "cs2 player analytics", "cs2 professional players",
        "counter strike 2 pro players", "cs2 player performance", "cs2 esports player statistics", "jogadores cs2",
        "jogadores counter strike 2", "estatísticas jogadores cs2", "jogadores profissionais cs2", "ranking jogadores cs2",
        "estatísticas pro players cs2", "análise jogadores cs2", "performance jogadores cs2",
    ],
    openGraph: {
        title: "Jogadores e Estatísticas de CS2",
        description:
            "Discover professional Counter-Strike 2 players and explore advanced statistics, rankings and esports performance analytics.",
        type: "website",
        siteName: "REDONDO",
    },
    twitter: {
        card: "summary_large_image",
        title: "Jogadores e Estatísticas de CS2",
        description:
            "Explore advanced Counter-Strike 2 player statistics, rankings and esports performance.",
    },
};

export default function Leagues() {
    return <PlayersPage />;
};
