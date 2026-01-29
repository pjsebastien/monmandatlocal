import { NextRequest, NextResponse } from "next/server";
import { getAllVilles, generateSlug } from "@/lib/data/territorial";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const villes = getAllVilles();
  const normalizedSearch = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const results = villes
    .filter((ville) => {
      const normalizedNom = ville.nom
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedNom.includes(normalizedSearch);
    })
    .slice(0, 6)
    .map((ville) => ({
      nom: ville.nom,
      slug: generateSlug(ville.nom),
      code_insee: ville.code_insee,
      departement: {
        code: ville.departement.code,
        name: ville.departement.name,
      },
      prix_m2: ville.dvf?.prix_m2_median_global ?? null,
      is_estimation: ville.dvf?.is_estimation ?? false,
    }));

  return NextResponse.json(results);
}
