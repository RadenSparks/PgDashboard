import React, { useRef } from 'react';
import GallerySlider from '../products/GallerySlider';

interface Props {
  onHeading: (level: number) => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onImageAdd: (files: FileList) => void;
  images: string[];
  onHr: () => void;
  previewTextColor: string;
  previewBgColor: string;
  showColorPicker: boolean;
  showBgColorPicker: boolean;
  setShowColorPicker: (v: boolean) => void;
  setShowBgColorPicker: (v: boolean) => void;
  setPreviewTextColor: (color: string) => void;
  setPreviewBgColor: (color: string) => void;
  COLORS: string[];
  BG_COLORS: string[];
  fontFamily: string;
  setFontFamily: (v: string) => void;
  fontSize: string;
  setFontSize: (v: string) => void;
  FONT_FAMILIES: { label: string; value: string }[];
  FONT_SIZES: { label: string; value: string }[];
  publish: boolean;
  setPublish: (v: boolean) => void;
  // Add this prop:
  onGalleryImageInsert?: (url: string) => void;
  onClearFormatting?: () => void;
  onInsertLink?: () => void;
  onGalleryImageRemove?: (idx: number) => void;
}

const PostFormToolbar: React.FC<Props> = ({
  onHeading, onBold, onItalic, onUnderline,
  onImageAdd, images, onHr,
  previewTextColor, previewBgColor,
  showColorPicker, showBgColorPicker,
  setShowColorPicker, setShowBgColorPicker,
  setPreviewTextColor, setPreviewBgColor,
  COLORS, BG_COLORS,
  fontFamily, setFontFamily,
  fontSize, setFontSize,
  FONT_FAMILIES, FONT_SIZES,
  publish, setPublish,
  onClearFormatting, onInsertLink,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border-b bg-white px-4 py-3">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        {/* Left: Markdown actions */}
        <div className="flex flex-wrap gap-1 items-center">
          <button type="button" title="Heading 1" className="p-1 hover:bg-gray-200 rounded" onClick={() => onHeading(1)}>H1</button>
          <button type="button" title="Heading 2" className="p-1 hover:bg-gray-200 rounded" onClick={() => onHeading(2)}>H2</button>
          <button type="button" title="Heading 3" className="p-1 hover:bg-gray-200 rounded" onClick={() => onHeading(3)}>H3</button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" title="Bold" className="p-1 hover:bg-gray-200 rounded font-bold" onClick={onBold}><b>B</b></button>
          <button type="button" title="Italic" className="p-1 hover:bg-gray-200 rounded italic" onClick={onItalic}><i>I</i></button>
          <button type="button" title="Underline" className="p-1 hover:bg-gray-200 rounded underline" onClick={onUnderline}><u>U</u></button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" title="Clear Formatting" className="p-1 hover:bg-gray-200 rounded" onClick={() => onClearFormatting?.()}>Tx</button>
          <button type="button" title="Insert Link" className="p-1 hover:bg-gray-200 rounded" onClick={() => onInsertLink?.()}>🔗</button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          {/* Gallery Image Upload & Preview */}
          <div className="relative flex items-center">
            <button
              type="button"
              title="Add Images"
              className="p-1 hover:bg-gray-200 rounded flex items-center gap-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <span role="img" aria-label="Gallery">🖼️</span>
              <span className="text-xs">Gallery</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={e => {
                if (e.target.files) onImageAdd(e.target.files);
                e.target.value = '';
              }}
            />
          </div>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" title="Horizontal Rule" className="p-1 hover:bg-gray-200 rounded" onClick={onHr}>―</button>
        </div>
        {/* Right: Customization controls */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Preview text color */}
          <div className="relative">
            <button
              type="button"
              title="Preview Text Color"
              className="p-1 hover:bg-gray-200 rounded"
              onClick={() => { setShowColorPicker(!showColorPicker); setShowBgColorPicker(false); }}
              style={{ borderBottom: `2px solid ${previewTextColor}` }}
            >A</button>
            {showColorPicker && (
              <div className="absolute z-10 mt-2 left-0 bg-white border rounded shadow p-2 flex gap-1 flex-wrap w-48">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded-full border-2 border-white hover:border-gray-400"
                    style={{ background: color }}
                    onClick={() => { setPreviewTextColor(color); setShowColorPicker(false); }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Preview background color */}
          <div className="relative">
            <button
              type="button"
              title="Preview Background Color"
              className="p-1 hover:bg-gray-200 rounded"
              onClick={() => { setShowBgColorPicker(!showBgColorPicker); setShowColorPicker(false); }}
              style={{ borderBottom: `2px solid ${previewBgColor}` }}
            >BG</button>
            {showBgColorPicker && (
              <div className="absolute z-10 mt-2 left-0 bg-white border rounded shadow p-2 flex gap-1 flex-wrap w-48">
                {BG_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded-full border-2 border-white hover:border-gray-400"
                    style={{ background: color }}
                    onClick={() => { setPreviewBgColor(color); setShowBgColorPicker(false); }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value)}
            className="border rounded p-1 text-sm"
            title="Font Family"
            style={{ minWidth: 90 }}
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            className="border rounded p-1 text-sm"
            title="Font Size"
            style={{ minWidth: 80 }}
          >
            {FONT_SIZES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {/* Publish toggle */}
          <label className="flex items-center gap-2 whitespace-nowrap font-medium text-green-700 ml-2">
            <input
              type="checkbox"
              checked={publish}
              onChange={e => setPublish(e.target.checked)}
              className="accent-green-600"
            />
            <span className="select-none">Publish</span>
          </label>
        </div>
      </div>
      {/* Gallery Preview Row (always visible, not overlay) */}
      {/*
      {images.length > 0 && (
        <div className="w-full mt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border rounded bg-gray-50 px-2" style={{ maxHeight: 80 }}>
            {images.map((img, idx) => (
              <div key={idx} className="relative group flex-shrink-0">
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-500 hover:bg-red-100 transition"
                  style={{ transform: 'translate(30%,-30%)' }}
                  onClick={() => onGalleryImageRemove?.(idx)}
                  title="Remove"
                >
                  ×
                </button>
                <button
                  type="button"
                  className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-tr rounded-bl opacity-80 hover:opacity-100 transition"
                  onClick={() => onGalleryImageInsert?.(img)}
                  title="Insert into post"
                >
                  Insert
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      */}
    </div>
  );
};

export default PostFormToolbar;