import { Metadata } from "next";
import PlayerPage from "./player-page";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const formattedTitle = slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

    return {
        title: `${formattedTitle}`,
        description: `Explore as estatísticas completas do jogador ${formattedTitle} em Counter-Strike 2 no REDONDO. Veja performance, histórico de partidas, mapas jogados e métricas avançadas de jogadores profissionais de CS2.`,
        keywords: [
            slug,
            formattedTitle,
            "cs2 players", "counter strike 2 players", "cs2 player stats", "cs2 pro players", "counter strike 2 player statistics",
            "cs2 esports players", "cs2 player rankings", "cs2 player analytics", "cs2 professional players", "cs2 player performance",
            "jogadores cs2", "jogadores counter strike 2", "estatísticas jogadores cs2", "jogadores profissionais cs2",
            "ranking jogadores cs2", "performance jogadores cs2", "estatísticas pro players cs2", "análise jogadores cs2",
        ],
        openGraph: {
            title: `${formattedTitle} | REDONDO`,
            description: `Veja estatísticas detalhadas do jogador ${formattedTitle} em Counter-Strike 2, incluindo partidas, mapas, performance e análises avançadas.`,
            type: "website",
            siteName: "REDONDO",
        },
        twitter: {
            card: "summary_large_image",
            title: `${formattedTitle} | REDONDO`,
            description: `Explore estatísticas completas do jogador ${formattedTitle} em Counter-Strike 2.`,
        },
    };
};

export default function Player() {
    return <PlayerPage />;
};
