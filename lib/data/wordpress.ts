/**
 * Fonctions d'accès à l'API REST WordPress
 * Source : https://www.blog.monmandatlocal.fr/wp-json/wp/v2/posts
 */

const WP_API_URL = "https://www.blog.monmandatlocal.fr/wp-json/wp/v2";

// Types pour l'API WordPress avec _embed
export interface WPFeaturedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full: string;
  };
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  avatar?: string;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WPPostRaw {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      slug: string;
      avatar_urls?: { [key: string]: string };
    }>;
    "wp:featuredmedia"?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
        sizes?: {
          thumbnail?: { source_url: string; width: number; height: number };
          medium?: { source_url: string; width: number; height: number };
          medium_large?: { source_url: string; width: number; height: number };
          large?: { source_url: string; width: number; height: number };
          full?: { source_url: string; width: number; height: number };
        };
      };
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
        taxonomy: string;
      }>
    >;
  };
}

// Type enrichi avec les données extraites de _embed
export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: string;
  titleRaw: string;
  content: string;
  contentCleaned: string;
  excerpt: string;
  excerptText: string;
  link: string;
  featuredImage: WPFeaturedImage | null;
  author: WPAuthor | null;
  categories: WPCategory[];
  readingTime: number;
}

export interface WPPostsResponse {
  posts: WPPost[];
  totalPages: number;
  totalPosts: number;
}

/**
 * Transforme un post brut de l'API en post enrichi
 */
function transformPost(raw: WPPostRaw): WPPost {
  // Extraire l'image à la une depuis _embed
  const featuredMedia = raw._embedded?.["wp:featuredmedia"]?.[0];
  let featuredImage: WPFeaturedImage | null = null;

  if (featuredMedia?.source_url) {
    const sizes = featuredMedia.media_details?.sizes;
    featuredImage = {
      url: sizes?.large?.source_url || featuredMedia.source_url,
      alt: featuredMedia.alt_text || "",
      width: sizes?.large?.width || featuredMedia.media_details?.width || 1200,
      height: sizes?.large?.height || featuredMedia.media_details?.height || 630,
      sizes: {
        thumbnail: sizes?.thumbnail?.source_url,
        medium: sizes?.medium?.source_url,
        large: sizes?.large?.source_url,
        full: featuredMedia.source_url,
      },
    };
  }

  // Extraire l'auteur depuis _embed
  const authorData = raw._embedded?.author?.[0];
  const author: WPAuthor | null = authorData
    ? {
        id: authorData.id,
        name: authorData.name,
        slug: authorData.slug,
        avatar: authorData.avatar_urls?.["96"],
      }
    : null;

  // Extraire les catégories depuis _embed
  const terms = raw._embedded?.["wp:term"] || [];
  const categories: WPCategory[] = terms
    .flat()
    .filter((term) => term.taxonomy === "category")
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    }));

  // Nettoyer le titre
  const titleRaw = raw.title.rendered;
  const title = decodeHTMLEntities(titleRaw);

  // Nettoyer le contenu
  const contentCleaned = cleanWPContent(raw.content.rendered);

  // Extraire l'excerpt en texte brut
  const excerptText = extractTextFromHTML(raw.excerpt.rendered, 160);

  // Calculer le temps de lecture
  const readingTime = calculateReadingTime(contentCleaned);

  return {
    id: raw.id,
    slug: raw.slug,
    date: raw.date,
    modified: raw.modified,
    title,
    titleRaw,
    content: raw.content.rendered,
    contentCleaned,
    excerpt: raw.excerpt.rendered,
    excerptText,
    link: raw.link,
    featuredImage,
    author,
    categories,
    readingTime,
  };
}

/**
 * Récupère une liste paginée d'articles WordPress
 */
export async function getWPPosts(
  page: number = 1,
  perPage: number = 10
): Promise<WPPostsResponse> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?page=${page}&per_page=${perPage}&_embed`,
      {
        next: { revalidate: 3600 }, // Cache 1 heure
      }
    );

    if (!response.ok) {
      if (response.status === 400) {
        return { posts: [], totalPages: 0, totalPosts: 0 };
      }
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const rawPosts: WPPostRaw[] = await response.json();
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");
    const totalPosts = parseInt(response.headers.get("X-WP-Total") || "0");

    const posts = rawPosts.map(transformPost);

    return { posts, totalPages, totalPosts };
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return { posts: [], totalPages: 0, totalPosts: 0 };
  }
}

/**
 * Récupère tous les articles (pour génération statique)
 */
export async function getAllWPPosts(): Promise<WPPost[]> {
  const allPosts: WPPost[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const { posts, totalPages } = await getWPPosts(page, 100);
    allPosts.push(...posts);
    hasMore = page < totalPages;
    page++;
  }

  return allPosts;
}

/**
 * Récupère tous les slugs des articles (pour generateStaticParams)
 */
export async function getAllWPPostSlugs(): Promise<string[]> {
  const posts = await getAllWPPosts();
  return posts.map((post) => post.slug);
}

/**
 * Récupère un article par son slug
 */
export async function getWPPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const response = await fetch(
      `${WP_API_URL}/posts?slug=${encodeURIComponent(slug)}&_embed`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const rawPosts: WPPostRaw[] = await response.json();

    if (rawPosts.length === 0) {
      return null;
    }

    return transformPost(rawPosts[0]);
  } catch (error) {
    console.error(`Error fetching WordPress post "${slug}":`, error);
    return null;
  }
}

// ============================================
// Fonctions utilitaires de nettoyage et formatage
// ============================================

// Domaines de l'ancien site WordPress à remplacer
const OLD_WP_DOMAINS = [
  "https://www.blog.monmandatlocal.fr",
  "https://blog.monmandatlocal.fr",
  "http://www.blog.monmandatlocal.fr",
  "http://blog.monmandatlocal.fr",
  "https://www.monmandatlocal.fr",
  "http://www.monmandatlocal.fr",
];

const NEW_SITE_URL = "https://monmandatlocal.fr";

/**
 * Réécrit les liens internes de l'ancien WordPress vers le nouveau site
 */
export function rewriteInternalLinks(html: string): string {
  let rewritten = html;

  for (const oldDomain of OLD_WP_DOMAINS) {
    // Remplacer les liens href vers les articles (pas les images wp-content)
    // Exemple: href="https://www.blog.monmandatlocal.fr/mon-article/"
    // Devient: href="https://monmandatlocal.fr/mon-article"
    const linkRegex = new RegExp(
      `href="${oldDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/(?!wp-content/)([^"]*)"`,
      "gi"
    );
    rewritten = rewritten.replace(linkRegex, (match, path) => {
      // Nettoyer le path (enlever le trailing slash)
      const cleanPath = path.replace(/\/$/, "");
      return `href="${NEW_SITE_URL}/${cleanPath}"`;
    });
  }

  return rewritten;
}

