"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrix } from "@/lib/data/territorial-types";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Villes", href: "/villes" },
  { name: "Quartiers", href: "/quartiers" },
  { name: "Estimation", href: "/estimation" },
  { name: "Blog", href: "/blog" },
  { name: "À propos", href: "/a-propos" },
];

interface VilleSearchResult {
  nom: string;
  slug: string;
  code_insee: string;
  departement: {
    code: string;
    name: string;
  };
  prix_m2: number | null;
  is_estimation: boolean;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<VilleSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recherche avec debounce
  const searchVilles = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search-villes?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error("Erreur de recherche:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounce la recherche
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchVilles(search);
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search, searchVilles]);

  const handleSelectVille = () => {
    setSearch("");
    setShowSuggestions(false);
    setSuggestions([]);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="MonMandatLocal.fr"
              width={200}
              height={48}
              className="h-[42px] md:h-[60px] w-auto"
              priority
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Search (Desktop) */}
          <div className="hidden lg:block" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Rechercher une ville..."
                className={`w-64 px-4 py-2 pl-10 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  showSuggestions && suggestions.length > 0
                    ? "rounded-t-lg rounded-b-none border-b-0"
                    : "rounded-lg"
                }`}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Dropdown suggestions desktop */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg overflow-hidden z-50">
                  {suggestions.map((ville, index) => (
                    <Link
                      key={ville.code_insee}
                      href={`/ville/${ville.slug}`}
                      onClick={handleSelectVille}
                      className={`flex items-center justify-between px-3 py-2.5 hover:bg-emerald-50 transition-colors ${
                        index !== suggestions.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{ville.nom}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {ville.departement.code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                        {ville.prix_m2 && (
                          <>
                            <span className="text-xs font-medium text-gray-700">
                              {formatPrix(ville.prix_m2)}
                            </span>
                            <span
                              className={`text-[9px] font-medium px-1 py-0.5 rounded ${
                                ville.is_estimation
                                  ? "bg-slate-100 text-slate-600"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {ville.is_estimation ? "Est." : "DVF"}
                            </span>
                          </>
                        )}
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                  {suggestions.length === 6 && (
                    <div className="px-3 py-1.5 bg-gray-50 text-center">
                      <p className="text-[10px] text-gray-500">
                        Tapez pour affiner...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Loading state */}
              {showSuggestions && isLoading && search.length >= 2 && suggestions.length === 0 && (
                <div className="absolute left-0 right-0 top-full bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 text-center">
                    <svg className="animate-spin h-5 w-5 text-emerald-600 mx-auto" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            {/* Mobile Search */}
            <div className="mb-4" ref={mobileSearchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Rechercher une ville..."
                  className={`w-full px-4 py-3 pl-10 text-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    showSuggestions && suggestions.length > 0
                      ? "rounded-t-lg rounded-b-none border-b-0"
                      : "rounded-lg"
                  }`}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setShowSuggestions(false);
                      setSuggestions([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* Dropdown suggestions mobile */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg overflow-hidden z-50">
                    {suggestions.map((ville, index) => (
                      <Link
                        key={ville.code_insee}
                        href={`/ville/${ville.slug}`}
                        onClick={handleSelectVille}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-emerald-50 transition-colors ${
                          index !== suggestions.length - 1 ? "border-b border-gray-100" : ""
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
                            <p className="text-xs text-gray-500">
                              {ville.departement.name} ({ville.departement.code})
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {ville.prix_m2 && (
                            <>
                              <span className="text-sm font-medium text-gray-700">
                                {formatPrix(ville.prix_m2)}
                              </span>
                              <span
                                className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                  ville.is_estimation
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {ville.is_estimation ? "Est." : "DVF"}
                              </span>
                            </>
                          )}
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                    {suggestions.length === 6 && (
                      <div className="px-4 py-2 bg-gray-50 text-center">
                        <p className="text-xs text-gray-500">
                          Continuez à taper pour affiner...
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Loading state mobile */}
                {showSuggestions && isLoading && search.length >= 2 && suggestions.length === 0 && (
                  <div className="absolute left-0 right-0 top-full bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 text-center">
                      <svg className="animate-spin h-5 w-5 text-emerald-600 mx-auto" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Links */}
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
