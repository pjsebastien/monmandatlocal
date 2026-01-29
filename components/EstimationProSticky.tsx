"use client";

import { useState, useEffect } from "react";
import { EstimationProForm } from "./EstimationProForm";

interface EstimationProStickyProps {
  ville: string;
}

export function EstimationProSticky({ ville }: EstimationProStickyProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Afficher après 400px de scroll
      const shouldShow = window.scrollY > 400;
      setIsVisible(shouldShow);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ne pas afficher si pas assez scrollé ou formulaire ouvert
  if (!isVisible || isFormOpen) {
    return (
      <EstimationProForm
        ville={ville}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    );
  }

  // Afficher le bouton minimisé
  if (isMinimized) {
    return (
      <>
        <button
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-4 right-4 md:right-6 z-40 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 animate-in fade-in duration-200"
          aria-label="Estimation professionnelle gratuite"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        <EstimationProForm
          ville={ville}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      </>
    );
  }

  // Afficher la barre complète
  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 animate-in slide-in-from-bottom-4 duration-300">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">
              Estimation professionnelle
            </p>
            <p className="text-xs text-gray-500 truncate">
              Un expert de {ville} vous rappelle
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex-shrink-0 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Gratuit
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Réduire"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <EstimationProForm
        ville={ville}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}
