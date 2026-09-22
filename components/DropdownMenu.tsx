"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";

interface DropdownItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface DropdownMenuProps {
  items: DropdownItem[];
  className?: string;
}

export default function DropdownMenu({ items, className = "" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        aria-label="Menu"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-gray-200 bg-white shadow-lg">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm font-medium first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50 ${
                item.variant === "danger" ? "text-danger-600" : "text-gray-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
