const footerLinks = {
  explorer: {
    title: "Explorer",
    links: [
      { name: "Toutes les villes", href: "/villes" },
      { name: "Rechercher un quartier", href: "/quartiers" },
      { name: "Estimation immobilière", href: "/estimation" },
    ],
  },
  ressources: {
    title: "Ressources",
    links: [
      { name: "Blog", href: "/blog" },
      { name: "Sources de données", href: "/sources" },
      { name: "Méthodologie", href: "/methodologie" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  legal: {
    title: "Informations",
    links: [
      { name: "À propos", href: "/a-propos" },
      { name: "Mentions légales", href: "/mentions-legales" },
      { name: "Politique de confidentialité", href: "/politique-confidentialite" },
      { name: "Contact", href: "/contact" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <a href="/" className="text-xl font-bold text-blue-600">
              MonMandatLocal.fr
            </a>
            <p className="mt-4 text-sm text-gray-600">
              Comprendre le marché immobilier local à partir de données
              officielles et factuelles.
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="border-t pt-8 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Données officielles</strong> : Toutes les informations
              présentées proviennent de sources publiques (DVF, INSEE, cadastre).
              Ce site présente des données descriptives uniquement et ne
              constitue pas un conseil en investissement.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} MonMandatLocal.fr - Tous droits
            réservés
          </p>
          <p className="text-sm text-gray-500">
            Informations à caractère descriptif uniquement
          </p>
        </div>
      </div>
    </footer>
  );
}
