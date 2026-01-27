/**
 * Script pour ajouter des estimations DVF aux villes qui n'ont pas de données officielles
 * Les estimations sont basées sur des recherches de marché de janvier 2026
 * Sources: MeilleursAgents, SeLoger, Notaires de France, PAP
 */

const fs = require('fs');
const path = require('path');

// Données d'estimation par ville (basées sur recherches marché janvier 2026)
// Structure: { appartements: { median, p25, p75 }, maisons: { median, p25, p75 } }
const estimations = {
  // Paris
  "Paris": {
    appartements: { median: 9570, p25: 7500, p75: 12500 },
    maisons: { median: 10200, p25: 8000, p75: 15000 }
  },

  // Grandes métropoles
  "Marseille": {
    appartements: { median: 3400, p25: 2400, p75: 4800 },
    maisons: { median: 3800, p25: 2600, p75: 5200 }
  },
  "Lyon": {
    appartements: { median: 4800, p25: 3500, p75: 6200 },
    maisons: { median: 5200, p25: 3800, p75: 7000 }
  },
  "Nice": {
    appartements: { median: 5200, p25: 3800, p75: 7000 },
    maisons: { median: 6000, p25: 4200, p75: 8500 }
  },
  "Strasbourg": {
    appartements: { median: 3660, p25: 2500, p75: 4770 },
    maisons: { median: 3290, p25: 2280, p75: 4300 }
  },
  "Bordeaux": {
    appartements: { median: 4600, p25: 3400, p75: 6000 },
    maisons: { median: 4900, p25: 3600, p75: 6500 }
  },

  // Pays de la Loire
  "Angers": {
    appartements: { median: 3200, p25: 2400, p75: 4200 },
    maisons: { median: 3000, p25: 2200, p75: 4000 }
  },
  "Cholet": {
    appartements: { median: 1900, p25: 1400, p75: 2500 },
    maisons: { median: 1800, p25: 1300, p75: 2400 }
  },

  // PACA
  "Aix-en-Provence": {
    appartements: { median: 5250, p25: 3230, p75: 7350 },
    maisons: { median: 6350, p25: 3180, p75: 11200 }
  },
  "Avignon": {
    appartements: { median: 2450, p25: 1470, p75: 3600 },
    maisons: { median: 2500, p25: 1230, p75: 4280 }
  },
  "Antibes": {
    appartements: { median: 5770, p25: 3450, p75: 8740 },
    maisons: { median: 8100, p25: 3610, p75: 15250 }
  },
  "Cannes": {
    appartements: { median: 6130, p25: 3830, p75: 9400 },
    maisons: { median: 7300, p25: 3420, p75: 13900 }
  },
  "Fréjus": {
    appartements: { median: 4965, p25: 2960, p75: 7290 },
    maisons: { median: 4445, p25: 2180, p75: 7240 }
  },
  "Hyères": {
    appartements: { median: 4285, p25: 3000, p75: 5800 },
    maisons: { median: 5150, p25: 3500, p75: 7200 }
  },
  "Cagnes-sur-Mer": {
    appartements: { median: 4740, p25: 3200, p75: 6500 },
    maisons: { median: 5700, p25: 3800, p75: 8000 }
  },
  "Arles": {
    appartements: { median: 2450, p25: 1360, p75: 4030 },
    maisons: { median: 2970, p25: 1470, p75: 5060 }
  },

  // Bretagne
  "Brest": {
    appartements: { median: 2400, p25: 1700, p75: 3200 },
    maisons: { median: 2600, p25: 1900, p75: 3500 }
  },

  // Hauts-de-France
  "Amiens": {
    appartements: { median: 2500, p25: 1800, p75: 3400 },
    maisons: { median: 2300, p25: 1600, p75: 3200 }
  },
  "Beauvais": {
    appartements: { median: 2200, p25: 1500, p75: 3000 },
    maisons: { median: 2000, p25: 1400, p75: 2800 }
  },
  "Villeneuve-d'Ascq": {
    appartements: { median: 3000, p25: 2200, p75: 4000 },
    maisons: { median: 2800, p25: 2000, p75: 3800 }
  },

  // Auvergne-Rhône-Alpes
  "Annecy": {
    appartements: { median: 5600, p25: 4200, p75: 7500 },
    maisons: { median: 7000, p25: 5000, p75: 9500 }
  },
  "Chambéry": {
    appartements: { median: 3430, p25: 2450, p75: 5050 },
    maisons: { median: 3960, p25: 2800, p75: 5500 }
  },

  // Nouvelle-Aquitaine
  "Limoges": {
    appartements: { median: 1800, p25: 1200, p75: 2500 },
    maisons: { median: 1700, p25: 1100, p75: 2400 }
  },

  // Grand Est
  "Metz": {
    appartements: { median: 2370, p25: 1640, p75: 3200 },
    maisons: { median: 2455, p25: 1640, p75: 3590 }
  },
  "Mulhouse": {
    appartements: { median: 1260, p25: 790, p75: 1800 },
    maisons: { median: 1890, p25: 1200, p75: 2600 }
  },
  "Colmar": {
    appartements: { median: 2890, p25: 2000, p75: 3800 },
    maisons: { median: 2500, p25: 1800, p75: 3400 }
  },

  // Bourgogne-Franche-Comté
  "Besançon": {
    appartements: { median: 2400, p25: 1700, p75: 3200 },
    maisons: { median: 2200, p25: 1500, p75: 3000 }
  },

  // Centre-Val de Loire
  "Bourges": {
    appartements: { median: 1700, p25: 1100, p75: 2400 },
    maisons: { median: 1600, p25: 1000, p75: 2200 }
  },

  // Occitanie
  "Béziers": {
    appartements: { median: 1970, p25: 1170, p75: 3100 },
    maisons: { median: 2170, p25: 1090, p75: 3750 }
  },
  "Albi": {
    appartements: { median: 2280, p25: 1680, p75: 3160 },
    maisons: { median: 2230, p25: 1600, p75: 3100 }
  },

  // Corse
  "Ajaccio": {
    appartements: { median: 4600, p25: 2930, p75: 6300 },
    maisons: { median: 4520, p25: 3000, p75: 6500 }
  },

  // Île-de-France - Hauts-de-Seine (92)
  "Boulogne-Billancourt": {
    appartements: { median: 8340, p25: 5800, p75: 11500 },
    maisons: { median: 9780, p25: 7000, p75: 14000 }
  },
  "Nanterre": {
    appartements: { median: 5200, p25: 3800, p75: 7000 },
    maisons: { median: 5500, p25: 4000, p75: 7500 }
  },
  "Asnières-sur-Seine": {
    appartements: { median: 6500, p25: 4800, p75: 8500 },
    maisons: { median: 7200, p25: 5200, p75: 9500 }
  },
  "Colombes": {
    appartements: { median: 5000, p25: 3600, p75: 6800 },
    maisons: { median: 5500, p25: 4000, p75: 7500 }
  },
  "Courbevoie": {
    appartements: { median: 7000, p25: 5000, p75: 9500 },
    maisons: { median: 8000, p25: 5800, p75: 11000 }
  },
  "Rueil-Malmaison": {
    appartements: { median: 6500, p25: 4800, p75: 8800 },
    maisons: { median: 7200, p25: 5200, p75: 10000 }
  },
  "Levallois-Perret": {
    appartements: { median: 9500, p25: 7000, p75: 12500 },
    maisons: { median: 11000, p25: 8000, p75: 15000 }
  },
  "Issy-les-Moulineaux": {
    appartements: { median: 7500, p25: 5500, p75: 10000 },
    maisons: { median: 8500, p25: 6200, p75: 12000 }
  },
  "Clichy": {
    appartements: { median: 5500, p25: 4000, p75: 7500 },
    maisons: { median: 6000, p25: 4300, p75: 8000 }
  },
  "Antony": {
    appartements: { median: 5000, p25: 3700, p75: 6800 },
    maisons: { median: 5800, p25: 4200, p75: 8000 }
  },
  "Neuilly-sur-Seine": {
    appartements: { median: 12000, p25: 9000, p75: 16000 },
    maisons: { median: 15400, p25: 11000, p75: 22000 }
  },
  "Clamart": {
    appartements: { median: 5500, p25: 4000, p75: 7500 },
    maisons: { median: 6000, p25: 4300, p75: 8200 }
  },
  "Gennevilliers": {
    appartements: { median: 4500, p25: 3200, p75: 6000 },
    maisons: { median: 4800, p25: 3500, p75: 6500 }
  },

  // Île-de-France - Seine-Saint-Denis (93)
  "Saint-Denis": {
    appartements: { median: 3870, p25: 2800, p75: 5200 },
    maisons: { median: 4200, p25: 3000, p75: 5800 }
  },
  "Montreuil": {
    appartements: { median: 5620, p25: 4200, p75: 7500 },
    maisons: { median: 6000, p25: 4500, p75: 8000 }
  },
  "Aubervilliers": {
    appartements: { median: 4000, p25: 2900, p75: 5400 },
    maisons: { median: 4300, p25: 3100, p75: 5800 }
  },
  "Aulnay-sous-Bois": {
    appartements: { median: 3000, p25: 2200, p75: 4000 },
    maisons: { median: 3200, p25: 2300, p75: 4300 }
  },
  "Noisy-le-Grand": {
    appartements: { median: 3800, p25: 2800, p75: 5000 },
    maisons: { median: 4200, p25: 3000, p75: 5600 }
  },
  "Drancy": {
    appartements: { median: 3500, p25: 2500, p75: 4700 },
    maisons: { median: 3800, p25: 2700, p75: 5100 }
  },
  "Pantin": {
    appartements: { median: 5000, p25: 3700, p75: 6800 },
    maisons: { median: 5500, p25: 4000, p75: 7500 }
  },
  "Le Blanc-Mesnil": {
    appartements: { median: 3200, p25: 2300, p75: 4300 },
    maisons: { median: 3500, p25: 2500, p75: 4700 }
  },
  "Bobigny": {
    appartements: { median: 3800, p25: 2700, p75: 5100 },
    maisons: { median: 4000, p25: 2900, p75: 5400 }
  },
  "Épinay-sur-Seine": {
    appartements: { median: 3500, p25: 2500, p75: 4700 },
    maisons: { median: 3700, p25: 2600, p75: 5000 }
  },
  "Saint-Ouen-sur-Seine": {
    appartements: { median: 5500, p25: 4000, p75: 7500 },
    maisons: { median: 6000, p25: 4300, p75: 8000 }
  },
  "Sevran": {
    appartements: { median: 3000, p25: 2100, p75: 4000 },
    maisons: { median: 3200, p25: 2300, p75: 4300 }
  },
  "Bondy": {
    appartements: { median: 3600, p25: 2600, p75: 4800 },
    maisons: { median: 3900, p25: 2800, p75: 5200 }
  },

  // Île-de-France - Val-de-Marne (94)
  "Vitry-sur-Seine": {
    appartements: { median: 4000, p25: 2900, p75: 5400 },
    maisons: { median: 4300, p25: 3100, p75: 5800 }
  },
  "Créteil": {
    appartements: { median: 4000, p25: 2900, p75: 5400 },
    maisons: { median: 4200, p25: 3000, p75: 5700 }
  },
  "Champigny-sur-Marne": {
    appartements: { median: 4500, p25: 3200, p75: 6000 },
    maisons: { median: 4800, p25: 3500, p75: 6500 }
  },
  "Saint-Maur-des-Fossés": {
    appartements: { median: 5700, p25: 4200, p75: 7600 },
    maisons: { median: 6200, p25: 4500, p75: 8500 }
  },
  "Ivry-sur-Seine": {
    appartements: { median: 4500, p25: 3300, p75: 6000 },
    maisons: { median: 4800, p25: 3500, p75: 6500 }
  },
  "Villejuif": {
    appartements: { median: 4500, p25: 3300, p75: 6000 },
    maisons: { median: 4800, p25: 3500, p75: 6500 }
  },
  "Maisons-Alfort": {
    appartements: { median: 5500, p25: 4000, p75: 7300 },
    maisons: { median: 6000, p25: 4400, p75: 8000 }
  },
  "Fontenay-sous-Bois": {
    appartements: { median: 5000, p25: 3700, p75: 6700 },
    maisons: { median: 5500, p25: 4000, p75: 7500 }
  },

  // Île-de-France - Val-d'Oise (95)
  "Argenteuil": {
    appartements: { median: 3700, p25: 2700, p75: 5000 },
    maisons: { median: 4000, p25: 2900, p75: 5400 }
  },

  // DOM-TOM
  "Fort-de-France": {
    appartements: { median: 2750, p25: 1940, p75: 4190 },
    maisons: { median: 1910, p25: 1020, p75: 3240 }
  },
  "Cayenne": {
    appartements: { median: 2670, p25: 1900, p75: 3800 },
    maisons: { median: 2310, p25: 1600, p75: 3300 }
  },
  "Saint-André": {
    appartements: { median: 2980, p25: 1900, p75: 4500 },
    maisons: { median: 2800, p25: 1600, p75: 4200 }
  },
  "Les Abymes": {
    appartements: { median: 2300, p25: 1500, p75: 3400 },
    maisons: { median: 2100, p25: 1400, p75: 3200 }
  },
  "Nouméa": {
    appartements: { median: 3400, p25: 2500, p75: 4800 },
    maisons: { median: 1900, p25: 1300, p75: 2800 }
  },
  "Mamoudzou": {
    appartements: { median: 2500, p25: 1700, p75: 3600 },
    maisons: { median: 2200, p25: 1500, p75: 3200 }
  }
};

