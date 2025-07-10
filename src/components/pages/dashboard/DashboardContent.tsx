import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../widgets/button";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import SalesChart from "./SalesChart";
import OrdersTable from "./OrdersTable";
import TopProducts from "./TopProducts";
import { mockProducts } from "../products/mockProducts";
import mockOrders from "../orders/mockOrders";
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import RecentCommentsPanel from "./RecentCommentsPanel";
import NewUsersPanel from "./NewUsersPanel";
import { useGetUsersQuery } from "../../../redux/api/usersApi";
import { useGetAllReviewsQuery } from "../../../redux/api/reviewsApi";
import { useGetOrdersQuery } from "../../../redux/api/ordersApi";

// --- Mock Data for New Users and Comments ---
const newUsersCount = 17; // Example: number of new users this week

const RECENT_USER_COUNT = 4; // or any number you want

const ordersWithProducts: Order[] = mockOrders.map((order, idx) => ({
  ...order,
  products: [
    { name: "UNO", quantity: 2, price: 19.99 },
    { name: "7 Wonders", quantity: 1, price: 59.99 },
  ].slice(0, (idx % 2) + 1),
}));

const DashboardContent = () => {
  const navigate = useNavigate();
  const { data: users = [] } = useGetUsersQuery();
  const { data: allReviews = [] } = useGetAllReviewsQuery();
  const { data: orders = [] } = useGetOrdersQuery();

  // Sort reviews by createdAt ascending (earliest first)
  const earliestReviews = [...allReviews]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(0, 4) // Show the first 4 earliest reviews
    .map(r => ({
      user: r.user?.username || "Unknown User",
      comment: r.content,
      product: r.product?.name || "Product",
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
    }));

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

    // Orders
    const orders = ordersWithProducts;
    const totalOrders = orders.length;
    const totalCustomers = Array.from(new Set(orders.map(o => o.customer))).length;

    // Revenue: sum of all order totals
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    // Sales chart: group by date (for demo, just use order dates)
    const salesChartData = orders.map(order => ({
      name: order.date,
      sales: order.total,
    }));

    // Top products by sales (from orders)
    const productSales: Record<string, number> = {};
    orders.forEach(order => {
      order.products.forEach(prod => {
        productSales[prod.name] = (productSales[prod.name] || 0) + prod.quantity;
      });
    });
    const topProductsData = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customer: order.user?.full_name || order.user?.username || "Unknown",
        date: order.order_date,
        status: order.productStatus,
        total: Number(order.total_price),
        items: Array.isArray(order.details) ? order.details.length : 0,
      }));

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

  // Comment carousel logic with transition
  const [currentComment, setCurrentComment] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setCurrentComment(0); // Reset to first comment when reviews change
    if (earliestReviews.length <= 1) return; // No need to cycle

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentComment((prev) => (prev + 1) % earliestReviews.length);
        setFade(true);
      }, 350);
    }, 3500);

    return () => clearInterval(interval);
  }, [earliestReviews.length]);

  // Handler for navigating to the comments page and focusing on the user
  const handleNavigateToComment = (user: string) => {
    navigate(`/comments?user=${encodeURIComponent(user)}`);
  };

  // Handler for navigating to the users page filtered by newly joined users
  const handleNavigateToNewUsers = () => {
    navigate("/users?filter=new");
  };

  const recentUsers = [...users]
    .sort((a, b) => b.id - a.id) // or use a joined/createdAt field if available
    .slice(0, RECENT_USER_COUNT)
    .map(user => ({
      name: user.full_name,
      avatar: user.avatar_url || "/assets/image/profile5.jpg",
      joined: user.joined || "",
      email: user.email,
    }));

  return (
    <main className="flex flex-1 px-8 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col gap-8 w-full">
        <DashboardHeader />
        <StatsCards
          totalRevenue={totalRevenue}
          totalOrders={totalOrders}
          totalCustomers={totalCustomers}
          totalProducts={totalProducts}
          newUsersCount={newUsersCount}
        />
        {/* Orders Table - moved above charts */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Orders</h3>
            <Button className="flex gap-2 px-3 py-1 border bg-white border-primary rounded-lg cursor-pointer">
              <span className="text-primary font-medium">Export</span>
            </Button>
          </div>
          <OrdersTable orders={recentOrders} />
        </div>

        {/* Charts and Top Products */}
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
            <SalesChart salesChartData={salesChartData} />
          </div>
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Top Products</h3>
            <TopProducts topProductsData={topProductsData} />
          </div>
        </div>

        {/* Info Panels: Recent Comments & New Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentCommentsPanel
            recentComments={earliestReviews}
            currentComment={currentComment}
            fade={fade}
            handleNavigateToComment={handleNavigateToComment}
          />
          <NewUsersPanel
            newUsers={recentUsers}
            handleNavigateToNewUsers={handleNavigateToNewUsers}
          />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;