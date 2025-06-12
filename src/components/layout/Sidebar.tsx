// import { navLinks } from "@/utils/navLinks"
import { Button } from "../widgets/button";
import { useState } from "react";
import {
  MdDashboard,
  MdCategory,
  MdLocalOffer,
  MdPostAdd,
  MdShoppingCart,
  MdPeople,
  MdSettings,
  MdInventory2,
  MdAdminPanelSettings,
  MdLabel,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Mock user data (replace with your auth/user context as needed)
const user = {
  name: "Belrose",
  avatar: "/assets/image/profile.jpg",
};

const tabs = [
  { label: "Dashboard", icon: <MdDashboard size={22} />, route: "/" },
  { label: "Products", icon: <MdInventory2 size={22} />, route: "/products" },
  { label: "Categories", icon: <MdCategory size={22} />, route: "/categories" },
  { label: "Voucher", icon: <MdLocalOffer size={22} />, route: "/voucher" },
  { label: "Posts", icon: <MdPostAdd size={22} />, route: "/posts" },
  { label: "Orders", icon: <MdShoppingCart size={22} />, route: "/orders" },
  { label: "Tags", icon: <MdLabel size={22} />, route: "/tags" },
  { label: "Permission", icon: <MdAdminPanelSettings size={22} />, route: "/permission" },
  { label: "Users", icon: <MdPeople size={22} />, route: "/users" },
  { label: "Settings", icon: <MdSettings size={22} />, route: "/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  return (
    <div className="relative h-screen">
      {/* Arrow Button between Navbar and Sidebar */}
      <Button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute top-6 -right-4 z-20 bg-white border border-[#dbdbdb] shadow p-1 w-8 h-8 flex items-center justify-center transition-colors hover:bg-yellow-100 focus:outline-none rounded-full"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
      >
        <img
          src="/assets/icons/lefticon.svg"
          height={20}
          width={20}
          alt="toggle sidebar"
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </Button>

      <div
        className={`hidden md:flex flex-col h-auto border-r-2 border-[#dbdbdb] py-4 transition-all duration-300 bg-gradient-to-b from-white via-gray-50 to-gray-200 ${collapsed ? "w-[72px]" : "w-[260px]"
          }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center px-3 mb-4">
          <span
            className="inline-flex items-center justify-center shadow-lg border-2 border-red-200 bg-gradient-to-br from-red-400 to-red-600 rounded-full"
            style={{ width: collapsed ? 44 : 56, height: collapsed ? 44 : 56 }}
          >
            <img
              src="/assets/icons/logo.svg"
              alt="Logo"
              width={collapsed ? 24 : 32}
              height={collapsed ? 24 : 32}
            />
          </span>
        </div>

        {/* Welcome Section */}
        <section className="w-full px-3 border-b-2 border-[#dbdbdb] py-6 flex flex-col items-center">
          {!collapsed ? (
            <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-2 bg-gradient-to-br from-yellow-100 to-yellow-200 px-4 py-4 rounded-2xl shadow border border-yellow-200">
              <img
                src={user.avatar}
                alt={user.name}
                className="rounded-full object-cover border-4 border-yellow-400"
                width={56}
                height={56}
              />
              <span className="text-yellow-800 text-lg font-bold mt-2">
                Welcome, {user.name.split(" ")[0]}!
              </span>
              <span className="text-yellow-700 text-sm font-medium text-center">
                Glad to see you back 👋
              </span>
            </div>
          ) : (
            <img
              src={user.avatar}
              alt={user.name}
              className="rounded-full object-cover border-2 border-yellow-400"
              width={32}
              height={32}
            />
          )}
        </section>

        {/* Tabs */}
        <ul className={`flex flex-col gap-1 py-6 w-full px-2 ${collapsed ? "items-center" : ""}`}>
          {tabs.map((tab) => (
            <li key={tab.label} className="w-full">
              <button
                className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors
                  ${collapsed ? "justify-center" : ""}
                  ${activeTab === tab.label
                    ? "bg-blue-100 text-blue-800 font-semibold"
                    : "hover:bg-gray-100 text-primary"}
                `}
                onClick={() => {
                  setActiveTab(tab.label);
                  navigate(tab.route);
                }}
              >
                {tab.icon}
                {!collapsed && <span className="truncate">{tab.label}</span>}
              </button>
            </li>
          ))}
          <hr className="bg-primary h-[1px] mt-6 w-full" />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;