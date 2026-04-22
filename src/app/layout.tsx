import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Roman-inscription display font — for the name, chapter markers
const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Classical serif — for subheadings, elegant text
const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Walid E.A E.I — Portfolio",
  description:
    "Aspiring Business Analyst with a full-stack CS background. Bridging tech, data and business.",
  authors: [{ name: "Walid El Aidouni El Idrissi" }],
  keywords: [
    "Walid El Aidouni",
    "Walid El Idrissi",
    "Business Analyst",
    "Full Stack Developer",
    "Software Engineer",
    "HELB",
    "Accenture",
    "Brussels",
    "Belgium",
    "Portfolio",
  ],
  openGraph: {
    title: "Walid E.A E.I — Portfolio",
    description:
      "Aspiring Business Analyst with a full-stack CS background. Bridging tech, data and business.",
    type: "website",
    locale: "en_US",
    siteName: "Walid El Aidouni El Idrissi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walid E.A E.I — Portfolio",
    description:
      "Aspiring Business Analyst with a full-stack CS background.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-bg text-text"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
