import React, { useState, useEffect, useRef } from 'react';

type GallerySliderProps = {
  images: string[];
  renderAction?: (url: string) => React.ReactNode;
};

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
      <div className="w-full h-16 bg-gray-100 flex items-center justify-center rounded mt-2">
        <span className="text-gray-400 text-xs">[Slider/Carousel Here]</span>
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center mt-2" ref={sliderRef} tabIndex={0}>
      {/* Main image preview */}
      <div className="relative w-56 h-36 flex items-center justify-center bg-gray-100 rounded-lg shadow group">
        <img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          className="w-56 h-36 object-cover rounded-lg border"
          draggable={false}
        />
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
            <span className="absolute bottom-2 right-1/2 translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
              {current + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {/* Action button (e.g. insert to content) */}
      {renderAction && (
        <div className="mt-2">{renderAction(images[current])}</div>
      )}
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`w-10 h-10 rounded border-2 transition
                ${idx === current ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'}
                bg-white p-0.5 shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-400`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to image ${idx + 1}`}
              type="button"
              tabIndex={0}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover rounded"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GallerySlider;