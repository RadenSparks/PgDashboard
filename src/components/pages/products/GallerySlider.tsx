import { useState } from "react";

type GallerySliderProps = {
    images: string[];
};

const GallerySlider = ({ images }: GallerySliderProps) => {
    const [current, setCurrent] = useState(0);

    if (!images.length) return (
        <div className="w-full h-16 bg-gray-100 flex items-center justify-center rounded mt-2">
            <span className="text-gray-400 text-xs">[Slider/Carousel Here]</span>
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center mt-2">
            <div className="relative w-40 h-28 flex items-center justify-center bg-gray-100 rounded">
                <img
                    src={images[current]}
                    alt={`Slide ${current + 1}`}
                    className="w-40 h-28 object-cover rounded border"
                />
                {images.length > 1 && (
                    <>
                        <button
                            className="absolute left-1 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 text-lg"
                            onClick={() => setCurrent((current - 1 + images.length) % images.length)}
                            type="button"
                            aria-label="Previous"
                        >&lt;</button>
                        <button
                            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 text-lg"
                            onClick={() => setCurrent((current + 1) % images.length)}
                            type="button"
                            aria-label="Next"
                        >&gt;</button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex gap-1 mt-2">
                    {images.map((_img, idx) => (
                        <button
                            key={idx}
                            className={`w-3 h-3 rounded-full ${idx === current ? "bg-blue-600" : "bg-gray-300"}`}
                            onClick={() => setCurrent(idx)}
                            type="button"
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GallerySlider;