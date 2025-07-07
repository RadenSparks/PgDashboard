import React, { useState } from "react";
import { useGetMediaQuery } from "../../redux/api/mediaApi";
import type { MediaItem } from "../../redux/api/mediaApi";

interface MediaPickerProps {
  show: boolean;
  multiple?: boolean;
  onSelect: (images: MediaItem[] | MediaItem) => void;
  onClose: () => void;
}

const MediaPicker: React.FC<MediaPickerProps> = ({ show, multiple, onSelect, onClose }) => {
  const { data: media = [] } = useGetMediaQuery();
  const [selected, setSelected] = useState<MediaItem[]>([]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 relative">
        <h3 className="text-lg font-bold mb-4 text-blue-700">Select Image{multiple ? "s" : ""}</h3>
        <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {media.map(item => (
            <div
              key={item.id}
              className={`border rounded-lg p-2 cursor-pointer transition ${selected.some(i => i.id === item.id) ? "ring-2 ring-blue-500" : "hover:shadow"}`}
              onClick={() => handleSelect(item)}
            >
              <img src={item.url} alt={item.name} className="w-full h-24 object-cover rounded" />
              <div className="text-xs mt-1 truncate">{item.name}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="bg-gray-200 px-6 py-2 rounded" onClick={onClose}>Cancel</button>
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
      </div>
    </div>
  );
};

export default MediaPicker;