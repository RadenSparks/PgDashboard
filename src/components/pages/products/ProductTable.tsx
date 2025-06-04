import type { Product } from "./types";
import { Button } from "../../widgets/button";

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
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left border-b">
                        <th className="py-2 px-2">Image</th>
                        <th className="py-2 px-2">Name</th>
                        <th className="py-2 px-2">Description</th>
                        <th className="py-2 px-2">Category</th>
                        <th className="py-2 px-2">Tags</th>
                        <th className="py-2 px-2">Price</th>
                        <th className="py-2 px-2">Discount</th>
                        <th className="py-2 px-2">Stock</th>
                        <th className="py-2 px-2">Sold</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-2">
                                <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-14 h-14 object-cover rounded shadow"
                                />
                            </td>
                            <td className="py-2 px-2 font-semibold">{prod.name}</td>
                            <td className="py-2 px-2 max-w-xs truncate" title={prod.description}>
                                {prod.description}
                            </td>
                            <td className="py-2 px-2">{prod.category}</td>
                            <td className="py-2 px-2">
                                {prod.tags && prod.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {prod.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">{tag}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            <td className="py-2 px-2">${prod.price.toFixed(2)}</td>
                            <td className="py-2 px-2">
                                {prod.discount > 0 ? (
                                    <span className="text-green-600 font-semibold">{prod.discount}% OFF</span>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </td>
                            <td className="py-2 px-2">{prod.stock}</td>
                            <td className="py-2 px-2">{prod.sold}</td>
                            <td className="py-2 px-2">
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
                            <td className="py-2 px-2 flex gap-2">
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
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={11} className="py-6 text-center text-gray-400">
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