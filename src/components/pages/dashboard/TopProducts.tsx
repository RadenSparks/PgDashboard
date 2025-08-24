import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type TopProductsProps = {
  topProductsData: { name: string; sales: number }[];
};

const getTotalSales = (data: { sales: number }[]) =>
  data.reduce((sum, item) => sum + item.sales, 0);

const CustomTooltip = ({
  active,
  payload,
  label,
  totalSales,
}: {
  active?: boolean;
  payload?: unknown[];
  label?: string;
  totalSales: number;
}) => {
  if (
    active &&
    payload &&
    payload.length &&
    typeof (payload[0] as { value?: unknown }).value === "number"
  ) {
    const sales = (payload[0] as { value: number }).value;
    const percent = ((sales / totalSales) * 100).toFixed(1);
    return (
      <div style={{
        background: "#fff",
        border: "1.5px solid #e0e7ef",
        borderRadius: 12,
        padding: "14px 20px",
        fontSize: 15,
        color: "#1e293b",
        boxShadow: "0 4px 16px 0 rgba(30,64,175,0.10)",
        minWidth: 120,
      }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: "#2563eb" }}>{label}</div>
        <div>Doanh số: <b>{sales}</b></div>
        <div>Tỷ lệ: <b>{percent}%</b></div>
      </div>
    );
  }
  return null;
};

const TopProducts = ({ topProductsData }: TopProductsProps) => {
  const totalSales = getTotalSales(topProductsData);

  return (
    <div
      style={{
        width: "100%",
        minHeight: 260,
        background: "linear-gradient(90deg, #f8fafc 60%, #e0e7ef 100%)",
        borderRadius: 18,
        boxShadow: "0 2px 16px 0 rgba(30,64,175,0.06)",
        padding: "24px 18px 18px 12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={topProductsData}
          layout="vertical"
          margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
          barCategoryGap={22}
        >
          <CartesianGrid
            stroke="#e0e7ef"
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 14, fill: "#64748b", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => (v === 0 ? "" : v)}
            domain={[0, "dataMax"]}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={130}
            tick={{ fontSize: 15, fill: "#334155", fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: "#e0e7ef", opacity: 0.3 }}
            content={(props) => (
              <CustomTooltip {...(props as object)} totalSales={totalSales} />
            )}
          />
          <Bar
            dataKey="sales"
            fill="url(#barGradient)"
            radius={[10, 10, 10, 10]}
            minPointSize={3}
            barSize={22}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e42" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
      <div
        style={{
          marginTop: 20,
          padding: "12px 20px",
          background: "#fff",
          borderRadius: 10,
          fontSize: 16,
          color: "#334155",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          boxShadow: "0 1px 4px 0 rgba(30,64,175,0.04)",
        }}
      >
        <div>
          <b>Tổng doanh số:</b> {totalSales}
        </div>
        <div>
          <b>Bán chạy nhất:</b>{" "}
          {topProductsData.length > 0
            ? topProductsData.reduce((max, item) =>
                item.sales > max.sales ? item : max,
              topProductsData[0]
            ).name
            : "Không có"}
        </div>
        <div>
          <b>Doanh số trung bình mỗi sản phẩm:</b>{" "}
          {topProductsData.length > 0
            ? Math.round(totalSales / topProductsData.length)
            : 0}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;