import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "@/components/SiteHeader";
import { QueryProvider } from "@/providers/QueryProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Trip Planner",
    description:
        "Plan your trip — browse countries, check the weather and add destinations.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-[#0E0E10] text-white">
                <QueryProvider>
                    <SiteHeader />
                    {children}
                </QueryProvider>
            </body>
        </html>
    );
}
