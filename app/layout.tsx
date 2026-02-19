import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MonMandatLocal.fr - Comprendre le marché immobilier local",
    template: "%s | MonMandatLocal.fr",
  },
  description:
    "Accédez aux données officielles du marché immobilier français : prix de vente, loyers, statistiques par ville et quartier. Informations factuelles pour particuliers.",
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
  alternates: {
    languages: {
      "fr-FR": "https://www.monmandatlocal.fr",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "google-site-verification": "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://blog.monmandatlocal.fr" />
        <link
          rel="dns-prefetch"
          href="https://blog.monmandatlocal.fr"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
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
