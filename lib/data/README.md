# Intégration des données

Ce dossier est destiné à contenir les utilitaires et fonctions d'accès aux données.

## Sources de données attendues

### 1. DVF (Demandes de Valeurs Foncières)
- **Source** : data.gouv.fr
- **Contenu** : Transactions immobilières (ventes)
- **Utilisation** : Calcul des prix médians, moyens, évolutions
- **Format suggéré** : PostgreSQL avec PostGIS ou fichiers parquet

### 2. INSEE - Données communales
- **Source** : insee.fr
- **Contenu** : Population, logements, démographie par commune
- **Utilisation** : Pages villes
- **Format suggéré** : JSON ou PostgreSQL

### 3. INSEE - Données IRIS (Quartiers)
- **Source** : insee.fr
- **Contenu** : Données démographiques et logement par quartier
- **Utilisation** : Pages quartiers
- **Format suggéré** : JSON ou PostgreSQL

### 4. Données cadastrales (optionnel)
- **Source** : cadastre.data.gouv.fr
- **Contenu** : Parcelles, bâtiments
- **Utilisation** : Enrichissement des données

## Structure suggérée

```
lib/data/
├── README.md (ce fichier)
├── db.ts (connexion base de données si nécessaire)
├── ville.ts (fonctions d'accès aux données villes)
├── quartier.ts (fonctions d'accès aux données quartiers)
├── dvf.ts (fonctions d'accès aux transactions DVF)
└── estimation.ts (algorithme d'estimation)
```

## Fonctions à implémenter

### Villes
- `getVilleBySlug(slug: string): Promise<Ville | null>`
- `getMarcheImmobilierVille(slug: string): Promise<MarcheImmobilierVille | null>`
- `getAllVilles(): Promise<Ville[]>` (pour génération statique)

### Quartiers
- `getQuartiersByVille(villeSlug: string): Promise<Quartier[]>`
- `getQuartier(villeSlug: string, irisCode: string): Promise<Quartier | null>`

### DVF
- `getTransactionsByVille(villeSlug: string, options?): Promise<Transaction[]>`
- `getPrixMedianByVille(villeSlug: string, typeBien): Promise<number>`

### Estimation
- `estimerBien(params: EstimationParams): Promise<EstimationResult>`

## Note importante

**Aucune donnée factice ne doit être insérée.**

Si les données ne sont pas encore disponibles, les pages doivent afficher :
- "À venir" ou "Données en cours d'intégration"
- Un placeholder clair
- Éventuellement un message explicatif

Cela maintient la transparence et la crédibilité du site.
