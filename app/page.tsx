import Link from "next/link";
import Image from "next/image";
import { getWPPosts } from "@/lib/data/wordpress";
import { ArticleCard } from "@/components/ArticleCard";
import { getAllVilles, getVillesAvecDVF, generateSlug, formatPrix, formatNumber } from "@/lib/data/territorial";

export default async function HomePage() {
  // Récupérer les données
  const { posts: latestPosts } = await getWPPosts(1, 3);
  const allVilles = getAllVilles();
  const villesAvecDVF = getVillesAvecDVF();

  // Statistiques
  const totalVilles = allVilles.length;
  const villesDVF = villesAvecDVF.filter(v => !v.dvf?.is_estimation).length;
  const totalTransactions = villesAvecDVF.reduce((acc, v) => acc + (v.dvf?.nb_ventes_total || 0), 0);

  // Villes populaires (avec le plus de transactions)
  const villesPopulaires = villesAvecDVF
    .filter(v => !v.dvf?.is_estimation)
    .sort((a, b) => (b.dvf?.nb_ventes_total || 0) - (a.dvf?.nb_ventes_total || 0))
    .slice(0, 8);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
              Comprenez votre marché immobilier local
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Prix au m², statistiques par quartier, données officielles DVF et INSEE.
              Tout ce qu&apos;il faut pour prendre des décisions éclairées.
            </p>

            {/* Search CTA */}
            <div className="max-w-xl mx-auto">
              <Link
                href="/villes"
                className="flex items-center gap-3 bg-white text-gray-700 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all group"
              >
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="flex-1 text-left text-gray-500">
                  Rechercher une ville (Lyon, Bordeaux, Nantes...)
                </span>
                <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-lg">
                  {totalVilles} villes
                </span>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-3xl md:text-4xl font-bold">{totalVilles}</p>
                <p className="text-indigo-200 text-sm">villes couvertes</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-3xl md:text-4xl font-bold">{villesDVF}</p>
                <p className="text-indigo-200 text-sm">avec données DVF</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="text-3xl md:text-4xl font-bold">{formatNumber(totalTransactions)}</p>
                <p className="text-indigo-200 text-sm">transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Villes populaires */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Villes les plus consultées
                </h2>
                <p className="text-gray-600">
                  Accédez directement aux données de prix
                </p>
              </div>
              <Link
                href="/villes"
                className="mt-4 md:mt-0 inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700"
              >
                Voir toutes les villes
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {villesPopulaires.map((ville) => (
                <Link
                  key={ville.code_insee}
                  href={`/ville/${generateSlug(ville.nom)}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-indigo-300 transition-all group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                    {ville.nom}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    {ville.departement.name}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPrix(ville.dvf?.prix_m2_median_global ?? null)}/m²
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatNumber(ville.dvf?.nb_ventes_total || 0)} ventes
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ce que vous pouvez faire */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Que pouvez-vous faire sur MonMandatLocal ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Des outils gratuits pour comprendre le marché immobilier
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Consulter les prix par ville"
                description="Découvrez les prix médians au m², la fourchette de prix, et comparez appartements et maisons dans 134 villes françaises."
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                href="/villes"
                cta="Explorer les villes"
                color="indigo"
              />
              <FeatureCard
                title="Estimer votre bien"
                description="Obtenez une estimation indicative basée sur les transactions réelles de votre ville. Personnalisez selon le type, la surface et l'état."
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
                href="/estimation"
                cta="Estimer un bien"
                color="emerald"
              />
              <FeatureCard
                title="Analyser les quartiers"
                description="Comparez les prix entre quartiers d'une même ville. Identifiez les zones les plus chères et les opportunités."
                icon={
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                href="/quartiers"
                cta="Voir les quartiers"
                color="purple"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Données officielles */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Données vérifiées
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  100% données officielles
                </h2>
                <p className="text-gray-600 mb-6">
                  Toutes nos données proviennent de sources publiques et officielles.
                  Pas d&apos;estimations opaques, pas d&apos;algorithmes secrets.
                  Vous savez exactement d&apos;où viennent les chiffres.
                </p>
                <Link
                  href="/sources"
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700"
                >
                  Découvrir nos sources
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="space-y-4">
                <DataSourceCard
                  name="DVF - Demandes de Valeurs Foncières"
                  description="Toutes les transactions immobilières enregistrées par les notaires"
                  badge="Transactions"
                />
                <DataSourceCard
                  name="INSEE"
                  description="Données démographiques, logement et statistiques officielles"
                  badge="Démographie"
                />
                <DataSourceCard
                  name="Données de marché"
                  description="Pour les villes sans DVF, estimations basées sur plusieurs sources"
                  badge="Estimations"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {latestPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Derniers articles
                  </h2>
                  <p className="text-gray-600">
                    Conseils et actualités du marché immobilier
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="mt-4 md:mt-0 inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700"
                >
                  Tous les articles
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {latestPosts.map((post, index) => (
                  <ArticleCard
                    key={post.id}
                    post={post}
                    priority={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à explorer votre marché ?
            </h2>
            <p className="text-indigo-100 mb-8">
              Commencez par rechercher votre ville pour découvrir les prix au m²,
              les tendances et les statistiques de votre secteur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/villes"
                className="inline-flex items-center justify-center bg-white text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Rechercher une ville
              </Link>
              <Link
                href="/estimation"
                className="inline-flex items-center justify-center bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl hover:bg-indigo-400 transition-colors"
              >
                Estimer mon bien
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-slate-600">
              <strong>Information :</strong> MonMandatLocal.fr présente des données factuelles à titre indicatif.
              Ce site ne fournit aucun conseil en investissement et ne remplace pas une expertise professionnelle.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  href,
  cta,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  cta: string;
  color: "indigo" | "emerald" | "purple";
}) {
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      hover: "group-hover:bg-indigo-600",
    },
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      hover: "group-hover:bg-emerald-600",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      hover: "group-hover:bg-purple-600",
    },
  };

  const colors = colorClasses[color];

  return (
    <Link
      href={href}
      className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300"
    >
      <div className={`w-14 h-14 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center mb-6 ${colors.hover} group-hover:text-white transition-colors`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <span className={`inline-flex items-center ${colors.text} font-medium`}>
        {cta}
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

function DataSourceCard({
  name,
  description,
  badge,
}: {
  name: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="flex items-start gap-4 bg-gray-50 p-5 rounded-xl border border-gray-100">
      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}
