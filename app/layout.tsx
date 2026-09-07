import type { Metadata } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calibre — Paint, Coating & Resin Technical Consultancy",
  description:
    "We help paint and coating manufacturers develop better formulations, fix failing ones, and turn lab work into production their team can repeat. Every engagement under NDA.",
  openGraph: {
    title: "Calibre — Paint, Coating & Resin Technical Consultancy",
    description:
      "Formulation development, failure analysis, plant setup and process optimisation for paint, coating and resin manufacturers.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
