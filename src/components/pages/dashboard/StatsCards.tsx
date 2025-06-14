import { FaDollarSign, FaShoppingCart, FaUsers, FaBoxOpen, FaUserPlus } from "react-icons/fa";

type StatsCardsProps = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  newUsersCount: number;
};

const StatsCards = ({
  totalRevenue,
  totalOrders,
  totalCustomers,
  totalProducts,
  newUsersCount,
}: StatsCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-blue-600">
        <FaDollarSign size={24} />
        <span className="font-semibold text-lg">Revenue</span>
      </div>
      <span className="text-2xl font-bold">${totalRevenue.toLocaleString()}</span>
      <span className="text-green-500 text-sm">+12% this month</span>
    </div>
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-green-600">
        <FaShoppingCart size={24} />
        <span className="font-semibold text-lg">Orders</span>
      </div>
      <span className="text-2xl font-bold">{totalOrders}</span>
      <span className="text-green-500 text-sm">+8% this month</span>
    </div>
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-yellow-600">
        <FaUsers size={24} />
        <span className="font-semibold text-lg">Customers</span>
      </div>
      <span className="text-2xl font-bold">{totalCustomers}</span>
      <span className="text-green-500 text-sm">+5% this month</span>
    </div>
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-purple-600">
        <FaBoxOpen size={24} />
        <span className="font-semibold text-lg">Products</span>
      </div>
      <span className="text-2xl font-bold">{totalProducts}</span>
      <span className="text-green-500 text-sm">+2% this month</span>
    </div>
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-pink-600">
        <FaUserPlus size={24} />
        <span className="font-semibold text-lg">New Users</span>
      </div>
      <span className="text-2xl font-bold">{newUsersCount}</span>
      <span className="text-green-500 text-sm">+4 today</span>
    </div>
  </div>
);

export default StatsCards;