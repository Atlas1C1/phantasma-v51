import type { Metadata, Viewport } from "next";
import Noise from "@/components/ui/Noise";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phantasma Ecosystem — Web3, reborn",
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
    <html lang="en">
      <body>
        {children}
        <Noise />
      </body>
    </html>
  );
}
