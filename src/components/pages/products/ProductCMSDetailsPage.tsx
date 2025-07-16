import React from "react";
import ReactMarkdown from "react-markdown";
import type { Product, CmsContent } from "./types";
import GallerySlider from "./GallerySlider";

interface Props {
  product: Product;
  cmsContent: CmsContent;
}

const ProductDetailsPage: React.FC<Props> = ({ product, cmsContent }) => {
  // Style values from CMS, with fallbacks
  const fontFamily = cmsContent.fontFamily || 'sans-serif';
  const fontSize =
    cmsContent.fontSize === "text-base" ? "1.25rem"
    : cmsContent.fontSize === "text-lg" ? "1.5rem"
    : cmsContent.fontSize === "text-2xl" ? "2rem"
    : undefined;
  const textColor = cmsContent.textColor || "#222";
  const bgColor = cmsContent.bgColor || "#fff";

  return (
    <div
      className="max-w-5xl mx-auto py-10 px-4"
      style={{
        fontFamily,
        color: textColor,
        background: bgColor,
        fontSize,
        transition: "background 0.2s, color 0.2s",
        minHeight: 400,
      }}
    >
      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="flex-1 flex flex-col items-center">
          {cmsContent.heroImages && cmsContent.heroImages.length > 0 ? (
            <GallerySlider images={cmsContent.heroImages} />
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded">
              <span className="text-gray-400">No images</span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2" style={{ color: textColor, fontFamily }}>{cmsContent.heroTitle || product.product_name}</h1>
          <h2 className="text-lg text-gray-600 mb-4">{cmsContent.heroSubtitle}</h2>
        </div>
      </section>

      {/* ABOUT SECTION */}
      {(cmsContent.aboutTitle || cmsContent.aboutText || (cmsContent.aboutImages && cmsContent.aboutImages.length > 0)) && (
        <section className="mb-10">
          <h3 className="text-2xl font-semibold mb-2" style={{ color: textColor, fontFamily }}>{cmsContent.aboutTitle}</h3>
          <div className="mb-4" style={{ color: textColor }}>{cmsContent.aboutText}</div>
          {cmsContent.aboutImages && cmsContent.aboutImages.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {cmsContent.aboutImages.map((img, idx) =>
                img ? (
                  <img
                    key={idx}
                    src={img}
                    alt={`About ${idx + 1}`}
                    className="w-28 h-28 object-cover rounded border"
                  />
                ) : null
              )}
            </div>
          )}
        </section>
      )}

      {/* SLIDER SECTION */}
      {cmsContent.sliderImages && cmsContent.sliderImages.length > 0 && (
        <section className="mb-10">
          <h4 className="text-xl font-semibold mb-2" style={{ color: textColor, fontFamily }}>Gallery</h4>
          <div className="flex gap-2 flex-wrap">
            {cmsContent.sliderImages.map((img, idx) =>
              img ? (
                <img
                  key={idx}
                  src={img}
                  alt={`Slider ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ) : null
            )}
          </div>
        </section>
      )}

      {/* DETAILS SECTION */}
      {(cmsContent.detailsTitle || cmsContent.detailsContent) && (
        <section className="mb-10">
          <h4 className="text-xl font-semibold mb-2" style={{ color: textColor, fontFamily }}>{cmsContent.detailsTitle}</h4>
          <div className="prose max-w-none border rounded p-4 bg-white" style={{ color: textColor, fontFamily, fontSize }}>
            <ReactMarkdown>{cmsContent.detailsContent || "*No details provided.*"}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* FEATURED SECTION (Alternating 2-column blocks) */}
      {cmsContent.featuredSections && cmsContent.featuredSections.length > 0 && (
        <section className="mb-10">
          <h4 className="text-xl font-semibold mb-6" style={{ color: textColor, fontFamily }}>Featured Section</h4>
          <div className="grid grid-cols-1 gap-8">
            {cmsContent.featuredSections.map((block, idx) => (
              <div
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-8 rounded-2xl shadow-lg border bg-white p-6 transition-all`}
                style={{
                  background: block.textBgColor || "#fff",
                  flexDirection: idx % 2 === 0 ? "row" : "row-reverse",
                }}
              >
                {/* Image */}
                {block.imageSrc && (
                  <div className="flex-shrink-0">
                    <img
                      src={block.imageSrc}
                      alt={block.imageAlt || `Block ${idx + 1}`}
                      className="w-40 h-40 object-cover rounded-xl border shadow"
                    />
                  </div>
                )}
                {/* Text */}
                <div className="flex-1 flex flex-col justify-center">
                  <h5 className="text-2xl font-bold mb-2" style={{ color: textColor, fontFamily }}>{block.title}</h5>
                  <div className="mb-2 text-base" style={{ color: textColor }}>{block.description}</div>
                  <div className="text-xs text-gray-500 mb-1">
                    {block.isImageRight ? "Image Right" : "Image Left"}
                  </div>
                  <div className="text-xs text-gray-400">Background: <span style={{ background: block.textBgColor, padding: "0 8px", borderRadius: 4 }}>{block.textBgColor}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;