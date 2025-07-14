import React from 'react';
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
  <div className="flex-1 min-w-[400px] max-w-[600px] flex flex-col overflow-y-auto bg-gradient-to-br from-blue-50 to-white border-l">
    <div className="p-6 pb-2">
      <h4 className="font-bold mb-4 text-blue-700 text-lg flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" />
        Live Preview
      </h4>
      <div className="rounded-2xl overflow-hidden border shadow bg-white transition-all" style={{ background: previewBgColor }}>
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
    <div className="bg-white rounded-2xl shadow p-6 m-6 mt-4">
      <h5 className="font-semibold mb-4 text-gray-700 text-base flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" />
        Preview Customization
      </h5>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Font Family</label>
          <select
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value)}
            className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-300"
          >
            {FONT_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Font Size</label>
          <select
            value={fontSize}
            onChange={e => setFontSize(e.target.value)}
            className="border rounded p-2 w-full focus:ring-2 focus:ring-blue-300"
          >
            {FONT_SIZES.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Preview Text Color</label>
          <div className="flex gap-2 flex-wrap w-full">
            {COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`w-7 h-7 rounded-full border-2 transition
                  ${previewTextColor === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}
                  hover:border-blue-400 focus:ring-2 focus:ring-blue-400`}
                style={{ background: color }}
                onClick={() => setPreviewTextColor(color)}
                title={color}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Preview Background Color</label>
          <div className="flex gap-2 flex-wrap w-full">
            {BG_COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`w-7 h-7 rounded-full border-2 transition
                  ${previewBgColor === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}
                  hover:border-blue-400 focus:ring-2 focus:ring-blue-400`}
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