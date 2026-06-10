import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Noise from "@/components/ui/Noise";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phantasma Phoenix — Web3, reborn",
  description:
    "The carbon-negative Layer 1 built for gaming. Tokens, Smart NFTs and entire games mint instantly — no contracts, no code, no compromise.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <Noise />
      </body>
    </html>
  );
}
