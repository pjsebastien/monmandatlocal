import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getWPPostBySlug,
  getAllWPPostSlugs,
  formatWPDate,
  formatISODate,
  getCanonicalUrl,
} from "@/lib/data/wordpress";
import { isReservedSlug, SITE_CONFIG } from "@/lib/config";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getAllWPPostSlugs();
    return slugs
      .filter((slug) => !isReservedSlug(slug))
      .map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (isReservedSlug(slug)) {
    return {};
  }

  const post = await getWPPostBySlug(slug);

  if (!post) {
    return {
      title: "Article non trouvé",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = getCanonicalUrl(slug, SITE_CONFIG.url);

  return {
    title: post.title,
    description: post.excerptText,
    openGraph: {
      title: post.title,
      description: post.excerptText,
      type: "article",
      url: canonicalUrl,
      publishedTime: formatISODate(post.date),
      modifiedTime: formatISODate(post.modified),
      images: post.featuredImage
        ? [{ url: post.featuredImage.sizes.full }]
        : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  if (isReservedSlug(slug)) {
    notFound();
  }

  const post = await getWPPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = getCanonicalUrl(slug, SITE_CONFIG.url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerptText,
    datePublished: formatISODate(post.date),
    dateModified: formatISODate(post.modified),
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
    image: post.featuredImage?.sizes.full,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center gap-2 text-blue-200 text-sm">
                <li>
                  <Link href="/" className="hover:text-white">
                    Accueil
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>/</li>
                <li className="text-blue-100 truncate max-w-[200px]">
                  {post.title}
                </li>
              </ol>
            </nav>

            {/* Catégorie */}
            {post.categories[0] && (
              <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                {post.categories[0].name}
              </span>
            )}

            {/* Titre */}
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              {post.author && <span>Par {post.author.name}</span>}
              <span>•</span>
              <time dateTime={post.date}>{formatWPDate(post.date)}</time>
              <span>•</span>
              <span>{post.readingTime} min de lecture</span>
            </div>
          </div>
        </header>

        {/* Image à la une */}
        {post.featuredImage && (
          <div className="max-w-4xl mx-auto px-4 -mt-6">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          </div>
        )}

        {/* Contenu */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: post.contentCleaned }}
            suppressHydrationWarning
          />
        </div>

        {/* Section maillage interne - Découvrir nos outils */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Découvrez nos outils immobiliers
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              MonMandatLocal.fr vous propose des outils gratuits pour mieux comprendre le marché immobilier et estimer la valeur de votre bien.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Estimation */}
              <Link
                href="/estimation"
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-emerald-400 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  Estimation immobilière
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Estimez gratuitement la valeur de votre appartement ou maison en 2 minutes.
                </p>
                <span className="text-emerald-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Estimer mon bien
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* Prix au m² */}
              <Link
                href="/villes"
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  Prix au m² par ville
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Consultez les prix immobiliers de 134 villes françaises avec données officielles.
                </p>
                <span className="text-indigo-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Voir les prix
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              {/* FAQ */}
              <Link
                href="/faq"
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  Questions fréquentes
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Trouvez les réponses à vos questions sur l&apos;immobilier et nos services.
                </p>
                <span className="text-amber-600 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Consulter la FAQ
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Villes populaires pour estimation */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Estimations populaires
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { ville: "Paris", slug: "paris" },
                  { ville: "Lyon", slug: "lyon" },
                  { ville: "Marseille", slug: "marseille" },
                  { ville: "Bordeaux", slug: "bordeaux" },
                  { ville: "Toulouse", slug: "toulouse" },
                  { ville: "Nantes", slug: "nantes" },
                  { ville: "Nice", slug: "nice" },
                  { ville: "Lille", slug: "lille" },
                ].map(({ ville, slug }) => (
                  <Link
                    key={slug}
                    href={`/estimation/${slug}`}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                  >
                    Estimation {ville}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer article */}
        <div className="border-t bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour au blog
              </Link>

              {/* Partage */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 mr-2">Partager</span>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Information :</strong> Cet article est fourni à titre informatif.
                Les informations ne constituent pas un conseil en investissement.
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
