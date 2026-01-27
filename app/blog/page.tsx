import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWPPosts, formatWPDate } from "@/lib/data/wordpress";

export const metadata: Metadata = {
  title: "Blog immobilier - Actualités et conseils",
  description:
    "Découvrez nos articles sur le marché immobilier local : actualités, guides pratiques, conseils pour acheteurs et vendeurs. Informations basées sur des données officielles.",
  keywords: [
    "blog immobilier",
    "actualités immobilier",
    "conseils achat immobilier",
    "marché immobilier France",
    "prix immobilier",
  ],
  openGraph: {
    title: "Blog immobilier - MonMandatLocal.fr",
    description:
      "Actualités et conseils sur le marché immobilier local. Guides pratiques pour acheteurs et vendeurs.",
    type: "website",
    url: "https://monmandatlocal.fr/blog",
  },
  alternates: {
    canonical: "https://monmandatlocal.fr/blog",
  },
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const { posts, totalPages, totalPosts } = await getWPPosts(currentPage, 9);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog MonMandatLocal.fr",
    description: "Actualités et conseils sur le marché immobilier local",
    url: "https://monmandatlocal.fr/blog",
    publisher: {
      "@type": "Organization",
      name: "MonMandatLocal.fr",
      url: "https://monmandatlocal.fr",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header avec gradient */}
      <header className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            Actualités immobilières
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Notre Blog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Conseils, guides et actualités pour mieux comprendre le marché
            immobilier local.
          </p>
        </div>
        {/* Vague décorative */}
        <div className="h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 50C480 60 600 60 720 50C840 40 960 20 1080 15C1200 10 1320 20 1380 25L1440 30V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Section maillage interne - Outils en haut */}
        <section className="mb-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Besoin d&apos;estimer votre bien ?
              </h2>
              <p className="text-gray-600 text-sm">
                Obtenez une estimation gratuite en 2 minutes, basée sur les données officielles du marché.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/estimation"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Estimer mon bien
              </Link>
              <Link
                href="/villes"
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-lg font-medium border border-gray-200 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Prix par ville
              </Link>
            </div>
          </div>
        </section>

        {posts.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">
              Aucun article disponible pour le moment.
            </p>
          </div>
        ) : (
          <>
            {/* Article en vedette (premier de la page 1) */}
            {currentPage === 1 && posts[0] && (
              <FeaturedArticle post={posts[0]} />
            )}

            {/* Grille d'articles */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.slice(currentPage === 1 ? 1 : 0).map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalPosts={totalPosts}
              />
            )}

            {/* Section maillage interne - Estimations populaires */}
            <section className="mt-12 pt-12 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                Estimation immobilière par ville
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Obtenez une estimation gratuite de votre bien dans les principales villes françaises
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { ville: "Paris", slug: "paris", prix: "10 500 €/m²" },
                  { ville: "Lyon", slug: "lyon", prix: "5 200 €/m²" },
                  { ville: "Marseille", slug: "marseille", prix: "3 400 €/m²" },
                  { ville: "Bordeaux", slug: "bordeaux", prix: "4 800 €/m²" },
                  { ville: "Toulouse", slug: "toulouse", prix: "3 600 €/m²" },
                  { ville: "Nantes", slug: "nantes", prix: "4 100 €/m²" },
                  { ville: "Nice", slug: "nice", prix: "5 100 €/m²" },
                  { ville: "Lille", slug: "lille", prix: "3 500 €/m²" },
                ].map(({ ville, slug, prix }) => (
                  <Link
                    key={slug}
                    href={`/estimation/${slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-400 hover:shadow-md transition-all"
                  >
                    <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {ville}
                    </p>
                    <p className="text-sm text-gray-500">{prix}</p>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/estimation"
                  className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
                >
                  Voir toutes les villes
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </section>

            {/* Section liens utiles */}
            <section className="mt-12 bg-gray-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Ressources utiles
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  href="/faq"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200 transition-colors">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                      Questions fréquentes
                    </p>
                    <p className="text-sm text-gray-500">
                      Réponses à vos questions sur l&apos;immobilier
                    </p>
                  </div>
                </Link>

                <Link
                  href="/methodologie"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Notre méthodologie
                    </p>
                    <p className="text-sm text-gray-500">
                      Comment nous calculons les estimations
                    </p>
                  </div>
                </Link>

                <Link
                  href="/sources"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                      Sources des données
                    </p>
                    <p className="text-sm text-gray-500">
                      Données DVF, INSEE et sources officielles
                    </p>
                  </div>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}

function FeaturedArticle({ post }: { post: ReturnType<typeof getWPPosts> extends Promise<{ posts: (infer T)[] }> ? T : never }) {
  return (
    <article className="mb-12">
      <Link href={`/${post.slug}`} className="group block">
        <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
          {/* Image de fond */}
          {post.featuredImage && (
            <div className="absolute inset-0">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>
          )}

          <div className="relative p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.categories[0] && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full">
                  {post.categories[0].name}
                </span>
              )}
              <span className="bg-amber-400 text-amber-900 text-sm font-bold px-4 py-1.5 rounded-full">
                À la une
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 group-hover:text-amber-200 transition-colors">
              {post.title}
            </h2>

            <p className="text-blue-100 text-lg mb-6 line-clamp-2 max-w-2xl">
              {post.excerptText}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-blue-200 text-sm">
                <time dateTime={post.date}>{formatWPDate(post.date)}</time>
                <span>•</span>
                <span>{post.readingTime} min de lecture</span>
              </div>

              <span className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-full group-hover:bg-amber-400 group-hover:text-amber-900 transition-colors">
                Lire l&apos;article
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ArticleCard({ post }: { post: ReturnType<typeof getWPPosts> extends Promise<{ posts: (infer T)[] }> ? T : never }) {
  // Couleurs alternées pour les cartes sans image
  const gradients = [
    "from-rose-400 to-pink-500",
    "from-amber-400 to-orange-500",
    "from-emerald-400 to-teal-500",
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-violet-500",
    "from-cyan-400 to-blue-500",
  ];
  const gradientClass = gradients[post.id % gradients.length];

  return (
    <article className="group">
      <Link href={`/${post.slug}`} className="block h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
          {/* Image ou gradient */}
          <div className="relative aspect-[16/10] overflow-hidden">
            {post.featuredImage ? (
              <>
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </>
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Catégorie */}
            {post.categories[0] && (
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                {post.categories[0].name}
              </span>
            )}
          </div>

          {/* Contenu */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Meta */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={post.date}>{formatWPDate(post.date)}</time>
              <span className="text-gray-300">|</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readingTime} min</span>
            </div>

            {/* Titre */}
            <h2 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 flex-grow">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {post.excerptText}
            </p>

            {/* Lire la suite */}
            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
              <span>Lire l&apos;article</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalPosts,
}: {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}) {
  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <nav
      className="flex flex-col items-center gap-6 py-8"
      aria-label="Pagination du blog"
    >
      <p className="text-sm text-gray-500">
        Page <span className="font-semibold text-gray-700">{currentPage}</span> sur{" "}
        <span className="font-semibold text-gray-700">{totalPages}</span>
        <span className="mx-2">—</span>
        {totalPosts} articles au total
      </p>

      <div className="flex items-center gap-2">
        {/* Précédent */}
        {currentPage > 1 ? (
          <Link
            href={`/blog?page=${currentPage - 1}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-full hover:border-blue-500 hover:text-blue-600 transition-all font-medium"
            aria-label="Page précédente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Précédent</span>
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-full text-gray-300 cursor-not-allowed font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Précédent</span>
          </span>
        )}

        {/* Numéros */}
        <div className="hidden md:flex items-center gap-1">
          {pages.map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                …
              </span>
            ) : (
              <Link
                key={page}
                href={`/blog?page=${page}`}
                className={`min-w-[44px] text-center px-3 py-2.5 rounded-full font-medium transition-all ${
                  page === currentPage
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </Link>
            )
          )}
        </div>

        {/* Suivant */}
        {currentPage < totalPages ? (
          <Link
            href={`/blog?page=${currentPage + 1}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-600/30"
            aria-label="Page suivante"
          >
            <span className="hidden sm:inline">Suivant</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-full text-gray-300 cursor-not-allowed font-medium">
            <span className="hidden sm:inline">Suivant</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </nav>
  );
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}
