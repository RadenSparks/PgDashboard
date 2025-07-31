import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Order } from "../../../redux/api/ordersApi"; // type-only import

type OrdersTableProps = {
  orders: Order[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#fbbf24",
  shipped: "#3b82f6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
  completed: "#a855f7",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  completed: "Completed",
};

const getStatusData = (orders: Order[]) => {
  const statusCount: Record<string, number> = {};
  orders.forEach((order) => {
    const status = order.productStatus;
    statusCount[status] = (statusCount[status] || 0) + 1;
  });
  return Object.entries(statusCount).map(([key, value]) => ({
    name: STATUS_LABELS[key] || key,
    value,
    color: STATUS_COLORS[key] || "#888",
  }));
};

function exportOrdersToCSV(orders: Order[]) {
  const headers = ["Order ID", "Customer", "Status", "Total"];
  const rows = orders.map((order) => [
    order.id,
    order.user?.full_name || order.user?.username || "Unknown",
    STATUS_LABELS[order.productStatus] || order.productStatus || "-",
    Number(order.total_price).toFixed(2),
  ]);
  const csvContent =
    [headers, ...rows]
      .map((row) => row.map(String).map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
      .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "orders.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Add a type for the label props
interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  name: string;
}

const OrdersTable = ({ orders }: OrdersTableProps) => {
  const pieData = getStatusData(orders);

  // Custom label for pie chart
  const renderCustomLabel = ({
    cx, cy, midAngle, outerRadius, percent, name,
  }: PieLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 24;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={13}
        fontWeight={500}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <div className="flex-1 overflow-x-auto bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Orders</h2>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            onClick={() => exportOrdersToCSV(orders)}
          >
            Export CSV
          </button>
        </div>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Status</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-2">{order.id}</td>
                <td className="py-2">{order.user?.full_name || order.user?.username || "Unknown"}</td>
                <td className="py-2">{STATUS_LABELS[order.productStatus] || order.productStatus || "-"}</td>
                <td className="py-2">${Number(order.total_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-center w-full lg:w-96 bg-white rounded-lg shadow p-6 mt-8 lg:mt-0">
        <h3 className="text-lg font-semibold mb-4 text-center">Order Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={renderCustomLabel}
              labelLine={false}
              isAnimationActive={true}
            >
              {pieData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value} orders`, name]}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersTable;