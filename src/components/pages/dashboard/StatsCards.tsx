import {
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaBoxOpen,
  FaUserPlus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

type StatsCardsProps = {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  totalProducts: number;
  productsChange: number;
  newUsersCount: number;
  newUsersChange: number;
};

const STAT_TITLE_COLORS: Record<string, string> = {
  "Doanh thu": "text-amber-600",
  "Đơn hàng": "text-blue-600",
  "Khách hàng": "text-green-600",
  "Sản phẩm": "text-purple-600",
  "Người dùng mới": "text-pink-600",
};

const StatCard = ({
  icon,
  label,
  value,
  change,
  suffix = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  change: number;
  suffix?: string;
}) => {
  const isUp = change >= 0;
  const absChange = Math.abs(change);

  // Format revenue as VND if label is "Doanh thu"
  const displayValue =
    label === "Doanh thu"
      ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      : `${suffix}${value.toLocaleString()}`;

  const titleColor = STAT_TITLE_COLORS[label] || "text-blue-600";

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
      <div className={`flex items-center gap-2 ${titleColor}`}>
        {icon}
        <span className="font-semibold text-lg">{label}</span>
      </div>
      <span className="text-2xl font-bold">{displayValue}</span>
      <span
        className={`text-sm flex items-center gap-1 ${
          isUp ? "text-green-500" : "text-red-500"
        }`}
      >
        {isUp ? <FaArrowUp /> : <FaArrowDown />}
        {absChange.toFixed(1)}% {isUp ? "tăng" : "giảm"} so với tháng trước
      </span>
    </div>
  );
};

const StatsCards = ({
  totalRevenue,
  revenueChange,
  totalOrders,
  ordersChange,
  totalCustomers,
  customersChange,
  totalProducts,
  productsChange,
  newUsersCount,
  newUsersChange,
}: StatsCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
    <StatCard
      icon={<FaDollarSign size={24} />}
      label="Doanh thu"
      value={totalRevenue}
      change={revenueChange}
      suffix=""
    />
    <StatCard
      icon={<FaShoppingCart size={24} />}
      label="Đơn hàng"
      value={totalOrders}
      change={ordersChange}
    />
    <StatCard
      icon={<FaUsers size={24} />}
      label="Khách hàng"
      value={totalCustomers}
      change={customersChange}
    />
    <StatCard
      icon={<FaBoxOpen size={24} />}
      label="Sản phẩm"
      value={totalProducts}
      change={productsChange}
    />
    <StatCard
      icon={<FaUserPlus size={24} />}
      label="Người dùng mới"
      value={newUsersCount}
      change={newUsersChange}
    />
  </div>
);

export default StatsCards;
