import type { Product } from "./types";
import { Button } from "../../widgets/button";
import { formatCurrencyVND } from "./formatCurrencyVND";
import Pagination from "./Pagination";
import React from "react";

type ProductTableProps = {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onShowDetails: (product: Product) => void;
    onOpenCms: (productId: number) => void;
};

const PAGE_SIZE = 10;

const ProductTable = ({
    products,
    onEdit,
    onDelete,
    onShowDetails,
    onOpenCms,
}: ProductTableProps) => {
    const [currentPage, setCurrentPage] = React.useState(1);

    const totalPages = Math.ceil(products.length / PAGE_SIZE);
    const paginatedProducts = products.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm align-middle">
                    <thead>
                        <tr className="text-left border-b bg-blue-50">
                            <th className="py-4 px-3 font-semibold text-gray-700">Image</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Name</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Description</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Category</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Genres</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Players</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Duration</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Price</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Discount</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Stock</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Sold</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Status</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedProducts.map((prod) => {
                            // Cast images and tags to the correct types
                            const images = (prod.images as { name?: string; url?: string }[]) || [];
                            const tags = (prod.tags as { name?: string; type?: string }[]) || [];

                            const mainImage = images.find((img) => img?.name === "main")?.url;
                            const genres = tags.filter((t) => t.type === "genre");
                            const players = tags.find((t) => t.type === "players");
                            const duration = tags.find((t) => t.type === "duration");

                            return (
                                <tr key={prod.id} className="border-b hover:bg-blue-50 align-middle transition">
                                    <td className="py-4 px-3 align-middle">
                                        <img
                                            src={mainImage || "/default-image.jpg"}
                                            alt={prod.product_name}
                                            className="w-16 h-16 object-cover rounded-xl shadow border border-gray-200"
                                        />
                                    </td>
                                    <td className="py-4 px-3 font-semibold align-middle text-gray-900">{prod.product_name}</td>
                                    <td className="py-4 px-3 max-w-xs align-middle">
                                        <span title={prod.description} className="block truncate text-gray-700">
                                            {prod.description}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 align-middle text-gray-700">{prod.category_ID.name}</td>
                                    <td className="py-4 px-3 align-middle">
                                        {genres.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {genres.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-3 align-middle">
                                        {players ? (
                                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                                                {players.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-3 align-middle">
                                        {duration ? (
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                                                {duration.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-3 align-middle font-semibold text-blue-700">{formatCurrencyVND(+(prod.product_price))}</td>
                                    <td className="py-4 px-3 align-middle">
                                        {prod.discount > 0 ? (
                                            <span className="text-green-600 font-semibold">
                                                {prod.discount}% OFF
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-3 align-middle">{prod.quantity_stock}</td>
                                    <td className="py-4 px-3 align-middle">{prod.quantity_sold}</td>
                                    <td className="py-4 px-3 align-middle">
                                        <span
                                            className={
                                                prod.status === "Available"
                                                    ? "text-green-600 font-semibold"
                                                    : "text-red-500 font-semibold"
                                            }
                                        >
                                            {prod.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 align-middle">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <Button
                                                size="sm"
                                                className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded-lg font-semibold"
                                                onClick={() => onShowDetails(prod)}
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 px-3 py-1 rounded-lg font-semibold"
                                                onClick={() => onEdit(prod)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 px-3 py-1 rounded-lg font-semibold"
                                                onClick={() => onOpenCms(prod.id)}
                                            >
                                                CMS
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 px-3 py-1 rounded-lg font-semibold"
                                                onClick={() => onDelete(prod.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {paginatedProducts.length === 0 && (
                            <tr>
                                <td colSpan={13} className="py-8 text-center text-gray-400">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default ProductTable;