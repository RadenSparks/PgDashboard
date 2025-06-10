import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

type Order = {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
  items: number;
};

type OrdersTableProps = {
  orders: Order[];
};

const data = [
  { name: "Completed", value: 400, color: "#22c55e" },
  { name: "Pending", value: 120, color: "#fbbf24" },
  { name: "Cancelled", value: 80, color: "#ef4444" },
];

const OrdersTable = ({ orders }: OrdersTableProps) => (
  <div className="flex flex-col lg:flex-row gap-8">
    <div className="flex-1">
      {/* Example table, replace with your real data */}
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
              <td className="py-2">{order.customer}</td>
              <td className="py-2">{order.status}</td>
              <td className="py-2">${order.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="w-full lg:w-64 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            label
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default OrdersTable;