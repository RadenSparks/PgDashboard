import React from "react";
import ReactMarkdown from "react-markdown";
import type { Product, CmsContent } from "./types";

// You may want to use your GallerySlider here for hero images
import GallerySlider from "./GallerySlider";

interface Props {
  product: Product;
  cmsContent: CmsContent;
}

const ProductDetailsPage: React.FC<Props> = ({ product, cmsContent }) => (
  <div className="max-w-5xl mx-auto py-10 px-4">
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
        <h1 className="text-4xl font-bold mb-2">{cmsContent.heroTitle || product.name}</h1>
        <h2 className="text-lg text-gray-600 mb-4">{cmsContent.heroSubtitle}</h2>
        {/* You can add price, SKU, etc. here if needed */}
      </div>
    </section>

    {/* ABOUT SECTION */}
    {(cmsContent.aboutTitle || cmsContent.aboutText || (cmsContent.aboutImages && cmsContent.aboutImages.length > 0)) && (
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-2">{cmsContent.aboutTitle}</h3>
        <div className="mb-4 text-gray-700">{cmsContent.aboutText}</div>
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
        <h4 className="text-xl font-semibold mb-2">Gallery</h4>
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
        <h4 className="text-xl font-semibold mb-2">{cmsContent.detailsTitle}</h4>
        <div className="prose max-w-none border rounded p-4 bg-white">
          <ReactMarkdown>{cmsContent.detailsContent || "*No details provided.*"}</ReactMarkdown>
        </div>
      </section>
    )}
  </div>
);

export default ProductDetailsPage;