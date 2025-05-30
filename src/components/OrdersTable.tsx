import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Completed", value: 400, color: "#22c55e" },
  { name: "Pending", value: 120, color: "#fbbf24" },
  { name: "Cancelled", value: 80, color: "#ef4444" },
];

const OrdersTable = () => (
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
          <tr className="border-b">
            <td className="py-2">#1001</td>
            <td className="py-2">Alice</td>
            <td className="py-2 text-green-600">Completed</td>
            <td className="py-2">$120.00</td>
          </tr>
          <tr className="border-b">
            <td className="py-2">#1002</td>
            <td className="py-2">Bob</td>
            <td className="py-2 text-yellow-600">Pending</td>
            <td className="py-2">$80.00</td>
          </tr>
          <tr>
            <td className="py-2">#1003</td>
            <td className="py-2">Charlie</td>
            <td className="py-2 text-red-600">Cancelled</td>
            <td className="py-2">$50.00</td>
          </tr>
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