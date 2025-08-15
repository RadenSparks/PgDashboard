import React from "react";
import type { MediaItem } from "../../../redux/api/mediaApi";

interface MediaGridProps {
  media: MediaItem[];
  selectedImages: number[];
  setSelectedImages: React.Dispatch<React.SetStateAction<number[]>>;
  handlePreview: (url: string) => void;
  handleCopy: (url: string) => void;
  setDeleteTarget: (item: MediaItem) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  media,
  selectedImages,
  setSelectedImages,
  handlePreview,
  handleCopy,
  setDeleteTarget,
  previewUrl,
  setPreviewUrl,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 ">
    {media.map((item, idx) => (
      <div
        key={item.id || idx}
        className={`border rounded-2xl p-4 bg-white shadow hover:shadow-lg transition group relative`}
      >
        <input
          type="checkbox"
          className="absolute top-4 left-4 accent-blue-600 w-5 h-5 rounded focus:ring-2 focus:ring-blue-400"
          checked={item.id !== undefined && selectedImages.includes(item.id)}
          onChange={e => {
            setSelectedImages(sel => {
              if (item.id === undefined) return sel;
              return e.target.checked
                ? [...sel, item.id]
                : sel.filter(id => id !== item.id);
            });
          }}
        />
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-40 object-cover rounded-xl cursor-pointer border border-gray-100 hover:border-blue-400 transition"
          onClick={() => handlePreview(item.url)}
        />
        <div className="break-all text-xs text-gray-700 mt-4 font-medium">{item.name}</div>
        {/* --- File size display --- */}
        {typeof item.size === "number" && (
          <div className="text-xs text-gray-500 mt-1">
            {(item.size / (1024 * 1024)).toFixed(2)} MB
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-4 justify-start">
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 hover:text-blue-900 transition"
            onClick={() => handleCopy(item.url)}
            title="Copy URL"
          >
            Copy
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-50 text-gray-700 text-xs font-semibold hover:bg-gray-100 hover:text-blue-700 transition"
            title="View Original"
          >
            View
          </a>
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 hover:text-red-800 transition"
            onClick={() => setDeleteTarget(item)}
            title="Delete"
          >
            Delete
          </button>
        </div>
        {previewUrl === item.url && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            onClick={() => setPreviewUrl(null)}
          >
            <img
              src={item.url}
              alt={item.name}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl border-4 border-white"
            />
          </div>
        )}
      </div>
    ))}
  </div>
);

export default MediaGrid;