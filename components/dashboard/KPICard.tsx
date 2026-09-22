import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  iconBgClassName?: string;
  action?: { label: string; onClick: () => void };
}

export default function KPICard({
  label,
  value,
  icon: Icon,
  iconClassName,
  iconBgClassName,
  action,
}: KPICardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className={`rounded-lg p-3 ${iconBgClassName ?? "bg-gray-50"} ${iconClassName ?? "text-gray-600"}`}>
          <Icon size={20} strokeWidth={1.75} />
        </div>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            {action.label}
          </button>
        )}
      </div>
      <p className="mt-4 text-4xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
    </div>
  );
}
