# MonMandatLocal.fr

Site web d'information sur le marché immobilier local en France, basé sur des données officielles (DVF, INSEE).

## Objectif

Aider les particuliers (vendeurs, acheteurs, bailleurs) à comprendre le marché immobilier local à partir de données factuelles et officielles : prix de vente, loyers, statistiques démographiques et logement par ville et quartier.

## Principes

- **SEO-first** : Pages générées côté serveur, optimisées pour l'indexation
- **Data-driven** : Données officielles uniquement (DVF, INSEE)
- **Approche descriptive** : Présentation factuelle, sans conseil en investissement
- **Transparence** : Méthodologie explicite, aucune donnée inventée

## Stack technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Déploiement** : À définir (Vercel recommandé)

## Structure du projet

```
monmandatlocal/
├── app/                          # Routes et pages (Next.js App Router)
│   ├── layout.tsx                # Layout racine
│   ├── page.tsx                  # Page d'accueil
│   ├── not-found.tsx             # Page 404
│   ├── ville/[slug]/             # Pages villes (/ville/lyon)
│   ├── quartier/[ville]/[iris]/  # Pages quartiers (/quartier/lyon/123456)
│   ├── estimation/[ville]/       # Pages estimation (/estimation/lyon)
│   ├── robots.ts                 # Génération robots.txt
│   └── sitemap.ts                # Génération sitemap.xml
├── components/                   # Composants réutilisables
│   ├── MetricCard.tsx
│   ├── Breadcrumb.tsx
│   └── DisclaimerBox.tsx
├── lib/                          # Utilitaires et logique métier
│   ├── types.ts                  # Types TypeScript
│   └── data/                     # Accès aux données
│       └── README.md             # Guide d'intégration des données
├── public/                       # Assets statiques
└── README.md                     # Ce fichier
```

## Fonctionnalités

### Implémenté
- ✅ Architecture Next.js avec App Router
- ✅ Page d'accueil pédagogique
- ✅ Structure de routes (villes, quartiers, estimation)
- ✅ Templates de pages avec emplacements pour la data
- ✅ Composants réutilisables (MetricCard, Breadcrumb, DisclaimerBox)
- ✅ Configuration SEO de base (metadata, robots.txt, sitemap)

### À implémenter
- ⏳ Intégration des données DVF (transactions immobilières)
- ⏳ Intégration des données INSEE (démographie, logement)
- ⏳ Génération des pages statiques pour les villes
- ⏳ Génération des pages statiques pour les quartiers (IRIS)
- ⏳ Algorithme d'estimation immobilière
- ⏳ Barre de recherche fonctionnelle
- ⏳ Graphiques et visualisations de données
- ⏳ Système de comparaison (quartier vs ville)

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000).

## Configuration

Copier `.env.example` vers `.env.local` et configurer les variables :

```bash
cp .env.example .env.local
```

## Intégration des données

Voir [lib/data/README.md](lib/data/README.md) pour les instructions d'intégration des sources de données officielles.

### Sources attendues
- **DVF** : Demandes de Valeurs Foncières (transactions immobilières)
- **INSEE** : Données communales et IRIS (démographie, logement)
- **Cadastre** : Données parcellaires (optionnel)

## Build et déploiement

```bash
# Build de production
npm run build

# Démarrer en production
npm start
```

## Bonnes pratiques

1. **Aucune donnée factice** : Si la data n'est pas disponible, afficher "À venir"
2. **SEO** : Toutes les pages importantes doivent être générées statiquement
3. **Performance** : Optimiser les images, lazy loading pour les composants lourds
4. **Accessibilité** : Respecter les standards WCAG (textes alternatifs, navigation clavier)

## Contribution

Ce projet respecte une approche strictement descriptive et factuelle. Toute contribution doit :
- Utiliser des données officielles vérifiables
- Éviter tout discours d'investissement ou de conseil
- Maintenir la neutralité et la transparence

## Licence

À définir
