"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiShow, ShowStatus } from "@/lib/types/models";

interface ShowsCalendarProps {
  shows: ApiShow[];
  onSelectShow: (show: ApiShow) => void;
}

const STATUS_DOT_CLASS: Record<NonNullable<ShowStatus>, string> = {
  current: "bg-success-500",
  upcoming: "bg-info-500",
  past: "bg-gray-400",
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function buildMonthGrid(monthStart: Date): Date[] {
  const firstOfMonth = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - firstOfMonth.getDay());

  const days: Date[] = [];
  const cursor = new Date(gridStart);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export default function ShowsCalendar({ shows, onSelectShow }: ShowsCalendarProps) {
  const [monthCursor, setMonthCursor] = useState(() => startOfDay(new Date()));

  const days = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);
  const today = useMemo(() => startOfDay(new Date()), []);

  const showsByDay = useMemo(() => {
    const map = new Map<string, ApiShow[]>();
    for (const day of days) {
      const key = day.toDateString();
      const matches = shows.filter((show) => {
        if (!show.startDate && !show.endDate) return false;
        const start = show.startDate ? startOfDay(new Date(show.startDate)) : null;
        const end = show.endDate ? startOfDay(new Date(show.endDate)) : start;
        const rangeStart = start ?? end;
        if (!rangeStart || !end) return false;
        return day >= rangeStart && day <= end;
      });
      if (matches.length > 0) map.set(key, matches);
    }
    return map;
  }, [days, shows]);

  const monthLabel = monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const goPrevMonth = () =>
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goNextMonth = () =>
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const goToday = () => setMonthCursor(startOfDay(new Date()));

  return (
    <div data-testid="shows-calendar" className="card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">{monthLabel}</h3>
        <div className="flex items-center gap-1">
          <button type="button" onClick={goToday} className="btn-secondary px-3 py-1.5 text-xs">
            Today
          </button>
          <button
            type="button"
            data-testid="shows-calendar-prev"
            aria-label="Previous month"
            onClick={goPrevMonth}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            data-testid="shows-calendar-next"
            aria-label="Next month"
            onClick={goNextMonth}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md border border-gray-100 bg-gray-100 text-xs">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="bg-gray-50 px-2 py-1.5 text-center font-medium text-gray-500">
            {label}
          </div>
        ))}

        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === monthCursor.getMonth();
          const isToday = day.getTime() === today.getTime();
          const dayShows = showsByDay.get(day.toDateString()) ?? [];

          return (
            <div
              key={day.toISOString()}
              data-testid={`shows-calendar-day-${day.toISOString().slice(0, 10)}`}
              className={`min-h-20 bg-white p-1.5 ${isCurrentMonth ? "" : "bg-gray-50/60"}`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                  isToday
                    ? "bg-accent-500 font-semibold text-white"
                    : isCurrentMonth
                      ? "text-gray-700"
                      : "text-gray-400"
                }`}
              >
                {day.getDate()}
              </span>

              <div className="mt-1 space-y-1">
                {dayShows.slice(0, 3).map((show) => (
                  <button
                    key={show.id}
                    type="button"
                    onClick={() => onSelectShow(show)}
                    title={show.title}
                    className="flex w-full items-center gap-1 truncate rounded px-1 py-0.5 text-left text-[11px] text-gray-700 hover:bg-gray-100"
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${show.status ? STATUS_DOT_CLASS[show.status] : "bg-gray-400"}`}
                    />
                    <span className="truncate">{show.title}</span>
                  </button>
                ))}
                {dayShows.length > 3 && (
                  <p className="px-1 text-[10px] text-gray-400">+{dayShows.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
