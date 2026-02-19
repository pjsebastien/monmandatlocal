import { MetadataRoute } from "next";
import { getAllWPPosts } from "@/lib/data/wordpress";
import { isReservedSlug } from "@/lib/config";
import { getAllVilles, generateSlug } from "@/lib/data/territorial";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.monmandatlocal.fr";

  // Date fixe pour les pages statiques (date du dernier déploiement significatif)
  // Évite de signaler à Google que toutes les pages changent à chaque build
  const staticDate = new Date("2026-02-19");
  const dataDate = new Date("2026-01-29");

  // Pages statiques du site
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/villes`,
      lastModified: staticDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/quartiers`,
      lastModified: staticDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/estimation`,
      lastModified: staticDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: staticDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: staticDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sources`,
      lastModified: staticDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/methodologie`,
      lastModified: staticDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: staticDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: staticDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: staticDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Articles WordPress
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllWPPosts();
    blogPages = posts
      .filter((post) => !isReservedSlug(post.slug))
      .map((post) => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error("Error fetching WordPress posts for sitemap:", error);
  }

  // Pages des villes (prix immobilier)
  const villes = getAllVilles();
  const villePages: MetadataRoute.Sitemap = villes.map((ville) => ({
    url: `${baseUrl}/ville/${generateSlug(ville.nom)}`,
    lastModified: dataDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Pages estimation par ville
  const estimationVillePages: MetadataRoute.Sitemap = villes.map((ville) => ({
    url: `${baseUrl}/estimation/${generateSlug(ville.nom)}`,
    lastModified: dataDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages, ...villePages, ...estimationVillePages];
}
