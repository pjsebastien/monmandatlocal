import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de MonMandatLocal.fr - Gestion des données personnelles et cookies",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-10">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-indigo-600">
                  Accueil
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900">Politique de confidentialité</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Politique de confidentialité</h1>
          <p className="text-gray-600 mt-2">Dernière mise à jour : janvier 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 space-y-10">
          {/* Introduction */}
          <section>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
              <p className="text-indigo-800">
                La protection de vos données personnelles est importante pour nous.
                Cette politique de confidentialité explique quelles informations nous collectons,
                comment nous les utilisons et quels sont vos droits.
              </p>
            </div>
          </section>

          {/* Responsable du traitement */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
              Responsable du traitement
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Le responsable du traitement des données collectées sur MonMandatLocal.fr est :
              </p>
              <div className="bg-gray-50 rounded-xl p-5">
                <p><strong>Sébastien P.</strong></p>
                <p>Contact : <a href="mailto:contact@monmandatlocal.fr" className="text-indigo-600 hover:underline">contact@monmandatlocal.fr</a></p>
              </div>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
              Données collectées
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                MonMandatLocal.fr est conçu pour minimiser la collecte de données personnelles.
                Nous collectons uniquement :
              </p>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Données de navigation (automatiques)</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Adresse IP (anonymisée)</li>
                    <li>Type de navigateur et système d&apos;exploitation</li>
                    <li>Pages visitées et temps de visite</li>
                    <li>Source de trafic (site référent)</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-3">
                    Ces données sont collectées à des fins statistiques uniquement.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">Données fournies volontairement</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Formulaire de contact : nom, email, message</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-3">
                    Ces données sont utilisées uniquement pour répondre à votre demande.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <p className="text-emerald-800">
                  <strong>Ce que nous ne collectons PAS :</strong>
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-emerald-700 text-sm">
                  <li>Données bancaires ou financières</li>
                  <li>Données de géolocalisation précise</li>
                  <li>Informations sur vos biens immobiliers</li>
                  <li>Données à des fins publicitaires ou de profilage</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
              Utilisation des données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Les données collectées sont utilisées pour :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Améliorer le site</strong> : comprendre comment les utilisateurs
                  naviguent pour optimiser l&apos;expérience
                </li>
                <li>
                  <strong>Répondre aux demandes</strong> : traiter les messages envoyés
                  via le formulaire de contact
                </li>
                <li>
                  <strong>Assurer la sécurité</strong> : détecter et prévenir les
                  activités malveillantes
                </li>
              </ul>
              <p>
                <strong>Nous ne vendons, ne louons et ne partageons pas vos données
                personnelles avec des tiers à des fins commerciales.</strong>
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
              Cookies
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Un cookie est un petit fichier texte stocké sur votre appareil lors de
                la visite d&apos;un site web. MonMandatLocal.fr utilise les cookies suivants :
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-semibold">Type</th>
                      <th className="text-left p-3 font-semibold">Finalité</th>
                      <th className="text-left p-3 font-semibold">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-3">Cookies techniques</td>
                      <td className="p-3">Fonctionnement du site (session, préférences)</td>
                      <td className="p-3">Session / 1 an</td>
                    </tr>
                    <tr>
                      <td className="p-3">Cookie de consentement</td>
                      <td className="p-3">Mémoriser votre choix concernant les cookies</td>
                      <td className="p-3">1 an</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Gérer les cookies</h3>
                <p className="text-sm">
                  Vous pouvez à tout moment modifier vos préférences en matière de cookies
                  via les paramètres de votre navigateur. Notez que la désactivation de
                  certains cookies peut affecter le fonctionnement du site.
                </p>
              </div>
            </div>
          </section>

          {/* Conservation des données */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
              Conservation des données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>Les données sont conservées pour la durée suivante :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Données de navigation</strong> : 13 mois maximum (conformément
                  aux recommandations CNIL)
                </li>
                <li>
                  <strong>Données de contact</strong> : 3 ans après le dernier échange
                </li>
              </ul>
            </div>
          </section>

          {/* Vos droits */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">6</span>
              Vos droits
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD),
                vous disposez des droits suivants :
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Droit d&apos;accès</h3>
                  <p className="text-sm">Obtenir une copie de vos données personnelles</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Droit de rectification</h3>
                  <p className="text-sm">Corriger des données inexactes ou incomplètes</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Droit à l&apos;effacement</h3>
                  <p className="text-sm">Demander la suppression de vos données</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Droit d&apos;opposition</h3>
                  <p className="text-sm">Vous opposer au traitement de vos données</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Droit à la portabilité</h3>
                  <p className="text-sm">Récupérer vos données dans un format lisible</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">Droit de limitation</h3>
                  <p className="text-sm">Limiter le traitement de vos données</p>
                </div>
              </div>

              <p>
                Pour exercer ces droits, contactez-nous à{" "}
                <a href="mailto:contact@monmandatlocal.fr" className="text-indigo-600 hover:underline">
                  contact@monmandatlocal.fr
                </a>.
                Nous répondrons dans un délai d&apos;un mois.
              </p>

              <p>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez
                introduire une réclamation auprès de la CNIL :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  www.cnil.fr
                </a>
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">7</span>
              Sécurité des données
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Nous mettons en oeuvre des mesures techniques et organisationnelles
                appropriées pour protéger vos données :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Connexion sécurisée HTTPS</li>
                <li>Hébergement sur infrastructure sécurisée (Vercel)</li>
                <li>Accès restreint aux données</li>
              </ul>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">8</span>
              Modifications de cette politique
            </h2>
            <div className="text-gray-700">
              <p>
                Cette politique de confidentialité peut être mise à jour occasionnellement.
                La date de dernière mise à jour est indiquée en haut de cette page.
                Nous vous encourageons à consulter régulièrement cette page.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Pour toute question concernant cette politique de confidentialité,
              contactez-nous à{" "}
              <a href="mailto:contact@monmandatlocal.fr" className="text-indigo-600 hover:underline">
                contact@monmandatlocal.fr
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
