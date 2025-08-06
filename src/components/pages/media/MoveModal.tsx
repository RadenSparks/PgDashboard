import React from "react";

interface MoveModalProps {
  show: boolean;
  onClose: () => void;
  onMove: () => void;
  moveTargetFolder: string | null;
  setMoveTargetFolder: (folder: string) => void;
  getAllFolderPaths: (tree: unknown) => string[];
  folderTree: unknown;
  disabled?: boolean;
}

const MoveModal: React.FC<MoveModalProps> = ({
  show,
  onClose,
  onMove,
  moveTargetFolder,
  setMoveTargetFolder,
  getAllFolderPaths,
  folderTree,
  disabled,
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-8 relative">
        <h3 className="text-lg font-bold mb-4 text-blue-600">Move Images</h3>
        <label className="block mb-2 text-sm font-medium text-gray-700">Destination folder</label>
        <select
          className="border px-2 py-1 rounded w-full mb-4 focus:ring-2 focus:ring-blue-400"
          value={moveTargetFolder || ""}
          onChange={e => setMoveTargetFolder(e.target.value)}
        >
          <option value="">Select a folder...</option>
          {getAllFolderPaths(folderTree).map((path) => (
            <option key={path} value={path}>
              {path || "Root"}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            className="flex items-center gap-1 bg-gray-200 text-gray-700 px-6 py-2 rounded shadow hover:bg-gray-300 focus:ring-2 focus:ring-gray-400"
            type="button"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-base"></span>
            Cancel
          </button>
          <button
            className="flex items-center gap-1 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
            type="button"
            onClick={onMove}
            disabled={disabled || !moveTargetFolder}
          >
            <span className="material-symbols-outlined text-base"></span>
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveModal;