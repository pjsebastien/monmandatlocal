"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { generateSlug, formatPrix, formatNumber } from "@/lib/data/territorial-types";
import type { Ville, Departement, Region, DVFVille } from "@/lib/data/territorial-types";

type VilleLight = Pick<Ville, "nom" | "code_insee" | "departement" | "region" | "dvf">;

interface VillesClientProps {
  villes: VilleLight[];
  regions: string[];
  departements: string[];
}

type SortOption = "nom" | "population" | "prix" | "transactions";
type SortDirection = "asc" | "desc";

export function VillesClient({ villes, regions, departements }: VillesClientProps) {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedDepartement, setSelectedDepartement] = useState<string>("");
  const [showDVFOnly, setShowDVFOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("nom");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Suggestions de recherche (max 8)
  const searchSuggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    const normalizedSearch = search
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return villes
      .filter((ville) => {
        const normalizedNom = ville.nom
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return normalizedNom.includes(normalizedSearch);
      })
      .slice(0, 8);
  }, [villes, search]);

  // Filtrer et trier les villes
  const filteredVilles = useMemo(() => {
    let result = [...villes];

    // Filtre par recherche
    if (search) {
      const normalizedSearch = search
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      result = result.filter((ville) => {
        const normalizedNom = ville.nom
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return normalizedNom.includes(normalizedSearch);
      });
    }

    // Filtre par région
    if (selectedRegion) {
      result = result.filter((ville) => ville.region.name === selectedRegion);
    }

    // Filtre par département
    if (selectedDepartement) {
      const deptCode = selectedDepartement.split(" - ")[0];
      result = result.filter((ville) => ville.departement.code === deptCode);
    }

    // Filtre DVF uniquement
    if (showDVFOnly) {
      result = result.filter(
        (ville) => ville.dvf && ville.dvf.prix_m2_median_global !== null
      );
    }

    // Tri
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "nom":
          comparison = a.nom.localeCompare(b.nom, "fr");
          break;
        case "prix":
          const prixA = a.dvf?.prix_m2_median_global ?? 0;
          const prixB = b.dvf?.prix_m2_median_global ?? 0;
          comparison = prixA - prixB;
          break;
        case "transactions":
          const transA = a.dvf?.nb_ventes_total ?? 0;
          const transB = b.dvf?.nb_ventes_total ?? 0;
          comparison = transA - transB;
          break;
        default:
          comparison = a.nom.localeCompare(b.nom, "fr");
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [villes, search, selectedRegion, selectedDepartement, showDVFOnly, sortBy, sortDirection]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortDirection(option === "nom" ? "asc" : "desc");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedRegion("");
    setSelectedDepartement("");
    setShowDVFOnly(false);
    setSortBy("nom");
    setSortDirection("asc");
  };

  const hasActiveFilters = search || selectedRegion || selectedDepartement || showDVFOnly;

  return (
    <div>
      {/* Barre de recherche avec autocomplétion */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="relative" ref={searchRef}>
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Rechercher une ville (ex: Lyon, Bordeaux, Nantes...)"
            className={`w-full pl-12 pr-4 py-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg ${
              showSuggestions && searchSuggestions.length > 0
                ? "rounded-t-xl rounded-b-none border-b-0"
                : "rounded-xl"
            }`}
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setShowSuggestions(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Dropdown suggestions */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full bg-white border border-gray-300 border-t-0 rounded-b-xl shadow-lg overflow-hidden z-50">
              {searchSuggestions.map((ville, index) => {
                const isEstimation = ville.dvf?.is_estimation ?? false;
                const hasDVF = ville.dvf && ville.dvf.prix_m2_median_global !== null;
                return (
                  <Link
                    key={ville.code_insee}
                    href={`/ville/${generateSlug(ville.nom)}`}
                    onClick={() => setShowSuggestions(false)}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-emerald-50 transition-colors ${
                      index !== searchSuggestions.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{ville.nom}</p>
                        <p className="text-sm text-gray-500">
                          {ville.departement.name} ({ville.departement.code})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasDVF && (
                        <>
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrix(ville.dvf!.prix_m2_median_global)}/m²
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              isEstimation
                                ? "bg-slate-100 text-slate-600"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {isEstimation ? "Marché" : "DVF"}
                          </span>
                        </>
                      )}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
              {searchSuggestions.length === 8 && (
                <div className="px-4 py-2 bg-gray-50 text-center">
                  <p className="text-xs text-gray-500">
                    Continuez à taper pour affiner la recherche...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtre par région */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Région
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setSelectedDepartement("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="">Toutes les régions</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre par département */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Département
            </label>
            <select
              value={selectedDepartement}
              onChange={(e) => setSelectedDepartement(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="">Tous les départements</option>
              {departements
                .filter((d) => !selectedRegion || villes.some(
                  (v) => v.region.name === selectedRegion && `${v.departement.code} - ${v.departement.name}` === d
                ))
                .map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
            </select>
          </div>

          {/* Filtre DVF */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDVFOnly}
                onChange={(e) => setShowDVFOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Données DVF uniquement</span>
            </label>
          </div>

          {/* Reset filtres */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Tri */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Trier par :</span>
            <div className="flex gap-1">
              {[
                { key: "nom", label: "Nom" },
                { key: "prix", label: "Prix/m²" },
                { key: "transactions", label: "Transactions" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key as SortOption)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                    sortBy === key
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {label}
                  {sortBy === key && (
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Vue grille / liste */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
              title="Vue grille"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
              title="Vue liste"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Compteur de résultats */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{filteredVilles.length}</span> ville
          {filteredVilles.length > 1 ? "s" : ""} trouvée
          {filteredVilles.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Liste des villes */}
      {filteredVilles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Aucune ville trouvée
          </h3>
          <p className="text-gray-500 mb-4">
            Essayez de modifier vos critères de recherche
          </p>
          <button
            onClick={resetFilters}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVilles.map((ville) => (
            <VilleCard key={ville.code_insee} ville={ville} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Département
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Prix médian/m²
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Transactions
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVilles.map((ville) => (
                <VilleRow key={ville.code_insee} ville={ville} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function VilleCard({ ville }: { ville: VilleLight }) {
  const slug = generateSlug(ville.nom);
  const hasDVF = ville.dvf && ville.dvf.prix_m2_median_global !== null;
  const isEstimation = ville.dvf?.is_estimation ?? false;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-emerald-200 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
            {ville.nom}
          </h3>
          <p className="text-sm text-gray-500">
            {ville.departement.name} ({ville.departement.code})
          </p>
        </div>
        {hasDVF && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isEstimation
                ? "bg-slate-100 text-slate-600"
                : "bg-emerald-100 text-emerald-700"
            }`}
            title={isEstimation ? "Prix de marché" : "Données DVF officielles"}
          >
            {isEstimation ? "Marché" : "DVF"}
          </span>
        )}
      </div>

      {hasDVF ? (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Prix médian</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrix(ville.dvf!.prix_m2_median_global)}
            <span className="text-sm font-normal text-gray-500">/m²</span>
          </p>
          {isEstimation ? (
            <p className="text-xs text-gray-500 mt-1">
              Source : données de marché
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              {formatNumber(ville.dvf!.nb_ventes_total)} transactions en 2025
            </p>
          )}
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-400">Données DVF non disponibles</p>
        </div>
      )}

      <div className="flex gap-2">
        <Link
          href={`/ville/${slug}`}
          className="flex-1 text-center px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Prix
        </Link>
        {hasDVF && (
          <Link
            href={`/estimation/${slug}`}
            className="flex-1 text-center px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Estimer
          </Link>
        )}
      </div>
    </div>
  );
}

function VilleRow({ ville }: { ville: VilleLight }) {
  const slug = generateSlug(ville.nom);
  const hasDVF = ville.dvf && ville.dvf.prix_m2_median_global !== null;
  const isEstimation = ville.dvf?.is_estimation ?? false;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-medium text-gray-900">{ville.nom}</p>
            <p className="text-xs text-gray-500 md:hidden">
              {ville.departement.code}
            </p>
          </div>
          {hasDVF && (
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                isEstimation
                  ? "bg-slate-100 text-slate-600"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {isEstimation ? "Marché" : "DVF"}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
        {ville.departement.name} ({ville.departement.code})
      </td>
      <td className="px-4 py-3 text-right">
        {hasDVF ? (
          <span className="font-semibold text-gray-900">
            {formatPrix(ville.dvf!.prix_m2_median_global)}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">N/A</span>
        )}
      </td>
      <td className="px-4 py-3 text-right text-sm text-gray-600 hidden sm:table-cell">
        {hasDVF && !isEstimation ? formatNumber(ville.dvf!.nb_ventes_total) : "-"}
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          <Link
            href={`/ville/${slug}`}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Prix
          </Link>
          {hasDVF && (
            <Link
              href={`/estimation/${slug}`}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Estimer
            </Link>
          )}
        </div>
      </td>
    </tr>
  );
}
