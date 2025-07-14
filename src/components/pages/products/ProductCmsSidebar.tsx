import React from "react";
import LiveProductMarkdownPreview from "./LiveProductMarkdownPreview";
import type { Product, CmsContent } from "./types";

interface Props {
  cmsContent: CmsContent;
  product: Product;
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

const ProductCmsSidebar: React.FC<Props> = ({
  cmsContent, product,
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
      <div className="rounded-xl overflow-hidden border shadow bg-white transition-all" style={{ background: previewBgColor }}>
        <LiveProductMarkdownPreview
          cmsContent={cmsContent}
          product={product}
          fontFamily={fontFamily}
          fontSize={fontSize}
          textColor={previewTextColor}
          bgColor={previewBgColor}
        />
        {/* --- CMS Modal Section Previews --- */}
        {/* HERO SECTION */}
        {(cmsContent.heroTitle || cmsContent.heroSubtitle || cmsContent.heroImage) && (
          <section className="mb-6 mt-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Hero Section</h5>
            {cmsContent.heroImage && (
              <img src={cmsContent.heroImage} alt="Hero" className="w-32 h-32 object-cover rounded-lg border shadow mb-2" />
            )}
            <div className="font-bold text-xl mb-1" style={{ color: previewTextColor }}>{cmsContent.heroTitle}</div>
            <div className="text-gray-600" style={{ color: previewTextColor }}>{cmsContent.heroSubtitle}</div>
          </section>
        )}
        {/* ABOUT SECTION */}
        {(cmsContent.aboutTitle || cmsContent.aboutText || (cmsContent.aboutImages && cmsContent.aboutImages.length > 0)) && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>About Section</h5>
            <div className="font-bold mb-1" style={{ color: previewTextColor }}>{cmsContent.aboutTitle}</div>
            <div className="mb-2" style={{ color: previewTextColor }}>{cmsContent.aboutText}</div>
            <div className="flex gap-2 flex-wrap">
              {cmsContent.aboutImages?.map((img, idx) =>
                img ? (
                  <img
                    key={idx}
                    src={img}
                    alt={`About ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ) : null
              )}
            </div>
          </section>
        )}
        {/* SLIDER SECTION */}
        {cmsContent.sliderImages && cmsContent.sliderImages.length > 0 && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Gallery</h5>
            <div className="flex gap-2 flex-wrap">
              {cmsContent.sliderImages.map((img, idx) =>
                img ? (
                  <img
                    key={idx}
                    src={img}
                    alt={`Slider ${idx + 1}`}
                    className="w-14 h-14 object-cover rounded border"
                  />
                ) : null
              )}
            </div>
          </section>
        )}
        {/* DETAILS SECTION */}
        {(cmsContent.detailsTitle || cmsContent.detailsContent) && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Product Details</h5>
            <div className="font-bold mb-1" style={{ color: previewTextColor }}>{cmsContent.detailsTitle}</div>
            <div className="prose max-w-none border rounded p-2 bg-gray-50" style={{ color: previewTextColor, fontFamily, fontSize }}>
              {cmsContent.detailsContent}
            </div>
          </section>
        )}
        {/* TABS SECTION */}
        {cmsContent.tabs && cmsContent.tabs.length > 0 && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Product Tabs</h5>
            {cmsContent.tabs.map((tab, idx) => (
              <div key={idx} className="mb-3">
                <div className="font-bold" style={{ color: previewTextColor }}>{tab.title}</div>
                <div className="mb-1" style={{ color: previewTextColor }}>{tab.content}</div>
                <div className="flex gap-2 flex-wrap">
                  {tab.images?.map((img, imgIdx) =>
                    img ? (
                      <img
                        key={imgIdx}
                        src={img}
                        alt={`Tab ${idx + 1} Image ${imgIdx + 1}`}
                        className="w-12 h-12 object-cover rounded border"
                      />
                    ) : null
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
        {/* FEATURED SECTION */}
        {cmsContent.featuredSections && cmsContent.featuredSections.length > 0 && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Featured Section</h5>
            {cmsContent.featuredSections.map((block, idx) => (
              <div key={idx} className="border rounded-lg p-3 mb-3 bg-white shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="font-bold" style={{ color: previewTextColor }}>{block.title}</div>
                  <div className="mb-1" style={{ color: previewTextColor }}>{block.description}</div>
                  <div className="text-xs text-gray-500">Background: <span style={{ background: block.textBgColor, padding: "0 8px", borderRadius: 4 }}>{block.textBgColor}</span></div>
                </div>
                {block.imageSrc && (
                  <img
                    src={block.imageSrc}
                    alt={block.imageAlt || `Block ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded border shadow"
                  />
                )}
                <div className="text-xs text-gray-500">{block.isImageRight ? "Image Right" : "Image Left"}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
    <div className="bg-white rounded-xl shadow p-6 m-6 mt-4">
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

export default ProductCmsSidebar;