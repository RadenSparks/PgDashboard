import React from "react";

interface FolderTreeProps {
  node: any;
  path?: string[];
  expanded?: Record<string, boolean>;
  setExpanded?: (exp: Record<string, boolean>) => void;
  selectedPath?: string[];
  setSelectedPath?: (path: string[]) => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  node,
  path = [],
  expanded = {},
  setExpanded = () => {},
  selectedPath = [],
  setSelectedPath = () => {},
}) => {
  if (!node.children) return null;

  return (
    <ul className="pl-2 border-l border-gray-200">
      {Object.keys(node.children).sort().map((folder) => {
        const thisPath = [...path, folder];
        const pathKey = thisPath.join("/");
        const hasChildren =
          !!node.children[folder].children &&
          Object.keys(node.children[folder].children).length > 0;
        const isExpanded = expanded[pathKey] ?? true;
        const isSelected = pathKey === selectedPath.join("/");

        return (
          <li key={folder} className="relative group">
            <div
              className={`flex items-center cursor-pointer rounded-lg pr-2 py-2 gap-1 ${
                isSelected
                  ? "bg-blue-100 font-bold text-blue-700"
                  : "hover:bg-blue-50"
              }`}
              style={{ minHeight: 36 }}
              onClick={() => setSelectedPath(thisPath)}
            >
              {hasChildren ? (
                <button
                  className="mr-1 flex items-center justify-center w-6 h-6 rounded hover:bg-blue-100 focus:outline-none transition"
                  onClick={e => {
                    e.stopPropagation();
                    setExpanded({
                      ...expanded,
                      [pathKey]: !isExpanded,
                    });
                  }}
                  tabIndex={-1}
                  aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                  type="button"
                >
                  {/* Use Heroicons chevron-down and chevron-right */}
                  {isExpanded ? (
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ) : (
                <span className="w-6 inline-block" />
              )}
              {/* Folder icon */}
              <span className="mr-1 flex items-center">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </span>
              <span className="truncate">{folder}</span>
              <span className="ml-auto text-xs text-gray-400 group-hover:text-blue-400">
                {node.children[folder].items?.length || 0}
              </span>
            </div>
            {hasChildren && isExpanded && (
              <FolderTree
                node={node.children[folder]}
                path={thisPath}
                expanded={expanded}
                setExpanded={setExpanded}
                selectedPath={selectedPath}
                setSelectedPath={setSelectedPath}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FolderTree;