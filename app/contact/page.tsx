import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe MonMandatLocal.fr",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">Contact</h1>
      <p className="text-xl text-gray-600 mb-8">
        Une question ? Un signalement d'erreur ? N'hésitez pas à nous écrire.
      </p>

      {/* Formulaire */}
      <section className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Votre email
            </label>
            <input
              type="email"
              placeholder="votre@email.fr"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sujet</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            >
              <option>Question sur les données</option>
              <option>Signalement d'erreur</option>
              <option>Suggestion d'amélioration</option>
              <option>Partenariat</option>
              <option>Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              rows={6}
              placeholder="Votre message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>

          <button
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300"
            disabled
          >
            Envoyer
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Formulaire de contact à venir
        </p>
      </section>

      {/* Informations */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="font-bold mb-4">Ce que nous pouvons vous aider à faire</h2>
        <ul className="text-gray-700 space-y-2">
          <li>Comprendre nos données et leur méthodologie</li>
          <li>Signaler une erreur ou une incohérence</li>
          <li>Suggérer une fonctionnalité ou une amélioration</li>
          <li>Poser une question sur les sources de données</li>
        </ul>

        <h2 className="font-bold mt-6 mb-4">
          Ce que nous ne pouvons pas faire
        </h2>
        <ul className="text-gray-700 space-y-2">
          <li>Fournir une expertise immobilière personnalisée</li>
          <li>Donner des conseils en investissement</li>
          <li>Réaliser une estimation sur mesure de votre bien</li>
        </ul>
      </section>
    </div>
  );
}
