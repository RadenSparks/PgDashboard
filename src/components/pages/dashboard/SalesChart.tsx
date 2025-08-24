import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface SalesChartData {
  name: string; // Date label
  sales: number;
}

const SalesChart: React.FC<{ salesChartData: SalesChartData[] }> = ({ salesChartData }) => {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart
          data={salesChartData}
          margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            label={{
              value: "Ngày",
              position: "insideBottomRight",
              offset: -5,
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{
              value: "Doanh số (₫)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
            }}
            labelStyle={{ fontWeight: "bold" }}
            formatter={(value: number) => value.toLocaleString("vi-VN") + " ₫"}
            labelFormatter={(label: string) => `Ngày: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 6 }}
            name="Doanh số"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;