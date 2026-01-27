/**
 * Composant pour afficher des disclaimers et avertissements
 */
export function DisclaimerBox({
  title,
  children,
  variant = "info",
}: {
  title: string;
  children: React.ReactNode;
  variant?: "info" | "warning";
}) {
  const styles = {
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      title: "text-blue-900",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-400 text-yellow-800",
      title: "text-yellow-900",
    },
  };

  const style = styles[variant];

  return (
    <div className={`border p-6 rounded-lg ${style.container}`}>
      <h3 className={`font-bold mb-2 ${style.title}`}>{title}</h3>
      <div className="text-sm">{children}</div>
    </div>
  );
}
