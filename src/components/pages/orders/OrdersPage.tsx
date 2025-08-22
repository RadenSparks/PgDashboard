import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../widgets/button";
import { FaEye, FaEdit, FaExchangeAlt, FaFileInvoice } from "react-icons/fa";
import Loading from "../../../components/widgets/loading";
import { formatCurrencyVND } from "../products/formatCurrencyVND";
import {
    useGetOrdersQuery,
    useUpdateStatusMutation,
    useDeleteOrderMutation,
    useCancelOversoldOrdersMutation, // <-- Add this import
    type Order,
} from "../../../redux/api/ordersApi";
import {
    useMarkOrderAsPaidMutation,
    useCancelOrderMutation,
    useGetPaymentTypesQuery,
} from "../../../redux/api/paymentsApi";
import { useGetDeliveryMethodsQuery } from "../../../redux/api/deliveryApi";
import OrderDetailsModal from "./OrderDetailsModal";
import ProductDetailModal from "./ProductDetailModal";
import EditOrderModal from "./EditOrderModal";
import { getCurrentUserId } from "../../../utils/auth";
import { useToast } from "@chakra-ui/react"; // <-- Use Chakra Toast

const statusCycle = ["pending", "shipped", "delivered", "cancelled"];
const STATUS_LABELS: { [key: string]: string } = {
    pending: "Đang chờ xử lý",
    shipped: "Đã giao hàng",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
    paid: "Paid",
    pending: "Pending",
    pending_on_delivery: "Pending On Delivery",
    refunded: "Refunded",
    success: "Success",
    canceled: "Canceled",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    pending_on_delivery: "bg-blue-100 text-blue-700",
    refunded: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    canceled: "bg-red-100 text-red-700",
};

const PAGE_SIZE = 10;


type SortField = "id" | "total_price" | "order_date";
type SortDirection = "asc" | "desc";

