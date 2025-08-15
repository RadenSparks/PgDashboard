import React, { useState, useEffect, useRef } from 'react';

type GalleryImage = string | { url: string; size?: number };
type GallerySliderProps = {
  images: GalleryImage[];
  renderAction?: (url: string) => React.ReactNode;
};

function getUrl(img: GalleryImage) {
  return typeof img === "string" ? img : img.url;
}
function getSize(img: GalleryImage) {
  return typeof img === "object" && img.size ? img.size : undefined;
}

const GallerySlider = ({ images, renderAction }: GallerySliderProps) => {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!sliderRef.current) return;
      if (document.activeElement && !sliderRef.current.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") setCurrent(c => (c - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setCurrent(c => (c + 1) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length]);

  if (!images.length)
    return (
      <div className="w-full h-20 bg-gray-100 flex items-center justify-center rounded mt-2">
        <span className="text-gray-400 text-xs">No images available</span>
      </div>
    );

  return (
    <div
      className="w-full flex flex-col items-center mt-2"
      ref={sliderRef}
      tabIndex={0}
      aria-label="Gallery slider, use arrow keys to navigate"
    >
      {/* Main image preview */}
      <div className="relative w-72 h-44 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg group transition-all duration-300">
        <img
          src={getUrl(images[current])}
          alt={`Slide ${current + 1}`}
          className="w-72 h-44 object-cover rounded-xl border transition-all duration-300"
          draggable={false}
          style={{ boxShadow: "0 4px 24px 0 rgba(30,64,175,0.10)" }}
        />
        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full px-3 py-2 text-2xl shadow hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 transition"
              onClick={() => setCurrent((current - 1 + images.length) % images.length)}
              type="button"
              aria-label="Previous"
              tabIndex={0}
            >&lt;</button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 rounded-full px-3 py-2 text-2xl shadow hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 transition"
              onClick={() => setCurrent((current + 1) % images.length)}
              type="button"
              aria-label="Next"
              tabIndex={0}
            >&gt;</button>
          </>
        )}
        {/* Image counter */}
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded shadow">
          {current + 1} / {images.length}
        </span>
        {/* File size display (if available) */}
        {getSize(images[current]) && (
          <span className="absolute top-2 right-2 bg-white bg-opacity-80 text-gray-700 text-xs px-2 py-0.5 rounded shadow">
            {(getSize(images[current])! / (1024 * 1024)).toFixed(2)} MB
          </span>
        )}
      </div>
      {/* Action button (e.g. insert to content) */}
      {renderAction && (
        <div className="mt-2">{renderAction(getUrl(images[current]))}</div>
      )}
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4">
          {images.map((img, idx) => (
            <button
              key={getUrl(img) + idx}
              className={`w-12 h-12 rounded border-2 transition
                ${idx === current ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'}
                bg-white p-0.5 shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-400`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to image ${idx + 1}`}
              type="button"
              tabIndex={0}
            >
              <img
                src={getUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                className={`w-full h-full object-cover rounded transition-all duration-200 ${idx === current ? "scale-105" : ""}`}
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
      {/* Keyboard navigation hint */}
      <div className="text-xs text-gray-400 mt-2">
        Use <span className="font-semibold text-blue-600">←</span> / <span className="font-semibold text-blue-600">→</span> keys to navigate
      </div>
    </div>
  );
};

export default GallerySlider;