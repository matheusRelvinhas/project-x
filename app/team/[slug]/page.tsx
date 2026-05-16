import { Metadata } from "next";
import TeamPage from "./team-page";

export const runtime = "edge";

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
        description: `Veja estatísticas completas do time ${formattedTitle} no Counter-Strike 2. Confira jogadores, partidas, resultados, mapas e desempenho da equipe no REDONDO.FUN.`,
        keywords: [
            slug,
            formattedTitle,
            "cs2 teams", "counter strike 2 teams", "cs2 team stats", "cs2 esports teams", "cs2 team roster", "cs2 team statistics",
            "counter strike 2 team stats", "cs2 professional teams", "cs2 team performance", "cs2 team results", "cs2 team matches",
            "cs2 team players", "cs2 roster", "cs2 esports roster", "counter strike 2 roster", "cs2 lineup", "cs2 pro team",
            "cs2 competitive teams", "cs2 esports organization", "cs2 team rankings", "cs2 match history", "cs2 player lineup",
            "times cs2", "equipes cs2", "time cs2", "estatísticas time cs2", "estatísticas equipe cs2", "estatísticas cs2",
            "desempenho time cs2", "resultados time cs2", "partidas time cs2", "histórico de partidas cs2", "lineup cs2",
            "lineup time cs2", "jogadores cs2", "jogadores do time cs2", "elenco cs2", "equipe profissional cs2",
            "time competitivo cs2", "ranking times cs2", "organizações esports cs2",
        ],
        openGraph: {
            title: `${formattedTitle} | REDONDO.FUN`,
            description: `Confira estatísticas completas do time ${formattedTitle} no Counter-Strike 2, incluindo lineup, partidas e desempenho da equipe.`,
            type: "website",
            siteName: "REDONDO.FUN",
        },
        twitter: {
            card: "summary_large_image",
            title: `${formattedTitle} | REDONDO.FUN`,
            description: `Veja estatísticas detalhadas do time ${formattedTitle} no Counter-Strike 2.`,
        },
    };
};

export default function Team() {
    return <TeamPage />;
};
