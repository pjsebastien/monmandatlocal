/**
 * Configuration du site MonMandatLocal.fr
 */

/**
 * Liste des slugs réservés par le site (ne pas confondre avec les articles WordPress)
 * Ces routes ont la priorité sur les articles WordPress
 */
export const RESERVED_SLUGS = [
  // Pages principales
  "villes",
  "ville",
  "quartiers",
  "quartier",
  "estimation",
  "blog",
  // Pages légales et informations
  "a-propos",
  "mentions-legales",
  "contact",
  "faq",
  "sources",
  "methodologie",
  // Routes techniques
  "api",
  "admin",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
] as const;

export type ReservedSlug = (typeof RESERVED_SLUGS)[number];

/**
 * Vérifie si un slug est réservé par le site
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.includes(slug as ReservedSlug);
}

/**
 * Configuration de l'API WordPress
 */
export const WP_CONFIG = {
  apiUrl: "https://www.blog.monmandatlocal.fr/wp-json/wp/v2",
  postsPerPage: 10,
  cacheRevalidate: 3600, // 1 heure
} as const;

/**
 * Configuration SEO du site
 */
export const SITE_CONFIG = {
  name: "MonMandatLocal.fr",
  url: "https://monmandatlocal.fr",
  description:
    "Comprendre le marché immobilier local à partir de données officielles",
} as const;
