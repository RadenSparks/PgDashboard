import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../widgets/button";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import SalesChart from "./SalesChart";
import OrdersTable from "./OrdersTable";
import TopProducts from "./TopProducts";
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import RecentCommentsPanel from "./RecentCommentsPanel";
import NewUsersPanel from "./NewUsersPanel";
import { useGetUsersQuery } from "../../../redux/api/usersApi";
import { useGetAllReviewsQuery } from "../../../redux/api/reviewsApi";
import { useGetOrdersQuery } from "../../../redux/api/ordersApi";
import { useGetProductsQuery } from "../../../redux/api/productsApi";

const RECENT_USER_COUNT = 4;

const DashboardContent = () => {
  const navigate = useNavigate();

  // Fetch real data
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: allReviews = [], isLoading: reviewsLoading } = useGetAllReviewsQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();

  // Stats calculation
  const {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    salesChartData,
    topProductsData,
    recentOrders,
  } = useMemo(() => {
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeProducts = Array.isArray(products) ? products : [];

    const totalProducts = safeProducts.length;
    const totalOrders = safeOrders.length;
    const totalCustomers = Array.from(new Set(safeOrders.map(o => o.customer || o.user?.username))).length;
    const totalRevenue = safeOrders.reduce((sum, o) => sum + (o.total || Number(o.total_price) || 0), 0);

    // Sales chart: group by date, format date for better readability
    const salesChartData = safeOrders.map(order => ({
      name: order.date
        ? new Date(order.date).toLocaleDateString()
        : order.order_date
        ? new Date(order.order_date).toLocaleDateString()
        : "Unknown",
      sales: order.total || Number(order.total_price) || 0,
    }));

    // Top products by sales
    const productSales: Record<string, number> = {};
    safeOrders.forEach(order => {
      (order.products || order.details || []).forEach(prod => {
        const name = prod.name || prod.product_name || "Unknown";
        productSales[name] = (productSales[name] || 0) + (prod.quantity || 1);
      });
    });
    const topProductsData = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Recent orders
    const recentOrders = [...safeOrders]
      .sort((a, b) => new Date(b.order_date || b.date).getTime() - new Date(a.order_date || a.date).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customer: order.user?.full_name || order.user?.username || order.customer || "Unknown",
        date: order.order_date || order.date,
        status: order.productStatus || order.status,
        total: Number(order.total_price || order.total),
        items: Array.isArray(order.details || order.products) ? (order.details || order.products).length : 0,
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
  }, [orders, products]);

  // Recent reviews (earliest first)
  const earliestReviews = useMemo(() => {
    return [...allReviews]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, 4)
      .map(r => ({
        user: r.user?.username || "Unknown User",
        comment: r.content,
        product: r.product?.name || "Product",
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
      }));
  }, [allReviews]);

  // Comment carousel logic
  const [currentComment, setCurrentComment] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setCurrentComment(0);
    if (earliestReviews.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentComment((prev) => (prev + 1) % earliestReviews.length);
        setFade(true);
      }, 350);
    }, 3500);
    return () => clearInterval(interval);
  }, [earliestReviews.length]);

  const handleNavigateToComment = (user: string) => {
    navigate(`/comments?user=${encodeURIComponent(user)}`);
  };

  const handleNavigateToNewUsers = () => {
    navigate("/users?filter=new");
  };

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => b.id - a.id)
      .slice(0, RECENT_USER_COUNT)
      .map(user => ({
        name: user.full_name,
        avatar: user.avatar_url || "/assets/image/profile5.jpg",
        joined: user.joined || "",
        email: user.email,
      }));
  }, [users]);

  // Loading state
  const isLoading = usersLoading || reviewsLoading || ordersLoading || productsLoading;

  return (
    <main className="flex flex-1 px-4 md:px-12 py-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex flex-col gap-10 w-full">
        <DashboardHeader />
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-blue-500 text-lg font-semibold animate-pulse">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <>
            <StatsCards
              totalRevenue={totalRevenue}
              totalOrders={totalOrders}
              totalCustomers={totalCustomers}
              totalProducts={totalProducts}
              newUsersCount={recentUsers.length}
            />

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-blue-700">Recent Orders</h3>
                <Button className="flex gap-2 px-4 py-2 border bg-white border-blue-300 rounded-xl shadow hover:bg-blue-50 transition font-semibold">
                  <span className="text-blue-700 font-medium">Export</span>
                </Button>
              </div>
              <OrdersTable orders={recentOrders} />
            </div>

            {/* Charts and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Sales Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-8 col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-blue-700">Sales Overview</h3>
                  <Button className="flex gap-2 px-4 py-2 border bg-white border-blue-300 rounded-xl shadow hover:bg-blue-50 transition font-semibold">
                    <span className="text-blue-700 font-medium">This Month</span>
                    <MdOutlineKeyboardArrowDown size={20} className="text-blue-700" />
                  </Button>
                </div>
                {salesChartData.length > 0 ? (
                  <SalesChart salesChartData={salesChartData} />
                ) : (
                  <div className="text-gray-400 text-center py-12">No sales data available.</div>
                )}
              </div>
              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="font-bold text-xl text-blue-700 mb-6">Top Products</h3>
                {topProductsData.length > 0 ? (
                  <TopProducts topProductsData={topProductsData} />
                ) : (
                  <div className="text-gray-400 text-center py-12">No product sales data.</div>
                )}
              </div>
            </div>

            {/* Info Panels: Recent Comments & New Users */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </>
        )}
      </div>
    </main>
  );
};

export default DashboardContent;