/**
 * Nettoie le contenu WordPress en supprimant :
 * - Table of Contents (TOC)
 * - Scripts et iframes malveillants
 * - Shortcodes WordPress non rendus
 * - Classes et styles inline inutiles
 * Et réécrit les liens internes vers le nouveau site
 */
export function cleanWPContent(html: string): string {
  let cleaned = html;

  // Supprimer les Table of Contents (différents plugins)
  // Plugin "Easy Table of Contents"
  cleaned = cleaned.replace(/<div[^>]*id="ez-toc-container"[^>]*>[\s\S]*?<\/div>/gi, "");
  // Plugin "Table of Contents Plus"
  cleaned = cleaned.replace(/<div[^>]*id="toc_container"[^>]*>[\s\S]*?<\/div>/gi, "");
  // Plugin "LuckyWP Table of Contents"
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*lwptoc[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  // Plugin "Jetengin TOC"
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*jet-table-of-contents[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  // Plugin "Rank Math TOC"
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*wp-block-rank-math-toc-block[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  // Plugin "FLAVOR TOC" ou similaires avec nav
  cleaned = cleaned.replace(/<nav[^>]*class="[^"]*toc[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, "");
  // Générique : div avec class contenant "toc" ou "table-of-contents"
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*(?:table-of-contents|toc-wrapper|toc-container)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
  // Titres "Table des matières" ou "Sommaire" suivis d'une liste
  cleaned = cleaned.replace(/<(?:h[2-4]|p|div)[^>]*>(?:Table des matières|Sommaire|Table of Contents)<\/(?:h[2-4]|p|div)>\s*<(?:ul|ol)[^>]*>[\s\S]*?<\/(?:ul|ol)>/gi, "");


  // Supprimer les scripts inline
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Supprimer les shortcodes WordPress non rendus [shortcode]
  cleaned = cleaned.replace(/\[[^\]]+\]/g, "");

  // Supprimer les commentaires HTML
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  // Supprimer les styles inline vides
  cleaned = cleaned.replace(/\s+style="\s*"/gi, "");

  // Supprimer les classes vides
  cleaned = cleaned.replace(/\s+class="\s*"/gi, "");

  // Nettoyer les espaces multiples
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // Supprimer les paragraphes vides
  cleaned = cleaned.replace(/<p[^>]*>\s*(&nbsp;|\s)*\s*<\/p>/gi, "");

  // Réécrire les liens internes vers le nouveau site
  cleaned = rewriteInternalLinks(cleaned);

  return cleaned.trim();
}

/**
 * Décode les entités HTML (&amp; -> &, etc.)
 */
export function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&apos;": "'",
    "&nbsp;": " ",
    "&#8217;": "'",
    "&#8216;": "'",
    "&#8220;": '"',
    "&#8221;": '"',
    "&#8211;": "–",
    "&#8212;": "—",
    "&#8230;": "…",
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, "g"), char);
  }

  // Gérer les entités numériques restantes
  decoded = decoded.replace(/&#(\d+);/g, (_, code) =>
    String.fromCharCode(parseInt(code, 10))
  );
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, code) =>
    String.fromCharCode(parseInt(code, 16))
  );

  return decoded;
}

/**
 * Extrait le texte brut depuis du HTML
 */
export function extractTextFromHTML(html: string, maxLength: number = 160): string {
  // Supprimer les balises HTML
  let text = html.replace(/<[^>]*>/g, "");
  // Décoder les entités
  text = decodeHTMLEntities(text);
  // Nettoyer les espaces
  text = text.replace(/\s+/g, " ").trim();
  // Tronquer
  if (text.length <= maxLength) return text;
  // Couper au dernier mot complet
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "…";
}

/**
 * Calcule le temps de lecture estimé (mots par minute)
 */
export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Formate une date WordPress pour l'affichage
 */
export function formatWPDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formate une date ISO pour les balises meta
 */
export function formatISODate(dateString: string): string {
  return new Date(dateString).toISOString();
}

/**
 * Génère l'URL canonique d'un article
 */
export function getCanonicalUrl(slug: string, baseUrl: string = "https://monmandatlocal.fr"): string {
  return `${baseUrl}/${slug}`;
}
