import React from "react";

interface BreadcrumbsProps {
  folderPath: string[];
  setFolderPath: (path: string[]) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ folderPath, setFolderPath }) => (
  <nav
    className="flex items-center gap-1 text-sm mb-6 px-3 py-2 bg-blue-50 rounded-lg shadow border border-blue-100 overflow-x-auto"
    aria-label="Breadcrumb"
    style={{ scrollbarWidth: "thin" }}
  >
    <button
      className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold transition-colors
        ${folderPath.length === 0
          ? "bg-blue-600 text-white shadow"
          : "text-blue-700 hover:bg-blue-100"}
      `}
      onClick={() => setFolderPath([])}
      aria-current={folderPath.length === 0 ? "page" : undefined}
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
      </svg>
      Root
    </button>
    {folderPath.map((folder, idx) => (
      <React.Fragment key={idx}>
        <span className="mx-1 text-blue-300 select-none">/</span>
        <button
          className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold transition-colors
            ${idx === folderPath.length - 1
              ? "bg-blue-600 text-white shadow"
              : "text-blue-700 hover:bg-blue-100"}
          `}
          onClick={() => setFolderPath(folderPath.slice(0, idx + 1))}
          aria-current={idx === folderPath.length - 1 ? "page" : undefined}
        >
          <svg className="w-4 h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          {folder}
        </button>
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumbs;