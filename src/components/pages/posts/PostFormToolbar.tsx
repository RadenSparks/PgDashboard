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
          <button type="button" aria-label="Tiêu đề 1" title="Tiêu đề 1" className={ICON_BTN} onClick={() => onHeading(1)}>H1</button>
          <button type="button" aria-label="Tiêu đề 2" title="Tiêu đề 2" className={ICON_BTN} onClick={() => onHeading(2)}>H2</button>
          <button type="button" aria-label="Tiêu đề 3" title="Tiêu đề 3" className={ICON_BTN} onClick={() => onHeading(3)}>H3</button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" aria-label="Đậm" title="Đậm" className={ICON_BTN + " font-bold"} onClick={onBold}><b>B</b></button>
          <button type="button" aria-label="Nghiêng" title="Nghiêng" className={ICON_BTN + " italic"} onClick={onItalic}><i>I</i></button>
          <button type="button" aria-label="Gạch chân" title="Gạch chân" className={ICON_BTN + " underline"} onClick={onUnderline}><u>U</u></button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" aria-label="Xóa định dạng" title="Xóa định dạng" className={ICON_BTN} onClick={onClearFormatting}>Tx</button>
          <button type="button" aria-label="Chèn liên kết" title="Chèn liên kết" className={ICON_BTN} onClick={onInsertLink}>🔗</button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button
            type="button"
            aria-label="Chèn ảnh từ thư viện"
            title="Chèn ảnh từ thư viện"
            className={ICON_BTN + " flex items-center gap-1"}
            onClick={onOpenGalleryPicker}
          >
            <span role="img" aria-label="Thư viện">🖼️</span>
            <span className="text-sm font-normal">Thư viện</span>
          </button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button type="button" aria-label="Chèn đường kẻ ngang" title="Chèn đường kẻ ngang" className={ICON_BTN} onClick={onHr}>―</button>
          <span className="w-px h-5 bg-gray-300 mx-1" />
          <button
            type="button"
            aria-label="Ngắt đoạn"
            title="Ngắt đoạn"
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
              aria-label="Màu chữ xem trước"
              title="Màu chữ xem trước"
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
                    aria-label={`Chọn màu chữ ${color}`}
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
              aria-label="Màu nền xem trước"
              title="Màu nền xem trước"
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
                    aria-label={`Chọn màu nền ${color}`}
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
            title="Kiểu chữ"
            style={{ minWidth: 90 }}
            aria-label="Kiểu chữ"
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-300"
            title="Cỡ chữ"
            style={{ minWidth: 70 }}
            aria-label="Cỡ chữ"
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
              aria-label="Công khai"
            />
            <span className="select-none">Công khai</span>
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
                  title="Xóa"
                  aria-label="Xóa ảnh"
                >
                  ×
                </button>
                <button
                  type="button"
                  className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-tr-xl rounded-bl-xl opacity-80 hover:opacity-100 transition"
                  onClick={() => onGalleryImageInsert(img)}
                  title="Chèn vào bài viết"
                  aria-label="Chèn ảnh vào bài viết"
                >
                  Chèn
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