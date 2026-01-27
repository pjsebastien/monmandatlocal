import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Méthodologie",
  description:
    "Découvrez comment MonMandatLocal.fr traite et présente les données immobilières.",
};

export default function MethodologiePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Méthodologie</h1>
      <p className="text-xl text-gray-600 mb-8">
        Comment nous collectons, traitons et présentons les données.
      </p>

      {/* Prix immobiliers */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Calcul des prix immobiliers</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold mb-3">Prix médian</h3>
          <p className="text-gray-700 mb-4">
            Le prix médian correspond à la valeur qui sépare les transactions en
            deux moitiés égales : 50% des biens se sont vendus moins cher, 50%
            plus cher. C'est un indicateur plus robuste que la moyenne car il
            n'est pas influencé par les valeurs extrêmes.
          </p>

          <h3 className="font-bold mb-3">Prix au m²</h3>
          <p className="text-gray-700 mb-4">
            Le prix au m² est calculé en divisant le prix de vente par la
            surface habitable déclarée dans l'acte de vente. Nous calculons la
            médiane des prix au m² plutôt que le rapport des médianes.
          </p>

          <h3 className="font-bold mb-3">Période de référence</h3>
          <p className="text-gray-700">
            Sauf indication contraire, les prix présentés sont basés sur les
            transactions des 12 derniers mois disponibles dans la base DVF.
          </p>
        </div>
      </section>

      {/* Filtrage */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Filtrage des données</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Pour garantir la pertinence des indicateurs, nous appliquons
            certains filtres aux données DVF :
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>
              <strong>Ventes de gré à gré uniquement</strong> : exclusion des
              ventes aux enchères et adjudications
            </li>
            <li>
              <strong>Biens à usage d'habitation</strong> : exclusion des locaux
              commerciaux, industriels, agricoles
            </li>
            <li>
              <strong>Transactions complètes</strong> : exclusion des ventes en
              l'état futur d'achèvement (VEFA) en cours
            </li>
            <li>
              <strong>Prix cohérents</strong> : exclusion des transactions à
              prix symbolique (1€) ou manifestement erronées
            </li>
          </ul>
        </div>
      </section>

      {/* Estimations */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Calcul des estimations</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            L'estimation indicative est calculée à partir des transactions
            comparables (même type de bien, nombre de pièces similaire) dans la
            commune.
          </p>

          <h3 className="font-bold mb-3">Méthode</h3>
          <ol className="text-gray-600 space-y-2 list-decimal list-inside mb-4">
            <li>Sélection des transactions comparables (12 derniers mois)</li>
            <li>Calcul du prix médian au m² pour ce segment</li>
            <li>Application à la surface du bien à estimer</li>
            <li>Calcul d'une fourchette (±15% du prix estimé)</li>
          </ol>

          <h3 className="font-bold mb-3">Limites</h3>
          <p className="text-gray-700">
            Cette méthode ne prend pas en compte : l'état du bien, les travaux
            réalisés, l'étage (pour les appartements), l'exposition, la vue, le
            stationnement, la qualité de la copropriété, ou tout autre critère
            qualitatif.
          </p>
        </div>
      </section>

      {/* Données démographiques */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Données démographiques</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Les données démographiques proviennent du recensement de la
            population de l'INSEE.
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>
              <strong>Fréquence</strong> : Recensement annuel par roulement sur
              5 ans
            </li>
            <li>
              <strong>Décalage</strong> : Les données présentées peuvent avoir
              jusqu'à 3 ans de décalage avec la situation actuelle
            </li>
            <li>
              <strong>IRIS</strong> : Disponible pour les communes de plus de
              10 000 habitants
            </li>
          </ul>
        </div>
      </section>

      {/* Limites */}
      <section className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-yellow-900">
          Limites et précautions
        </h2>
        <ul className="text-yellow-800 space-y-2">
          <li>
            Les données DVF ne couvrent pas l'Alsace-Moselle ni Mayotte
          </li>
          <li>
            Certaines transactions peuvent être manquantes ou mal renseignées
          </li>
          <li>
            Les indicateurs statistiques masquent la diversité des biens
          </li>
          <li>
            Les données ont un délai de publication (plusieurs mois)
          </li>
          <li>
            Les estimations sont indicatives et ne remplacent pas une expertise
          </li>
        </ul>
      </section>
    </div>
  );
}
