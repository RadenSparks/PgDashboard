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
    const age = tags.find((t) => t.type === "age");

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
                <div className="flex flex-col gap-6 items-center justify-center w-full md:w-1/3 p-8 border-r bg-gradient-to-br from-blue-50 to-white">
                    {/* Gallery Slider Card */}
                    <div className="w-full">
                        <div className="bg-white rounded-xl shadow border border-blue-100 p-4">
                            <div className="text-sm font-semibold text-blue-700 mb-2 text-center">
                                Gallery
                            </div>
                            <GallerySlider
                                images={images.map(imgObj => imgObj.url).filter(Boolean)}
                            />
                        </div>
                    </div>
                </div>
                {/* Info Section - right column */}
                <div className="flex-1 p-8 flex flex-col justify-between bg-white">
                    <div>
                        <h3 className="text-3xl font-bold mb-2 text-blue-700">{product.product_name}</h3>
                        <div className="mb-4 text-gray-700 text-base">{product.description}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Category</div>
                                <div className="text-blue-700 font-medium">{product.category_ID?.name || "-"}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Publisher</div>
                                <div className="text-blue-700 font-medium">{product.publisherID?.name || "-"}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Slug</div>
                                <div className="text-gray-700">{product.slug}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Status</div>
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
                        </div>
                        <div className="mb-6">
                            <div className="font-semibold text-gray-600 mb-1">Tags</div>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    Genre: {genres.length > 0 ? genres.map(g => g.name).join(", ") : "-"}
                                </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    Players: {players?.name || "-"}
                                </span>
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    Duration: {duration?.name || "-"}
                                </span>
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                                    Age: {age?.name || "-"}
                                </span>
                            </div>
                        </div>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Price</div>
                                <span className="text-blue-700 font-bold text-lg">{formatCurrencyVND(product.product_price)}</span>
                                {product.discount > 0 && (
                                    <span className="ml-2 text-green-600 font-semibold">
                                        {product.discount}% OFF
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Stock / Sold</div>
                                <span className="text-gray-700 font-medium">
                                    Stock: {product.quantity_stock} &nbsp;|&nbsp; Sold: {product.quantity_sold}
                                </span>
                            </div>
                        </div>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Meta Title</div>
                                <div className="text-gray-700">{product.meta_title || "-"}</div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-600 mb-1">Meta Description</div>
                                <div className="text-gray-700">{product.meta_description || "-"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;