import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

type TopProductsProps = {
  topProductsData: { name: string; sales: number }[];
};

const getTotalSales = (data: { sales: number }[]) =>
  data.reduce((sum, item) => sum + item.sales, 0);

// Use the recharts Payload type for compatibility
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

type CustomTooltipProps = {
  active?: boolean;
  payload?: Payload<string | number, string>[];
  label?: string;
  totalSales: number;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  totalSales,
}: CustomTooltipProps) => {
  if (
    active &&
    payload &&
    payload.length &&
    (typeof payload[0].value === "number" || (typeof payload[0].value === "string" && !isNaN(Number(payload[0].value))))
  ) {
    const sales = typeof payload[0].value === "number" ? payload[0].value : Number(payload[0].value);
    const percent = ((sales / totalSales) * 100).toFixed(1);
    return (
      <div style={{ background: "#fff", border: "1px solid #ccc", padding: 8 }}>
        <strong>{label}</strong>
        <div>Sales: {sales}</div>
        <div>Share: {percent}%</div>
      </div>
    );
  }
  return null;
};

const TopProducts = ({ topProductsData }: TopProductsProps) => {
  const totalSales = getTotalSales(topProductsData);

  // Add percentage to each product for LabelList
  const dataWithPercent = topProductsData.map((item) => ({
    ...item,
    percent: ((item.sales / totalSales) * 100).toFixed(1) + "%",
  }));

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={dataWithPercent}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 40, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number">
            <text
              x={220}
              y={210}
              textAnchor="middle"
              fill="#666"
              fontSize={12}
            >
              Sales
            </text>
          </XAxis>
          <YAxis dataKey="name" type="category" width={90}>
            <text
              x={-30}
              y={110}
              textAnchor="middle"
              fill="#666"
              fontSize={12}
              transform="rotate(-90)"
            >
              Product
            </text>
          </YAxis>
          <Tooltip
            content={(props) => <CustomTooltip {...(props as CustomTooltipProps)} totalSales={totalSales} />}
          />
          <Bar dataKey="sales" fill="#f59e42" barSize={24}>
            <LabelList
              dataKey="percent"
              position="right"
              content={({ value, x, y }) => (
                <text x={x} y={y} fill="#333" fontSize={12} dy={4}>
                  {value}
                </text>
              )}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Additional info below the chart */}
      <div style={{ marginTop: 16, padding: "8px 16px", background: "#fafafa", borderRadius: 6, fontSize: 14 }}>
        <div><strong>Total Sales:</strong> {totalSales}</div>
        <div>
          <strong>Best Seller:</strong>{" "}
          {topProductsData.length > 0
            ? topProductsData.reduce((max, item) => item.sales > max.sales ? item : max, topProductsData[0]).name
            : "N/A"}
        </div>
        <div>
          <strong>Average Sales per Product:</strong>{" "}
          {topProductsData.length > 0 ? Math.round(totalSales / topProductsData.length) : 0}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;