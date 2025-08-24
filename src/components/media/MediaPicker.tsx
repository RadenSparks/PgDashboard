import React, { useState, useMemo, useEffect } from "react";
import { useGetMediaQuery } from "../../redux/api/mediaApi";
import type { MediaItem } from "../../redux/api/mediaApi";
import { Spinner } from "@chakra-ui/react";

// Folder tree node type
type FolderTreeNode = {
  children?: { [key: string]: FolderTreeNode };
  items?: MediaItem[];
};

// Build folder tree from flat media list
function buildFolderTree(media: MediaItem[]): FolderTreeNode {
  const root: FolderTreeNode = {};
  media.forEach((item) => {
    const parts = (item.folder || "default").split("/").filter(Boolean);
    let node = root;
    for (const part of parts) {
      node.children = node.children || {};
      node.children[part] = node.children[part] || {};
      node = node.children[part];
    }
    node.items = node.items || [];
    node.items.push(item);
  });
  return root;
}

// Get node by path
function getCurrentNode(tree: FolderTreeNode, path: string[]) {
  let node = tree;
  for (const part of path) {
    if (!node.children || !node.children[part]) return { items: [] };
    node = node.children[part];
  }
  return node;
}

// Folder sidebar component
const FolderSidebar: React.FC<{
  tree: FolderTreeNode;
  path: string[];
  setPath: (p: string[]) => void;
  selectedPath: string[];
  parentPath?: string[];
}> = ({ tree, path, setPath, selectedPath, parentPath = [] }) => {
  if (!tree.children) return null;
  return (
    <ul className="pl-2">
      {Object.keys(tree.children)
        .sort()
        .map((folder) => {
          const thisPath = [...parentPath, folder];
          const isSelected = thisPath.join("/") === selectedPath.join("/");
          return (
            <li key={folder}>
              <button
                className={`flex items-center w-full text-left px-2 py-1 rounded transition
                ${isSelected ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-blue-50"}
              `}
                onClick={() => setPath(thisPath)}
              >
                <span className="mr-2">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </span>
                <span className="truncate">{folder}</span>
              </button>
              {/* Recursive render for subfolders */}
              <FolderSidebar
                tree={tree.children?.[folder] || {}}
                path={path}
                setPath={setPath}
                selectedPath={selectedPath}
                parentPath={thisPath}
              />
            </li>
          );
        })}
    </ul>
  );
};

interface MediaPickerProps {
  show: boolean;
  multiple?: boolean;
  onSelect: (images: MediaItem[] | MediaItem) => void;
  onClose: () => void;
  folder?: string;
}

const MediaPicker: React.FC<MediaPickerProps> = ({
  show,
  multiple,
  onSelect,
  onClose,
  folder,
}) => {
  const { data: media = [], isLoading } = useGetMediaQuery();

  // Build folder tree from ALL media
  const folderTree = useMemo(() => buildFolderTree(media), [media]);

  // Set initial folder path if folder prop is provided
  const [folderPath, setFolderPath] = useState<string[]>(
    folder ? folder.split("/") : []
  );
  useEffect(() => {
    if (folder) setFolderPath(folder.split("/"));
  }, [folder, show]);

  // Track selected images for multi-select
  const [selected, setSelected] = useState<MediaItem[]>([]);

  // Get current node and media for current folder
  const currentNode = useMemo(
    () => getCurrentNode(folderTree, folderPath),
    [folderTree, folderPath]
  );
  const currentMedia: MediaItem[] = currentNode.items || [];

  if (!show) return null;

  // Breadcrumb navigation
  const Breadcrumbs = (
    <div className="flex items-center gap-1 text-sm mb-4">
      <button
        className={`hover:underline ${
          folderPath.length === 0 ? "font-bold text-blue-700" : ""
        }`}
        onClick={() => setFolderPath([])}
      >
        Gốc
      </button>
      {folderPath.map((folderName, idx) => (
        <React.Fragment key={idx}>
          <span className="mx-1 text-gray-400">/</span>
          <button
            className={`hover:underline ${
              idx === folderPath.length - 1
                ? "font-bold text-blue-700"
                : ""
            }`}
            onClick={() => setFolderPath(folderPath.slice(0, idx + 1))}
          >
            {folderName}
          </button>
        </React.Fragment>
      ))}
    </div>
  );

  const handleSelect = (item: MediaItem) => {
    if (multiple) {
      setSelected((sel) =>
        sel.some((i) => i.id === item.id)
          ? sel.filter((i) => i.id !== item.id)
          : [...sel, item]
      );
    } else {
      onSelect(item);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="
        bg-white rounded-xl shadow-lg
        w-full max-w-5xl
        md:w-[90vw] md:max-w-4xl
        sm:w-[98vw] sm:max-w-full
        p-0 relative flex flex-col md:flex-row
        max-h-[95vh]
        overflow-hidden
      "
        style={{ minHeight: 400 }}
      >
        {/* Sidebar: Folder Tree */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-gray-50 p-4 md:p-6 overflow-y-auto rounded-t-xl md:rounded-l-xl md:rounded-tr-none max-h-40 md:max-h-none">
          <div className="font-bold text-blue-700 mb-4">Thư mục</div>
          <FolderSidebar
            tree={folderTree}
            path={folderPath}
            setPath={setFolderPath}
            selectedPath={folderPath}
          />
        </aside>
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 flex flex-col overflow-y-auto">
          <h3 className="text-lg font-bold mb-2 text-blue-700">
            Chọn ảnh{multiple ? "" : ""}
          </h3>
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" color="blue.500" />
            </div>
          )}
          {!isLoading && (
            <>
              {Breadcrumbs}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[45vh] md:max-h-[60vh] overflow-y-auto">
                {currentMedia.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-2 cursor-pointer transition 
                    ${
                      selected.some((i) => i.id === item.id)
                        ? "ring-2 ring-blue-500 border-blue-400"
                        : "hover:shadow hover:border-blue-200"
                    }
                    group`}
                    onClick={() => handleSelect(item)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={selected.some((i) => i.id === item.id)}
                  >
                    <img
                      src={item.url}
                      alt={item.name || "media"}
                      className="w-full h-24 object-cover rounded"
                    />
                    <div className="text-xs mt-1 truncate text-gray-700 group-hover:text-blue-700">
                      {item.name}
                    </div>
                    {/* --- File size display --- */}
                    {typeof item.size === "number" && (
                      <div className="text-xs text-gray-500 mt-1">
                        {(item.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300"
                  onClick={onClose}
                >
                  Hủy
                </button>
                {multiple && (
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    onClick={() => {
                      onSelect(selected);
                      onClose();
                    }}
                    disabled={selected.length === 0}
                  >
                    Chọn
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPicker;