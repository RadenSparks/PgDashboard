import { useEffect, useRef } from "react";
import type { Product } from "./types";
import GallerySlider from "./GallerySlider";
import { genreTags, playerTags, durationTags } from "../tags/availableTags";
import { formatCurrencyVND } from "./ProductTable";

type ProductDetailsModalProps = {
    product: Product;
    onClose: () => void;
};

const ProductDetailsModal = ({ product, onClose }: ProductDetailsModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    // Group tags by type for display
    const genres =
        product.tags?.filter((t) => t.type === "genre") || [];
    const players =
        product.tags?.find((t) => t.type === "players") || "";
    const duration =
        product.tags?.find((t) => t.type === "duration") || "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-8 relative flex flex-row items-stretch my-12"
                style={{
                    margin: "auto",
                    position: "relative",
                    top: "unset",
                    left: "unset",
                    transform: "none",
                    maxHeight: "90vh",
                    overflowY: "auto"
                }}
            >
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={onClose}
                    aria-label="Close details"
                >
                    &times;
                </button>
                {/* Gallery Section - left column */}
                <div className="flex flex-col items-center justify-center w-1/3 pr-6 border-r">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Main</div>
                        {(() => {
                            const mainImage = product.images?.find((img) => img.name === "main")?.url;
                            return (
                                <img
                                    src={mainImage || "/default-image.jpg"}
                                    alt={product.product_name}
                                    className="w-32 h-32 object-cover rounded border mb-4"
                                />
                            );
                        })()}

                    </div>
                    <div className="w-full">
                        <div className="text-xs text-gray-500 mb-1">Gallery</div>
                        <div className="flex gap-2 flex-wrap">
                            {product.images
                                .filter((img) => img.name === "detail")
                                .map((imgObj, idx) => (
                                    <img
                                        key={idx}
                                        src={imgObj.url}
                                        alt={`${product.product_name} detail ${idx + 1}`}
                                        className="w-10 h-10 object-cover rounded border"
                                    />
                                ))}
                        </div>
                    </div>
                    {/* Slider Carousel */}
                    <GallerySlider
                        images={[
                            ...product.images.map(imgObj => imgObj.url)
                        ].filter(Boolean)}
                    />
                </div>
                {/* Info Section - right column */}
                <div className="flex-1 pl-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{product.product_name}</h3>
                        <p className="mb-2 text-gray-700">{product.description}</p>
                        <div className="mb-2">
                            <span className="font-semibold">Category:</span> {product.category_ID.name}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Genres:</span>{" "}
                            {genres.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {genres.map((tag, idx) => (
                                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{tag.name}</span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Players:</span>{" "}
                            {players ? (
                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">{players.name}</span>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Duration:</span>{" "}
                            {duration ? (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">{duration.name}</span>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Price:</span>{formatCurrencyVND(product.product_price)}
                            {product.discount > 0 && (
                                <span className="ml-2 text-green-600 font-semibold">
                                    {product.discount}% OFF
                                </span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Stock:</span> {product.stock}
                            <span className="ml-4 font-semibold">Sold:</span> {product.sold}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Status:</span>{" "}
                            <span
                                className={
                                    product.status === "Available"
                                        ? "text-green-600 font-semibold"
                                        : "text-red-500 font-semibold"
                                }
                            >
                                {product.status}
                            </span>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Slug:</span> {product.slug}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Meta Title:</span> {product.meta_title}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Meta Description:</span> {product.meta_description}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Created At:</span>{" "}
                            {new Date(product.created_at).toLocaleString()}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Updated At:</span>{" "}
                            {new Date(product.updated_at).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;