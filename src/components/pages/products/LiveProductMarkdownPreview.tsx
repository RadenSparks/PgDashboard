import React from "react";
import ReactMarkdown from "react-markdown";
import type { Product, CmsContent } from "./types";

interface Props {
  cmsContent: CmsContent;
  product: Product;
  fontFamily?: string;
  fontSize?: string;
  textColor?: string;
  bgColor?: string;
}

const LiveProductMarkdownPreview: React.FC<Props> = ({
  cmsContent,
  product,
  fontFamily = 'sans-serif',
  fontSize = 'text-lg',
  textColor = '#000000',
  bgColor = '#ffffff',
}) => (
  <div
    className="rounded-2xl overflow-hidden border max-w-2xl mx-auto"
    style={{
      fontFamily,
      background: bgColor,
      color: textColor,
      transition: 'background 0.2s, color 0.2s',
      minHeight: 200,
    }}
  >
    <div className={`p-8 ${fontSize}`}>
      <h1 className="text-3xl font-extrabold mb-2" style={{ color: textColor }}>
        {cmsContent.heroTitle}
      </h1>
      <h2 className="text-xl text-gray-600 mb-4">{cmsContent.heroSubtitle}</h2>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(cmsContent.heroImages || []).map((img, idx) =>
          img ? (
            <img
              key={idx}
              src={img}
              alt={`Hero ${idx + 1}`}
              className="w-24 h-24 object-cover rounded border"
            />
          ) : null
        )}
      </div>
      <h3 className="text-2xl font-semibold mb-2">{cmsContent.aboutTitle}</h3>
      <p className="mb-4">{cmsContent.aboutText}</p>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(cmsContent.aboutImages || []).map((img, idx) =>
          img ? (
            <img
              key={idx}
              src={img}
              alt={`About ${idx + 1}`}
              className="w-20 h-20 object-cover rounded border"
            />
          ) : null
        )}
      </div>
      {(cmsContent.sliderImages && cmsContent.sliderImages.length > 0) && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Slider</h4>
          <div className="flex gap-2 flex-wrap">
            {cmsContent.sliderImages.map((img, idx) =>
              img ? (
                <img
                  key={idx}
                  src={img}
                  alt={`Slider ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
              ) : null
            )}
          </div>
        </div>
      )}
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">{cmsContent.detailsTitle}</h4>
        <div className="prose prose-sm max-w-none border rounded p-3 bg-white min-h-[60px]">
          <ReactMarkdown>{cmsContent.detailsContent || "*Nothing to preview*"}</ReactMarkdown>
        </div>
      </div>
      {cmsContent.tabs && cmsContent.tabs.length > 0 && (
        <section className="mb-10">
          <h4 className="text-xl font-semibold mb-2">Product Tabs</h4>
          {cmsContent.tabs.map((tab, idx) => (
            <div key={idx} className="mb-4">
              <h5 className="text-lg font-bold">{tab.title}</h5>
              <div className="prose">
                <ReactMarkdown>{tab.content}</ReactMarkdown>
              </div>
              {tab.images && tab.images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {tab.images.map((img, i) => (
                    <img key={i} src={img} alt={`Tab ${idx + 1} Img ${i + 1}`} className="w-16 h-16 object-cover rounded border" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  </div>
);

export default LiveProductMarkdownPreview;