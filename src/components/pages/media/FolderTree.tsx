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
              className={`flex items-center cursor-pointer rounded pr-2 ${
                isSelected
                  ? "bg-blue-100 font-bold text-blue-700"
                  : "hover:bg-blue-50"
              }`}
              style={{ minHeight: 32 }}
              onClick={() => setSelectedPath(thisPath)}
            >
              {hasChildren ? (
                <button
                  className="mr-1 text-gray-400 hover:text-blue-600 focus:outline-none"
                  onClick={e => {
                    e.stopPropagation();
                    setExpanded({
                      ...expanded,
                      [pathKey]: !isExpanded,
                    });
                  }}
                  tabIndex={-1}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                  type="button"
                >
                  <span className="material-symbols-outlined text-base align-middle">
                    {isExpanded ? "▼" : "▶"}
                  </span>
                </button>
              ) : (
                <span className="w-5 inline-block" />
              )}
              <span className="mr-1">
                <span className="material-symbols-outlined text-blue-500 align-middle">
                  {isExpanded && hasChildren}
                </span>
                <span className="text-xs text-gray-500 ml-1"></span>
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