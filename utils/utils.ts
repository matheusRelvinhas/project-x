import { useEffect, useState } from "react";

export const periodText = (period: string) => {
    if (period == "last_month") return "Último mês";
    else if (period == "3_months") return "Últimos 3 meses";
    else if (period == "6_months") return "Últimos 6 meses";
    else if (period == "12_months") return "Últimos 12 meses";
    else return period;
};

export const mapsName = [
    { title: "Dust 2", value: "de_dust2" },
    { title: "Mirage", value: "de_mirage" },
    { title: "Inferno", value: "de_inferno" },
    { title: "Nuke", value: "de_nuke" },
    { title: "Overpass", value: "de_overpass" },
    { title: "Ancient", value: "de_ancient" },
    { title: "Anubis", value: "de_anubis" },
    //{ title: "Train", value: "de_train" },
    //{ title: "Vertigo", value: "de_vertigo" },
];

export function useMounted() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    return mounted;
};

export function useTypewriter(text: string, speed = 50) {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);
    const words = text.split(" ");
    useEffect(() => {
        if (!text) return;
        if (index < words.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) =>
                    prev ? prev + " " + words[index] : words[index]
                );
                setIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timeout);
        }
    }, [index, text]);
    useEffect(() => {
        setDisplayedText("");
        setIndex(0);
    }, [text]);
    return displayedText;
}
