/**
 * Types et utilitaires pour les données territoriales
 * Ce fichier peut être importé côté client ET serveur
 */

// Types pour les données territoriales
export interface Coordonnees {
  latitude: number;
  longitude: number;
}

export interface Departement {
  code: string;
  name: string;
}

export interface Region {
  code: string;
  name: string;
}

export interface StatsLogements {
  total: number;
  residences_principales: number;
  residences_secondaires: number;
  logements_vacants: number;
}

export interface StatsINSEE {
  population: number;
  menages: number;
  taille_menage_moyenne: number;
  pct_15_29_ans: number;
  pct_60_plus_ans: number;
  logements: StatsLogements;
  taux_vacance_pct: number;
  annee_population: number;
  annee_logements: number;
  source: string;
}

export interface IndicateursCalcules {
  pression_residentielle: number;
  niveau_vacance: "faible" | "moyen" | "élevé";
  profil_demographique: "jeune" | "familial" | "senior";
  stabilite_residentielle: string;
}

export interface DVFTypeBien {
  nb_ventes: number;
  prix_m2_median: number;
  prix_m2_moyen: number;
  prix_m2_p25: number;
  prix_m2_p75: number;
}

export interface DVFVille {
  nb_ventes_total: number;
  prix_m2_median_global: number | null;
  prix_m2_moyen_global: number | null;
  prix_m2_p25: number | null;
  prix_m2_p75: number | null;
  appartements?: DVFTypeBien;
  maisons?: DVFTypeBien;
  /** Indique si les données sont estimées (true) ou officielles DVF (false/undefined) */
  is_estimation?: boolean;
  /** Source de l'estimation si is_estimation est true */
  source_estimation?: string;
}

export interface Quartier {
  iris_id: string;
  nom: string;
  nom_quartier: string;
  nom_commune: string;
  coordonnees: Coordonnees;
  stats_insee: StatsINSEE;
  indicateurs_calcules: IndicateursCalcules;
  dvf: DVFTypeBien | null;
}

export interface Ville {
  nom: string;
  code_insee: string;
  departement: Departement;
  region: Region;
  codes_postaux: string[];
  coordonnees: Coordonnees;
  stats_agregees: {
    population_totale: number;
    nb_menages: number;
    nb_logements: number;
    nb_residences_principales: number;
    nb_residences_secondaires: number;
    nb_logements_vacants: number;
    taux_vacance_moyen_pct: number;
  };
  nb_quartiers_iris: number;
  quartiers: Quartier[];
  dvf: DVFVille | null;
}

export interface DataTerritoriale {
  metadata: {
    titre: string;
    version: string;
    annee_reference: number;
    sources: string[];
  };
  statistiques_globales: {
    nb_villes: number;
    nb_total_iris: number;
    population_totale_couverte: number;
    total_ventes_dvf: number;
    villes_avec_dvf: number;
    villes_sans_dvf: number;
  };
  villes: Ville[];
}

/**
 * Critères supplémentaires pour affiner l'estimation
 */
export type EtatBien = "renover" | "correct" | "bon" | "excellent";
export type AncienneteBien = "neuf" | "recent" | "annees_90" | "annees_70" | "ancien" | "tres_ancien";
export type EtageAppartement = "rdc" | "bas" | "intermediaire" | "eleve" | "dernier";

export interface CriteresEstimation {
  /** État général du bien */
  etat?: EtatBien;
  /** Ancienneté du bien */
  anciennete?: AncienneteBien;
  /** Pour les maisons : surface du terrain en m² */
  surfaceTerrain?: number;
  /** Pour les appartements : étage */
  etage?: EtageAppartement;
  /** Pour les appartements : présence d'un ascenseur */
  ascenseur?: boolean;
}

/**
 * Résultat d'une estimation immobilière
 */
export interface EstimationResult {
  ville: string;
  typeBien: "appartement" | "maison";
  surface: number;
  prixMedianM2: number | null;
  prixEstime: number | null;
  fourchetteBasse: number | null;
  fourchetteHaute: number | null;
  nbVentesReference: number | null;
  qualiteDonnees: "bon" | "moyen" | "faible" | null;
  anneeReference: number;
  /** Indique si les données sont estimées ou officielles */
  isEstimation: boolean;
  /** Source de l'estimation si applicable */
  sourceEstimation?: string;
  /** Critères utilisés pour l'estimation */
  criteresUtilises?: CriteresEstimation;
  /** Indique si des critères ont modulé l'estimation */
  estimationAffine: boolean;
}

/**
 * Génère un slug URL-friendly à partir du nom de ville
 */
