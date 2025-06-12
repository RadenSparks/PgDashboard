import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaEye, FaEdit, FaSave, FaTimes, FaExchangeAlt } from "react-icons/fa";
import mockOrders from "./mockOrders";

// Extend Order type to include products array
type OrderProduct = {
    name: string;
    quantity: number;
    price: number;
};

type Order = {
    id: string;
    customer: string;
    date: string;
    status: string;
    total: number;
    items: number;
    paymentType: string;
    deliveryMethod: string;
    trackingNumber: string;
    products: OrderProduct[];
};

const paymentTypes = [
    "Credit Card",
    "Bank Transfer",
    "Cash on Delivery",
    "E-Wallet",
];
const deliveryMethods = ["Standard Shipping", "Express Shipping", "Pickup"];
const statusCycle = ["Pending", "Ongoing", "Completed", "Cancelled"];

// Example mockOrders with products (update your mockOrders accordingly)
const ordersWithProducts: Order[] = mockOrders.map((order: any, idx: number) => ({
    ...order,
    products: order.products || [
        { name: "UNO", quantity: 2, price: 19.99 },
        { name: "7 Wonders", quantity: 1, price: 59.99 },
    ].slice(0, (idx % 2) + 1), // Just for demo, alternate between 1 and 2 products
}));

const OrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>(ordersWithProducts);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editOrder, setEditOrder] = useState<Order | null>(null);

    const handleSaveEdit = () => {
        if (editOrder) {
            setOrders(
                orders.map((o) => (o.id === editOrder.id ? editOrder : o))
            );
            setEditOrder(null);
            setSelectedOrder(editOrder);
        }
    };

    const handleChange = <K extends keyof Order>(field: K, value: Order[K]) => {
        if (!editOrder) return;
        setEditOrder({ ...editOrder, [field]: value });
    };

    const handleToggleStatus = (orderId: string) => {
        setOrders((prev) =>
            prev.map((order) => {
                if (order.id !== orderId) return order;
                const currentIdx = statusCycle.indexOf(order.status);
                const nextStatus = statusCycle[(currentIdx + 1) % statusCycle.length];
                return { ...order, status: nextStatus };
            })
        );
    };

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
                                    <td className="py-2 px-2">{order.customer}</td>
                                    <td className="py-2 px-2">{order.date}</td>
                                    <td className="py-2 px-2">{order.items}</td>
                                    <td className="py-2 px-2">${order.total.toFixed(2)}</td>
                                    <td className="py-2 px-2">{order.paymentType || "-"}</td>
                                    <td className="py-2 px-2">{order.deliveryMethod || "-"}</td>
                                    <td className="py-2 px-2 flex items-center gap-2">
                                        <span
                                            className={
                                                order.status === "Completed"
                                                    ? "text-green-600 font-semibold"
                                                    : order.status === "Pending"
                                                    ? "text-yellow-600 font-semibold"
                                                    : order.status === "Ongoing"
                                                    ? "text-blue-600 font-semibold"
                                                    : "text-red-600 font-semibold"
                                            }
                                        >
                                            {order.status}
                                        </span>
                                        <Button
                                            size="xs"
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

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                            onClick={() => setSelectedOrder(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold mb-2">Order Details</h3>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Order ID:</span> {selectedOrder.id}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Customer:</span> {selectedOrder.customer}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Date:</span> {selectedOrder.date}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Items:</span> {selectedOrder.items}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Total:</span> ${selectedOrder.total.toFixed(2)}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Payment Type:</span> {selectedOrder.paymentType || "-"}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Delivery Method:</span> {selectedOrder.deliveryMethod || "-"}
                        </div>
                        <div className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Tracking Number:</span> {selectedOrder.trackingNumber || "-"}
                        </div>
                        <div className="mb-2 text-sm">
                            <span
                                className={
                                    selectedOrder.status === "Completed"
                                        ? "inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                        : selectedOrder.status === "Pending"
                                        ? "inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                                        : selectedOrder.status === "Ongoing"
                                        ? "inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                                        : "inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                                }
                            >
                                {selectedOrder.status}
                            </span>
                        </div>
                        <div className="mb-4 mt-4">
                            <span className="font-semibold block mb-2">Products in Order:</span>
                            <table className="w-full text-xs border">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-1 px-2 text-left">Product</th>
                                        <th className="py-1 px-2 text-left">Quantity</th>
                                        <th className="py-1 px-2 text-left">Price</th>
                                        <th className="py-1 px-2 text-left">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.products.map((prod, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="py-1 px-2">{prod.name}</td>
                                            <td className="py-1 px-2">{prod.quantity}</td>
                                            <td className="py-1 px-2">${prod.price.toFixed(2)}</td>
                                            <td className="py-1 px-2">${(prod.price * prod.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Order Modal */}
            {editOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                            onClick={() => setEditOrder(null)}
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-xl font-bold mb-4">Edit Order</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveEdit();
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Payment Type
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={editOrder.paymentType || ""}
                                    onChange={(e) =>
                                        handleChange("paymentType", e.target.value)
                                    }
                                >
                                    <option value="">Select payment type</option>
                                    {paymentTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Delivery Method
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={editOrder.deliveryMethod || ""}
                                    onChange={(e) =>
                                        handleChange("deliveryMethod", e.target.value)
                                    }
                                >
                                    <option value="">Select delivery method</option>
                                    {deliveryMethods.map((method) => (
                                        <option key={method} value={method}>
                                            {method}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Tracking Number
                                </label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    type="text"
                                    value={editOrder.trackingNumber || ""}
                                    onChange={(e) =>
                                        handleChange("trackingNumber", e.target.value)
                                    }
                                    placeholder="Tracking Number"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Status
                                </label>
                                <input
                                    className="w-full border rounded px-3 py-2 bg-gray-100"
                                    value={editOrder.status}
                                    disabled
                                    readOnly
                                />
                                <span className="text-xs text-gray-400">Use the table button to change status</span>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    className="bg-gray-200 px-6 py-2 rounded"
                                    type="button"
                                    onClick={() => setEditOrder(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                    type="submit"
                                >
                                    <FaSave className="mr-1" /> Save
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;