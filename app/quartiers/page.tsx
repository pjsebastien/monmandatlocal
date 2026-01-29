import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorer les quartiers",
  description:
    "Accédez aux données démographiques et logement par quartier (IRIS) pour comprendre les spécificités locales.",
};

export default function QuartiersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Explorer par quartier</h1>
      <p className="text-xl text-gray-600 mb-8">
        Accédez aux données détaillées par quartier (IRIS) pour affiner votre
        compréhension du marché local.
      </p>

      {/* Explication IRIS */}
      <section className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">Qu'est-ce qu'un IRIS ?</h2>
        <p className="text-gray-700 mb-4">
          L'IRIS (Ilots Regroupés pour l'Information Statistique) est le
          découpage géographique de base utilisé par l'INSEE pour diffuser les
          données infra-communales. Chaque IRIS regroupe environ 2 000
          habitants.
        </p>
        <p className="text-gray-700">
          Ce découpage permet d'analyser les caractéristiques démographiques et
          de logement à une échelle fine, révélant les différences entre
          quartiers d'une même ville.
        </p>
      </section>

      {/* Recherche */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Trouver un quartier</h2>
        <div className="max-w-xl">
          <p className="text-gray-600 mb-4">
            Commencez par sélectionner une ville pour accéder à ses quartiers :
          </p>
          <input
            type="text"
            placeholder="Rechercher une ville..."
            className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            disabled
          />
          <p className="text-sm text-gray-500 mt-2">
            Recherche fonctionnelle à venir
          </p>
        </div>
      </section>

      {/* Données disponibles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Données par quartier</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">Démographie</h3>
            <ul className="text-gray-600 space-y-2">
              <li>Population totale</li>
              <li>Densité de population</li>
              <li>Répartition par âge</li>
              <li>Taille des ménages</li>
              <li>Catégories socio-professionnelles</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">Logement</h3>
            <ul className="text-gray-600 space-y-2">
              <li>Nombre de logements</li>
              <li>Part de propriétaires / locataires</li>
              <li>Types de logements (maisons, appartements)</li>
              <li>Surface moyenne</li>
              <li>Ancienneté du parc</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Source */}
      <section className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="font-bold mb-2 text-blue-900">Source des données</h3>
        <p className="text-sm text-blue-800">
          Les données présentées par quartier proviennent des recensements INSEE
          et sont disponibles au niveau IRIS pour les communes de plus de 10 000
          habitants. Pour les communes plus petites, seules les données
          communales sont disponibles.
        </p>
      </section>
    </div>
  );
}
