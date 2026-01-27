# Guide de démarrage rapide

## 1. Installation des dépendances

```bash
npm install
```

Cette commande installera toutes les dépendances listées dans [package.json](package.json).

## 2. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000).

## 3. Structure du projet

Le projet est maintenant initialisé avec :

### Pages principales
- **Page d'accueil** : [app/page.tsx](app/page.tsx) - Présentation pédagogique du site
- **Pages villes** : [app/ville/[slug]/page.tsx](app/ville/[slug]/page.tsx) - Template pour /ville/lyon, /ville/paris, etc.
- **Pages quartiers** : [app/quartier/[ville]/[iris]/page.tsx](app/quartier/[ville]/[iris]/page.tsx) - Template pour les données IRIS
- **Pages estimation** : [app/estimation/[ville]/page.tsx](app/estimation/[ville]/page.tsx) - Template pour les estimations

### Composants réutilisables
- [components/MetricCard.tsx](components/MetricCard.tsx) - Affichage de métriques
- [components/Breadcrumb.tsx](components/Breadcrumb.tsx) - Fil d'Ariane
- [components/DisclaimerBox.tsx](components/DisclaimerBox.tsx) - Boîtes d'avertissement

### Types et données
- [lib/types.ts](lib/types.ts) - Définitions TypeScript pour les données
- [lib/data/README.md](lib/data/README.md) - Guide d'intégration des données

### Configuration SEO
- [app/layout.tsx](app/layout.tsx) - Metadata par défaut
- [app/robots.ts](app/robots.ts) - Génération du robots.txt
- [app/sitemap.ts](app/sitemap.ts) - Génération du sitemap.xml

## 4. Prochaines étapes

### Intégration des données

Consultez [lib/data/README.md](lib/data/README.md) pour les instructions d'intégration des sources de données officielles (DVF, INSEE).

Vous devrez créer :
- `lib/data/ville.ts` - Fonctions d'accès aux données villes
- `lib/data/quartier.ts` - Fonctions d'accès aux données quartiers
- `lib/data/dvf.ts` - Fonctions d'accès aux transactions immobilières
- `lib/data/estimation.ts` - Algorithme d'estimation

### Génération statique

Une fois les données disponibles, décommentez les sections TODO dans :
- [app/sitemap.ts](app/sitemap.ts) - Pour générer le sitemap complet
- Les pages (ville, quartier, estimation) - Pour appeler les vraies fonctions de données

### Build de production

```bash
npm run build
npm start
```

## 5. Vérification du bon fonctionnement

Après `npm run dev`, vous devriez voir :
- Page d'accueil accessible sur http://localhost:3000
- Navigation fonctionnelle (header, footer)
- Styles Tailwind appliqués
- Pages 404 personnalisées pour les routes inexistantes

## 6. Remarques importantes

- **Pas de données factices** : Les pages affichent "À venir" tant que les vraies données ne sont pas intégrées
- **SEO-first** : Toutes les pages utilisent les metadata Next.js pour l'optimisation SEO
- **Approche descriptive** : Le contenu est neutre et factuel, sans conseil en investissement

## Support

Pour toute question, consultez le [README principal](README.md).