export function generateSlug(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calcule un facteur de modulation subtil basé sur les critères
 * Les impacts sont volontairement limités et combinés de manière non linéaire
 */
function calculerModulation(
  typeBien: "appartement" | "maison",
  criteres?: CriteresEstimation
): number {
  if (!criteres) return 1;

  let modulation = 0;

  // État du bien (impact limité : -4% à +3%)
  if (criteres.etat) {
    const impactEtat: Record<EtatBien, number> = {
      renover: -0.04,
      correct: -0.01,
      bon: 0.01,
      excellent: 0.03,
    };
    modulation += impactEtat[criteres.etat] ?? 0;
  }

  // Ancienneté (impact limité : -2% à +2%)
  if (criteres.anciennete) {
    const impactAnciennete: Record<AncienneteBien, number> = {
      neuf: 0.02,
      recent: 0.01,
      annees_90: 0,
      annees_70: -0.01,
      ancien: -0.015,
      tres_ancien: -0.02,
    };
    modulation += impactAnciennete[criteres.anciennete] ?? 0;
  }

  // Spécifique appartements : étage et ascenseur
  if (typeBien === "appartement") {
    if (criteres.etage) {
      const impactEtage: Record<EtageAppartement, number> = {
        rdc: -0.02,
        bas: -0.01,
        intermediaire: 0,
        eleve: 0.01,
        dernier: 0.02,
      };
      let etageModulation = impactEtage[criteres.etage] ?? 0;

      // RDC ou bas sans ascenseur = moins de malus
      // Étage élevé sans ascenseur = malus au lieu de bonus
      if (criteres.ascenseur === false && (criteres.etage === "eleve" || criteres.etage === "dernier")) {
        etageModulation = -0.02;
      }
      modulation += etageModulation;
    }
  }

  // Spécifique maisons : surface terrain (impact très limité)
  if (typeBien === "maison" && criteres.surfaceTerrain) {
    // Terrain standard ~500m², bonus/malus très léger
    if (criteres.surfaceTerrain < 200) {
      modulation -= 0.015;
    } else if (criteres.surfaceTerrain > 1000) {
      modulation += 0.02;
    } else if (criteres.surfaceTerrain > 600) {
      modulation += 0.01;
    }
  }

  // Plafonner la modulation totale à ±8%
  return 1 + Math.max(-0.08, Math.min(0.08, modulation));
}

/**
 * Calcule une estimation immobilière pour une ville
 */
export function calculerEstimation(
  ville: Ville,
  typeBien: "appartement" | "maison",
  surface: number,
  criteres?: CriteresEstimation
): EstimationResult {
  const dvf = ville.dvf;
  const typeData = typeBien === "appartement" ? dvf?.appartements : dvf?.maisons;

  const prixMedianM2 = typeData?.prix_m2_median ?? dvf?.prix_m2_median_global ?? null;
  const prixP25 = typeData?.prix_m2_p25 ?? dvf?.prix_m2_p25 ?? null;
  const prixP75 = typeData?.prix_m2_p75 ?? dvf?.prix_m2_p75 ?? null;
  const nbVentes = typeData?.nb_ventes ?? dvf?.nb_ventes_total ?? null;

  let qualiteDonnees: "bon" | "moyen" | "faible" | null = null;
  if (nbVentes !== null) {
    if (nbVentes >= 30) qualiteDonnees = "bon";
    else if (nbVentes >= 10) qualiteDonnees = "moyen";
    else qualiteDonnees = "faible";
  }

  // Calcul de la modulation basée sur les critères
  const hasCriteres = criteres && Object.keys(criteres).length > 0;
  const modulation = calculerModulation(typeBien, criteres);

  // Prix de base
  const prixBase = prixMedianM2 !== null ? prixMedianM2 * surface : null;

  // Prix modulé (si critères fournis)
  const prixEstime = prixBase !== null ? Math.round(prixBase * modulation) : null;

  // Fourchettes ajustées
  const fourchetteBasse = prixP25 !== null ? Math.round(prixP25 * surface * modulation) : null;
  const fourchetteHaute = prixP75 !== null ? Math.round(prixP75 * surface * modulation) : null;

  return {
    ville: ville.nom,
    typeBien,
    surface,
    prixMedianM2,
    prixEstime,
    fourchetteBasse,
    fourchetteHaute,
    nbVentesReference: nbVentes,
    qualiteDonnees,
    anneeReference: 2025,
    isEstimation: dvf?.is_estimation ?? false,
    sourceEstimation: dvf?.source_estimation,
    criteresUtilises: hasCriteres ? criteres : undefined,
    estimationAffine: hasCriteres ?? false,
  };
}

/**
 * Formate un prix en euros
 */
export function formatPrix(prix: number | null): string {
  if (prix === null) return "Non disponible";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(prix);
}

/**
 * Formate un nombre avec séparateur de milliers
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "Non disponible";
  return new Intl.NumberFormat("fr-FR").format(num);
}
