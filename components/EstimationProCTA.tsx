"use client";

import { useState } from "react";
import { EstimationProForm } from "./EstimationProForm";

interface EstimationProCTAProps {
  ville: string;
  variant?: "primary" | "secondary" | "sidebar";
  children?: React.ReactNode;
}

export function EstimationProCTA({ ville, variant = "primary", children }: EstimationProCTAProps) {
  const [isOpen, setIsOpen] = useState(false);

  const baseStyles = "font-semibold transition-colors";

  const variantStyles = {
    primary: "bg-white text-emerald-700 px-8 py-4 rounded-xl hover:bg-emerald-50 whitespace-nowrap shadow-lg",
    secondary: "bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700",
    sidebar: "w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 text-sm",
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${baseStyles} ${variantStyles[variant]}`}
      >
        {children}
      </button>
      <EstimationProForm
        ville={ville}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
