import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/context";
import Menu from "@/components/menu";
import Theme from "@/components/theme";

export const metadata: Metadata = {
  title: "project-x",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProvider>
        <body
          className={`bg-default-100 flex h-full w-full`}
        >
          <Menu />
          <Theme />
          <div className="p-2">
            {children}
          </div>
        </body>
      </AppProvider>
    </html>
  );
}
