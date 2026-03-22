import { Metadata } from "next";
import { Suspense } from "react";
import Login from "@/components/login";

export const metadata: Metadata = {
    title: "Login/Registro",
    description:
        "Sign in or create your REDONDO.FUN account to access advanced Counter-Strike 2 statistics, track teams, players, matches and esports tournaments.",
    keywords: [
        "REDONDO.FUN login", "REDONDO.FUN register", "cs2 stats account", "counter strike 2 statistics account", "cs2 esports platform",
        "cs2 stats platform", "login cs2 stats", "register cs2 stats", "esports statistics platform", "counter strike 2 analytics platform",
    ],
    openGraph: {
        title: "Login / Register | REDONDO.FUN",
        description:
            "Access your REDONDO.FUN account to explore advanced Counter-Strike 2 statistics, teams, players and esports tournaments.",
        type: "website",
        siteName: "REDONDO.FUN",
    },
    twitter: {
        card: "summary_large_image",
        title: "Login / Register | REDONDO.FUN",
        description:
            "Sign in to REDONDO.FUN to explore advanced Counter-Strike 2 statistics and esports analytics.",
    },
};

export default function LoginPage() {
    return (
        <Suspense fallback={<></>}>
            <Login />
        </Suspense>
    );
};
