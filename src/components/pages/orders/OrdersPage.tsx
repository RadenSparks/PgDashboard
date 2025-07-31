import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../widgets/button";
import { FaEye, FaEdit, FaExchangeAlt } from "react-icons/fa";
import Loading from "../../../components/widgets/loading";
import { formatCurrencyVND } from "../products/formatCurrencyVND";
import { useGetOrdersQuery, useUpdateStatusMutation } from "../../../redux/api/ordersApi";
import { type Order } from "../../../redux/api/ordersApi";
import OrderDetailsModal from "./OrderDetailsModal";
import ProductDetailModal from "./ProductDetailModal";
import EditOrderModal from "./EditOrderModal";

const paymentTypes = [
    "Credit Card",
    "Bank Transfer",
    "Cash on Delivery",
    "E-Wallet",
];
const deliveryMethods = ["Standard Shipping", "Express Shipping", "Pickup"];
const statusCycle = ["pending", "shipped", "delivered", "cancelled"];
const STATUS_LABELS: { [key: string]: string } = {
    pending: "Đang chờ xử lý",
    shipped: "Đã giao hàng",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
};

const OrdersPage = () => {
    const [updateStatus] = useUpdateStatusMutation();
    const { data: orders = [], isLoading } = useGetOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [productDetail, setProductDetail] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleToggleStatus = (orderId: number) => {
        const result = orders.find(order => order.id === orderId);
        if (!result) return;
        const currentIdx = statusCycle.indexOf(result.productStatus);
        const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];
        updateStatus({ ...result, productStatus: nextStatus }); // <-- fix here
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            <div className="bg-white rounded-xl shadow p-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="py-2 px-2">Order ID</th>
                                <th className="py-2 px-2">Customer</th>
                                <th className="py-2 px-2">Date</th>
                                <th className="py-2 px-2">Items</th>
                                <th className="py-2 px-2">Total</th>
                                <th className="py-2 px-2">Payment</th>
                                <th className="py-2 px-2">Delivery</th>
                                <th className="py-2 px-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-2">
                                        <Button
                                            size="sm"
                                            className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <FaEye className="mr-1" /> {order.id}
                                        </Button>
                                    </td>
                                    <td className="py-2 px-2">{order.user.username}</td>
                                    <td className="py-2 px-2">{order.order_date}</td>
                                    <td className="py-2 px-2">{order.details.length}</td>
                                    <td className="py-2 px-2">{formatCurrencyVND(+order.total_price)}</td>
                                    <td className="py-2 px-2">{order.payment_type || "-"}</td>
                                    <td className="py-2 px-2">{order.delivery.name || "-"}</td>
                                    <td className="py-2 px-2 flex items-center gap-2">
                                        <span
                                            className={
                                                order.productStatus === "delivered"
                                                    ? "text-green-600 font-semibold"
                                                    : order.productStatus === "pending"
                                                        ? "text-yellow-600 font-semibold"
                                                        : order.productStatus === "shipped"
                                                            ? "text-blue-600 font-semibold"
                                                            : "text-red-600 font-semibold"
                                            }
                                        >
                                            {STATUS_LABELS[order.productStatus] || order.productStatus}
                                        </span>
                                        <Button
                                            size="sm"
                                            title="Toggle Status"
                                            className="bg-gray-100 border border-gray-300 hover:bg-gray-200 px-2 py-1 rounded"
                                            onClick={() => handleToggleStatus(order.id)}
                                        >
                                            <FaExchangeAlt />
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 px-3 py-1 rounded"
                                            onClick={() => setEditOrder(order)}
                                        >
                                            <FaEdit className="mr-1" /> Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-6 text-center text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onProductDetail={setProductDetail}
                navigate={navigate}
            />

            <ProductDetailModal
                productId={productDetail}
                onClose={() => setProductDetail(null)}
                navigate={navigate}
            />

            <EditOrderModal
                order={editOrder}
                onClose={() => setEditOrder(null)}
                paymentTypes={paymentTypes}
                deliveryMethods={deliveryMethods}
                // Add onSave if you want to persist changes
            />
        </div>
    );
};

export default OrdersPage;