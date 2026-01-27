import Image from "next/image";
import Link from "next/link";
import { WPPost, formatWPDate } from "@/lib/data/wordpress";

interface ArticleCardProps {
  post: WPPost;
  variant?: "default" | "featured" | "compact" | "horizontal";
  priority?: boolean;
}

// Couleurs pour les cartes sans image
const gradients = [
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-violet-500",
  "from-cyan-400 to-blue-500",
];

export function ArticleCard({
  post,
  variant = "default",
  priority = false,
}: ArticleCardProps) {
  const gradientClass = gradients[post.id % gradients.length];

  if (variant === "compact") {
    return (
      <article className="group">
        <Link href={`/${post.slug}`} className="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors">
          {/* Image */}
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {post.featuredImage ? (
              <Image
                src={post.featuredImage.sizes.thumbnail || post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="80px"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1 text-sm">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <time dateTime={post.date}>{formatWPDate(post.date)}</time>
              <span>•</span>
              <span>{post.readingTime} min</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group">
        <Link href={`/${post.slug}`} className="flex flex-col md:flex-row gap-6 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
          {/* Image */}
          <div className="relative w-full md:w-72 aspect-video md:aspect-square overflow-hidden flex-shrink-0">
            {post.featuredImage ? (
              <>
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 288px"
                  priority={priority}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r" />
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

            {post.categories[0] && (
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                {post.categories[0].name}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col justify-center flex-1">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <time dateTime={post.date}>{formatWPDate(post.date)}</time>
              <span>•</span>
              <span>{post.readingTime} min de lecture</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
              {post.title}
            </h2>

            <p className="text-gray-600 line-clamp-2 mb-4">
              {post.excerptText}
            </p>

            <span className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
              Lire l&apos;article
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "featured") {
    return (
      <article className="group">
        <Link href={`/${post.slug}`} className="block">
          <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
            {post.featuredImage && (
              <div className="absolute inset-0">
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  className="object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority={priority}
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

  // Default variant
  return (
    <article className="group h-full">
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
                  priority={priority}
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
