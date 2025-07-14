import React from "react";

interface BreadcrumbsProps {
  folderPath: string[];
  setFolderPath: (path: string[]) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ folderPath, setFolderPath }) => (
  <div className="flex items-center gap-1 text-sm mb-6">
    <button
      className={`hover:underline px-2 py-1 rounded-lg ${folderPath.length === 0 ? "font-bold text-blue-700 bg-blue-50" : ""}`}
      onClick={() => setFolderPath([])}
    >
      Root
    </button>
    {folderPath.map((folder, idx) => (
      <React.Fragment key={idx}>
        <span className="mx-1 text-gray-400">/</span>
        <button
          className={`hover:underline px-2 py-1 rounded-lg ${idx === folderPath.length - 1 ? "font-bold text-blue-700 bg-blue-50" : ""}`}
          onClick={() => setFolderPath(folderPath.slice(0, idx + 1))}
        >
          {folder}
        </button>
      </React.Fragment>
    ))}
  </div>
);

export default Breadcrumbs;