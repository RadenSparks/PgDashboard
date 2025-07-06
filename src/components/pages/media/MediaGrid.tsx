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
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
    {media.map((item, idx) => (
      <div
        key={item.id || idx}
        className="border rounded-lg p-2 bg-white shadow hover:shadow-lg transition group relative"
      >
        <input
          type="checkbox"
          className="absolute top-2 left-2"
          checked={selectedImages.includes(item.id)}
          onChange={e => {
            setSelectedImages(sel =>
              e.target.checked
                ? [...sel, item.id]
                : sel.filter(id => id !== item.id)
            );
          }}
        />
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-32 object-cover rounded cursor-pointer"
          onClick={() => handlePreview(item.url)}
        />
        <div className="break-all text-xs text-gray-500 mt-2">{item.name}</div>
        <div className="flex gap-2 mt-2">
          <button
            className="text-blue-600 text-xs underline hover:text-blue-800"
            onClick={() => handleCopy(item.url)}
            title="Copy URL"
          >
            Copy URL
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 text-xs underline hover:text-blue-800"
            title="View Original"
          >
            View
          </a>
          <button
            className="text-red-500 text-xs underline hover:text-red-700"
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
              className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
            />
          </div>
        )}
      </div>
    ))}
  </div>
);

export default MediaGrid;