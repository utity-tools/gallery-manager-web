"use client";

import { CalendarDays, Clock } from "lucide-react";
import type { ApiShow } from "@/lib/types/models";

interface ShowsSummaryProps {
  shows: ApiShow[];
}

export default function ShowsSummary({ shows }: ShowsSummaryProps) {
  const currentShow = shows.find((s) => s.status === "current");
  const nextShow = shows.find((s) => s.status === "upcoming");

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Current Show */}
      <div className="rounded-lg border border-accent-200 bg-accent-50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">
              Currently Open
            </p>
            {currentShow ? (
              <>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  {currentShow.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{currentShow.venueName}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <CalendarDays size={14} />
                  {formatDate(currentShow.startDate)} – {formatDate(currentShow.endDate)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-600">No active exhibition</p>
            )}
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              currentShow ? "bg-accent-600 text-white" : "bg-gray-200 text-gray-400"
            }`}
          >
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Next Show */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Upcoming
            </p>
            {nextShow ? (
              <>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">
                  {nextShow.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{nextShow.venueName}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                  <CalendarDays size={14} />
                  {formatDate(nextShow.startDate)} – {formatDate(nextShow.endDate)}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-gray-600">No upcoming exhibition</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
            <CalendarDays size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
