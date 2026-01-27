/**
 * Composant réutilisable pour afficher une métrique
 */
export function MetricCard({
  label,
  value,
  unit = "",
  description,
}: {
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold">
        {value}{" "}
        {unit && <span className="text-lg text-gray-600">{unit}</span>}
      </p>
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
}
