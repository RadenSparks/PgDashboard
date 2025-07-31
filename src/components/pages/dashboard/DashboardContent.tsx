import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../widgets/button";
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
import { saveAs } from "file-saver";

const RECENT_USER_COUNT = 4;

const DashboardContent = () => {
  const navigate = useNavigate();

  // Fetch real data
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: allReviews = [], isLoading: reviewsLoading } = useGetAllReviewsQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();

  // Defensive arrays
  const safeOrders = useMemo(() => Array.isArray(orders) ? orders : [], [orders]);
  const safeProducts = useMemo(() => Array.isArray(products) ? products : [], [products]);

  // Stats
  const totalProducts = safeProducts.length;
  const totalOrders = safeOrders.length;
  const totalCustomers = Array.from(new Set(safeOrders.map(o => o.user?.username))).length;
  const totalRevenue = safeOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);

  // --- Sales Chart Data by Day, Week, Month ---
  const getDateKey = (date: Date, mode: "day" | "week" | "month") => {
    if (mode === "day") return date.toLocaleDateString("vi-VN");
    if (mode === "week") {
      const firstDayOfWeek = new Date(date);
      firstDayOfWeek.setDate(date.getDate() - date.getDay());
      return `Tuần ${firstDayOfWeek.toLocaleDateString("vi-VN")}`;
    }
    if (mode === "month") return `${date.getMonth() + 1}/${date.getFullYear()}`;
    return "";
  };

  const [salesMode, setSalesMode] = useState<"day" | "week" | "month">("day");

  const salesChartData = useMemo(() => {
    if (salesMode !== "day") {
      // Keep original logic for week/month
      const salesByPeriod: Record<string, number> = {};
      safeOrders.forEach(order => {
        const rawDate = order.order_date;
        if (!rawDate) return;
        const dateObj = new Date(rawDate);
        const key = getDateKey(dateObj, salesMode);
        salesByPeriod[key] = (salesByPeriod[key] || 0) + Number(order.total_price || 0);
      });
      return Object.entries(salesByPeriod)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
    }

    // For "day" mode, show all days in range (including missing)
    const dates: Date[] = [];
    const orderDates = safeOrders
      .map(order => new Date(order.order_date))
      .filter(d => !isNaN(d.getTime()));

    if (orderDates.length === 0) return [];

    // Find min/max date from orders
    const minDate = new Date(Math.min(...orderDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...orderDates.map(d => d.getTime())));

    // Optionally, extend maxDate to today + 3 days for upcoming
    const today = new Date();
    if (maxDate < today) maxDate.setTime(today.getTime());
    maxDate.setDate(maxDate.getDate() + 3);

    // Build date range
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    // Build sales map
    const salesByDay: Record<string, number> = {};
    safeOrders.forEach(order => {
      const rawDate = order.order_date;
      if (!rawDate) return;
      const dateObj = new Date(rawDate);
      const key = dateObj.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
      salesByDay[key] = (salesByDay[key] || 0) + Number(order.total_price || 0);
    });

    // Fill chart data for all days
    return dates.map(date => {
      const key = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
      return { name: key, sales: salesByDay[key] || 0 };
    });
  }, [safeOrders, salesMode]);

  // --- Top Products ---
  type OrderDetail = { product: { product_name?: string; name?: string; id?: number }; quantity: number; product_name?: string; name?: string; product_id?: number };
  const topProductsData = useMemo(() => {
    const productSales: Record<string, number> = {};
    safeOrders.forEach(order => {
      (order.details || []).forEach((prod: OrderDetail) => {
        const name =
          prod.product?.product_name ||
          prod.product?.name ||
          prod.product_name ||
          prod.name ||
          `#${prod.product?.id || prod.product_id || "?"}`;
        productSales[name] = (productSales[name] || 0) + (prod.quantity || 1);
      });
    });
    return Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [safeOrders]);

  // Recent orders
  const recentOrders = useMemo(() => {
    return [...safeOrders]
      .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
      .slice(0, 5);
  }, [safeOrders]);

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

  // Fix: Add joined property for NewUser[]
  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => b.id - a.id)
      .slice(0, RECENT_USER_COUNT)
      .map(user => ({
        name: user.full_name,
        avatar: user.avatar_url || "/assets/image/profile5.jpg",
        email: user.email,
      }));
  }, [users]);

  // Loading state
  const isLoading = usersLoading || reviewsLoading || ordersLoading || productsLoading;

  // Export sales chart data as CSV
  const handleExportSalesChart = () => {
    if (!salesChartData.length) return;
    const csvRows = [
      "Date,Sales",
      ...salesChartData.map(row => `"${row.name}",${row.sales}`)
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `sales_chart_${salesMode}.csv`);
  };

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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Sales Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-8 col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-blue-700">Sales Overview</h3>
                  <div className="flex gap-2">
                    <Button
                      className={`px-3 py-1 rounded-lg font-semibold border ${salesMode === "day" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-600"}`}
                      onClick={() => setSalesMode("day")}
                    >
                      Day
                    </Button>
                    <Button
                      className={`px-3 py-1 rounded-lg font-semibold border ${salesMode === "week" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-600"}`}
                      onClick={() => setSalesMode("week")}
                    >
                      Week
                    </Button>
                    <Button
                      className={`px-3 py-1 rounded-lg font-semibold border ${salesMode === "month" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-600"}`}
                      onClick={() => setSalesMode("month")}
                    >
                      Month
                    </Button>
                    <Button
                      className="flex gap-2 px-4 py-2 border bg-white border-blue-300 rounded-xl shadow hover:bg-blue-50 transition font-semibold"
                      onClick={handleExportSalesChart}
                    >
                      <span className="text-blue-700 font-medium">Export Chart</span>
                    </Button>
                  </div>
                </div>
                {salesChartData.length > 0 ? (
                  <SalesChart salesChartData={salesChartData} />
                ) : (
                  <div className="text-gray-400 text-center py-12">No sales data available.</div>
                )}
              </div>
              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-lg p-8 ">
                <h3 className="font-bold text-xl text-blue-700 mb-6">Top Products</h3>
                {topProductsData.length > 0 ? (
                  <TopProducts topProductsData={topProductsData} />
                ) : (
                  <div className="text-gray-400 text-center py-12">No product sales data.</div>
                )}
              </div>
            </div>

            {/* Info Panels: Recent Comments & New Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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