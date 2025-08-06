import { Button } from "../../widgets/button";
import { FaArrowRight } from "react-icons/fa";
import { formatCurrencyVND } from "../products/formatCurrencyVND";
import { type Order } from "../../../redux/api/ordersApi";

interface Props {
    order: Order | null;
    onClose: () => void;
    onProductDetail: (id: number) => void;
    navigate: (path: string) => void;
}

const OrderDetailsModal: React.FC<Props> = ({ order, onClose, onProductDetail, navigate }) => {
    if (!order) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h3 className="text-xl font-bold mb-2">Order Details</h3>
                <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Order ID:</span> {order.id}
                </div>
                <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Customer:</span> {order.user.username}
                </div>
                <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Date:</span> {order.order_date}
                </div>
                <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Items:</span> {order.details.length}
                </div>
                <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Total:</span>{formatCurrencyVND(+order.total_price)}
                </div>
                <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Payment Type:</span> {order.payment_type || "-"}
                </div>
                <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Delivery Method:</span> {order.delivery.name || "-"}
                </div>
                <div className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Tracking Number:</span> {"-"}
                </div>
                <div className="mb-2 text-sm">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {order.productStatus}
                    </span>
                </div>
                <div className="mb-4 mt-4">
                    <span className="font-semibold block mb-2">Products in Order:</span>
                    <table className="w-full text-xs border">
                        <thead>
                            <tr className="border-b">
                                <th className="py-1 px-2 text-left">Product</th>
                                <th className="py-1 px-2 text-left">Image</th>
                                <th className="py-1 px-2 text-left">Quantity</th>
                                <th className="py-1 px-2 text-left">Price</th>
                                <th className="py-1 px-2 text-left">Subtotal</th>
                                <th className="py-1 px-2 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.details.map((prod, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="py-1 px-2">{prod.product.product_name}</td>
                                    <td className="py-1 px-2">
                                        {prod.product.images?.[0] ? (
                                            <img
                                                src={
                                                    typeof prod.product.images[0] === "string"
                                                        ? prod.product.images[0]
                                                        : (typeof prod.product.images[0] === "object" && prod.product.images[0] !== null && "url" in prod.product.images[0])
                                                            ? (prod.product.images[0] as { url: string }).url
                                                            : ""
                                                }
                                                alt={prod.product.product_name}
                                                className="w-10 h-10 object-cover rounded border"
                                            />
                                        ) : (
                                            <span>-</span>
                                        )}
                                    </td>
                                    <td className="py-1 px-2">{prod.quantity}</td>
                                    <td className="py-1 px-2">{formatCurrencyVND(+prod.price)}</td>
                                    <td className="py-1 px-2">{formatCurrencyVND(prod.price * prod.quantity)}</td>
                                    <td className="py-1 px-2">
                                        <Button
                                            size="sm"
                                            className="bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 px-2 py-1 rounded flex items-center gap-1"
                                            onClick={() => onProductDetail(prod.product.id)}
                                        >
                                            <FaArrowRight />
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        className="bg-gray-200 px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => navigate(`/orders/${order.id}/invoice`)}
                    >
                        View Invoice
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;