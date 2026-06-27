import type { Metadata } from "next";
import { AppProvider } from "@/context/context";
import Menu from "@/components/menu";
import Toast from "@/components/toast";
import SchemaOrganization from "@/components/schema-organization";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "REDONDO STATS",
        template: "%s | REDONDO STATS",
    },
    description:
        "REDONDO STATS é uma plataforma de estatísticas avançadas de Counter-Strike 2. Analise jogadores, times, campeonatos e partidas com métricas detalhadas e insights competitivos.",
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
    const classFull = 'flex min-h-full w-full bg-default-100 text-default-950';
    return (
        <html lang="pt" className={classFull}>
            <head>
                <SchemaOrganization />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
                <link rel="preconnect" href="https://www.googleadservices.com" />
                <meta name="google-adsense-account" content="ca-pub-5377852341726601"></meta>
            </head>
            <AppProvider>
                <body className={classFull}>
                    <Toast />
                    <Menu>
                        {children}
                    </Menu>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                (function(w,d,s,l,i){
                                    w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                                    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                                    j.async=true;j.src='https://www.googletagmanager.com/gtag/js?id=AW-18173053796';
                                    f.parentNode.insertBefore(j,f);
                                })(window,document,'script','dataLayer','AW-18173053796');
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', 'AW-18173053796');
                            `,
                        }}
                    />
                </body>
            </AppProvider>
        </html>
    );
};
