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
import EmailSender from "./EmailSender";

// --- Type helpers for stricter typing ---
import type { Order } from "../../../redux/api/ordersApi";
import type { Product as ProductType } from "../../../redux/api/productsApi";
import type { User as UserType } from "../../../redux/api/usersApi";

// Utility type to add index signature to types
type WithIndex<T> = T & { [key: string]: unknown };

const RECENT_USER_COUNT = 5;

const DashboardContent = () => {
  const navigate = useNavigate();

  // Fetch real data
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();
  const { data: allReviews = [], isLoading: reviewsLoading } = useGetAllReviewsQuery();
  const { data: orders = [], isLoading: ordersLoading } = useGetOrdersQuery();
  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery({ page: 1, limit: 100 });

  // Defensive arrays
  const safeOrders = useMemo(() => Array.isArray(orders) ? orders : [], [orders]);

  // Stats

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

  // Helper: Get start/end of this month and last month
  const getMonthRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  };
  const getPrevMonthRange = (date: Date) => {
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    return getMonthRange(prevMonth);
  };
  const today = new Date();
  const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(today);
  const { start: lastMonthStart, end: lastMonthEnd } = getPrevMonthRange(today);

  // Helper: Filter by date range
  function filterByDate<T>(items: T[], dateField: keyof T, start: Date, end: Date): T[] {
    return items.filter(item => {
      const raw = (item as WithIndex<T>)[dateField];
      if (!raw) return false;
      const d = new Date(raw as string);
      return d >= start && d <= end;
    });
  }

  // --- Revenue ---
  const thisMonthOrders = filterByDate<WithIndex<Order>>(safeOrders as WithIndex<Order>[], "order_date", thisMonthStart, thisMonthEnd);
  const lastMonthOrders = filterByDate<WithIndex<Order>>(safeOrders as WithIndex<Order>[], "order_date", lastMonthStart, lastMonthEnd);

  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
  const revenueChange = lastMonthRevenue === 0 ? 100 : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  // --- Orders ---
  const thisMonthOrderCount = thisMonthOrders.length;
  const lastMonthOrderCount = lastMonthOrders.length;
  const ordersChange = lastMonthOrderCount === 0 ? 100 : ((thisMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100;

  // --- Customers ---
  const thisMonthCustomers = Array.from(new Set(thisMonthOrders.map(o => o.user?.username))).length;
  const lastMonthCustomers = Array.from(new Set(lastMonthOrders.map(o => o.user?.username))).length;
  const customersChange = lastMonthCustomers === 0 ? 100 : ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100;

  // --- Products ---
  type PaginatedProducts = { data: ProductType[]; [key: string]: unknown };
  const isPaginatedProducts = (obj: unknown): obj is PaginatedProducts =>
    !!obj && typeof obj === "object" && "data" in obj && Array.isArray((obj as PaginatedProducts).data);

  const safeProductsArr: ProductType[] = isPaginatedProducts(products)
    ? products.data
    : (Array.isArray(products) ? products as ProductType[] : []);

  // Define product month ranges (fixes the missing variable error)
  const { start: thisMonthProductStart, end: thisMonthProductEnd } = getMonthRange(today);
  const { start: lastMonthProductStart, end: lastMonthProductEnd } = getPrevMonthRange(today);

  // Use 'as keyof ProductType' to satisfy TS
  const thisMonthProducts = filterByDate<WithIndex<ProductType>>(safeProductsArr as WithIndex<ProductType>[], "created_at", thisMonthProductStart, thisMonthProductEnd).length;
  const lastMonthProducts = filterByDate<WithIndex<ProductType>>(safeProductsArr as WithIndex<ProductType>[], "created_at", lastMonthProductStart, lastMonthProductEnd).length;
  const productsChange = lastMonthProducts === 0 ? (thisMonthProducts > 0 ? 100 : 0) : ((thisMonthProducts - lastMonthProducts) / lastMonthProducts) * 100;

  // --- New Users ---
  const usersArr: UserType[] = Array.isArray(users) ? users : [];
  const thisMonthUsers = filterByDate<WithIndex<UserType>>(usersArr as WithIndex<UserType>[], "created_at", thisMonthStart, thisMonthEnd).length;
  const lastMonthUsers = filterByDate<WithIndex<UserType>>(usersArr as WithIndex<UserType>[], "created_at", lastMonthStart, lastMonthEnd).length;
  const newUsersChange = lastMonthUsers === 0 ? (thisMonthUsers > 0 ? 100 : 0) : ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;

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
              totalRevenue={thisMonthRevenue}
              revenueChange={revenueChange}
              totalOrders={thisMonthOrderCount}
              ordersChange={ordersChange}
              totalCustomers={thisMonthCustomers}
              customersChange={customersChange}
              totalProducts={thisMonthProducts}
              productsChange={productsChange}
              newUsersCount={thisMonthUsers}
              newUsersChange={newUsersChange}
            />

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-blue-700">Đơn hàng gần đây</h3>
                <Button className="flex gap-2 px-4 py-2 border bg-white border-blue-300 rounded-xl shadow hover:bg-blue-50 transition font-semibold">
                  <span className="text-blue-700 font-medium">Xuất dữ liệu</span>
                </Button>
              </div>
              <OrdersTable orders={recentOrders} />
            </div>

            {/* Charts and Top Products */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Sales Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-8 col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl text-blue-700">Biểu đồ doanh số</h3>
                  <div className="flex gap-2">
                    <Button
                      className={`px-3 py-1 rounded-lg font-semibold border ${salesMode === "day" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-600"}`}
                      onClick={() => setSalesMode("day")}
                    >
                      Ngày
                    </Button>
                    <Button
                      className={`px-3 py-1 rounded-lg font-semibold border ${salesMode === "week" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-600"}`}
                      onClick={() => setSalesMode("week")}
                    >
                      Tuần
                    </Button>
                    <Button
                      className={`px-3 py-1 rounded-lg font-semibold border ${salesMode === "month" ? "bg-blue-100 text-blue-700" : "bg-white text-gray-600"}`}
                      onClick={() => setSalesMode("month")}
                    >
                      Tháng
                    </Button>
                    <Button
                      className="flex gap-2 px-4 py-2 border bg-white border-blue-300 rounded-xl shadow hover:bg-blue-50 transition font-semibold"
                      onClick={handleExportSalesChart}
                    >
                      <span className="text-blue-700 font-medium">Xuất biểu đồ</span>
                    </Button>
                  </div>
                </div>
                {salesChartData.length > 0 ? (
                  <SalesChart salesChartData={salesChartData} />
                ) : (
                  <div className="text-gray-400 text-center py-12">Không có dữ liệu doanh số.</div>
                )}
              </div>
              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-lg p-8 ">
                <h3 className="font-bold text-xl text-blue-700 mb-6">Sản phẩm bán chạy</h3>
                {topProductsData.length > 0 ? (
                  <TopProducts topProductsData={topProductsData} />
                ) : (
                  <div className="text-gray-400 text-center py-12">Không có dữ liệu sản phẩm.</div>
                )}
              </div>
            </div>

            {/* Email Marketing Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">📧</span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-blue-700">Email Marketing</h3>
                  <p className="text-gray-600 text-sm">Tạo và gửi chiến dịch email cho khách hàng</p>
                </div>
              </div>
              <EmailSender />
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