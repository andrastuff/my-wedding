import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Dancing_Script, Great_Vibes, Manrope } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

const monogram = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-monogram",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "The Wedding of Ayuu & Ardi",
  icons: {
    icon: [{ url: "/assets/favicon.png", type: "image/png" }],
    shortcut: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },
  description: "Undangan pernikahan Ayuu Dwi Wahyulita & Ardi Mahendra — 26 September 2026",
  openGraph: {
    title: "The Wedding of Ayuu & Ardi",
    description: "Sabtu, 26 September 2026",
    images: ["/assets/my/DSC_0680%20(2).jpg.jpeg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3a161b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${serif.variable} ${script.variable} ${monogram.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
