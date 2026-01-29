import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe MonMandatLocal.fr",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">Contact</h1>
      <p className="text-xl text-gray-600 mb-8">
        Une question ? Un signalement d&apos;erreur ? N&apos;hésitez pas à nous écrire.
      </p>

      {/* Email de contact */}
      <section className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Écrivez-nous</h2>
          <p className="text-gray-600 mb-6">
            Envoyez-nous un email et nous vous répondrons dans les meilleurs délais.
          </p>
          <a
            href="mailto:contact@monmandatlocal.fr"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            contact@monmandatlocal.fr
          </a>
        </div>
      </section>

      {/* Informations */}
      <section className="bg-gray-50 p-6 rounded-xl">
        <h2 className="font-bold mb-4">Ce que nous pouvons vous aider à faire</h2>
        <ul className="text-gray-700 space-y-2 mb-6">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Comprendre nos données et leur méthodologie
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Signaler une erreur ou une incohérence
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Suggérer une fonctionnalité ou une amélioration
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Poser une question sur les sources de données
          </li>
        </ul>

        <h2 className="font-bold mt-6 mb-4">Ce que nous ne pouvons pas faire</h2>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Fournir une expertise immobilière personnalisée
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Donner des conseils en investissement
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Réaliser une estimation sur mesure de votre bien
          </li>
        </ul>
      </section>

      {/* Liens utiles */}
      <section className="mt-8 text-center text-sm text-gray-500">
        <p>
          Consultez également nos{" "}
          <Link href="/mentions-legales" className="text-indigo-600 hover:underline">
            mentions légales
          </Link>{" "}
          et notre{" "}
          <Link href="/politique-confidentialite" className="text-indigo-600 hover:underline">
            politique de confidentialité
          </Link>.
        </p>
      </section>
    </div>
  );
}
