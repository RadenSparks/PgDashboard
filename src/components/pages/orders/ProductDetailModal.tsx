import React, { useEffect, useRef } from "react";
import { Button } from "../../widgets/button";
import { useGetProductByIdQuery } from "../../../redux/api/productsApi";

interface ProductDetailModalProps {
    productId: number | null;
    onClose: () => void;
    navigate: (path: string) => void;
    orderId?: number; // <-- Add this if needed
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ productId, onClose, navigate, orderId }) => {
    const { data: product, isLoading } = useGetProductByIdQuery(productId ?? 0, { skip: productId === null });
    const modalRef = useRef<HTMLDivElement>(null);

    // Trap focus and close on ESC
    useEffect(() => {
        if (modalRef.current) modalRef.current.focus();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (productId === null || isLoading || !product) return null;

    const mainImage =
        product.images && product.images.length > 0
            ? typeof product.images[0] === "string"
                ? product.images[0]
                : (product.images[0] as { url: string })?.url || ""
            : "";

    // Helper to open invoice
    const handleViewInvoice = () => {
        // Use orderId if available, otherwise fallback to productId
        const invoiceId = orderId ?? productId;
        window.open(
            `${import.meta.env.VITE_BASE_API || "https://pengoo-back-end.vercel.app"}/invoices/${invoiceId}`,
            "_blank"
        );
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in"
                tabIndex={-1}
                ref={modalRef}
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                        <img
                            src={mainImage}
                            alt={product.product_name}
                            className="w-32 h-32 object-cover rounded border mb-4 cursor-pointer hover:scale-105 transition"
                        />
                        <div className="flex gap-2 flex-wrap">
                            {product.images?.map((imgObj: string | { url: string }, idx: number) => (
                                <img
                                    key={idx}
                                    src={typeof imgObj === "string" ? imgObj : imgObj.url}
                                    alt={`${product.product_name} ${idx + 1}`}
                                    className="w-10 h-10 object-cover rounded border cursor-pointer hover:ring-2 hover:ring-blue-400"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{product.product_name}</h3>
                        <p className="mb-2 text-gray-700">{(product as { description?: string }).description ?? "No description"}</p>
                        <div className="mb-2">
                            <span className="font-semibold">Price:</span> ${product.product_price.toFixed(2)}
                            {((product as { discount?: number }).discount ?? 0) > 0 && (
                                <span className="ml-2 text-green-600 font-semibold">
                                    {(product as { discount?: number }).discount}% OFF
                                </span>
                            )}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Stock:</span> {product.quantity_stock}
                            <span className="ml-4 font-semibold">Sold:</span> {(product as { quantity_sold?: number }).quantity_sold ?? 0}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Status:</span>{" "}
                            <span
                                className={
                                    (product as { status?: string }).status === "Available"
                                        ? "text-green-600 font-semibold"
                                        : "text-red-500 font-semibold"
                                }
                            >
                                {(product as { status?: string }).status ?? "Unknown"}
                            </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                onClick={() => {
                                    onClose();
                                    navigate(`/products/${product.id}`);
                                }}
                            >
                                Go to Product Detail Page
                            </Button>
                            <Button
                                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                                onClick={handleViewInvoice}
                            >
                                View Invoice
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
