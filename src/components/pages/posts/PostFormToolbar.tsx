import React, { useRef } from 'react';
import GallerySlider from '../products/GallerySlider';

interface Props {
  onHeading: (level: number) => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
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
  onGalleryImageInsert?: (url: string) => void;
  onClearFormatting?: () => void;
  onInsertLink?: () => void;
  onGalleryImageRemove?: (idx: number) => void;
  onOpenGalleryPicker: () => void;
  images: string[];
}

const PostFormToolbar: React.FC<Props> = ({
  onHeading, onBold, onItalic, onUnderline,
  onHr,
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
  onOpenGalleryPicker,
  images,
  onGalleryImageInsert,
  onGalleryImageRemove,
}) => {
  return (
    <div className="border-b bg-white px-2 py-1">
      <div className="flex flex-wrap gap-1 items-center justify-between">
        {/* Left: Markdown actions */}
        <div className="flex flex-wrap gap-0.5 items-center">
          <button type="button" aria-label="Heading 1" title="Heading 1" className="p-1.5 hover:bg-gray-200 rounded text-xs" onClick={() => onHeading(1)}>H1</button>
          <button type="button" aria-label="Heading 2" title="Heading 2" className="p-1.5 hover:bg-gray-200 rounded text-xs" onClick={() => onHeading(2)}>H2</button>
          <button type="button" aria-label="Heading 3" title="Heading 3" className="p-1.5 hover:bg-gray-200 rounded text-xs" onClick={() => onHeading(3)}>H3</button>
          <span className="w-px h-4 bg-gray-300 mx-0.5" />
          <button type="button" aria-label="Bold" title="Bold" className="p-1.5 hover:bg-gray-200 rounded font-bold text-xs" onClick={onBold}><b>B</b></button>
          <button type="button" aria-label="Italic" title="Italic" className="p-1.5 hover:bg-gray-200 rounded italic text-xs" onClick={onItalic}><i>I</i></button>
          <button type="button" aria-label="Underline" title="Underline" className="p-1.5 hover:bg-gray-200 rounded underline text-xs" onClick={onUnderline}><u>U</u></button>
          <span className="w-px h-4 bg-gray-300 mx-0.5" />
          <button type="button" aria-label="Clear Formatting" title="Clear Formatting" className="p-1.5 hover:bg-gray-200 rounded text-xs" onClick={() => onClearFormatting?.()}>Tx</button>
          <button type="button" aria-label="Insert Link" title="Insert Link" className="p-1.5 hover:bg-gray-200 rounded text-xs" onClick={() => onInsertLink?.()}>🔗</button>
          <span className="w-px h-4 bg-gray-300 mx-0.5" />
          {/* Gallery Insert via MediaPicker */}
          <button
            type="button"
            aria-label="Insert Gallery Image"
            title="Insert Gallery Image"
            className="p-1.5 hover:bg-gray-200 rounded flex items-center gap-0.5 text-xs"
            onClick={onOpenGalleryPicker}
          >
            <span role="img" aria-label="Gallery">🖼️</span>
            <span className="text-xs">Gallery</span>
          </button>
          <span className="w-px h-4 bg-gray-300 mx-0.5" />
          <button type="button" aria-label="Horizontal Rule" title="Horizontal Rule" className="p-1.5 hover:bg-gray-200 rounded text-xs" onClick={onHr}>―</button>
        </div>
        {/* Right: Customization controls */}
        <div className="flex flex-wrap gap-1 items-center">
          {/* Preview text color */}
          <div className="relative">
            <button
              type="button"
              aria-label="Preview Text Color"
              title="Preview Text Color"
              className="p-1.5 hover:bg-gray-200 rounded text-xs"
              onClick={() => { setShowColorPicker(!showColorPicker); setShowBgColorPicker(false); }}
              style={{ borderBottom: `2px solid ${previewTextColor}` }}
            >A</button>
            {showColorPicker && (
              <div className="absolute z-10 mt-2 left-0 bg-white border rounded shadow p-2 flex gap-1 flex-wrap w-48">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Set text color ${color}`}
                    className="w-5 h-5 rounded-full border-2 border-white hover:border-gray-400"
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
              aria-label="Preview Background Color"
              title="Preview Background Color"
              className="p-1.5 hover:bg-gray-200 rounded text-xs"
              onClick={() => { setShowBgColorPicker(!showBgColorPicker); setShowColorPicker(false); }}
              style={{ borderBottom: `2px solid ${previewBgColor}` }}
            >BG</button>
            {showBgColorPicker && (
              <div className="absolute z-10 mt-2 left-0 bg-white border rounded shadow p-2 flex gap-1 flex-wrap w-48">
                {BG_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Set background color ${color}`}
                    className="w-5 h-5 rounded-full border-2 border-white hover:border-gray-400"
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
            className="border rounded p-1 text-xs"
            title="Font Family"
            style={{ minWidth: 70 }}
            aria-label="Font Family"
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            className="border rounded p-1 text-xs"
            title="Font Size"
            style={{ minWidth: 60 }}
            aria-label="Font Size"
          >
            {FONT_SIZES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {/* Publish toggle */}
          <label className="flex items-center gap-1 whitespace-nowrap font-medium text-green-700 ml-1 text-xs">
            <input
              type="checkbox"
              checked={publish}
              onChange={e => setPublish(e.target.checked)}
              className="accent-green-600"
              aria-label="Publish"
            />
            <span className="select-none">Publish</span>
          </label>
        </div>
      </div>
      {/* Gallery Preview Row */}
      {images.length > 0 && (
        <div className="w-full mt-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border rounded bg-gray-50 px-2" style={{ maxHeight: 60 }}>
            {images.map((img, idx) => (
              <div key={idx} className="relative group flex-shrink-0">
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-12 h-12 object-cover rounded border"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-500 hover:bg-red-100 transition"
                  style={{ transform: 'translate(30%,-30%)' }}
                  onClick={() => onGalleryImageRemove?.(idx)}
                  title="Remove"
                  aria-label="Remove image"
                >
                  ×
                </button>
                <button
                  type="button"
                  className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-1 py-0.5 rounded-tr rounded-bl opacity-80 hover:opacity-100 transition"
                  onClick={() => onGalleryImageInsert?.(img)}
                  title="Insert into post"
                  aria-label="Insert image into post"
                >
                  Insert
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFormToolbar;