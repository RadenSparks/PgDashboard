import React from 'react';

interface Props {
  onHeading: (level: number) => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onImage: () => void;
  onHr: () => void;
  previewTextColor: string;
  previewBgColor: string;
  showColorPicker: boolean;
  showBgColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  setShowBgColorPicker: (show: boolean) => void;
  setPreviewTextColor: (color: string) => void;
  setPreviewBgColor: (color: string) => void;
  COLORS: string[];
  BG_COLORS: string[];
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  FONT_FAMILIES: { label: string; value: string }[];
  FONT_SIZES: { label: string; value: string }[];
  publish: boolean;
  setPublish: (v: boolean) => void;
  onOpenGalleryPicker: () => void;
  images: string[];
  onGalleryImageInsert: (url: string) => void;
  onGalleryImageRemove?: (idx: number) => void;
  onClearFormatting?: () => void;
  onInsertLink?: () => void;
  onParagraphBreak?: () => void;
}

const ICON_BTN =
  "p-2 rounded-xl hover:bg-blue-100 transition text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm";

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
  onOpenGalleryPicker,
  images,
  onGalleryImageInsert,
  onGalleryImageRemove,
  onClearFormatting,
  onInsertLink,
  onParagraphBreak,
}) => {
  return (
    <div className="border-b bg-white px-3 py-2 rounded-t-2xl shadow-sm">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        {/* Left: Markdown actions */}
        <div className="flex flex-wrap gap-1 items-center">
          <button type="button" aria-label="Heading 1" title="Heading 1" className={ICON_BTN} onClick={() => onHeading(1)}>H1</button>
          <button type="button" aria-label="Heading 2" title="Heading 2" className={ICON_BTN} onClick={() => onHeading(2)}>H2</button>
          <button type="button" aria-label="Heading 3" title="Heading 3" className={ICON_BTN} onClick={() => onHeading(3)}>H3</button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" aria-label="Bold" title="Bold" className={ICON_BTN + " font-bold"} onClick={onBold}><b>B</b></button>
          <button type="button" aria-label="Italic" title="Italic" className={ICON_BTN + " italic"} onClick={onItalic}><i>I</i></button>
          <button type="button" aria-label="Underline" title="Underline" className={ICON_BTN + " underline"} onClick={onUnderline}><u>U</u></button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" aria-label="Clear Formatting" title="Clear Formatting" className={ICON_BTN} onClick={onClearFormatting}>Tx</button>
          <button type="button" aria-label="Insert Link" title="Insert Link" className={ICON_BTN} onClick={onInsertLink}>🔗</button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button
            type="button"
            aria-label="Insert Gallery Image"
            title="Insert Gallery Image"
            className={ICON_BTN + " flex items-center gap-1"}
            onClick={onOpenGalleryPicker}
          >
            <span role="img" aria-label="Gallery">🖼️</span>
            <span className="text-sm font-normal">Gallery</span>
          </button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" aria-label="Horizontal Rule" title="Horizontal Rule" className={ICON_BTN} onClick={onHr}>―</button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button
            type="button"
            aria-label="Paragraph Break"
            title="Paragraph Break"
            className={ICON_BTN}
            onClick={onParagraphBreak}
          >
            ¶
          </button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
        </div>
        {/* Right: Customization controls */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Preview text color */}
          <div className="relative">
            <button
              type="button"
              aria-label="Preview Text Color"
              title="Preview Text Color"
              className={ICON_BTN}
              onClick={() => { setShowColorPicker(!showColorPicker); setShowBgColorPicker(false); }}
              style={{ borderBottom: `3px solid ${previewTextColor}` }}
            >A</button>
            {showColorPicker && (
              <div className="absolute z-10 mt-2 left-0 bg-white border rounded-xl shadow-lg p-2 flex gap-1 flex-wrap w-56">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Set text color ${color}`}
                    className="w-6 h-6 rounded-full border-2 border-white hover:border-blue-400 transition"
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
              className={ICON_BTN}
              onClick={() => { setShowBgColorPicker(!showBgColorPicker); setShowColorPicker(false); }}
              style={{ borderBottom: `3px solid ${previewBgColor}` }}
            >BG</button>
            {showBgColorPicker && (
              <div className="absolute z-10 mt-2 left-0 bg-white border rounded-xl shadow-lg p-2 flex gap-1 flex-wrap w-56">
                {BG_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Set background color ${color}`}
                    className="w-6 h-6 rounded-full border-2 border-white hover:border-blue-400 transition"
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
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-300"
            title="Font Family"
            style={{ minWidth: 90 }}
            aria-label="Font Family"
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-300"
            title="Font Size"
            style={{ minWidth: 70 }}
            aria-label="Font Size"
          >
            {FONT_SIZES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {/* Publish toggle */}
          <label className="flex items-center gap-1 whitespace-nowrap font-medium text-green-700 ml-1 text-sm">
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
        <div className="w-full mt-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border rounded-xl bg-blue-50 px-2" style={{ maxHeight: 70 }}>
            {images.map((img, idx) => (
              <div key={idx} className="relative group flex-shrink-0">
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-14 h-14 object-cover rounded-xl border border-blue-100 shadow"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-base text-red-500 hover:bg-red-100 transition"
                  style={{ transform: 'translate(30%,-30%)' }}
                  onClick={() => onGalleryImageRemove && onGalleryImageRemove(idx)}
                  title="Remove"
                  aria-label="Remove image"
                >
                  ×
                </button>
                <button
                  type="button"
                  className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-tr-xl rounded-bl-xl opacity-80 hover:opacity-100 transition"
                  onClick={() => onGalleryImageInsert(img)}
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