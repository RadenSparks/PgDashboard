import React from 'react';
import LiveMarkdownPreview from './LiveMarkdownPreview';
import BlogPostPreview from './BlogPostPreview';

interface Props {
  form: any;
  catalogues: any[];
  fontFamily: string;
  setFontFamily: (v: string) => void;
  fontSize: string;
  setFontSize: (v: string) => void;
  previewTextColor: string;
  setPreviewTextColor: (v: string) => void;
  previewBgColor: string;
  setPreviewBgColor: (v: string) => void;
  FONT_FAMILIES: { label: string; value: string }[];
  FONT_SIZES: { label: string; value: string }[];
  COLORS: string[];
  BG_COLORS: string[];
}

const PostFormSidebar: React.FC<Props> = ({
  form, catalogues,
  fontFamily, setFontFamily,
  fontSize, setFontSize,
  previewTextColor, setPreviewTextColor,
  previewBgColor, setPreviewBgColor,
  FONT_FAMILIES, FONT_SIZES, COLORS, BG_COLORS
}) => (
  <div className="flex-1 min-w-[400px] max-w-[600px] flex flex-col overflow-y-auto bg-gray-50 border-l">
    <div className="p-6 pb-2">
      <h4 className="font-bold mb-2 text-blue-700">Live Preview</h4>
      <div className="rounded-xl overflow-hidden border shadow bg-white" style={{ background: previewBgColor }}>
        <BlogPostPreview
          content={form.content || ''}
          title={form.name}
          description={form.description}
          image={form.image}
          catalogueName={
            catalogues.find(c => c.id === Number(form.catalogueId))?.name ||
            form.catalogue?.name
          }
          date={form.created_at?.slice(0, 10)}
          fontFamily={fontFamily}
          fontSize={fontSize}
          textColor={previewTextColor}
          bgColor={previewBgColor}
          meta_title={form.meta_title}
          meta_description={form.meta_description}
          meta_keyword={form.meta_keyword}
          canonical={form.canonical}
          publish={!!form.publish}
        />
      </div>
    </div>
    <div className="bg-white rounded-xl shadow p-4 m-6 mt-4">
      <h5 className="font-semibold mb-2 text-gray-700">Preview Customization</h5>
      <div className="flex flex-col gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Family</label>
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value)}
            className="border rounded p-1 w-full"
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Size</label>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            className="border rounded p-1 w-full"
          >
            {FONT_SIZES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Preview Text Color</label>
          <div className="flex gap-1 flex-wrap w-full">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`w-6 h-6 rounded-full border-2 ${previewTextColor === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-white'} hover:border-gray-400 transition`}
                style={{ background: color }}
                onClick={() => setPreviewTextColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Preview Background Color</label>
          <div className="flex gap-1 flex-wrap w-full">
            {BG_COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`w-6 h-6 rounded-full border-2 ${previewBgColor === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-white'} hover:border-gray-400 transition`}
                style={{ background: color }}
                onClick={() => setPreviewBgColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PostFormSidebar;