import type { ApiShow, ShowStatus } from "@/lib/types/models";
import DropdownMenu from "@/components/DropdownMenu";

interface ShowsListProps {
  shows: ApiShow[];
  onEdit: (show: ApiShow) => void;
  onDelete: (show: ApiShow) => void;
}

const STATUS_LABEL: Record<NonNullable<ShowStatus>, string> = {
  current: "Current",
  upcoming: "Upcoming",
  past: "Past",
};

const STATUS_BADGE_CLASS: Record<NonNullable<ShowStatus>, string> = {
  current: "badge-success",
  upcoming: "badge-info",
  past: "inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600",
};

function formatDateRange(startDate?: string, endDate?: string): string {
  if (!startDate && !endDate) return "No dates set";
  const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  if (startDate && endDate) return `${fmt(startDate)} – ${fmt(endDate)}`;
  return fmt((startDate ?? endDate) as string);
}

function ShowCard({ show, onEdit, onDelete }: { show: ApiShow; onEdit: (s: ApiShow) => void; onDelete: (s: ApiShow) => void }) {
  return (
    <div
      data-testid={`show-row-${show.id}`}
      className="relative min-w-[280px] flex-shrink-0 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
    >
      {/* Status Badge */}
      {show.status && (
        <div className="mb-2">
          <span className={STATUS_BADGE_CLASS[show.status]}>{STATUS_LABEL[show.status]}</span>
        </div>
      )}

      {/* Title */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-gray-900 line-clamp-2">{show.title}</h4>
        {!show.isPublic && <span className="badge-warning text-xs">Draft</span>}
      </div>

      {/* Dates */}
      <p className="mt-2 text-sm text-gray-600">{formatDateRange(show.startDate, show.endDate)}</p>

      {/* Venue */}
      {show.venueName && <p className="mt-1 text-xs text-gray-500">{show.venueName}</p>}

      {/* Meta */}
      <p className="mt-2 text-xs text-gray-500">
        {show.artworkCount} {show.artworkCount === 1 ? "artwork" : "artworks"}
        {show.artistNames.length > 0 && ` · ${show.artistNames.length} artist${show.artistNames.length === 1 ? "" : "s"}`}
      </p>

      {/* Actions */}
      <div className="mt-3 flex justify-end">
        <DropdownMenu
          items={[
            {
              label: "Edit",
              onClick: () => onEdit(show),
            },
            {
              label: "Delete",
              onClick: () => onDelete(show),
              variant: "danger",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default function ShowsList({ shows, onEdit, onDelete }: ShowsListProps) {
  if (shows.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-500">No exhibitions yet. Add your first one.</p>;
  }

  const current = shows.filter((s) => s.status === "current");
  const upcoming = shows.filter((s) => s.status === "upcoming");
  const past = shows.filter((s) => s.status === "past");
  const undated = shows.filter((s) => s.status === null);

  const groups: { label: string; items: ApiShow[] }[] = [
    { label: "Current", items: current },
    { label: "Upcoming", items: upcoming },
    { label: "No dates set", items: undated },
    { label: "Past", items: past },
  ];

  return (
    <div className="space-y-6">
      {groups
        .filter((g) => g.items.length > 0)
        .map((group) => (
          <div key={group.label}>
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">{group.label}</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {group.items.map((show) => (
                <ShowCard key={show.id} show={show} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
