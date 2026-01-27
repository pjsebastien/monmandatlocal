const data = require('../data/api_territoriale_v3.json');

const villesSansDVF = data.villes.filter(v => !v.dvf || v.dvf.prix_m2_median_global === null);
console.log('Villes sans DVF (' + villesSansDVF.length + '):');
villesSansDVF.forEach(v => console.log(v.nom + ' | ' + v.departement.name + ' (' + v.departement.code + ') | ' + v.region.name));
