"use client";

import { useState } from "react";
import {
  Ville,
  calculerEstimation,
  formatPrix,
  formatNumber,
  CriteresEstimation,
  EtatBien,
  AncienneteBien,
  EtageAppartement,
} from "@/lib/data/territorial-types";

interface EstimationFormProps {
  ville: Ville;
  isDataEstimation?: boolean;
}

export function EstimationForm({ ville }: EstimationFormProps) {
  const [typeBien, setTypeBien] = useState<"appartement" | "maison">("appartement");
  const [surface, setSurface] = useState<string>("");
  const [showCriteresAvances, setShowCriteresAvances] = useState(false);

  // Critères avancés
  const [etat, setEtat] = useState<EtatBien | "">("");
  const [anciennete, setAnciennete] = useState<AncienneteBien | "">("");
  const [surfaceTerrain, setSurfaceTerrain] = useState<string>("");
  const [etage, setEtage] = useState<EtageAppartement | "">("");
  const [ascenseur, setAscenseur] = useState<boolean | null>(null);

  const [estimation, setEstimation] = useState<ReturnType<typeof calculerEstimation> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const surfaceNum = parseFloat(surface);
    if (isNaN(surfaceNum) || surfaceNum <= 0) return;

    // Construire les critères
    const criteres: CriteresEstimation = {};
    if (etat) criteres.etat = etat;
    if (anciennete) criteres.anciennete = anciennete;
    if (typeBien === "maison" && surfaceTerrain) {
      const terrainNum = parseFloat(surfaceTerrain);
      if (!isNaN(terrainNum) && terrainNum > 0) {
        criteres.surfaceTerrain = terrainNum;
      }
    }
    if (typeBien === "appartement") {
      if (etage) criteres.etage = etage;
      if (ascenseur !== null) criteres.ascenseur = ascenseur;
    }

    const result = calculerEstimation(ville, typeBien, surfaceNum, criteres);
    setEstimation(result);
  };

  const hasAppartements = ville.dvf?.appartements;
  const hasMaisons = ville.dvf?.maisons;

  // Labels pour les sélecteurs
  const etatLabels: Record<EtatBien, string> = {
    renover: "À rénover",
    correct: "Correct, quelques travaux",
    bon: "Bon état général",
    excellent: "Excellent état / refait à neuf",
  };

  const ancienneteLabels: Record<AncienneteBien, string> = {
    neuf: "Neuf (moins de 5 ans)",
    recent: "Récent (5-15 ans)",
    annees_90: "Années 90-2000",
    annees_70: "Années 70-80",
    ancien: "Ancien (avant 1970)",
    tres_ancien: "Très ancien (avant 1950)",
  };

  const etageLabels: Record<EtageAppartement, string> = {
    rdc: "Rez-de-chaussée",
    bas: "Étage bas (1er-2e)",
    intermediaire: "Étage intermédiaire",
    eleve: "Étage élevé",
    dernier: "Dernier étage",
  };

  return (
    <div className="space-y-6">
      {/* Formulaire */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Décrivez votre bien
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de bien */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de bien
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setTypeBien("appartement");
                  setSurfaceTerrain("");
                }}
                disabled={!hasAppartements}
                className={`p-4 rounded-lg border-2 transition-all ${
                  typeBien === "appartement"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${!hasAppartements ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <svg
                  className={`w-8 h-8 mx-auto mb-2 ${typeBien === "appartement" ? "text-emerald-600" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className={`font-medium ${typeBien === "appartement" ? "text-emerald-700" : "text-gray-700"}`}>
                  Appartement
                </span>
                {!hasAppartements && (
                  <span className="block text-xs text-gray-400 mt-1">
                    Données non disponibles
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTypeBien("maison");
                  setEtage("");
                  setAscenseur(null);
                }}
                disabled={!hasMaisons}
                className={`p-4 rounded-lg border-2 transition-all ${
                  typeBien === "maison"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${!hasMaisons ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <svg
                  className={`w-8 h-8 mx-auto mb-2 ${typeBien === "maison" ? "text-emerald-600" : "text-gray-400"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className={`font-medium ${typeBien === "maison" ? "text-emerald-700" : "text-gray-700"}`}>
                  Maison
                </span>
                {!hasMaisons && (
                  <span className="block text-xs text-gray-400 mt-1">
                    Données non disponibles
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Surface */}
          <div>
            <label htmlFor="surface" className="block text-sm font-medium text-gray-700 mb-2">
              Surface habitable
            </label>
            <div className="relative">
              <input
                type="number"
                id="surface"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                placeholder="Ex: 75"
                min="9"
                max="500"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                m²
              </span>
            </div>
          </div>

          {/* Toggle critères avancés */}
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setShowCriteresAvances(!showCriteresAvances)}
              className="flex items-center justify-between w-full text-left"
            >
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Affiner mon estimation
                </span>
                <span className="block text-xs text-gray-500">
                  Ajoutez des détails pour une estimation plus personnalisée
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${showCriteresAvances ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Critères avancés */}
          {showCriteresAvances && (
            <div className="space-y-5 bg-gray-50 rounded-lg p-4 -mx-2">
              {/* État du bien */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  État général du bien
                </label>
                <select
                  value={etat}
                  onChange={(e) => setEtat(e.target.value as EtatBien | "")}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="">Non précisé</option>
                  {Object.entries(etatLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Ancienneté */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de construction
                </label>
                <select
                  value={anciennete}
                  onChange={(e) => setAnciennete(e.target.value as AncienneteBien | "")}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="">Non précisé</option>
                  {Object.entries(ancienneteLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Champs spécifiques appartement */}
              {typeBien === "appartement" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Étage
                    </label>
                    <select
                      value={etage}
                      onChange={(e) => setEtage(e.target.value as EtageAppartement | "")}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                    >
                      <option value="">Non précisé</option>
                      {Object.entries(etageLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {etage && etage !== "rdc" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ascenseur
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setAscenseur(true)}
                          className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                            ascenseur === true
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          onClick={() => setAscenseur(false)}
                          className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                            ascenseur === false
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          Non
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Champs spécifiques maison */}
              {typeBien === "maison" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface du terrain
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={surfaceTerrain}
                      onChange={(e) => setSurfaceTerrain(e.target.value)}
                      placeholder="Ex: 500"
                      min="50"
                      max="10000"
                      className="w-full px-3 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      m²
                    </span>
                  </div>
                </div>
              )}

              {/* Note explicative */}
              <p className="text-xs text-gray-500 italic">
                Ces critères permettent d&apos;affiner l&apos;estimation. Certains éléments
                (luminosité, vue, travaux précis...) ne peuvent être évalués qu&apos;en visite.
              </p>
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={!surface || parseFloat(surface) <= 0}
            className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-lg"
          >
            Obtenir mon estimation
          </button>
        </form>
      </div>

      {/* Résultat */}
      {estimation && estimation.prixEstime && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 p-6">
          {/* Prix estimé - EN PRIORITÉ */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">
              Valeur estimée de votre {estimation.typeBien} de {estimation.surface} m²
            </p>
            <p className="text-5xl font-bold text-emerald-600 mb-2">
              {formatPrix(estimation.prixEstime)}
            </p>
            <p className="text-sm text-gray-500">
              à {estimation.ville}
            </p>
            {estimation.estimationAffine && (
              <p className="text-xs text-emerald-600 mt-2 flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Estimation affinée selon vos critères
              </p>
            )}
          </div>

          {/* Fourchette - Mise en avant */}
          {estimation.fourchetteBasse && estimation.fourchetteHaute && (
            <div className="bg-white rounded-xl p-5 mb-6 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-4 text-center">
                Fourchette d&apos;estimation
              </p>
              <div className="flex items-center justify-between gap-4">
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-500 mb-1">Estimation basse</p>
                  <p className="text-xl font-bold text-gray-700">
                    {formatPrix(estimation.fourchetteBasse)}
                  </p>
                </div>
                <div className="flex-1 px-2">
                  <div className="h-3 bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-200 rounded-full" />
                </div>
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-500 mb-1">Estimation haute</p>
                  <p className="text-xl font-bold text-gray-700">
                    {formatPrix(estimation.fourchetteHaute)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* CTA après résultat */}
          <div className="bg-blue-600 rounded-xl p-5 text-white text-center mb-6">
            <p className="font-medium mb-2">
              Affinez cette estimation avec un professionnel
            </p>
            <p className="text-blue-100 text-sm mb-4">
              Un expert local peut évaluer les spécificités de votre bien.
            </p>
            <button className="bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
              Estimation professionnelle gratuite
            </button>
          </div>

          {/* Détails secondaires */}
          <div className="border-t border-emerald-200 pt-4">
            <p className="text-xs text-gray-500 mb-3 font-medium">Détails du calcul</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Prix au m² de référence</p>
                <p className="font-semibold text-gray-800">
                  {formatPrix(estimation.prixMedianM2)}/m²
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Base de calcul</p>
                <p className="font-semibold text-gray-800">
                  {estimation.isEstimation
                    ? "Données marché"
                    : `${formatNumber(estimation.nbVentesReference)} transactions`}
                </p>
              </div>
            </div>

            {/* Critères pris en compte */}
            {estimation.criteresUtilises && Object.keys(estimation.criteresUtilises).length > 0 && (
              <div className="mt-4 bg-white/60 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-2">Critères pris en compte</p>
                <div className="flex flex-wrap gap-2">
                  {estimation.criteresUtilises.etat && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      {etatLabels[estimation.criteresUtilises.etat]}
                    </span>
                  )}
                  {estimation.criteresUtilises.anciennete && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      {ancienneteLabels[estimation.criteresUtilises.anciennete]}
                    </span>
                  )}
                  {estimation.criteresUtilises.etage && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      {etageLabels[estimation.criteresUtilises.etage]}
                    </span>
                  )}
                  {estimation.criteresUtilises.ascenseur !== undefined && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      {estimation.criteresUtilises.ascenseur ? "Avec ascenseur" : "Sans ascenseur"}
                    </span>
                  )}
                  {estimation.criteresUtilises.surfaceTerrain && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                      Terrain {estimation.criteresUtilises.surfaceTerrain} m²
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer repositionné et reformulé */}
          <div className="mt-4 pt-4 border-t border-emerald-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              Cette estimation est calculée à partir des prix médians observés
              sur le marché de {estimation.ville}
              {estimation.estimationAffine && ", ajustée selon les critères que vous avez indiqués"}.
              Elle constitue un premier repère indicatif. La valeur réelle de votre bien
              dépend de nombreux facteurs (emplacement précis, luminosité, vue, nuisances...)
              qu&apos;un professionnel pourra évaluer lors d&apos;une visite.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
