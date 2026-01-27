import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getVilleBySlug,
  getVillesAvecDVF,
  getAllVilles,
  generateSlug,
  formatPrix,
} from "@/lib/data/territorial";
import { EstimationForm } from "./EstimationForm";

type Props = {
  params: Promise<{ ville: string }>;
};

export async function generateStaticParams() {
  const villes = getVillesAvecDVF();
  return villes.map((ville) => ({
    ville: generateSlug(ville.nom),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville: villeSlug } = await params;
  const ville = getVilleBySlug(villeSlug);

  if (!ville) {
    return { title: "Ville non trouvée" };
  }

  const prixM2 = ville.dvf?.prix_m2_median_global
    ? formatPrix(ville.dvf.prix_m2_median_global)
    : null;

  return {
    title: `Estimation immobilière ${ville.nom} : estimation gratuite en 2 minutes`,
    description: `Estimez gratuitement la valeur de votre bien à ${ville.nom}${prixM2 ? ` (prix médian : ${prixM2}/m²)` : ""}. Outil d'estimation en ligne basé sur ${ville.dvf?.nb_ventes_total || "les"} transactions réelles. Sans inscription, résultat immédiat.`,
    openGraph: {
      title: `Estimation immobilière ${ville.nom} : estimation gratuite en 2 minutes`,
      description: `Estimez la valeur de votre appartement ou maison à ${ville.nom}. Basé sur les prix réels du marché. Gratuit et sans engagement.`,
    },
  };
}

export default async function EstimationVillePage({ params }: Props) {
  const { ville: villeSlug } = await params;
  const ville = getVilleBySlug(villeSlug);

  if (!ville || !ville.dvf || ville.dvf.prix_m2_median_global === null) {
    notFound();
  }

  const dvf = ville.dvf;
  const isEstimation = dvf.is_estimation ?? false;

  // Villes similaires/proches pour estimation
  const allVilles = getAllVilles().filter(
    (v) => v.dvf && v.dvf.prix_m2_median_global !== null
  );

  // Villes du même département (hors ville actuelle)
  const villesDepartement = allVilles
    .filter((v) =>
      v.code_insee !== ville.code_insee &&
      v.departement.code === ville.departement.code
    )
    .sort((a, b) => (b.dvf?.nb_ventes_total || 0) - (a.dvf?.nb_ventes_total || 0))
    .slice(0, 4);

  // Villes de la même région (hors département)
  const villesRegion = allVilles
    .filter((v) =>
      v.code_insee !== ville.code_insee &&
      v.region.name === ville.region.name &&
      v.departement.code !== ville.departement.code
    )
    .sort((a, b) => (b.dvf?.nb_ventes_total || 0) - (a.dvf?.nb_ventes_total || 0))
    .slice(0, 3);

  // Villes populaires (grandes villes avec beaucoup de transactions)
  const villesPopulaires = allVilles
    .filter((v) =>
      v.code_insee !== ville.code_insee &&
      v.region.name !== ville.region.name &&
      !v.dvf?.is_estimation
    )
    .sort((a, b) => (b.dvf?.nb_ventes_total || 0) - (a.dvf?.nb_ventes_total || 0))
    .slice(0, 3);

  // Combiner pour avoir 9+ villes suggérées
  const villesSuggerees = [
    ...villesDepartement,
    ...villesRegion,
    ...villesPopulaires,
  ].slice(0, 9);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-emerald-200 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/estimation" className="hover:text-white">
                  Estimation
                </Link>
              </li>
              <li>/</li>
              <li className="text-emerald-100">{ville.nom}</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Estimation immobilière {ville.nom} : gratuite en 2 minutes
          </h1>
          <p className="text-emerald-100 text-lg mb-4">
            {ville.departement.name} ({ville.departement.code}) • {ville.region.name}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              100% gratuit
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Résultat immédiat
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Sans inscription
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction pédagogique */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-2">Comment fonctionne cette estimation ?</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Cette estimation indicative est calculée à partir des prix observés sur le marché immobilier
                de {ville.nom}. Elle vous donne un premier repère pour situer la valeur de votre bien.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                Pour une évaluation complète tenant compte des caractéristiques spécifiques de votre bien
                (état, emplacement exact, prestations), nous vous recommandons de consulter un professionnel
                de l&apos;immobilier.
              </p>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire */}
          <div className="lg:col-span-2">
            <EstimationForm ville={ville} isDataEstimation={isEstimation} />
          </div>

          {/* Sidebar avec données de référence */}
          <div className="space-y-6">
            {/* Prix de référence */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Repères de prix à {ville.nom}
              </h2>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Prix médian observé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrix(dvf.prix_m2_median_global)}/m²
                  </p>
                </div>
                {dvf.appartements && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Appartements</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrix(dvf.appartements.prix_m2_median)}/m²
                    </span>
                  </div>
                )}
                {dvf.maisons && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Maisons</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrix(dvf.maisons.prix_m2_median)}/m²
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Fourchette */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Fourchette de prix
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bas de marché</span>
                  <span className="font-medium text-gray-700">
                    {formatPrix(dvf.prix_m2_p25)}/m²
                  </span>
                </div>
                <div className="h-2 bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-200 rounded-full" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Haut de marché</span>
                  <span className="font-medium text-gray-700">
                    {formatPrix(dvf.prix_m2_p75)}/m²
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                50% des transactions se situent dans cette fourchette.
              </p>
            </div>

            {/* Besoin d'aide - Mini CTA */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Besoin d&apos;un avis professionnel ?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Un agent local peut affiner cette estimation gratuitement.
              </p>
              <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                Demander une estimation pro
              </button>
            </div>
          </div>
        </div>

        {/* CTA Principal après estimation */}
        <section className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold mb-2">
                Affinez votre estimation avec un expert local
              </h2>
              <p className="text-emerald-100">
                Un professionnel de l&apos;immobilier à {ville.nom} peut évaluer votre bien
                en tenant compte de ses caractéristiques uniques. Gratuit et sans engagement.
              </p>
            </div>
            <button className="bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors whitespace-nowrap shadow-lg">
              Estimation professionnelle gratuite
            </button>
          </div>
        </section>

        {/* Lien vers page ville */}
        <div className="mt-8 text-center">
          <Link
            href={`/ville/${villeSlug}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-2"
          >
            Voir le détail des prix à {ville.nom}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Section éducative : Comprendre le marché immobilier local */}
        <section className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comprendre le marché immobilier à {ville.nom}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contexte du marché */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Le marché en chiffres
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Le marché immobilier de <strong>{ville.nom}</strong> affiche un prix médian de{" "}
                  <strong className="text-gray-900">{formatPrix(dvf.prix_m2_median_global)}/m²</strong>.
                  {dvf.nb_ventes_total && (
                    <> Ce prix est calculé sur la base de <strong>{dvf.nb_ventes_total} transactions</strong> réalisées en 2025.</>
                  )}
                </p>
                {dvf.appartements && dvf.maisons && (
                  <p>
                    On observe une différence entre les appartements ({formatPrix(dvf.appartements.prix_m2_median)}/m²)
                    et les maisons ({formatPrix(dvf.maisons.prix_m2_median)}/m²).
                    {dvf.appartements.prix_m2_median > dvf.maisons.prix_m2_median
                      ? " Les appartements sont plus chers au m², ce qui est typique des centres-villes où le foncier est rare."
                      : " Les maisons sont plus chères au m², reflétant la demande pour les biens avec jardin."}
                  </p>
                )}
                <p>
                  La fourchette de prix s&apos;étend de {formatPrix(dvf.prix_m2_p25)}/m² (bas de marché) à{" "}
                  {formatPrix(dvf.prix_m2_p75)}/m² (haut de marché). Cette amplitude reflète la diversité
                  des biens disponibles : emplacement, état, prestations.
                </p>
              </div>
            </div>

            {/* Données démographiques */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Portrait de la ville
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>{ville.nom}</strong> compte <strong>{new Intl.NumberFormat("fr-FR").format(ville.stats_agregees.population_totale)} habitants</strong> répartis
                  dans <strong>{new Intl.NumberFormat("fr-FR").format(ville.stats_agregees.nb_menages)} ménages</strong>.
                </p>
                <p>
                  Le parc immobilier comprend <strong>{new Intl.NumberFormat("fr-FR").format(ville.stats_agregees.nb_logements)} logements</strong> dont{" "}
                  {new Intl.NumberFormat("fr-FR").format(ville.stats_agregees.nb_residences_principales)} résidences principales
                  et {new Intl.NumberFormat("fr-FR").format(ville.stats_agregees.nb_residences_secondaires)} résidences secondaires.
                </p>
                {ville.stats_agregees.taux_vacance_moyen_pct !== null && (
                  <p>
                    Le taux de vacance est de <strong>{ville.stats_agregees.taux_vacance_moyen_pct.toFixed(1)}%</strong>
                    {ville.stats_agregees.taux_vacance_moyen_pct < 5
                      ? ", indiquant un marché tendu où la demande est forte."
                      : ville.stats_agregees.taux_vacance_moyen_pct > 10
                      ? ", ce qui peut indiquer une offre abondante."
                      : ", un niveau équilibré pour le marché local."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Conseils pour bien estimer */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Conseils pour une estimation fiable
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">Comparez les biens similaires</p>
                <p className="text-sm text-gray-600">
                  Regardez les annonces de biens comparables au vôtre (même surface, même quartier)
                  pour affiner votre estimation.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">Tenez compte de l&apos;état</p>
                <p className="text-sm text-gray-600">
                  Un bien rénové peut valoir 10 à 20% de plus qu&apos;un bien à rafraîchir.
                  L&apos;état général est un facteur clé.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">L&apos;emplacement compte</p>
                <p className="text-sm text-gray-600">
                  La proximité des transports, commerces et écoles peut faire varier le prix
                  de 5 à 15% dans une même ville.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section FAQ pour les novices */}
        <section className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Questions fréquentes sur l&apos;estimation immobilière
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Qu&apos;est-ce qu&apos;une estimation immobilière ?
              </h3>
              <p className="text-gray-600">
                Une estimation immobilière consiste à évaluer la valeur marchande d&apos;un bien
                (appartement ou maison) en fonction des prix pratiqués sur le marché local.
                Elle vous donne une idée du prix auquel vous pourriez vendre votre bien,
                ou du montant à prévoir pour un achat. Cette estimation est indicative et peut
                varier selon les caractéristiques précises du bien.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Comment est calculé le prix au m² à {ville.nom} ?
              </h3>
              <p className="text-gray-600">
                Le prix au m² est calculé à partir des transactions immobilières réelles
                enregistrées par les notaires. Pour {ville.nom}, nous utilisons{" "}
                {isEstimation
                  ? "des estimations basées sur les tendances du marché régional et les données des portails immobiliers."
                  : `les données officielles DVF (Demandes de Valeurs Foncières) qui recensent ${dvf.nb_ventes_total || "les"} ventes réalisées en 2025.`
                }{" "}
                Le prix médian signifie que la moitié des transactions se sont faites au-dessus,
                et l&apos;autre moitié en-dessous de ce prix.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Quelle est la différence entre prix médian et prix moyen ?
              </h3>
              <p className="text-gray-600">
                Le <strong>prix médian</strong> divise les transactions en deux : 50% des ventes
                sont au-dessus, 50% en-dessous. Il est plus représentatif car il n&apos;est pas
                influencé par les biens exceptionnels (très chers ou très bon marché).
                Le <strong>prix moyen</strong> est la simple moyenne de tous les prix, mais peut
                être faussé par quelques transactions atypiques. C&apos;est pourquoi nous privilégions
                le prix médian dans nos estimations.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Pourquoi mon bien peut valoir plus ou moins que l&apos;estimation ?
              </h3>
              <p className="text-gray-600">
                L&apos;estimation en ligne se base sur des moyennes de marché. Votre bien peut valoir
                plus s&apos;il est en parfait état, bien situé, avec des prestations de qualité
                (parking, terrasse, vue dégagée). À l&apos;inverse, des travaux à prévoir, un étage
                sans ascenseur ou une exposition défavorable peuvent réduire sa valeur.
                Pour une estimation précise, un professionnel visitera votre bien.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Cette estimation est-elle gratuite et sans engagement ?
              </h3>
              <p className="text-gray-600">
                Oui, notre outil d&apos;estimation en ligne est 100% gratuit, sans inscription
                et sans engagement. Vous obtenez un résultat instantané basé sur les données
                du marché de {ville.nom}. Si vous souhaitez une estimation plus précise,
                vous pouvez demander l&apos;intervention gratuite d&apos;un professionnel local.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Que sont les données DVF ?
              </h3>
              <p className="text-gray-600">
                Les données DVF (Demandes de Valeurs Foncières) sont publiées par l&apos;État français
                via Etalab. Elles contiennent l&apos;ensemble des transactions immobilières enregistrées
                par les notaires : prix de vente, surface, type de bien, localisation.
                Ces données officielles et vérifiables constituent la source la plus fiable
                pour connaître les prix réels du marché immobilier.
              </p>
            </div>
          </div>
        </section>

        {/* Villes similaires pour estimation */}
        {villesSuggerees.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Estimer dans d&apos;autres villes
            </h2>

            {/* Villes du même département */}
            {villesDepartement.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Dans le {ville.departement.name} ({ville.departement.code})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {villesDepartement.map((v) => (
                    <VilleSuggereeCard key={v.code_insee} ville={v} />
                  ))}
                </div>
              </div>
            )}

            {/* Villes de la même région */}
            {villesRegion.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  En {ville.region.name}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {villesRegion.map((v) => (
                    <VilleSuggereeCard key={v.code_insee} ville={v} />
                  ))}
                </div>
              </div>
            )}

            {/* Villes populaires */}
            {villesPopulaires.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Villes populaires en France
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {villesPopulaires.map((v) => (
                    <VilleSuggereeCard key={v.code_insee} ville={v} />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* CTA Final */}
        <section className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Prêt à connaître la vraie valeur de votre bien ?
            </h2>
            <p className="text-gray-600 mb-6">
              Cette estimation en ligne vous donne un premier aperçu. Pour une évaluation
              précise et personnalisée, faites confiance à un professionnel local qui connaît
              le marché de {ville.nom}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                Demander une estimation gratuite
              </button>
              <Link
                href={`/ville/${villeSlug}`}
                className="bg-gray-100 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voir les prix détaillés
              </Link>
            </div>
          </div>
        </section>

        {/* Méthodologie et sources (disclaimer repositionné) */}
        <section className="mt-8 text-center">
          <details className="text-sm text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">
              Méthodologie et sources des données
            </summary>
            <div className="mt-4 text-left bg-gray-50 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="mb-2">
                {isEstimation ? (
                  <>
                    Les prix de référence pour {ville.nom} sont des estimations basées sur
                    l&apos;analyse de plusieurs sources de marché (portails immobiliers,
                    observatoires des notaires). Ces données sont indicatives.
                  </>
                ) : (
                  <>
                    Les prix de référence proviennent de la base DVF (Demandes de Valeurs
                    Foncières) publiée par Etalab, qui recense les transactions immobilières
                    réelles enregistrées en 2025.
                  </>
                )}
              </p>
              <p>
                Cette estimation ne constitue pas une évaluation officielle et ne peut
                remplacer l&apos;expertise d&apos;un professionnel de l&apos;immobilier.
              </p>
            </div>
          </details>
        </section>
      </main>
    </div>
  );
}

function VilleSuggereeCard({ ville }: { ville: { nom: string; code_insee: string; departement: { code: string; name: string }; dvf?: { prix_m2_median_global: number | null; is_estimation?: boolean; nb_ventes_total: number } | null } }) {
  const isEstimation = ville.dvf?.is_estimation ?? false;
  const hasDVF = ville.dvf && ville.dvf.prix_m2_median_global !== null;

  return (
    <Link
      href={`/estimation/${generateSlug(ville.nom)}`}
      className={`block bg-white rounded-xl border p-4 hover:shadow-lg transition-all group ${
        isEstimation ? "border-amber-200 hover:border-amber-400" : "border-gray-200 hover:border-emerald-400"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
          {ville.nom}
        </h4>
        {hasDVF && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${
              isEstimation
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isEstimation ? "Est." : "DVF"}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {ville.departement.name} ({ville.departement.code})
      </p>
      {hasDVF && (
        <p className={`text-lg font-bold ${isEstimation ? "text-amber-600" : "text-gray-900"}`}>
          {formatPrix(ville.dvf!.prix_m2_median_global)}/m²
        </p>
      )}
    </Link>
  );
}
