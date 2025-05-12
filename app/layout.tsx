import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/context";
import Menu from "@/components/menu";
import Theme from "@/components/theme";
import Toast from "@/components/toast";

export const metadata: Metadata = {
    title: "project-x",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const classFull = 'transition bg-default-100 text-default-950';
    return (
        <html lang="pt" className={classFull}>
            <AppProvider>
                <body className={classFull}>
                    <Toast />
                    <Menu>
                        {children}
                    </Menu>
                    <Theme />
                </body>
            </AppProvider>
        </html>
    );
};
