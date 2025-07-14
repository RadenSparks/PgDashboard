import React, { useState, useMemo, useEffect } from "react";
import { useGetMediaQuery } from "../../redux/api/mediaApi";
import type { MediaItem } from "../../redux/api/mediaApi";
import { Spinner } from "@chakra-ui/react"; // Add this if using Chakra UI

// Helper to build a folder tree from flat media list
function buildFolderTree(media: MediaItem[]) {
  const root: any = {};
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

function getCurrentNode(tree: any, path: string[]) {
  let node = tree;
  for (const part of path) {
    if (!node.children || !node.children[part]) return { items: [] };
    node = node.children[part];
  }
  return node;
}

interface MediaPickerProps {
  show: boolean;
  multiple?: boolean;
  onSelect: (images: MediaItem[] | MediaItem) => void;
  onClose: () => void;
  folder?: string; // <-- Add this prop
}

const MediaPicker: React.FC<MediaPickerProps> = ({ show, multiple, onSelect, onClose, folder }) => {
  const { data: media = [], isLoading } = useGetMediaQuery();

  // Build folder tree from ALL media
  const folderTree = useMemo(() => buildFolderTree(media), [media]);

  // Set initial folder path if folder prop is provided
  const [folderPath, setFolderPath] = useState<string[]>(folder ? folder.split("/") : []);
  useEffect(() => {
    if (folder) setFolderPath(folder.split("/"));
  }, [folder, show]);

  // Track selected images for multi-select
  const [selected, setSelected] = useState<MediaItem[]>([]);

  // Get current node and media for current folder
  const currentNode = useMemo(() => getCurrentNode(folderTree, folderPath), [folderTree, folderPath]);
  const currentMedia: MediaItem[] = currentNode.items || [];

  if (!show) return null;

  const handleSelect = (item: MediaItem) => {
    if (multiple) {
      setSelected(sel =>
        sel.some(i => i.id === item.id)
          ? sel.filter(i => i.id !== item.id)
          : [...sel, item]
      );
    } else {
      onSelect(item);
      onClose();
    }
  };

  // Breadcrumb navigation (always show)
  const Breadcrumbs = (
    <div className="flex items-center gap-1 text-sm mb-4">
      <button
        className={`hover:underline ${folderPath.length === 0 ? "font-bold text-blue-700" : ""}`}
        onClick={() => setFolderPath([])}
      >
        Root
      </button>
      {folderPath.map((folderName, idx) => (
        <React.Fragment key={idx}>
          <span className="mx-1 text-gray-400">/</span>
          <button
            className={`hover:underline ${idx === folderPath.length - 1 ? "font-bold text-blue-700" : ""}`}
            onClick={() => setFolderPath(folderPath.slice(0, idx + 1))}
          >
            {folderName}
          </button>
        </React.Fragment>
      ))}
    </div>
  );

  // Folder list (always show if children exist)
  const FolderList = currentNode.children ? (
    <div className="mb-4 flex flex-wrap gap-2">
      {Object.keys(currentNode.children).sort().map(folderName => (
        <button
          key={folderName}
          className="px-3 py-1 rounded bg-gray-100 hover:bg-blue-100 text-blue-700 font-semibold text-xs"
          onClick={() => setFolderPath([...folderPath, folderName])}
        >
          {folderName}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 relative">
        <h3 className="text-lg font-bold mb-4 text-blue-700">Select Image{multiple ? "s" : ""}</h3>
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Spinner size="lg" color="blue.500" />
          </div>
        )}
        {!isLoading && (
          <>
            {Breadcrumbs}
            {FolderList}
            <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {currentMedia.map(item => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-2 cursor-pointer transition 
                    ${selected.some(i => i.id === item.id) ? "ring-2 ring-blue-500 border-blue-400" : "hover:shadow hover:border-blue-200"}
                    group`}
                  onClick={() => handleSelect(item)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selected.some(i => i.id === item.id)}
                >
                  <img src={item.url} alt={item.name || "media"} className="w-full h-24 object-cover rounded" />
                  <div className="text-xs mt-1 truncate text-gray-700 group-hover:text-blue-700">{item.name}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300" onClick={onClose}>Cancel</button>
              {multiple && (
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  onClick={() => { onSelect(selected); onClose(); }}
                  disabled={selected.length === 0}
                >
                  Select
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaPicker;