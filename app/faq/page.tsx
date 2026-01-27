import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes sur MonMandatLocal.fr et les données immobilières.",
};

const faqs = [
  {
    question: "D'où proviennent les données de prix ?",
    answer:
      "Les données de prix proviennent de la base DVF (Demandes de Valeurs Foncières), qui recense toutes les transactions immobilières en France. Cette base est publiée par la Direction Générale des Finances Publiques et mise à jour semestriellement.",
  },
  {
    question: "Quelle est la différence entre prix médian et prix moyen ?",
    answer:
      "Le prix médian est la valeur qui sépare les transactions en deux moitiés égales. Il est moins sensible aux valeurs extrêmes que la moyenne. Par exemple, si 10 biens se vendent entre 100 000€ et 200 000€, et un bien à 2 000 000€, le prix moyen sera très élevé alors que le prix médian restera représentatif de la majorité des transactions.",
  },
  {
    question: "Les estimations sont-elles fiables ?",
    answer:
      "Les estimations fournies sont indicatives et basées uniquement sur les transactions récentes dans la commune. Elles ne prennent pas en compte les spécificités de votre bien (état, emplacement exact, travaux, etc.). Pour une estimation fiable, consultez un professionnel de l'immobilier.",
  },
  {
    question: "Qu'est-ce qu'un IRIS ?",
    answer:
      "L'IRIS (Ilots Regroupés pour l'Information Statistique) est le découpage géographique utilisé par l'INSEE pour diffuser des données à l'échelle du quartier. Chaque IRIS regroupe environ 2 000 habitants et permet d'analyser finement les caractéristiques d'un territoire.",
  },
  {
    question: "Pourquoi certaines données ne sont pas disponibles ?",
    answer:
      "Plusieurs raisons peuvent expliquer l'absence de données : nombre de transactions insuffisant pour calculer un indicateur fiable, commune trop petite pour les données IRIS, données non encore publiées par les sources officielles, ou territoire non couvert (Alsace-Moselle, Mayotte).",
  },
  {
    question: "À quelle fréquence les données sont-elles mises à jour ?",
    answer:
      "Les données DVF sont publiées semestriellement par la DGFiP, avec un délai de plusieurs mois après les transactions. Les données INSEE sont issues de recensements annuels avec un décalage de 2 à 3 ans. Nous mettons à jour notre site dès que de nouvelles données sont disponibles.",
  },
  {
    question: "MonMandatLocal.fr fournit-il des conseils en investissement ?",
    answer:
      "Non. MonMandatLocal.fr présente uniquement des données factuelles et descriptives. Nous ne fournissons aucun conseil en investissement, aucune garantie de rentabilité, et aucune recommandation d'achat ou de vente. Pour tout projet immobilier, consultez des professionnels qualifiés.",
  },
  {
    question: "Comment sont calculées les fourchettes d'estimation ?",
    answer:
      "La fourchette d'estimation correspond à ±15% autour du prix estimé. Cette marge reflète l'incertitude liée à la méthode statistique utilisée et aux caractéristiques individuelles des biens que nous ne pouvons pas prendre en compte.",
  },
  {
    question: "Les données couvrent-elles toute la France ?",
    answer:
      "Les données DVF couvrent la France métropolitaine et les DOM, à l'exception de l'Alsace-Moselle (où le régime foncier est différent) et de Mayotte. Les données IRIS ne sont disponibles que pour les communes de plus de 10 000 habitants.",
  },
  {
    question: "Puis-je utiliser les données pour mon usage personnel ?",
    answer:
      "Les données sources (DVF, INSEE) sont en open data et peuvent être réutilisées librement. Les analyses et présentations réalisées par MonMandatLocal.fr sont protégées par le droit d'auteur mais peuvent être citées avec mention de la source.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Questions fréquentes</h1>
      <p className="text-xl text-gray-600 mb-8">
        Retrouvez les réponses aux questions les plus courantes.
      </p>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <h2 className="text-lg font-bold mb-3">{faq.question}</h2>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <section className="mt-12 bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-900">
          Vous avez une autre question ?
        </h2>
        <p className="text-blue-800 mb-4">
          Si vous n'avez pas trouvé la réponse à votre question, n'hésitez pas
          à nous contacter.
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
