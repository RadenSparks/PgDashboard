import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type SalesChartProps = {
  salesChartData: { name: string; sales: number }[];
};

const SalesChart = ({ salesChartData }: SalesChartProps) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={salesChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
    </LineChart>
  </ResponsiveContainer>
);

export default SalesChart;