import { Metadata } from "next";
import { getAllVilles, loadTerritorialData } from "@/lib/data/territorial";
import { VillesClient } from "./VillesClient";

export const metadata: Metadata = {
  title: "Toutes les villes | Prix immobilier et estimation | Mon Mandat Local",
  description:
    "Explorez les prix immobiliers de 134 villes françaises. Données DVF officielles et estimations de marché, prix au m², outils d'estimation. Trouvez votre ville et découvrez le marché immobilier local.",
  openGraph: {
    title: "Toutes les villes - Prix immobilier en France",
    description:
      "Consultez les prix immobiliers de 134 villes françaises : données DVF officielles et estimations de marché.",
  },
};

export default function VillesPage() {
  const data = loadTerritorialData();
  const villes = getAllVilles();

  // Extraire les régions uniques pour le filtre
  const regions = Array.from(
    new Set(villes.map((v) => v.region.name))
  ).sort();

  // Extraire les départements uniques
  const departements = Array.from(
    new Set(villes.map((v) => `${v.departement.code} - ${v.departement.name}`))
  ).sort((a, b) => a.localeCompare(b, "fr"));

  // Calculer les stats pour les villes avec DVF officiel vs estimations
  const villesAvecDVFOfficiel = villes.filter(
    (v) => v.dvf && v.dvf.prix_m2_median_global !== null && !v.dvf.is_estimation
  ).length;
  const villesAvecEstimation = villes.filter(
    (v) => v.dvf && v.dvf.is_estimation
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explorez le marché immobilier
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            {data.statistiques_globales.nb_villes} villes françaises avec prix au m²,
            estimations et analyses par quartier.
            Données DVF 2025 et estimations de marché.
          </p>

          {/* Stats rapides */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">
                {data.statistiques_globales.nb_villes}
              </p>
              <p className="text-slate-300 text-sm">Villes couvertes</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-emerald-400">
                {villesAvecDVFOfficiel}
              </p>
              <p className="text-slate-300 text-sm">Données DVF officielles</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-amber-400">
                {villesAvecEstimation}
              </p>
              <p className="text-slate-300 text-sm">Estimations marché</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">
                {(
                  data.statistiques_globales.total_ventes_dvf / 1000
                ).toFixed(0)}
                k
              </p>
              <p className="text-slate-300 text-sm">Transactions DVF 2025</p>
            </div>
          </div>

          {/* Légende */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">DVF = Données officielles Etalab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="text-slate-300">Estimation = Prix estimés (non officiels)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal avec filtres et liste */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <VillesClient
          villes={villes}
          regions={regions}
          departements={departements}
        />
      </main>
    </div>
  );
}
