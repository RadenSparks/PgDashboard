import { Button } from "@/components/ui/button";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaShoppingCart, FaUsers, FaDollarSign, FaBoxOpen,} from "react-icons/fa";
import { IoMdLink, IoMdAdd } from "react-icons/io";
import SalesChart from "@/components/SalesChart"; 
import OrdersTable from "@/components/OrdersTable"; 
import TopProducts from "@/components/TopProducts"; 

const DashboardContent = () => {
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
            <span className="text-2xl font-bold">$24,500</span>
            <span className="text-green-500 text-sm">+12% this month</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-green-600">
              <FaShoppingCart size={24} />
              <span className="font-semibold text-lg">Orders</span>
            </div>
            <span className="text-2xl font-bold">1,320</span>
            <span className="text-green-500 text-sm">+8% this month</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-yellow-600">
              <FaUsers size={24} />
              <span className="font-semibold text-lg">Customers</span>
            </div>
            <span className="text-2xl font-bold">890</span>
            <span className="text-green-500 text-sm">+5% this month</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-purple-600">
              <FaBoxOpen size={24} />
              <span className="font-semibold text-lg">Products</span>
            </div>
            <span className="text-2xl font-bold">320</span>
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
            <SalesChart />
          </div>
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-lg mb-4">Top Products</h3>
            <TopProducts />
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
          <OrdersTable />
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;