import type { Product } from "./types";
import { Button } from "../../widgets/button";
export function formatCurrencyVND(amount: number): string {
    return amount.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
}
type ProductTableProps = {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onShowDetails: (product: Product) => void;
    onOpenCms: (productId: number) => void;
};

const ProductTable = ({
    products,
    onEdit,
    onDelete,
    onShowDetails,
    onOpenCms,
}: ProductTableProps) => (
    <div className="bg-white rounded-xl shadow p-6">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm align-middle">
                <thead>
                    <tr className="text-left border-b">
                        <th className="py-3 px-2">Image</th>
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Description</th>
                        <th className="py-3 px-2">Category</th>
                        <th className="py-3 px-2">Genres</th>
                        <th className="py-3 px-2">Players</th>
                        <th className="py-3 px-2">Duration</th>
                        <th className="py-3 px-2">Price</th>
                        <th className="py-3 px-2">Discount</th>
                        <th className="py-3 px-2">Stock</th>
                        <th className="py-3 px-2">Sold</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => {
                        // Group tags by type
                        const genres =
                            prod.tags?.filter((t) => t.type === "genre") || [];
                        const players =
                            prod.tags?.find((t) => t.type === "players") || "";
                        const duration =
                            prod.tags?.find((t) => t.type === "duration") || "";
                        return (
                            <tr key={prod.id} className="border-b hover:bg-gray-50 align-middle">
                                <td className="py-3 px-2 align-middle">
                                    {(() => {
                                        const mainImage = prod.images?.find((img) => img.name === "main")?.url;
                                        return (
                                            <img
                                                src={mainImage || "/default-image.jpg"}
                                                alt={prod.product_name}
                                                className="w-14 h-14 object-cover rounded shadow border"
                                            />
                                        );
                                    })()}
                                </td>
                                <td className="py-3 px-2 font-semibold align-middle">{prod.product_name}</td>
                                <td className="py-3 px-2 max-w-xs align-middle">
                                    <span title={prod.description} className="block truncate">
                                        {prod.description}
                                    </span>
                                </td>
                                <td className="py-3 px-2 align-middle">{prod.category_ID.name}</td>
                                <td className="py-3 px-2 align-middle">
                                    {genres.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {genres.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs whitespace-nowrap"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="py-3 px-2 align-middle">
                                    {players ? (
                                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                                            {players.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="py-3 px-2 align-middle">
                                    {duration ? (
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                                            {duration.name}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="py-3 px-2 align-middle">{formatCurrencyVND(+(prod.product_price))}</td>
                                <td className="py-3 px-2 align-middle">
                                    {prod.discount > 0 ? (
                                        <span className="text-green-600 font-semibold">
                                            {prod.discount}% OFF
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="py-3 px-2 align-middle">{prod.quantity_stock}</td>
                                <td className="py-3 px-2 align-middle">{prod.quantity_sold}</td>
                                <td className="py-3 px-2 align-middle">
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
                                <td className="py-3 px-2 align-middle">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <Button
                                            size="sm"
                                            className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded"
                                            onClick={() => onShowDetails(prod)}
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 px-3 py-1 rounded"
                                            onClick={() => onEdit(prod)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 px-3 py-1 rounded"
                                            onClick={() => onOpenCms(prod.id)}
                                        >
                                            Manage Details Page
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 px-3 py-1 rounded"
                                            onClick={() => onDelete(prod.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={13} className="py-8 text-center text-gray-400">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default ProductTable;