const OrdersPage = () => {
    const [updateStatus, { isLoading: updatingStatus }] = useUpdateStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();
    const { data: orders = [], isLoading, refetch } = useGetOrdersQuery();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<Order | null>(null);
    const [productDetail, setProductDetail] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(""); // <-- Add state
    const [sortField, setSortField] = useState<SortField>("id");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
    const [showOversoldOnly, setShowOversoldOnly] = useState(false);

    // Payment mutations (match backend logic)
    const [markOrderAsPaid, { isLoading: markingPaid }] = useMarkOrderAsPaidMutation();
    const [cancelOrder, { isLoading: canceling }] = useCancelOrderMutation();
    const [cancelOversoldOrders, { isLoading: cancelingOversold }] = useCancelOversoldOrdersMutation(); // <-- Mutation for oversold cancellation

    const navigate = useNavigate();
    const userId = getCurrentUserId() ?? 0;
    const userRole = localStorage.getItem("role") || "user";
    const toast = useToast(); // <-- Chakra Toast

    // Fetch payment types and delivery methods
    const { data: paymentTypes = [] } = useGetPaymentTypesQuery();
    const { data: deliveryMethods = [] } = useGetDeliveryMethodsQuery();

    // Handle status update
    const handleToggleStatus = async (orderId: number) => {
        const order = orders.find(order => order.id === orderId);
        if (!order) return;
        const currentIdx = statusCycle.indexOf(order.productStatus);
        const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];
        await updateStatus({ id: orderId, productStatus: nextStatus });
    };

    // Payment status actions
    const handleMarkPaid = async (order: Order) => {
        try {
            await markOrderAsPaid({ orderId: order.id, userId, userRole }).unwrap();
            toast({
                title: "Order marked as paid.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            refetch();
        } catch (err: unknown) {
            const errorMessage =
                typeof err === "object" && err !== null && "data" in err && typeof (err as { data?: { message?: unknown } }).data?.message === "string"
                    ? (err as { data: { message: string } }).data.message
                    : "Failed to mark as paid.";
            toast({
                title: errorMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleCancel = async (order: Order) => {
        if (order.payment_type?.toLowerCase() === "cash on delivery" || order.payment_type?.toLowerCase() === "on_delivery") {
            toast({
                title: "Canceling COD orders will not trigger a refund.",
                status: "info",
                duration: 4000,
                isClosable: true,
            });
        }
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            await cancelOrder({ orderId: order.id, userId, userRole }).unwrap();
            toast({
                title: "Order cancelled.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            refetch();
        } catch (err: unknown) {
            const errorMessage =
                typeof err === "object" &&
                err !== null &&
                "data" in err &&
                typeof (err as { data?: { message?: unknown } }).data?.message === "string"
                    ? (err as { data: { message: string } }).data.message
                    : "Cancel failed.";
            toast({
                title: errorMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    // Handle invoice viewing (opens PDF in new tab)
    const handleViewInvoice = (orderId: number) => {
        window.open(`${import.meta.env.VITE_BASE_API || "https://pengoo-back-end.vercel.app"}/invoices/${orderId}`, "_blank");
    };

    // Handle order deletion
    const handleDeleteOrder = async (orderId: number) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            await deleteOrder(orderId);
        }
    };

    // Detect oversold orders
    const isOrderOversold = (order: Order) =>
        order.details.some(detail => detail.quantity > (detail.product.quantity_stock ?? 0));

    // Filter for oversold orders if toggled
    const filteredOrders = orders.filter(order =>
        (searchTerm === "" ||
            order.id.toString().includes(searchTerm) ||
            order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "" || order.productStatus === statusFilter) &&
        (paymentStatusFilter === "" || order.payment_status === paymentStatusFilter) &&
        (!showOversoldOnly || isOrderOversold(order))
    );

    // Sorting logic
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        let aValue: number | string = a[sortField];
        let bValue: number | string = b[sortField];

        // Handle date sorting
        if (sortField === "order_date") {
            aValue = aValue ? new Date(aValue).getTime() : 0;
            bValue = bValue ? new Date(bValue).getTime() : 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });

    // Pagination logic
    const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);
    const paginatedOrders = sortedOrders.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    // Sorting UI handler
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Handler for canceling oversold orders
    const handleCancelOversold = async () => {
        if (!window.confirm("Are you sure you want to cancel all oversold orders?")) return;
        try {
            await cancelOversoldOrders().unwrap();
            toast({
                title: "Oversold orders cancelled.",
                description: "All orders that cannot be fulfilled due to insufficient stock have been cancelled and customers notified.",
                status: "success",
                duration: 4000,
                isClosable: true,
            });
            refetch();
        } catch {
            toast({
                title: "Failed to cancel oversold orders.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold mb-8 text-blue-700 tracking-tight">Order Management</h2>
            <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Oversold Controls */}
                <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
                    <Button
                        className="bg-red-600 text-white px-4 py-2 rounded"
                        onClick={handleCancelOversold}
                        disabled={cancelingOversold}
                    >
                        {cancelingOversold ? "Processing..." : "Cancel Oversold Orders"}
                    </Button>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOversoldOnly}
                            onChange={e => setShowOversoldOnly(e.target.checked)}
                        />
                        Show only oversold orders
                    </label>
                </div>
                {/* Search and Filter Controls */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="Search by Order ID or Customer"
                            value={searchTerm}
                            onChange={e => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                    </div>
                    <select
                        className="border rounded-lg px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                    <select
                        className="border rounded-lg px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        value={paymentStatusFilter}
                        onChange={e => {
                            setPaymentStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Payment Statuses</option>
                        {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4 text-gray-500 text-sm">
                    <span className="font-semibold text-blue-700">
                        Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                        {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)}
                    </span>
                    <span> of {filteredOrders.length} orders</span>
                </div>

                <div className="overflow-x-auto w-full rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full text-sm bg-white rounded-lg">
                        <thead>
                            <tr className="text-left border-b bg-blue-50">
                                <th className="py-3 px-3 cursor-pointer font-semibold text-blue-700" onClick={() => handleSort("id")}>
                                    Order ID
                                    {sortField === "id" && (
                                        <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                                    )}
                                </th>
                                <th className="py-3 px-3 font-semibold text-blue-700">Customer</th>
                                <th className="py-3 px-3 cursor-pointer font-semibold text-blue-700" onClick={() => handleSort("order_date")}>
                                    Date
                                    {sortField === "order_date" && (
                                        <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                                    )}
                                </th>
                                <th className="py-3 px-3 font-semibold text-blue-700">Items</th>
                                <th className="py-3 px-3 cursor-pointer font-semibold text-blue-700" onClick={() => handleSort("total_price")}>
                                    Total
                                    {sortField === "total_price" && (
                                        <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                                    )}
                                </th>
                                <th className="py-3 px-3 font-semibold text-blue-700">Payment</th>
                                <th className="py-3 px-3 font-semibold text-blue-700">Delivery</th>
                                <th className="py-3 px-3 font-semibold text-blue-700">Status</th>
                                <th className="py-3 px-3 font-semibold text-blue-700">Payment Status</th>
                                <th className="py-3 px-3 font-semibold text-blue-700">Actions</th>
                                <th className="py-3 px-3 font-semibold text-blue-700">Oversold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.map((order) => {
                                const oversold = isOrderOversold(order);
                                return (
                                    <tr
                                        key={order.id}
                                        className={`border-b hover:bg-blue-50 group transition ${oversold ? "bg-red-50" : ""}`}
                                    >
                                        <td className="py-2 px-3">
                                            <Button
                                                size="sm"
                                                className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded font-semibold transition"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <FaEye className="mr-1" /> {order.id}
                                            </Button>
                                        </td>
                                        <td className="py-2 px-3 font-medium">{order.user?.username}</td>
                                        <td className="py-2 px-3">{order.order_date ? new Date(order.order_date).toLocaleDateString() : "-"}</td>
                                        <td className="py-2 px-3">{order.details?.length ?? 0}</td>
                                        <td className="py-2 px-3 font-semibold text-blue-700">{formatCurrencyVND(+order.total_price)}</td>
                                        <td className="py-2 px-3">{order.payment_type || "-"}</td>
                                        <td className="py-2 px-3">{order.delivery?.name || "-"}</td>
                                        <td className="py-2 px-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    order.productStatus === "delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.productStatus === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : order.productStatus === "shipped"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {STATUS_LABELS[order.productStatus] || order.productStatus}
                                            </span>
                                        </td>
                                        {/* Payment Status column with backend logic actions */}
                                        <td className="py-2 px-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${PAYMENT_STATUS_COLORS[order.payment_status] || "bg-gray-100 text-gray-700"}`}>
                                                    {PAYMENT_STATUS_LABELS[order.payment_status] || order.payment_status}
                                                </span>
                                                {order.payment_status !== "paid" && order.payment_status !== "canceled" && order.payment_status !== "refunded" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 px-2 py-1 rounded transition"
                                                        onClick={() => handleMarkPaid(order)}
                                                        disabled={markingPaid}
                                                    >
                                                        Mark as Paid
                                                    </Button>
                                                )}
                                                {order.payment_status !== "canceled" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 px-2 py-1 rounded transition"
                                                        onClick={() => handleCancel(order)}
                                                        disabled={canceling}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-2 px-3 flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 px-2 py-1 rounded transition"
                                                onClick={() => handleViewInvoice(order.id)}
                                                title="View Invoice"
                                            >
                                                <FaFileInvoice />
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 px-2 py-1 rounded transition"
                                                onClick={() => handleToggleStatus(order.id)}
                                                disabled={updatingStatus}
                                                title="Update Status"
                                            >
                                                <FaExchangeAlt />
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-2 py-1 rounded transition"
                                                onClick={() => setEditOrder(order)}
                                                title="Edit Order"
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 px-2 py-1 rounded transition"
                                                onClick={() => handleDeleteOrder(order.id)}
                                                title="Delete Order"
                                            >
                                                &times;
                                            </Button>
                                        </td>
                                        <td className="py-2 px-3">
                                            {oversold ? (
                                                <span className="px-2 py-1 rounded text-xs font-semibold bg-red-200 text-red-700">
                                                    Oversold
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                                                    OK
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {paginatedOrders.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="py-8 text-center text-gray-400 font-semibold">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 transition"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`px-4 py-2 rounded-lg font-semibold transition ${
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
                            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold disabled:opacity-50 transition"
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
            />
        </div>
    );
};

export default OrdersPage;