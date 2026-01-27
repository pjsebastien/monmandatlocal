import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ ville: string; iris: string }>;
};

type QuartierData = {
  nom: string;
  ville: string;
  iris: string;
};

// TODO: Remplacer par les vraies données
async function getQuartierData(
  ville: string,
  iris: string
): Promise<QuartierData | null> {
  // Emplacement pour récupérer les données IRIS depuis la source
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ville, iris } = await params;
  const quartier = await getQuartierData(ville, iris);

  if (!quartier) {
    return {
      title: "Quartier non trouvé",
    };
  }

  return {
    title: `Quartier ${quartier.nom} à ${quartier.ville}`,
    description: `Données démographiques et logement du quartier ${quartier.nom} à ${quartier.ville}`,
  };
}

export default async function QuartierPage({ params }: Props) {
  const { ville, iris } = await params;
  const quartier = await getQuartierData(ville, iris);

  if (!quartier) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <a href="/" className="hover:text-blue-600">
          Accueil
        </a>
        {" > "}
        <a href={`/ville/${ville}`} className="hover:text-blue-600">
          {quartier.ville}
        </a>
        {" > "}
        <span>{quartier.nom}</span>
      </nav>

      <h1 className="text-4xl font-bold mb-2">Quartier {quartier.nom}</h1>
      <p className="text-xl text-gray-600 mb-8">{quartier.ville}</p>

      {/* Section Démographie */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Population et démographie</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {/* TODO: Intégrer les données INSEE IRIS */}
          <MetricCard label="Population" value="À venir" />
          <MetricCard label="Densité" value="À venir" unit="hab/km²" />
          <MetricCard label="Âge médian" value="À venir" unit="ans" />
          <MetricCard label="Taille ménages" value="À venir" unit="pers." />
        </div>
      </section>

      {/* Section Logement */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Logements</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* TODO: Intégrer les données INSEE IRIS */}
          <MetricCard label="Nombre de logements" value="À venir" />
          <MetricCard label="Propriétaires" value="À venir" unit="%" />
          <MetricCard label="Locataires" value="À venir" unit="%" />
        </div>

        <div className="mt-6 bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold mb-3">Répartition des types de logements</h3>
          {/* TODO: Graphique ou tableau */}
          <p className="text-gray-500">Données à venir</p>
        </div>
      </section>

      {/* Section Comparaison */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Comparaison avec la ville
        </h2>
        <p className="text-gray-600 mb-4">
          Comparez les indicateurs de ce quartier avec la moyenne de la ville.
        </p>
        {/* TODO: Tableau de comparaison */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-500">
            Tableau de comparaison à venir
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="font-bold mb-2 text-blue-900">Source des données</h3>
        <p className="text-sm text-blue-800">
          Les données présentées proviennent de l'INSEE (données carroyées IRIS).
          Elles sont mises à jour périodiquement et peuvent présenter un léger
          décalage avec la situation actuelle.
        </p>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit = "",
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold">
        {value} {unit && <span className="text-lg text-gray-600">{unit}</span>}
      </p>
    </div>
  );
}
