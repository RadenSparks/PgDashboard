import type { Product } from "./types";
import { Button } from "../../widgets/button";
import { formatCurrencyVND } from "./formatCurrencyVND";
import Pagination from "./Pagination";
type ProductTableProps = {
    products: Product[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    onShowDetails: (product: Product) => void;
    onOpenCms: (productId: number) => void;
};

const ProductTable = ({
    products,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    onShowDetails,
    onOpenCms,
}: ProductTableProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="overflow-x-auto">
                <table className="min-w-[1400px] text-sm align-middle">
                    <thead>
                        <tr className="text-left border-b bg-blue-50">
                            <th className="py-4 px-3 font-semibold text-gray-700">Ảnh</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Tên sản phẩm</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Mô tả</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Danh mục</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Thể loại</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Số người chơi</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Thời lượng</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Độ tuổi</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Giá</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Giảm giá</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Tồn kho</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Đã bán</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Trạng thái</th>
                            <th className="py-4 px-3 font-semibold text-gray-700">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((prod) => {
                            // Cast images and tags to the correct types
                            const images = (prod.images as { name?: string; url?: string }[]) || [];
                            const tags = (prod.tags as {
                                deletedAt?: Date | string | null; name?: string; type?: string 
}[]) || [];

                            const mainImage = images.find((img) => img?.name === "main")?.url;
                            const genres = tags.filter((t) => t.type === "genre");
                            const players = tags.find((t) => t.type === "players");
                            const duration = tags.find((t) => t.type === "duration");
                            const age = tags.find((t) => t.type === "age");

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
                                    <td className="py-4 px-3 align-middle text-gray-700">
                                        {prod.category_ID
                                            ? (
                                                <span>
                                                    {prod.category_ID.name}
                                                    {(prod.category_ID as { deletedAt?: Date | string | null })?.deletedAt && (
                                                        <span className="ml-2 text-xs text-red-500">(Đã xóa)</span>
                                                    )}
                                                </span>
                                            )
                                            : <span className="text-gray-400">-</span>
                                        }
                                    </td>
                                    <td className="py-4 px-3 align-middle">
                                        {genres.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {genres.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${tag.deletedAt ? 'line-through text-red-500' : ''}`}
                                                    >
                                                        {tag.name}
                                                        {tag.deletedAt && <span className="ml-1">(Đã xóa)</span>}
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
                                    <td className="py-4 px-3 align-middle">
                                        {age ? (
                                            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs whitespace-nowrap">
                                                {age.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-3 align-middle font-semibold text-blue-700">
                                        {formatCurrencyVND(+(prod.product_price))}
                                    </td>
                                    <td className="py-4 px-3 align-middle">
                                        {prod.discount > 0 ? (
                                            <span className="text-green-600 font-semibold">
                                                {prod.discount}% GIẢM
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
                                                    : prod.status === "Unavailable"
                                                    ? "text-red-500 font-semibold"
                                                    : prod.status === "Coming Soon"
                                                    ? "text-yellow-500 font-semibold"
                                                    : prod.status === "Discontinued"
                                                    ? "text-gray-500 font-semibold"
                                                    : "text-blue-600 font-semibold"
                                            }
                                        >
                                            {prod.status === "Available"
                                                ? "Còn hàng"
                                                : prod.status === "Unavailable"
                                                ? "Hết hàng"
                                                : prod.status === "Coming Soon"
                                                ? "Sắp ra mắt"
                                                : prod.status === "Discontinued"
                                                ? "Ngừng kinh doanh"
                                                : prod.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3 align-middle">
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <Button
                                                size="sm"
                                                className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded-lg font-semibold"
                                                onClick={() => onShowDetails(prod)}
                                            >
                                                Chi tiết
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 px-3 py-1 rounded-lg font-semibold"
                                                onClick={() => onEdit(prod)}
                                            >
                                                Sửa
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
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={14} className="py-8 text-center text-gray-400">
                                    Không tìm thấy sản phẩm nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default ProductTable;