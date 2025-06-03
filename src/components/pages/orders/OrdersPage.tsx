import { useState } from "react";
import { Button } from "../../widgets/button";
import { FaEye } from "react-icons/fa";

const mockOrders = [
	{
		id: "ORD-1001",
		customer: "Alice Johnson",
		date: "2025-06-01",
		status: "Completed",
		total: 120.0,
		items: 3,
	},
	{
		id: "ORD-1002",
		customer: "Bob Smith",
		date: "2025-06-02",
		status: "Pending",
		total: 80.0,
		items: 2,
	},
	{
		id: "ORD-1003",
		customer: "Charlie Lee",
		date: "2025-06-03",
		status: "Cancelled",
		total: 50.0,
		items: 1,
	},
];

const OrdersPage = () => {
	const [orders] = useState(mockOrders);
	const [selectedOrder, setSelectedOrder] = useState<
		typeof mockOrders[0] | null
	>(null);

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
								<th className="py-2 px-2">Status</th>
								<th className="py-2 px-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr key={order.id} className="border-b hover:bg-gray-50">
									<td className="py-2 px-2">{order.id}</td>
									<td className="py-2 px-2">{order.customer}</td>
									<td className="py-2 px-2">{order.date}</td>
									<td className="py-2 px-2">{order.items}</td>
									<td className="py-2 px-2">
										${order.total.toFixed(2)}
									</td>
									<td className="py-2 px-2">
										<span
											className={
												order.status === "Completed"
													? "text-green-600 font-semibold"
													: order.status === "Pending"
													? "text-yellow-600 font-semibold"
													: "text-red-600 font-semibold"
											}
										>
											{order.status}
										</span>
									</td>
									<td className="py-2 px-2 flex gap-2">
										<Button
											size="sm"
											className="bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 px-3 py-1 rounded"
											onClick={() => setSelectedOrder(order)}
										>
											<FaEye className="mr-1" /> View
										</Button>
									</td>
								</tr>
							))}
							{orders.length === 0 && (
								<tr>
									<td
										colSpan={7}
										className="py-6 text-center text-gray-400"
									>
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
					<div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
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
							<span className="font-semibold">Customer:</span>{" "}
							{selectedOrder.customer}
						</div>
						<div className="mb-2 text-sm text-gray-500">
							<span className="font-semibold">Date:</span> {selectedOrder.date}
						</div>
						<div className="mb-2 text-sm text-gray-500">
							<span className="font-semibold">Items:</span> {selectedOrder.items}
						</div>
						<div className="mb-2 text-sm text-gray-500">
							<span className="font-semibold">Total:</span> $
							{selectedOrder.total.toFixed(2)}
						</div>
						<div className="mb-2 text-sm">
							<span
								className={
									selectedOrder.status === "Completed"
										? "inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
										: selectedOrder.status === "Pending"
										? "inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
										: "inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
								}
							>
								{selectedOrder.status}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrdersPage;