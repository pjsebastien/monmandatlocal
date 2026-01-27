import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getVilleBySlug,
  getVillesAvecDVF,
  getAllVilles,
  generateSlug,
  formatPrix,
  formatNumber,
} from "@/lib/data/territorial";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const villes = getVillesAvecDVF();
  return villes.map((ville) => ({
    slug: generateSlug(ville.nom),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ville = getVilleBySlug(slug);

  if (!ville) {
    return { title: "Ville non trouvée" };
  }

  const prixM2 = ville.dvf?.prix_m2_median_global;
  const isEstimation = ville.dvf?.is_estimation ?? false;
  const nbVentes = ville.dvf?.nb_ventes_total;

  const description = prixM2
    ? `Prix immobilier à ${ville.nom} : ${formatPrix(prixM2)}/m² (médian). Données DVF 2025, statistiques par quartier, contexte démographique.`
    : `Prix immobilier à ${ville.nom} : statistiques du marché, données démographiques et logement. Source INSEE.`;

  return {
    title: `Prix immobilier ${ville.nom} : prix au m² et données du marché`,
    description,
    openGraph: {
      title: `Prix immobilier ${ville.nom} : prix au m² et données du marché`,
      description,
    },
  };
}

export default async function VillePrixPage({ params }: Props) {
  const { slug } = await params;
  const ville = getVilleBySlug(slug);

  if (!ville) {
    notFound();
  }

  const dvf = ville.dvf;
  const hasDVF = dvf && dvf.prix_m2_median_global !== null;
  const isEstimation = dvf?.is_estimation ?? false;
  const stats = ville.stats_agregees;

  // Quartiers avec données DVF triés par prix
  const quartiersAvecDVF = ville.quartiers
    .filter((q) => q.dvf && q.dvf.prix_m2_median > 0)
    .sort((a, b) => (b.dvf?.prix_m2_median || 0) - (a.dvf?.prix_m2_median || 0));

  // Villes similaires/proches
  const allVilles = getAllVilles();

  // Villes du même département (hors ville actuelle)
  const villesDepartement = allVilles
    .filter((v) =>
      v.code_insee !== ville.code_insee &&
      v.departement.code === ville.departement.code &&
      v.dvf?.prix_m2_median_global
    )
    .sort((a, b) => (b.dvf?.nb_ventes_total || 0) - (a.dvf?.nb_ventes_total || 0))
    .slice(0, 4);

  // Villes de la même région (hors département)
  const villesRegion = allVilles
    .filter((v) =>
      v.code_insee !== ville.code_insee &&
      v.region.name === ville.region.name &&
      v.departement.code !== ville.departement.code &&
      v.dvf?.prix_m2_median_global
    )
    .sort((a, b) => (b.dvf?.nb_ventes_total || 0) - (a.dvf?.nb_ventes_total || 0))
    .slice(0, 3);

  // Villes populaires (grandes villes avec beaucoup de transactions)
  const villesPopulaires = allVilles
    .filter((v) =>
      v.code_insee !== ville.code_insee &&
      v.region.name !== ville.region.name &&
      v.dvf?.prix_m2_median_global &&
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
      <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-indigo-200 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/villes" className="hover:text-white">
                  Villes
                </Link>
              </li>
              <li>/</li>
              <li className="text-indigo-100">{ville.nom}</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Prix immobilier {ville.nom} : {hasDVF ? formatPrix(dvf.prix_m2_median_global) + "/m² (prix médian)" : "prix au m² et données du marché"}
          </h1>
          <p className="text-indigo-100 mb-4">
            {ville.departement.name} ({ville.departement.code}) • {ville.region.name}
          </p>

          {/* Badges de confiance */}
          <div className="flex flex-wrap gap-3 text-sm mb-8">
            <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {isEstimation ? "Prix de marché" : "Données DVF officielles"}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              Mis à jour en 2026
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {formatNumber(stats.population_totale)} habitants
            </span>
          </div>

          {/* Prix médian en vedette */}
          {hasDVF && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                <p className="text-indigo-200 text-sm mb-1">Prix médian</p>
                <p className="text-3xl font-bold">
                  {formatPrix(dvf.prix_m2_median_global)}
                  <span className="text-lg font-normal">/m²</span>
                </p>
              </div>
              {dvf.appartements && (
                <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                  <p className="text-indigo-200 text-sm mb-1">Appartements</p>
                  <p className="text-3xl font-bold">
                    {formatPrix(dvf.appartements.prix_m2_median)}
                    <span className="text-lg font-normal">/m²</span>
                  </p>
                </div>
              )}
              {dvf.maisons && (
                <div className="bg-white/10 backdrop-blur rounded-xl p-5">
                  <p className="text-indigo-200 text-sm mb-1">Maisons</p>
                  <p className="text-3xl font-bold">
                    {formatPrix(dvf.maisons.prix_m2_median)}
                    <span className="text-lg font-normal">/m²</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Prix au m² */}
        {hasDVF ? (
          <section className="mb-12">
            {/* Note pour données estimées */}
            {isEstimation && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-slate-800">Prix de marché</p>
                    <p className="text-sm text-slate-600">
                      Prix basés sur l&apos;analyse du marché immobilier local
                      (sources : MeilleursAgents, SeLoger, Notaires de France).
                    </p>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Prix au m² à {ville.nom}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Appartements */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Appartements</h3>
                </div>
                {dvf.appartements ? (
                  <>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {formatPrix(dvf.appartements.prix_m2_median)}/m²
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Fourchette : {formatPrix(dvf.appartements.prix_m2_p25)} - {formatPrix(dvf.appartements.prix_m2_p75)}/m²</p>
                      {isEstimation ? (
                        <p className="text-gray-500">Source : données de marché</p>
                      ) : (
                        <p>{formatNumber(dvf.appartements.nb_ventes)} ventes en 2025</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Données non disponibles</p>
                )}
              </div>

              {/* Maisons */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Maisons</h3>
                </div>
                {dvf.maisons ? (
                  <>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {formatPrix(dvf.maisons.prix_m2_median)}/m²
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Fourchette : {formatPrix(dvf.maisons.prix_m2_p25)} - {formatPrix(dvf.maisons.prix_m2_p75)}/m²</p>
                      {isEstimation ? (
                        <p className="text-gray-500">Source : données de marché</p>
                      ) : (
                        <p>{formatNumber(dvf.maisons.nb_ventes)} ventes en 2025</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">Données non disponibles</p>
                )}
              </div>
            </div>

            {/* Fourchette globale */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Fourchette de prix observée</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">25% des biens</p>
                  <p className="font-semibold text-gray-700">&lt; {formatPrix(dvf.prix_m2_p25)}/m²</p>
                </div>
                <div className="flex-1 h-3 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-full" />
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">75% des biens</p>
                  <p className="font-semibold text-gray-700">&lt; {formatPrix(dvf.prix_m2_p75)}/m²</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Prix médian : <strong>{formatPrix(dvf.prix_m2_median_global)}/m²</strong>
              </p>
            </div>
          </section>
        ) : (
          <section className="mb-12">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h2 className="font-semibold text-amber-900 mb-2">Données de prix non disponibles</h2>
              <p className="text-amber-800 text-sm">
                Les données de transactions immobilières (DVF) ne sont pas disponibles pour {ville.nom}.
                Seules les statistiques démographiques et de logement sont affichées.
              </p>
            </div>
          </section>
        )}

        {/* Différences entre quartiers */}
        {quartiersAvecDVF.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Prix par quartier à {ville.nom}
            </h2>
            <p className="text-gray-600 mb-6">
              {quartiersAvecDVF.length} quartiers avec données de prix disponibles sur {ville.nb_quartiers_iris} quartiers IRIS.
            </p>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Quartier</th>
                      <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Prix médian/m²</th>
                      <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">Nb ventes</th>
                      <th className="text-right px-6 py-3 text-sm font-semibold text-gray-700">vs Ville</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quartiersAvecDVF.slice(0, 15).map((quartier) => {
                      const prixQuartier = quartier.dvf!.prix_m2_median;
                      const prixVille = dvf!.prix_m2_median_global!;
                      const diff = ((prixQuartier - prixVille) / prixVille) * 100;
                      return (
                        <tr key={quartier.iris_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{quartier.nom_quartier}</p>
                            <p className="text-xs text-gray-500">{quartier.nom_commune}</p>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-gray-900">
                            {formatPrix(prixQuartier)}/m²
                          </td>
                          <td className="px-6 py-4 text-right text-gray-600">
                            {formatNumber(quartier.dvf!.nb_ventes)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                              diff > 0
                                ? "bg-red-100 text-red-700"
                                : diff < 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}>
                              {diff > 0 ? "+" : ""}{diff.toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {quartiersAvecDVF.length > 15 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600">
                    + {quartiersAvecDVF.length - 15} autres quartiers
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Contexte démographique et logement */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contexte local à {ville.nom}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Population"
              value={formatNumber(stats.population_totale)}
              source="INSEE 2022"
            />
            <StatCard
              label="Ménages"
              value={formatNumber(stats.nb_menages)}
              source="INSEE 2022"
            />
            <StatCard
              label="Logements"
              value={formatNumber(stats.nb_logements)}
              source="INSEE 2013"
            />
            <StatCard
              label="Taux de vacance"
              value={stats.taux_vacance_moyen_pct !== null ? `${stats.taux_vacance_moyen_pct.toFixed(1)}%` : "N/A"}
              source="INSEE"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <StatCard
              label="Résidences principales"
              value={formatNumber(stats.nb_residences_principales)}
              subvalue={`${((stats.nb_residences_principales / stats.nb_logements) * 100).toFixed(1)}% du parc`}
            />
            <StatCard
              label="Résidences secondaires"
              value={formatNumber(stats.nb_residences_secondaires)}
              subvalue={`${((stats.nb_residences_secondaires / stats.nb_logements) * 100).toFixed(1)}% du parc`}
            />
            <StatCard
              label="Logements vacants"
              value={formatNumber(stats.nb_logements_vacants)}
              subvalue={`${((stats.nb_logements_vacants / stats.nb_logements) * 100).toFixed(1)}% du parc`}
            />
          </div>

          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quartiers IRIS</h3>
            <p className="text-gray-600">
              {ville.nom} est divisée en <strong>{ville.nb_quartiers_iris} quartiers IRIS</strong> (Îlots Regroupés pour l&apos;Information Statistique),
              permettant une analyse fine du territoire.
            </p>
          </div>
        </section>

        {/* Section analyse du marché */}
        <section className="mb-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Analyse du marché immobilier à {ville.nom}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Synthèse du marché */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Synthèse des prix
              </h3>
              <div className="space-y-4 text-gray-600">
                {hasDVF && (
                  <>
                    <p>
                      À <strong>{ville.nom}</strong>, le prix immobilier médian s&apos;établit à{" "}
                      <strong className="text-gray-900">{formatPrix(dvf.prix_m2_median_global)}/m²</strong>.
                      {!isEstimation && dvf.nb_ventes_total && (
                        <> Ce prix est calculé sur <strong>{formatNumber(dvf.nb_ventes_total)} transactions</strong> enregistrées en 2025.</>
                      )}
                    </p>
                    {dvf.appartements && dvf.maisons && (
                      <p>
                        Les <strong>appartements</strong> se négocient en moyenne à {formatPrix(dvf.appartements.prix_m2_median)}/m²,
                        tandis que les <strong>maisons</strong> affichent un prix de {formatPrix(dvf.maisons.prix_m2_median)}/m².
                        {dvf.appartements.prix_m2_median > dvf.maisons.prix_m2_median
                          ? " Cette différence s'explique par la localisation des appartements, souvent plus centraux."
                          : " Les maisons avec terrain sont particulièrement prisées dans cette commune."}
                      </p>
                    )}
                    <p>
                      La <strong>fourchette de prix</strong> s&apos;étend de {formatPrix(dvf.prix_m2_p25)}/m² à {formatPrix(dvf.prix_m2_p75)}/m²,
                      soit un écart de {formatPrix((dvf.prix_m2_p75 || 0) - (dvf.prix_m2_p25 || 0))}/m² entre le bas et le haut du marché.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Profil de la ville */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Profil immobilier
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Avec <strong>{formatNumber(stats.population_totale)} habitants</strong> et{" "}
                  <strong>{formatNumber(stats.nb_logements)} logements</strong>, {ville.nom} présente
                  un ratio de {(stats.nb_logements / stats.population_totale * 1000).toFixed(0)} logements
                  pour 1000 habitants.
                </p>
                <p>
                  Le parc est composé à <strong>{((stats.nb_residences_principales / stats.nb_logements) * 100).toFixed(0)}%</strong> de
                  résidences principales, ce qui indique {stats.nb_residences_principales / stats.nb_logements > 0.85
                    ? "une forte occupation résidentielle."
                    : stats.nb_residences_secondaires / stats.nb_logements > 0.15
                    ? "une attractivité touristique significative."
                    : "un équilibre entre résidences principales et secondaires."}
                </p>
                {stats.taux_vacance_moyen_pct !== null && (
                  <p>
                    Le <strong>taux de vacance</strong> de {stats.taux_vacance_moyen_pct.toFixed(1)}%{" "}
                    {stats.taux_vacance_moyen_pct < 5
                      ? "témoigne d'un marché tendu où l'offre est limitée."
                      : stats.taux_vacance_moyen_pct > 10
                      ? "suggère une offre relativement abondante."
                      : "indique un marché équilibré."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Points clés à retenir */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Points clés du marché</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="font-medium text-indigo-900 mb-1">Niveau de prix</p>
                <p className="text-sm text-indigo-700">
                  {hasDVF && dvf.prix_m2_median_global
                    ? dvf.prix_m2_median_global > 5000
                      ? "Marché haut de gamme, prix supérieurs à la moyenne nationale."
                      : dvf.prix_m2_median_global > 3000
                      ? "Prix dans la moyenne nationale, marché accessible."
                      : "Prix attractifs, opportunités d'investissement."
                    : "Données en cours de collecte."}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="font-medium text-purple-900 mb-1">Dynamisme</p>
                <p className="text-sm text-purple-700">
                  {hasDVF && !isEstimation && dvf.nb_ventes_total
                    ? dvf.nb_ventes_total > 500
                      ? "Marché très actif avec un volume important de transactions."
                      : dvf.nb_ventes_total > 100
                      ? "Activité régulière, liquidité satisfaisante."
                      : "Volume modéré, bien cibler les opportunités."
                    : "Estimations basées sur les tendances régionales."}
                </p>
              </div>
              <div className="bg-teal-50 rounded-lg p-4">
                <p className="font-medium text-teal-900 mb-1">Type de biens</p>
                <p className="text-sm text-teal-700">
                  {dvf?.appartements && dvf?.maisons
                    ? dvf.appartements.nb_ventes > dvf.maisons.nb_ventes
                      ? "Dominante d'appartements, profil urbain."
                      : "Dominante de maisons, cadre résidentiel."
                    : "Mix équilibré appartements/maisons."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ sur les prix immobiliers */}
        <section className="mb-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Questions fréquentes sur les prix à {ville.nom}
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Comment sont calculés les prix immobiliers affichés ?
              </h3>
              <p className="text-gray-600">
                {isEstimation ? (
                  <>
                    Pour {ville.nom}, nous affichons des <strong>estimations</strong> basées sur l&apos;analyse
                    de multiples sources du marché (MeilleursAgents, SeLoger, Notaires de France).
                    Ces prix sont indicatifs et peuvent différer des transactions réelles.
                  </>
                ) : (
                  <>
                    Les prix proviennent de la base <strong>DVF (Demandes de Valeurs Foncières)</strong>,
                    qui recense toutes les transactions immobilières enregistrées par les notaires.
                    Ce sont des données officielles et vérifiables, basées sur {formatNumber(dvf?.nb_ventes_total)} ventes en 2025.
                  </>
                )}
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Que signifie le prix médian au m² ?
              </h3>
              <p className="text-gray-600">
                Le <strong>prix médian</strong> est la valeur qui sépare les transactions en deux parts égales :
                50% des biens se sont vendus au-dessus de ce prix, 50% en-dessous. C&apos;est un indicateur
                plus fiable que la moyenne car il n&apos;est pas influencé par les ventes exceptionnelles
                (biens de luxe ou braderies). À {ville.nom}, le prix médian est de{" "}
                {hasDVF ? formatPrix(dvf.prix_m2_median_global) : "N/A"}/m².
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Pourquoi les prix varient entre appartements et maisons ?
              </h3>
              <p className="text-gray-600">
                Plusieurs facteurs expliquent cette différence : <strong>l&apos;emplacement</strong> (les appartements
                sont souvent plus centraux), <strong>le terrain</strong> (les maisons incluent généralement un jardin
                dont la valeur au m² est moindre), et <strong>la demande locale</strong>. À {ville.nom},{" "}
                {dvf?.appartements && dvf?.maisons ? (
                  dvf.appartements.prix_m2_median > dvf.maisons.prix_m2_median
                    ? `les appartements sont ${((dvf.appartements.prix_m2_median / dvf.maisons.prix_m2_median - 1) * 100).toFixed(0)}% plus chers au m² que les maisons.`
                    : `les maisons sont ${((dvf.maisons.prix_m2_median / dvf.appartements.prix_m2_median - 1) * 100).toFixed(0)}% plus chères au m² que les appartements.`
                ) : "les données par type de bien sont en cours de consolidation."}
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Qu&apos;est-ce que la fourchette P25-P75 ?
              </h3>
              <p className="text-gray-600">
                La fourchette <strong>P25-P75</strong> (25e et 75e percentiles) indique la plage de prix
                où se situent <strong>50% des transactions</strong>. Les 25% les moins chers sont en-dessous de P25,
                les 25% les plus chers sont au-dessus de P75. À {ville.nom}, cette fourchette va de{" "}
                {hasDVF ? `${formatPrix(dvf.prix_m2_p25)} à ${formatPrix(dvf.prix_m2_p75)}/m²` : "N/A"}.
                Cette amplitude reflète la diversité des biens et des quartiers.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Comment les prix varient selon les quartiers ?
              </h3>
              <p className="text-gray-600">
                Les prix peuvent varier significativement d&apos;un quartier à l&apos;autre selon la proximité
                des transports, commerces, écoles, et la qualité du cadre de vie. À {ville.nom},{" "}
                {quartiersAvecDVF.length > 0 ? (
                  <>
                    nous avons identifié <strong>{quartiersAvecDVF.length} quartiers</strong> avec des données de prix.
                    L&apos;écart peut atteindre{" "}
                    {quartiersAvecDVF.length >= 2
                      ? formatPrix((quartiersAvecDVF[0].dvf?.prix_m2_median || 0) - (quartiersAvecDVF[quartiersAvecDVF.length - 1].dvf?.prix_m2_median || 0))
                      : "plusieurs centaines d'euros"
                    }/m² entre le quartier le plus cher et le moins cher.
                  </>
                ) : (
                  "les données par quartier sont en cours de consolidation."
                )}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Comment utiliser ces données pour mon projet ?
              </h3>
              <p className="text-gray-600">
                Ces prix vous donnent un <strong>premier repère</strong> pour évaluer un bien ou préparer une négociation.
                Pour une estimation précise, prenez en compte : l&apos;état du bien, son étage, l&apos;exposition,
                les prestations (parking, balcon, cave). Un écart de 10 à 20% par rapport au prix médian
                est courant selon ces critères. Pour une évaluation personnalisée,{" "}
                <Link href={`/estimation/${slug}`} className="text-indigo-600 hover:underline">
                  utilisez notre outil d&apos;estimation gratuit
                </Link>.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Estimation */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-2xl font-bold mb-2">
                  Estimer votre bien à {ville.nom}
                </h2>
                <p className="text-emerald-100">
                  Obtenez une estimation personnalisée en 2 minutes, basée sur ces données de marché.
                  Gratuit et sans engagement.
                </p>
              </div>
              <Link
                href={`/estimation/${slug}`}
                className="inline-block bg-white text-emerald-700 font-semibold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors whitespace-nowrap shadow-lg text-center"
              >
                Estimation gratuite
              </Link>
            </div>
          </div>
        </section>

        {/* Sources et méthodologie */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sources et méthodologie
          </h2>
          <div className="space-y-4 text-sm text-gray-600">
            {isEstimation ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
                  <h3 className="font-medium text-gray-900">Données de prix (Marché)</h3>
                </div>
                <p>
                  Les prix affichés pour {ville.nom} sont basés sur l&apos;analyse
                  de multiples sources de marché (MeilleursAgents, SeLoger, Notaires de France).
                </p>
                <p className="mt-2 text-gray-500">
                  Mis à jour en 2026
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                  <h3 className="font-medium text-gray-900">Données de prix (DVF officiel)</h3>
                </div>
                <p>
                  Les prix immobiliers proviennent de la base DVF (Demandes de Valeurs Foncières)
                  publiée par Etalab, qui recense toutes les transactions immobilières en France.
                  Données de l&apos;année 2025.
                </p>
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">Données démographiques (INSEE)</h3>
              <p>
                Population : Recensement INSEE 2022.
                Logements : Base INSEE 2013.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Calculs</h3>
              <p>
                Les prix médians représentent la valeur centrale {isEstimation ? "estimée" : "des transactions observées"}
                (50% des biens {isEstimation ? "estimés" : "vendus"} au-dessus, 50% en-dessous).
                Les fourchettes (P25-P75) indiquent où se situent 50% des {isEstimation ? "valeurs" : "transactions"}.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-500">
                <strong>Note :</strong> Ces données sont fournies à titre informatif
                et ne constituent pas un conseil en investissement. Les prix peuvent varier
                significativement selon les caractéristiques spécifiques de chaque bien.
              </p>
            </div>
          </div>
        </section>

        {/* Villes similaires */}
        {villesSuggerees.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Découvrir d&apos;autres villes
            </h2>

            {/* Villes du même département */}
            {villesDepartement.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  subvalue,
  source,
}: {
  label: string;
  value: string;
  subvalue?: string;
  source?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subvalue && <p className="text-sm text-gray-500 mt-1">{subvalue}</p>}
      {source && <p className="text-xs text-gray-400 mt-2">{source}</p>}
    </div>
  );
}

function VilleSuggereeCard({ ville }: { ville: { nom: string; code_insee: string; departement: { code: string; name: string }; dvf?: { prix_m2_median_global: number | null; is_estimation?: boolean; nb_ventes_total: number } | null } }) {
  const isEstimation = ville.dvf?.is_estimation ?? false;
  const hasDVF = ville.dvf && ville.dvf.prix_m2_median_global !== null;

  return (
    <Link
      href={`/ville/${generateSlug(ville.nom)}`}
      className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-400 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-semibold group-hover:text-indigo-600 transition-colors">
          {ville.nom}
        </h4>
        {hasDVF && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${
              isEstimation
                ? "bg-slate-100 text-slate-600"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isEstimation ? "Marché" : "DVF"}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {ville.departement.name} ({ville.departement.code})
      </p>
      {hasDVF && (
        <p className="text-lg font-bold text-gray-900">
          {formatPrix(ville.dvf!.prix_m2_median_global)}/m²
        </p>
      )}
    </Link>
  );
}
