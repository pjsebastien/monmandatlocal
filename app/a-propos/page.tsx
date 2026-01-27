import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez MonMandatLocal.fr, un site d'information sur le marché immobilier local basé sur des données officielles.",
};

export default function AProposPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">À propos de MonMandatLocal.fr</h1>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Notre mission</h2>
        <p className="text-gray-700 mb-4">
          MonMandatLocal.fr a pour objectif d'aider les particuliers à
          comprendre le marché immobilier local à partir de données factuelles
          et officielles.
        </p>
        <p className="text-gray-700">
          Que vous soyez vendeur, acheteur ou bailleur, nous mettons à votre
          disposition des informations objectives sur les prix, les loyers et
          les caractéristiques démographiques de chaque territoire.
        </p>
      </section>

      {/* Approche */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Notre approche</h2>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-2">Données officielles uniquement</h3>
            <p className="text-gray-600">
              Toutes les informations proviennent de sources publiques et
              vérifiables : DVF (Demandes de Valeurs Foncières), INSEE, données
              cadastrales.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-2">Transparence méthodologique</h3>
            <p className="text-gray-600">
              Nous expliquons clairement comment les données sont collectées,
              traitées et présentées. Aucune donnée n'est inventée ou
              extrapolée sans mention explicite.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-2">Approche descriptive</h3>
            <p className="text-gray-600">
              Nous présentons les faits sans porter de jugement. Nous ne
              fournissons aucun conseil en investissement ni recommandation
              d'achat ou de vente.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold mb-2">Neutralité</h3>
            <p className="text-gray-600">
              MonMandatLocal.fr n'est affilié à aucune agence immobilière,
              promoteur ou organisme de crédit. Notre seul objectif est
              l'information du public.
            </p>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Nos sources de données</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <ul className="space-y-4">
            <li>
              <strong className="text-gray-900">DVF (Demandes de Valeurs Foncières)</strong>
              <p className="text-gray-600 text-sm mt-1">
                Base de données des transactions immobilières publiée par la
                Direction Générale des Finances Publiques. Disponible sur
                data.gouv.fr.
              </p>
            </li>
            <li>
              <strong className="text-gray-900">INSEE</strong>
              <p className="text-gray-600 text-sm mt-1">
                Données démographiques et logement issues des recensements de
                population, disponibles à l'échelle communale et infra-communale
                (IRIS).
              </p>
            </li>
            <li>
              <strong className="text-gray-900">Cadastre</strong>
              <p className="text-gray-600 text-sm mt-1">
                Données cadastrales en open data pour les informations sur les
                parcelles et bâtiments.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Ce que nous ne faisons pas */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Ce que nous ne faisons pas</h2>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <ul className="text-red-800 space-y-2">
            <li>Nous ne fournissons pas de conseil en investissement</li>
            <li>Nous ne garantissons aucune rentabilité</li>
            <li>Nous ne recommandons pas d'acheter ou de vendre</li>
            <li>Nous ne remplaçons pas l'avis d'un professionnel</li>
            <li>Nous n'inventons pas de données</li>
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Contact</h2>
        <p className="text-blue-800 mb-4">
          Pour toute question concernant les données présentées ou le
          fonctionnement du site, vous pouvez nous contacter.
        </p>
        <a
          href="/contact"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Nous contacter
        </a>
      </section>
    </div>
  );
}
