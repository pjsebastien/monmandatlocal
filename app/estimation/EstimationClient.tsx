"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { generateSlug, formatPrix } from "@/lib/data/territorial-types";
import type { Ville } from "@/lib/data/territorial-types";

type VilleLight = Pick<Ville, "nom" | "code_insee" | "departement" | "region" | "dvf">;

interface EstimationClientProps {
  villes: VilleLight[];
  regions: string[];
}

type DataSourceFilter = "all" | "dvf" | "estimation";

export function EstimationClient({ villes, regions }: EstimationClientProps) {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [dataSourceFilter, setDataSourceFilter] = useState<DataSourceFilter>("all");
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

  // Filtrer les villes
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

    // Filtre par source de données
    if (dataSourceFilter === "dvf") {
      result = result.filter((ville) => !ville.dvf?.is_estimation);
    } else if (dataSourceFilter === "estimation") {
      result = result.filter((ville) => ville.dvf?.is_estimation);
    }

    return result;
  }, [villes, search, selectedRegion, dataSourceFilter]);

  // Grouper par région
  const villesParRegion = useMemo(() => {
    return filteredVilles.reduce(
      (acc, ville) => {
        const region = ville.region.name;
        if (!acc[region]) acc[region] = [];
        acc[region].push(ville);
        return acc;
      },
      {} as Record<string, typeof filteredVilles>
    );
  }, [filteredVilles]);

  const regionsTriees = Object.keys(villesParRegion).sort();

  const resetFilters = () => {
    setSearch("");
    setSelectedRegion("");
    setDataSourceFilter("all");
  };

  const hasActiveFilters = search || selectedRegion || dataSourceFilter !== "all";

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
            placeholder="Rechercher une ville (ex: Paris, Lyon, Bordeaux...)"
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
                return (
                  <Link
                    key={ville.code_insee}
                    href={`/estimation/${generateSlug(ville.nom)}`}
                    onClick={() => setShowSuggestions(false)}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-emerald-50 transition-colors ${
                      index !== searchSuggestions.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isEstimation
                          ? "bg-gradient-to-br from-amber-100 to-orange-100"
                          : "bg-gradient-to-br from-emerald-100 to-teal-100"
                      }`}>
                        <svg className={`w-4 h-4 ${isEstimation ? "text-amber-600" : "text-emerald-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
                      {ville.dvf?.prix_m2_median_global && (
                        <span className={`text-sm font-medium ${isEstimation ? "text-amber-600" : "text-gray-900"}`}>
                          {formatPrix(ville.dvf.prix_m2_median_global)}/m²
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          isEstimation
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isEstimation ? "Est." : "DVF"}
                      </span>
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

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtre par région */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Région
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
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

          {/* Filtre par source de données */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Source des données
            </label>
            <select
              value={dataSourceFilter}
              onChange={(e) => setDataSourceFilter(e.target.value as DataSourceFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="all">Toutes les sources</option>
              <option value="dvf">DVF officielles uniquement</option>
              <option value="estimation">Estimations uniquement</option>
            </select>
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
      </div>

      {/* Compteur de résultats */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{filteredVilles.length}</span> ville
          {filteredVilles.length > 1 ? "s" : ""} disponible
          {filteredVilles.length > 1 ? "s" : ""} pour l&apos;estimation
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
      ) : (
        <div className="space-y-8">
          {regionsTriees.map((region) => (
            <div key={region}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                {region}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {villesParRegion[region]
                  .sort((a, b) => a.nom.localeCompare(b.nom))
                  .map((ville) => {
                    const isEstimation = ville.dvf?.is_estimation ?? false;
                    return (
                      <Link
                        key={ville.code_insee}
                        href={`/estimation/${generateSlug(ville.nom)}`}
                        className={`block p-3 bg-white rounded-lg border hover:shadow-md transition-all group ${
                          isEstimation
                            ? "border-amber-200 hover:border-amber-400"
                            : "border-gray-200 hover:border-emerald-500"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className={`font-medium block truncate ${
                              isEstimation
                                ? "text-gray-900 group-hover:text-amber-700"
                                : "text-gray-900 group-hover:text-emerald-700"
                            }`}>
                              {ville.nom}
                            </span>
                            <span className="block text-sm text-gray-500 truncate">
                              {ville.departement.name}
                            </span>
                          </div>
                          <span
                            className={`flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              isEstimation
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                            title={isEstimation ? "Prix estimés (non officiels)" : "Données DVF officielles"}
                          >
                            {isEstimation ? "Est." : "DVF"}
                          </span>
                        </div>
                        {ville.dvf?.prix_m2_median_global && (
                          <p className={`text-xs mt-1 ${isEstimation ? "text-amber-600" : "text-gray-400"}`}>
                            {formatPrix(ville.dvf.prix_m2_median_global)}/m²
                          </p>
                        )}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
