/**
 * Accès aux données territoriales (INSEE + DVF)
 * Source : data/api_territoriale_v3.json
 *
 * ATTENTION : Ce fichier utilise 'fs' et ne peut être utilisé que côté serveur
 * Pour les types et utilitaires côté client, utiliser ./territorial-types.ts
 */

import fs from "fs";
import path from "path";

// Ré-exporter les types et utilitaires pour faciliter les imports
export * from "./territorial-types";

import type { DataTerritoriale, Ville } from "./territorial-types";
import { generateSlug } from "./territorial-types";

// Cache pour éviter de recharger le fichier à chaque requête
let dataCache: DataTerritoriale | null = null;

/**
 * Charge les données territoriales depuis le fichier JSON
 * SERVEUR UNIQUEMENT
 */
export function loadTerritorialData(): DataTerritoriale {
  if (dataCache) {
    return dataCache;
  }

  const filePath = path.join(process.cwd(), "data", "api_territoriale_v3.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  dataCache = JSON.parse(fileContent) as DataTerritoriale;
  return dataCache;
}

/**
 * Récupère la liste de toutes les villes (pour les listes et la recherche)
 * SERVEUR UNIQUEMENT
 */
export function getAllVilles(): Pick<Ville, "nom" | "code_insee" | "departement" | "region" | "dvf">[] {
  const data = loadTerritorialData();
  return data.villes.map((ville) => ({
    nom: ville.nom,
    code_insee: ville.code_insee,
    departement: ville.departement,
    region: ville.region,
    dvf: ville.dvf,
  }));
}

/**
 * Récupère les villes avec données DVF uniquement
 * SERVEUR UNIQUEMENT
 */
export function getVillesAvecDVF(): Ville[] {
  const data = loadTerritorialData();
  return data.villes.filter((ville) => ville.dvf && ville.dvf.prix_m2_median_global !== null);
}

/**
 * Récupère une ville par son slug
 * SERVEUR UNIQUEMENT
 */
export function getVilleBySlug(slug: string): Ville | null {
  const data = loadTerritorialData();
  return data.villes.find((ville) => generateSlug(ville.nom) === slug) || null;
}

/**
 * Récupère une ville par son code INSEE
 * SERVEUR UNIQUEMENT
 */
export function getVilleByCodeInsee(codeInsee: string): Ville | null {
  const data = loadTerritorialData();
  return data.villes.find((ville) => ville.code_insee === codeInsee) || null;
}

/**
 * Recherche de villes par nom (autocomplétion)
 * SERVEUR UNIQUEMENT
 */
export function searchVilles(query: string, limit: number = 10): Ville[] {
  const data = loadTerritorialData();
  const normalizedQuery = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return data.villes
    .filter((ville) => {
      const normalizedNom = ville.nom
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedNom.includes(normalizedQuery);
    })
    .slice(0, limit);
}
