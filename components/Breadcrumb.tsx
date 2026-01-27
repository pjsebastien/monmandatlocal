/**
 * Composant fil d'Ariane pour la navigation
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="text-sm text-gray-600 mb-6" aria-label="Fil d'Ariane">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <a href={item.href} className="hover:text-blue-600">
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && " > "}
        </span>
      ))}
    </nav>
  );
}