// Charger le fichier JSON
const dataPath = path.join(__dirname, '..', 'data', 'api_territoriale_v3.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let villesModifiees = 0;
let villesNonTrouvees = [];

// Parcourir les villes et ajouter les estimations
data.villes.forEach(ville => {
  const estimation = estimations[ville.nom];

  if (estimation && (!ville.dvf || ville.dvf.prix_m2_median_global === null)) {
    // Calculer les moyennes globales à partir des données
    const medianGlobal = Math.round(
      (estimation.appartements.median + estimation.maisons.median) / 2
    );
    const p25Global = Math.round(
      (estimation.appartements.p25 + estimation.maisons.p25) / 2
    );
    const p75Global = Math.round(
      (estimation.appartements.p75 + estimation.maisons.p75) / 2
    );

    ville.dvf = {
      nb_ventes_total: null, // Pas de données de ventes pour les estimations
      prix_m2_median_global: medianGlobal,
      prix_m2_moyen_global: medianGlobal,
      prix_m2_p25: p25Global,
      prix_m2_p75: p75Global,
      appartements: {
        nb_ventes: null,
        prix_m2_median: estimation.appartements.median,
        prix_m2_moyen: estimation.appartements.median,
        prix_m2_p25: estimation.appartements.p25,
        prix_m2_p75: estimation.appartements.p75
      },
      maisons: {
        nb_ventes: null,
        prix_m2_median: estimation.maisons.median,
        prix_m2_moyen: estimation.maisons.median,
        prix_m2_p25: estimation.maisons.p25,
        prix_m2_p75: estimation.maisons.p75
      },
      is_estimation: true,
      source_estimation: "Estimation basée sur données de marché janvier 2026 (MeilleursAgents, SeLoger, Notaires de France)"
    };

    villesModifiees++;
    console.log(`✓ ${ville.nom}: estimation ajoutée (${medianGlobal} €/m²)`);
  } else if (!estimation && (!ville.dvf || ville.dvf.prix_m2_median_global === null)) {
    villesNonTrouvees.push(ville.nom);
  }
});

// Mettre à jour les statistiques globales
const villesAvecDVF = data.villes.filter(v => v.dvf && v.dvf.prix_m2_median_global !== null).length;
const villesAvecDVFOfficiel = data.villes.filter(v => v.dvf && v.dvf.prix_m2_median_global !== null && !v.dvf.is_estimation).length;
const villesAvecEstimation = data.villes.filter(v => v.dvf && v.dvf.is_estimation).length;

data.statistiques_globales.villes_avec_dvf = villesAvecDVF;
data.statistiques_globales.villes_sans_dvf = data.statistiques_globales.nb_villes - villesAvecDVF;
data.statistiques_globales.villes_avec_dvf_officiel = villesAvecDVFOfficiel;
data.statistiques_globales.villes_avec_estimation = villesAvecEstimation;

// Mettre à jour les métadonnées
data.metadata.date_estimations_ajoutees = new Date().toISOString();
data.metadata.sources.push("Estimations marché janvier 2026 (MeilleursAgents, SeLoger, Notaires de France, PAP)");

// Sauvegarder le fichier
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

console.log('\n=== Résumé ===');
console.log(`Villes modifiées: ${villesModifiees}`);
console.log(`Villes avec DVF officiel: ${villesAvecDVFOfficiel}`);
console.log(`Villes avec estimation: ${villesAvecEstimation}`);
console.log(`Total villes avec données: ${villesAvecDVF}`);

if (villesNonTrouvees.length > 0) {
  console.log(`\n⚠ Villes sans estimation disponible (${villesNonTrouvees.length}):`);
  villesNonTrouvees.forEach(v => console.log(`  - ${v}`));
}

console.log('\n✓ Fichier JSON mis à jour avec succès!');
