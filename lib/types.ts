/**
 * Types pour les données territoriales et immobilières
 * À adapter selon la structure réelle de vos données
 */

// Ville
export interface Ville {
  slug: string; // URL-friendly identifier (ex: "lyon")
  nom: string; // Nom officiel (ex: "Lyon")
  codeInsee: string; // Code INSEE de la commune
  codeDepartement: string;
  codeRegion: string;
  population?: number;
  superficie?: number; // en km²
}

// Données de marché immobilier pour une ville
export interface MarcheImmobilierVille {
  villeSlug: string;
  prixMedianMaison?: number;
  prixMedianAppartement?: number;
  prixMoyenM2?: number;
  loyerMedian?: number;
  loyerMoyenM2?: number;
  nombreTransactions?: number;
  periodeReference?: string; // Ex: "2023-2024"
}

// Quartier (IRIS)
export interface Quartier {
  codeIris: string;
  nom: string;
  villeSlug: string;
  villeNom: string;
  population?: number;
  nombreLogements?: number;
  tauxProprietaires?: number; // en %
  tauxLocataires?: number; // en %
  ageMedain?: number;
  tailleMedianeMenage?: number;
  densite?: number; // hab/km²
}

// Transaction immobilière (DVF)
export interface Transaction {
  id: string;
  dateTransaction: string;
  villeSlug: string;
  typeBien: "maison" | "appartement";
  surface?: number;
  nombrePieces?: number;
  prix: number;
  prixM2?: number;
}

// Estimation immobilière
export interface EstimationParams {
  villeSlug: string;
  typeBien: "maison" | "appartement";
  surface: number;
  nombrePieces?: number;
}

export interface EstimationResult {
  fourchetteBasse: number;
  fourchetteHaute: number;
  prixEstime: number;
  confiance: "faible" | "moyenne" | "elevee";
  nombreTransactionsReference: number;
}
