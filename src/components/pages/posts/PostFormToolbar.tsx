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
  onGalleryImageInsert
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
      {/* Gallery Preview Slider with insert button */}
      {images.length > 0 && (
        <div className="mt-2">
          <GallerySlider
            images={images}
            renderAction={(url) =>
              onGalleryImageInsert ? (
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  onClick={() => onGalleryImageInsert(url)}
                >
                  Insert to Content
                </button>
              ) : null
            }
          />
        </div>
      )}
    </div>
  );
};

export default PostFormToolbar;