import { useMemo } from "react";
import { Button } from "../../widgets/button";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaShoppingCart, FaUsers, FaDollarSign, FaBoxOpen } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import SalesChart from "./SalesChart";
import OrdersTable from "./OrdersTable";
import TopProducts from "./TopProducts";
import { mockProducts } from "../products/mockProducts";
import mockOrders from "../orders/mockOrders"; // Update import path

// Define the Order type to match your mockOrders structure
type Order = {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
  items: number;
};

const DashboardContent = () => {
  // Calculate stats from products and orders
  const {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    salesChartData,
    topProductsData,
    recentOrders,
  } = useMemo(() => {
    // Products
    const products = mockProducts;
    const totalProducts = products.length;
    const topProductsData = products
      .map((p) => ({
        name: p.name,
        sales: p.sold,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Orders (mock)
    let orders: Order[] = [];
    try {
      orders = mockOrders as Order[];
    } catch {
      orders = [];
    }
    const totalOrders = orders.length || 1320;
    const totalCustomers = 890; // Replace with real user/customer count if available

    // Revenue: sum of all product sold * price (approximation)
    const totalRevenue = products.reduce(
      (sum, p) => sum + p.sold * p.price * (1 - (p.discount || 0) / 100),
      0
    );

    // Sales chart: group by month (mocked for now)
    const salesChartData = [
      { name: "Jan", sales: 4000 },
      { name: "Feb", sales: 3000 },
      { name: "Mar", sales: 5000 },
      { name: "Apr", sales: 4780 },
      { name: "May", sales: 5890 },
      { name: "Jun", sales: products.reduce((sum, p) => sum + p.sold * p.price, 0) }, // Example: this month
    ];

    // Recent orders (mock)
    const recentOrders = orders.slice(0, 3);

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      salesChartData,
      topProductsData,
      recentOrders,
    };
  }, []);

  return (
    <main className="flex flex-1 px-8 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-dark font-semibold text-4xl">Pengoo Dashboard</h2>
          <Button className="flex gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <IoMdAdd size={20} />
            <span>Add Product</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow p-6 col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Sales Overview</h3>
              <Button className="flex gap-2 px-3 py-1 border bg-white border-primary rounded-lg cursor-pointer">
                <span className="text-primary font-medium">This Month</span>
                <MdOutlineKeyboardArrowDown size={20} className="text-primary" />
              </Button>
            </div>
            {/* Pass salesChartData as prop */}
            <SalesChart salesChartData={salesChartData} />
          </div>
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Top Products</h3>
            {/* Pass topProductsData as prop */}
            <TopProducts topProductsData={topProductsData} />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Orders</h3>
            <Button className="flex gap-2 px-3 py-1 border bg-white border-primary rounded-lg cursor-pointer">
              <span className="text-primary font-medium">Export</span>
            </Button>
          </div>
          {/* Pass recentOrders as prop */}
          <OrdersTable orders={recentOrders} />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;