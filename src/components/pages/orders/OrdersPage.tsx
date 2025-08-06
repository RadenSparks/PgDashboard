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

const PAGE_SIZE = 10;

const OrdersPage = () => {
    const [updateStatus] = useUpdateStatusMutation();
    const { data: orders = [], isLoading } = useGetOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [productDetail, setProductDetail] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();

    const handleToggleStatus = (orderId: number) => {
        const result = orders.find(order => order.id === orderId);
        if (!result) return;
        const currentIdx = statusCycle.indexOf(result.productStatus);
        const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];
        updateStatus({ ...result, productStatus: nextStatus }); // <-- fix here
    };

    // Search and filter logic
    const filteredOrders = orders.filter(order =>
        (searchTerm === "" ||
            order.id.toString().includes(searchTerm) ||
            order.user.username.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "" || order.productStatus === statusFilter)
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Orders</h2>
            <div className="bg-white rounded-xl shadow p-6">
                {/* Search and Filter Controls */}
                <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center">
                    <input
                        type="text"
                        className="border rounded px-3 py-2 w-full sm:w-64"
                        placeholder="Search by Order ID or Customer"
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <select
                        className="border rounded px-3 py-2 w-full sm:w-48"
                        value={statusFilter}
                        onChange={e => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Statuses</option>
                        {statusCycle.map(status => (
                            <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2 text-gray-500 text-sm">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} orders
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0 z-10">
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
                            {paginatedOrders.map((order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50 group">
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
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedOrders.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-6 text-center text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`px-3 py-1 rounded font-semibold ${
                                    currentPage === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-blue-50 text-blue-700 hover:bg-blue-200"
                                }`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-semibold disabled:opacity-50"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
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