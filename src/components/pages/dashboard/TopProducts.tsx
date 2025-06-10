import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type TopProductsProps = {
  topProductsData: { name: string; sales: number }[];
};

const TopProducts = ({ topProductsData }: TopProductsProps) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={topProductsData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={90} />
      <Tooltip />
      <Bar dataKey="sales" fill="#f59e42" barSize={24} />
    </BarChart>
  </ResponsiveContainer>
);

export default TopProducts;