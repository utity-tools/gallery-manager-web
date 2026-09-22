import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 7;
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
    endPage = Math.min(totalPages, startPage + maxVisible - 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* First page link if not visible */}
      {startPage > 1 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            page === currentPage
              ? "bg-accent-500 text-white"
              : "border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last page link if not visible */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => handlePageClick(totalPages)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>

      {/* Info */}
      <span className="ml-4 text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
