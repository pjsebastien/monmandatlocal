import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MonMandatLocal.fr - Comprendre le marché immobilier local",
    template: "%s | MonMandatLocal.fr",
  },
  description:
    "Accédez aux données officielles du marché immobilier français : prix de vente, loyers, statistiques par ville et quartier. Informations factuelles pour particuliers.",
  keywords: [
    "marché immobilier",
    "prix immobilier",
    "données immobilières",
    "statistiques logement",
    "quartier",
    "ville",
    "DVF",
  ],
  authors: [{ name: "MonMandatLocal.fr" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.monmandatlocal.fr",
    siteName: "MonMandatLocal.fr",
    title: "MonMandatLocal.fr - Comprendre le marché immobilier local",
    description:
      "Données officielles du marché immobilier français par ville et quartier",
  },
  twitter: {
    card: "summary_large_image",
    title: "MonMandatLocal.fr - Comprendre le marché immobilier local",
    description:
      "Données officielles du marché immobilier français par ville et quartier",
    images: ["/logo.png"],
  },
  metadataBase: new URL("https://www.monmandatlocal.fr"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </div>
      </body>
    </html>
  );
}
