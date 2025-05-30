import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4780 },
  { name: "May", sales: 5890 },
  { name: "Jun", sales: 4390 },
  { name: "Jul", sales: 6490 },
  { name: "Aug", sales: 7000 },
  { name: "Sep", sales: 6000 },
  { name: "Oct", sales: 7500 },
  { name: "Nov", sales: 8000 },
  { name: "Dec", sales: 9000 },
];

const SalesChart = () => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
    </LineChart>
  </ResponsiveContainer>
);

export default SalesChart;