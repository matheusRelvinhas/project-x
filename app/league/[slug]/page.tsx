import { Metadata } from "next";
import LeaguePage from "./league-page";

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
        description: `Explore estatísticas completas do campeonato ${formattedTitle} de Counter-Strike 2. Veja times participantes, partidas, resultados, mapas e desempenho das equipes no REDONDO.`,
        keywords: [
            slug,
            formattedTitle,
            "cs2 tournaments", "counter strike 2 tournaments", "cs2 leagues", "cs2 esports tournaments", "cs2 tournament stats",
            "cs2 league statistics", "cs2 esports events", "cs2 competition stats", "counter strike 2 competitions", 
            "cs2 professional tournaments", "campeonatos cs2", "torneios cs2", "ligas cs2", "campeonato counter strike 2",
            "estatísticas campeonato cs2", "estatísticas torneios cs2", "eventos esports cs2", "competições cs2",
            "liga cs2 estatísticas", "torneio cs2 estatísticas",
        ],
        openGraph: {
            title: `${formattedTitle} – CS2 Tournament Statistics | REDONDO`,
            description: `Veja estatísticas completas do campeonato ${formattedTitle} de Counter-Strike 2, incluindo partidas, resultados e desempenho dos times.`,
            type: "website",
            siteName: "REDONDO",
        },
        twitter: {
            card: "summary_large_image",
            title: `${formattedTitle} – CS2 Tournament Statistics | REDONDO`,
            description: `Explore estatísticas completas do campeonato ${formattedTitle} de Counter-Strike 2.`,
        },
    };
};

export default function League() {
    return <LeaguePage />;
};
