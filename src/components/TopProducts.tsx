import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const data = [
  { name: "UNO", sales: 2400 },
  { name: "7 Wonders", sales: 2210 },
  { name: "Zoo King", sales: 1800 },
  { name: "Deception", sales: 1600 },
  { name: "Spicy!", sales: 1400 },
];

const TopProducts = () => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={90} />
      <Tooltip />
      <Bar dataKey="sales" fill="#f59e42" barSize={24} />
    </BarChart>
  </ResponsiveContainer>
);

export default TopProducts;