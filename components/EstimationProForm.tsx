"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "./Modal";

interface EstimationProFormProps {
  ville: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EstimationProForm({ ville, isOpen, onClose }: EstimationProFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("https://formspree.io/f/mjgryvgv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          ville,
          page: typeof window !== "undefined" ? window.location.href : "",
          pathname: typeof window !== "undefined" ? window.location.pathname : "",
          referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
          source: "estimation_pro",
          consentement_rgpd: consent,
          date_consentement: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setConsent(false);
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Une erreur est survenue. Veuillez réessayer.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  }

  function handleClose() {
    if (status === "success") {
      setStatus("idle");
    }
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6 pt-8">
        {status === "success" ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée !</h3>
            <p className="text-gray-600 mb-6">
              Un expert de {ville} vous contactera bientôt.
            </p>
            <button
              onClick={handleClose}
              className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Estimation professionnelle gratuite
              </h2>
              <p className="text-gray-600 text-sm">
                Un agent local à {ville} peut affiner cette estimation en tenant compte des caractéristiques uniques de votre bien.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Votre email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  disabled={status === "loading"}
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consent"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                  disabled={status === "loading"}
                />
                <label htmlFor="consent" className="text-xs text-gray-600 cursor-pointer">
                  J&apos;accepte que mes données soient utilisées pour être recontacté par un professionnel de l&apos;immobilier. Consultez notre{" "}
                  <Link
                    href="/politique-confidentialite"
                    className="text-emerald-600 hover:text-emerald-700 underline"
                    target="_blank"
                  >
                    politique de confidentialité
                  </Link>
                  .
                </label>
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  "Recevoir mon estimation gratuite"
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              Gratuit et sans engagement. Vos données restent confidentielles.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
