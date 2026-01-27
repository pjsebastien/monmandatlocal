import { Metadata } from "next";
import Link from "next/link";
import { getAllVilles } from "@/lib/data/territorial";
import { EstimationClient } from "./EstimationClient";

export const metadata: Metadata = {
  title: "Estimation immobilière gratuite | Mon Mandat Local",
  description:
    "Estimez la valeur de votre bien immobilier gratuitement. Données DVF 2025 officielles et estimations de marché pour 134 villes françaises. Appartements et maisons.",
  openGraph: {
    title: "Estimation immobilière gratuite",
    description:
      "Estimez la valeur de votre bien immobilier gratuitement avec les données DVF officielles et estimations de marché.",
  },
};

export default function EstimationIndexPage() {
  const villes = getAllVilles();
  const villesAvecDVF = villes.filter(
    (v) => v.dvf && v.dvf.prix_m2_median_global !== null
  );

  // Calculer les stats pour les villes avec DVF officiel vs estimations
  const villesAvecDVFOfficiel = villesAvecDVF.filter(
    (v) => !v.dvf?.is_estimation
  ).length;
  const villesAvecEstimation = villesAvecDVF.filter(
    (v) => v.dvf?.is_estimation
  ).length;

  // Extraire les régions uniques pour le filtre
  const regions = Array.from(
    new Set(villesAvecDVF.map((v) => v.region.name))
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-emerald-200 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Accueil
                </Link>
              </li>
              <li>/</li>
              <li className="text-emerald-100">Estimation immobilière</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Estimation immobilière gratuite
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl">
            Obtenez une estimation indicative de votre bien basée sur les
            données DVF officielles et les estimations de marché.
          </p>

          {/* Stats rapides */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold">
                {villesAvecDVF.length}
              </p>
              <p className="text-emerald-200 text-sm">Villes disponibles</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-emerald-300">
                {villesAvecDVFOfficiel}
              </p>
              <p className="text-emerald-200 text-sm">Données DVF officielles</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-3xl font-bold text-amber-300">
                {villesAvecEstimation}
              </p>
              <p className="text-emerald-200 text-sm">Estimations marché</p>
            </div>
          </div>

          {/* Légende */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-300"></span>
              <span className="text-emerald-200">DVF = Données officielles Etalab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-300"></span>
              <span className="text-emerald-200">Estimation = Prix estimés (non officiels)</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Comment ça marche */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comment fonctionne l&apos;estimation ?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Sélectionnez votre ville</h3>
              <p className="text-gray-600 text-sm">
                Choisissez parmi les {villesAvecDVF.length} villes disposant de
                données de prix (DVF officielles ou estimations marché).
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Décrivez votre bien</h3>
              <p className="text-gray-600 text-sm">
                Indiquez le type de bien (maison ou appartement) et sa surface.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Obtenez une fourchette</h3>
              <p className="text-gray-600 text-sm">
                Recevez une estimation indicative avec fourchette basse et haute.
              </p>
            </div>
          </div>
        </section>

        {/* Sélection de ville avec recherche */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sélectionnez votre ville
          </h2>
          <p className="text-gray-600 mb-8">
            {villesAvecDVFOfficiel} villes avec données DVF officielles et{" "}
            {villesAvecEstimation} villes avec estimations de marché.
          </p>

          <EstimationClient
            villes={villesAvecDVF}
            regions={regions}
          />
        </section>

        {/* Disclaimer */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-amber-900 mb-2">
            Estimation indicative
          </h3>
          <p className="text-sm text-amber-800 mb-3">
            Les estimations fournies sont basées sur deux types de données :
          </p>
          <ul className="text-sm text-amber-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
              <span>
                <strong>Données DVF officielles :</strong> Transactions réelles enregistrées par l&apos;État (source : Etalab DVF 2025).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
              <span>
                <strong>Estimations de marché :</strong> Prix estimés à partir de sources de marché (MeilleursAgents, SeLoger, Notaires de France). Ce ne sont pas des données officielles.
              </span>
            </li>
          </ul>
          <p className="text-sm text-amber-800 mt-3">
            Ces estimations ont un caractère purement indicatif et ne peuvent se substituer à
            l&apos;expertise d&apos;un professionnel de l&apos;immobilier.
          </p>
        </section>

        {/* CTA Pro */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-2">
            Besoin d&apos;une estimation professionnelle ?
          </h3>
          <p className="text-blue-100 mb-6 max-w-lg mx-auto">
            Pour une évaluation précise tenant compte de toutes les
            caractéristiques de votre bien, faites appel à un professionnel de
            l&apos;immobilier.
          </p>
          <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            Demander une estimation gratuite
          </button>
        </section>
      </main>
    </div>
  );
}
