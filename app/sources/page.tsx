import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sources de données",
  description:
    "Découvrez les sources officielles utilisées par MonMandatLocal.fr : DVF, INSEE, cadastre.",
};

export default function SourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Sources de données</h1>
      <p className="text-xl text-gray-600 mb-8">
        Toutes nos données proviennent de sources officielles et publiques.
      </p>

      {/* DVF */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          DVF - Demandes de Valeurs Foncières
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            La base DVF recense l'ensemble des transactions immobilières à titre
            onéreux (ventes) intervenues en France depuis 2014.
          </p>
          <ul className="text-gray-600 space-y-2 mb-4">
            <li>
              <strong>Producteur :</strong> Direction Générale des Finances
              Publiques (DGFiP)
            </li>
            <li>
              <strong>Couverture :</strong> France entière (hors Alsace-Moselle
              et Mayotte)
            </li>
            <li>
              <strong>Mise à jour :</strong> Semestrielle
            </li>
            <li>
              <strong>Licence :</strong> Licence Ouverte 2.0
            </li>
          </ul>
          <a
            href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Accéder aux données sur data.gouv.fr →
          </a>
        </div>
      </section>

      {/* INSEE */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">INSEE - Données de recensement</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Les données INSEE fournissent des informations démographiques et sur
            le logement à différentes échelles territoriales.
          </p>

          <h3 className="font-bold mt-4 mb-2">Données communales</h3>
          <ul className="text-gray-600 space-y-1 mb-4">
            <li>Population légale</li>
            <li>Nombre de logements</li>
            <li>Statut d'occupation (propriétaires, locataires)</li>
            <li>Caractéristiques des ménages</li>
          </ul>

          <h3 className="font-bold mt-4 mb-2">Données IRIS (quartiers)</h3>
          <ul className="text-gray-600 space-y-1 mb-4">
            <li>Population par tranche d'âge</li>
            <li>Catégories socio-professionnelles</li>
            <li>Caractéristiques des logements</li>
            <li>Modes de transport</li>
          </ul>

          <p className="text-gray-600 mb-4">
            <strong>Note :</strong> Les données IRIS sont disponibles pour les
            communes de plus de 10 000 habitants.
          </p>

          <a
            href="https://www.insee.fr/fr/statistiques"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Accéder aux données sur insee.fr →
          </a>
        </div>
      </section>

      {/* Cadastre */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Cadastre - Données parcellaires</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700 mb-4">
            Les données cadastrales en open data permettent d'accéder aux
            informations sur les parcelles et bâtiments.
          </p>
          <ul className="text-gray-600 space-y-2 mb-4">
            <li>
              <strong>Producteur :</strong> Direction Générale des Finances
              Publiques (DGFiP)
            </li>
            <li>
              <strong>Contenu :</strong> Parcelles, bâtiments, sections
              cadastrales
            </li>
            <li>
              <strong>Licence :</strong> Licence Ouverte 2.0
            </li>
          </ul>
          <a
            href="https://cadastre.data.gouv.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Accéder aux données sur cadastre.data.gouv.fr →
          </a>
        </div>
      </section>

      {/* Engagement */}
      <section className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-900">
          Notre engagement
        </h2>
        <ul className="text-blue-800 space-y-2">
          <li>Nous n'inventons aucune donnée</li>
          <li>Nous citons systématiquement nos sources</li>
          <li>Nous indiquons les dates de mise à jour</li>
          <li>Nous expliquons notre méthodologie de traitement</li>
        </ul>
      </section>
    </div>
  );
}
