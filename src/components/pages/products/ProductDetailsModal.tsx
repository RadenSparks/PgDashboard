import { useRef } from "react";
import type { Product, Tag, NamedImage } from "./types";
import GallerySlider from "./GallerySlider";
import { formatCurrencyVND } from "./formatCurrencyVND";

type ProductDetailsModalProps = {
    product: Product;
    onClose: () => void;
};

const ProductDetailsModal = ({ product, onClose }: ProductDetailsModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Group tags by type for display
    const tags = (product.tags as Tag[]) || [];
    const genres = tags.filter((t) => t.type === "genre");
    const players = tags.find((t) => t.type === "players");
    const duration = tags.find((t) => t.type === "duration");

    // Cast images for type safety
    const images = (product.images as NamedImage[]) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-0 relative flex flex-col md:flex-row items-stretch my-12"
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
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                    aria-label="Close details"
                >
                    &times;
                </button>
                {/* Gallery Section - left column */}
                <div className="flex flex-col items-center justify-center w-full md:w-1/3 p-8 border-r bg-gradient-to-br from-blue-50 to-white">
                    <div className="mb-6 w-full">
                        <div className="text-xs text-gray-500 mb-1">Main Image</div>
                        {(() => {
                            const mainImage = images.find((img) => img.name === "main")?.url;
                            return (
                                <img
                                    src={mainImage || "/default-image.jpg"}
                                    alt={product.product_name}
                                    className="w-32 h-32 object-cover rounded-xl border shadow mb-4 mx-auto"
                                />
                            );
                        })()}
                    </div>
                    <div className="mb-6 w-full">
                        <div className="text-xs text-gray-500 mb-1">Gallery</div>
                        <div className="flex gap-2 flex-wrap">
                            {images
                                .filter((img) => img.name === "detail")
                                .map((imgObj, idx) => (
                                    <img
                                        key={idx}
                                        src={imgObj.url}
                                        alt={`${product.product_name} detail ${idx + 1}`}
                                        className="w-12 h-12 object-cover rounded border shadow"
                                    />
                                ))}
                        </div>
                    </div>
                    {/* Slider Carousel */}
                    <div className="w-full">
                        <GallerySlider
                            images={images.map(imgObj => imgObj.url).filter(Boolean)}
                        />
                    </div>
                </div>
                {/* Info Section - right column */}
                <div className="flex-1 p-8 flex flex-col justify-between bg-white">
                    <div>
                        <h3 className="text-3xl font-bold mb-4 text-blue-700">{product.product_name}</h3>
                        <p className="mb-4 text-gray-700 text-base">{product.description}</p>
                        <div className="mb-3">
                            <span className="font-semibold text-gray-600">Category:</span> {product.category_ID?.name}
                        </div>
                        <div className="mb-3">
                            <span className="font-semibold text-gray-600">Genres:</span>{" "}
                            {genres.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {genres.map((tag, idx) => (
                                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">{tag.name}</span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                        </div>
                        <div className="mb-3 flex gap-4">
                            <div>
                                <span className="font-semibold text-gray-600">Players:</span>{" "}
                                {players ? (
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">{players.name}</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </div>
                            <div>
                                <span className="font-semibold text-gray-600">Duration:</span>{" "}
                                {duration ? (
                                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">{duration.name}</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </div>
                        </div>
                        <div className="mb-3">
                            <span className="font-semibold text-gray-600">Price:</span>{" "}
                            <span className="text-blue-700 font-bold">{formatCurrencyVND(product.product_price)}</span>
                            {product.discount > 0 && (
                                <span className="ml-2 text-green-600 font-semibold">
                                    {product.discount}% OFF
                                </span>
                            )}
                        </div>
                        <div className="mb-3 flex gap-4">
                            <span className="font-semibold text-gray-600">Stock:</span> {product.quantity_stock}
                            <span className="font-semibold text-gray-600">Sold:</span> {product.quantity_sold}
                        </div>
                        <div className="mb-3">
                            <span className="font-semibold text-gray-600">Status:</span>{" "}
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
                        <div className="mb-3">
                            <span className="font-semibold text-gray-600">Slug:</span> {product.slug}
                        </div>
                        <div className="mb-3">
                            <span className="font-semibold text-gray-600">Meta Title:</span> {product.meta_title}
                        </div>
                        <div className="mb-3">
                            <span className="font-semibold text-gray-600">Meta Description:</span> {product.meta_description}
                        </div>
                        {/* Remove created_at and updated_at if not in Product type */}
                        <div className="mb-3">
                            <span className="font-semibold text-gray-600">Publisher:</span>{" "}
                            {product.publisherID?.name || "-"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;