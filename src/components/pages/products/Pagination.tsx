import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded font-semibold ${
            currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-700 hover:bg-blue-200"
          }`}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;