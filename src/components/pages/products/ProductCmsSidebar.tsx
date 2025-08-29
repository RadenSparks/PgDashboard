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

const VIET_TITLES = ["Nội dung", "Cách chơi", "Tham Khảo"];

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
        Xem trước trực tiếp
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
        {/* HERO SECTION */}
        {(cmsContent.heroTitle || cmsContent.heroSubtitle) && (
          <section className="mb-6 mt-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Phần ảnh chính</h5>
            <div className="font-bold text-xl mb-1" style={{ color: previewTextColor }}>{cmsContent.heroTitle}</div>
            <div className="text-gray-600" style={{ color: previewTextColor }}>{cmsContent.heroSubtitle}</div>
          </section>
        )}
        {/* ABOUT SECTION */}
        {/*
        {(cmsContent.aboutTitle || cmsContent.aboutText || (cmsContent.aboutImages && cmsContent.aboutImages.length > 0)) && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Phần giới thiệu</h5>
            <div className="font-bold mb-1" style={{ color: previewTextColor }}>{cmsContent.aboutTitle}</div>
            <div className="mb-2" style={{ color: previewTextColor }}>{cmsContent.aboutText}</div>
            <div className="flex gap-2 flex-wrap">
              {cmsContent.aboutImages?.map((img, idx) =>
                img ? (
                  <img
                    key={idx}
                    src={img}
                    alt={`Ảnh giới thiệu ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ) : null
              )}
            </div>
          </section>
        )}
        */}
        {/* SLIDER SECTION */}
        {cmsContent.sliderImages && cmsContent.sliderImages.length > 0 && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Trình chiếu ảnh</h5>
            <div className="flex gap-2 flex-wrap">
              {cmsContent.sliderImages.map((img, idx) =>
                img ? (
                  <img
                    key={idx}
                    src={img}
                    alt={`Trình chiếu ${idx + 1}`}
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
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Chi tiết sản phẩm</h5>
            <div className="font-bold mb-1" style={{ color: previewTextColor }}>{cmsContent.detailsTitle}</div>
            <div className="prose max-w-none border rounded p-2 bg-gray-50" style={{ color: previewTextColor, fontFamily, fontSize }}>
              {cmsContent.detailsContent}
            </div>
          </section>
        )}
        {/* TABS SECTION - Vietnamese Titles */}
        {cmsContent.tabs && cmsContent.tabs.length > 0 && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Thông tin sản phẩm</h5>
            {VIET_TITLES.map((fixedTitle) => {
              const tab = cmsContent.tabs?.find(
                t =>
                  t.title.trim().toLowerCase() === fixedTitle.trim().toLowerCase() ||
                  (fixedTitle === "Tham Khảo" &&
                    (t.title.trim().toLowerCase() === "reference" ||
                     t.title.trim().toLowerCase() === "tài liệu tham khảo"))
              );
              if (!tab) return null;

              return (
                <div key={fixedTitle} className="mb-3">
                  <div className="font-bold" style={{ color: previewTextColor }}>{fixedTitle}</div>
                  {/* Special handling for "Cách chơi" */}
                  {fixedTitle === "Cách chơi" ? (
                    <div className="mb-1" style={{ color: previewTextColor }}>
                      {tab.content && (
                        <a
                          href={tab.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {tab.content}
                        </a>
                      )}
                      {/* Embed video if YouTube/Vimeo */}
                      {tab.content && (tab.content.includes("youtube.com") || tab.content.includes("youtu.be") || tab.content.includes("vimeo.com")) && (
                        <div className="mt-2">
                          <iframe
                            width="320"
                            height="180"
                            src={
                              tab.content.includes("youtube.com") || tab.content.includes("youtu.be")
                                ? tab.content.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
                                : tab.content
                            }
                            title="Video hướng dẫn chơi"
                            frameBorder={0}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  ) : fixedTitle === "Tham Khảo" ? (
                    <div className="mb-1" style={{ color: previewTextColor }}>
                      {(tab.references || []).length > 0 ? (
                        <ul className="list-disc pl-5">
                          {tab.references?.map((ref, refIdx) => (
                            <li key={refIdx}>
                              <a
                                href={ref.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                              >
                                {ref.title || ref.link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic">Chưa có tài liệu tham khảo.</span>
                      )}
                    </div>
                  ) : (
                    <div className="mb-1" style={{ color: previewTextColor }}>{tab.content}</div>
                  )}
                  {/* Images only for non-"Cách chơi" tabs */}
                  {fixedTitle !== "Cách chơi" && tab.images && (
                    <div className="flex gap-2 flex-wrap">
                      {tab.images?.map((img, imgIdx) =>
                        img ? (
                          <img
                            key={imgIdx}
                            src={img}
                            alt={`Tab ${fixedTitle} Ảnh ${imgIdx + 1}`}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
        {/* FEATURED SECTION */}
        {cmsContent.featuredSections && cmsContent.featuredSections.length > 0 && (
          <section className="mb-6">
            <h5 className="text-lg font-semibold mb-2" style={{ color: previewTextColor }}>Phần nổi bật</h5>
            {cmsContent.featuredSections.map((block, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row w-full border rounded-lg bg-white shadow-sm mb-3 overflow-hidden"
              >
                {/* Alternate order for checkered pattern */}
                {/* Text Box */}
                <div
                  className={`
                    md:w-1/2 w-full flex items-center
                    ${block.isImageRight ? 'md:order-2' : ''}
                    p-0
                  `}
                >
                  <div
                    className="w-full h-full flex flex-col justify-center px-6 py-6 bg-white"
                    style={{
                      background: block.textBgColor || "#fff",
                      borderTopRightRadius: block.isImageRight ? 0 : '1rem',
                      borderBottomRightRadius: block.isImageRight ? 0 : '1rem',
                      borderTopLeftRadius: block.isImageRight ? '1rem' : 0,
                      borderBottomLeftRadius: block.isImageRight ? '1rem' : 0,
                    }}
                  >
                    <div className="font-bold text-base mb-1" style={{ color: previewTextColor }}>{block.title}</div>
                    <div className="mb-1 text-sm" style={{ color: previewTextColor }}>{block.description}</div>
                    <div className="text-xs text-gray-400">Nền: <span style={{ background: block.textBgColor, padding: "0 8px", borderRadius: 4 }}>{block.textBgColor}</span></div>
                  </div>
                </div>
                {/* Image Box */}
                <div
                  className={`
                    md:w-1/2 w-full flex items-center justify-center
                    ${block.isImageRight ? 'md:order-1' : ''}
                    p-0
                  `}
                  style={{
                    background: "#f9fafb",
                    minHeight: 120,
                    borderTopLeftRadius: block.isImageRight ? 0 : '1rem',
                    borderBottomLeftRadius: block.isImageRight ? 0 : '1rem',
                    borderTopRightRadius: block.isImageRight ? '1rem' : 0,
                    borderBottomRightRadius: block.isImageRight ? '1rem' : 0,
                  }}
                >
                  {block.imageSrc ? (
                    <img
                      src={block.imageSrc}
                      alt={block.imageAlt || `Khối ${idx + 1}`}
                      className="object-cover w-32 h-32 md:w-48 md:h-48 rounded-none border"
                      style={{ background: "#f3f4f6" }}
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center text-gray-300 bg-gray-100 rounded-none border">
                      Không có ảnh
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
    <div className="bg-white rounded-xl shadow p-6 m-6 mt-4">
      <h5 className="font-semibold mb-4 text-gray-700 text-base flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" />
        Tùy chỉnh xem trước
      </h5>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-medium">Kiểu chữ</label>
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
          <label className="block text-xs text-gray-500 mb-1 font-medium">Cỡ chữ</label>
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
          <label className="block text-xs text-gray-500 mb-1 font-medium">Màu chữ xem trước</label>
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
          <label className="block text-xs text-gray-500 mb-1 font-medium">Màu nền xem trước</label>
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