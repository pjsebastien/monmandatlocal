import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site MonMandatLocal.fr - Éditeur, hébergement et conditions d'utilisation",
};

export default function MentionsLegalesPage() {
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
              <li className="text-gray-900">Mentions légales</li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Mentions légales</h1>
          <p className="text-gray-600 mt-2">Dernière mise à jour : janvier 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 space-y-10">
          {/* Éditeur */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
              Éditeur du site
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p><strong>Nom du site :</strong> MonMandatLocal.fr</p>
              <p><strong>Éditeur :</strong> Sébastien P.</p>
              <p><strong>Statut :</strong> Particulier</p>
              <p><strong>Adresse :</strong> France</p>
              <p>
                <strong>Contact :</strong>{" "}
                <a href="mailto:contact@monmandatlocal.fr" className="text-indigo-600 hover:underline">
                  contact@monmandatlocal.fr
                </a>
              </p>
            </div>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
              Hébergement
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p><strong>Hébergeur :</strong> Vercel Inc.</p>
              <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p>
                <strong>Site web :</strong>{" "}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
              Propriété intellectuelle
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Le contenu du site MonMandatLocal.fr (structure, textes, graphiques, images, code source)
                est la propriété exclusive de l&apos;éditeur, sauf mention contraire.
                Toute reproduction, représentation ou diffusion, totale ou partielle,
                sans autorisation préalable est interdite.
              </p>
              <p>
                Les données statistiques présentées proviennent de sources publiques
                et sont utilisées conformément à leurs licences respectives :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>DVF (Demandes de Valeurs Foncières)</strong> : Licence Ouverte Etalab
                </li>
                <li>
                  <strong>INSEE</strong> : Licence Ouverte
                </li>
              </ul>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
              Limitation de responsabilité
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="text-amber-800">
                  <strong>Important :</strong> Les informations présentées sur ce site ont un caractère
                  purement indicatif et descriptif. Elles ne constituent en aucun cas :
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1 text-amber-700">
                  <li>Un conseil en investissement</li>
                  <li>Une expertise immobilière certifiée</li>
                  <li>Une recommandation d&apos;achat ou de vente</li>
                  <li>Une garantie de valeur ou de rentabilité</li>
                </ul>
              </div>
              <p>
                L&apos;éditeur s&apos;efforce de fournir des informations exactes et à jour,
                mais ne saurait garantir l&apos;exactitude, l&apos;exhaustivité ou la pertinence
                des données présentées. L&apos;utilisateur est seul responsable de l&apos;usage
                qu&apos;il fait de ces informations.
              </p>
              <p>
                L&apos;éditeur ne saurait être tenu responsable des décisions prises
                sur la base des informations contenues sur ce site, ni des dommages
                directs ou indirects qui pourraient en résulter.
              </p>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
              Données personnelles
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Ce site ne collecte pas de données personnelles à des fins commerciales
                ou de prospection. Pour plus d&apos;informations sur la gestion de vos données,
                consultez notre{" "}
                <Link href="/politique-confidentialite" className="text-indigo-600 hover:underline">
                  politique de confidentialité
                </Link>.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">6</span>
              Cookies
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Ce site utilise des cookies strictement nécessaires au fonctionnement
                du site (préférences utilisateur, session). Aucun cookie publicitaire
                ou de tracking tiers n&apos;est utilisé.
              </p>
              <p>
                En continuant à naviguer sur ce site, vous acceptez l&apos;utilisation
                de ces cookies techniques.
              </p>
            </div>
          </section>

          {/* Liens externes */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">7</span>
              Liens externes
            </h2>
            <div className="text-gray-700">
              <p>
                Le site peut contenir des liens vers des sites externes.
                L&apos;éditeur n&apos;exerce aucun contrôle sur ces sites et décline
                toute responsabilité quant à leur contenu ou leurs pratiques
                en matière de protection des données.
              </p>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">8</span>
              Droit applicable
            </h2>
            <div className="text-gray-700">
              <p>
                Les présentes mentions légales sont régies par le droit français.
                En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter à{" "}
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
