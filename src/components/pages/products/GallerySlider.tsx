import React, { useState } from 'react';

type GallerySliderProps = {
  images: string[];
  renderAction?: (url: string) => React.ReactNode;
};

const GallerySlider = ({ images, renderAction }: GallerySliderProps) => {
  const [current, setCurrent] = useState(0);

  if (!images.length)
    return (
      <div className="w-full h-16 bg-gray-100 flex items-center justify-center rounded mt-2">
        <span className="text-gray-400 text-xs">[Slider/Carousel Here]</span>
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center mt-2">
      {/* Main image preview */}
      <div className="relative w-48 h-32 flex items-center justify-center bg-gray-100 rounded-lg shadow">
        <img
          src={images[current]}
          alt={`Slide ${current + 1}`}
          className="w-48 h-32 object-cover rounded-lg border"
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-lg shadow hover:bg-blue-100 transition"
              onClick={() => setCurrent((current - 1 + images.length) % images.length)}
              type="button"
              aria-label="Previous"
            >&lt;</button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-lg shadow hover:bg-blue-100 transition"
              onClick={() => setCurrent((current + 1) % images.length)}
              type="button"
              aria-label="Next"
            >&gt;</button>
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
                bg-white p-0.5 shadow-sm hover:border-blue-400`}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to image ${idx + 1}`}
              type="button"
              tabIndex={0}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GallerySlider;