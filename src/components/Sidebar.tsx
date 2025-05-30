// import { navLinks } from "@/utils/navLinks"
import { useState } from "react"
import { Button } from "./ui/button";
import {
  MdDashboard,
  MdCategory,
  MdLocalOffer,
  MdPostAdd,
  MdShoppingCart,
  MdContacts,
  MdPeople,
  MdSettings,
  MdInventory2,
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
  { label: "Contacts", icon: <MdContacts size={22} />, route: "/contacts" },
  { label: "Users", icon: <MdPeople size={22} />, route: "/users" },
  { label: "Settings", icon: <MdSettings size={22} />, route: "/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Arrow Button between Navbar and Sidebar */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute top-6 -right-4 z-20 bg-white border border-[#dbdbdb] shadow p-1 w-8 h-8 flex items-center justify-center transition-colors hover:bg-yellow-100 focus:outline-none rounded-none"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        style={{ }}
      >
        <img
          src="/assets/icons/lefticon.svg"
          height={20}
          width={20}
          alt="toggle sidebar"
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`hidden md:flex flex-col h-full border-r-2 border-[#dbdbdb] py-4 transition-all duration-300 ${
          collapsed ? "w-[80px]" : "w-[300px]"
        } bg-gradient-to-b from-white via-gray-50 to-gray-200`} // <-- changed background
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center px-3 mb-4">
          <span
            className="inline-flex items-center justify-center shadow-lg border-2 border-red-200 bg-gradient-to-br from-red-400 to-red-600 rounded-full"
            style={{ width: collapsed ? 48 : 64, height: collapsed ? 48 : 64 }}
          >
            <img
              src="/assets/icons/logo.svg"
              alt="Logo"
              width={collapsed ? 28 : 36}
              height={collapsed ? 28 : 36}
            />
          </span>
        </div>

        {/* Welcome Section */}
        <section className="w-full px-3 border-b-2 border-[#dbdbdb] py-6 flex flex-col items-center">
          {!collapsed && (
            <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-2 bg-gradient-to-br from-yellow-100 to-yellow-200 px-6 py-6 rounded-2xl shadow border border-yellow-200">
              <img
                src={user.avatar}
                alt={user.name}
                className="rounded-full object-cover border-4 border-yellow-400"
                width={70}
                height={70}
              />
              <span className="text-yellow-800 text-xl font-bold mt-2">
                Welcome, {user.name.split(" ")[0]}!
              </span>
              <span className="text-yellow-700 text-base font-medium text-center">
                Glad to see you back 👋
              </span>
            </div>
          )}
          {collapsed && (
            <img
              src={user.avatar}
              alt={user.name}
              className="rounded-full object-cover border-2 border-yellow-400"
              width={40}
              height={40}
            />
          )}
        </section>

        {/* Tabs */}
        <ul className={`flex flex-col gap-2 py-6 w-full px-3 ${collapsed ? "items-center" : ""}`}>
          {tabs.map((tab) => (
            <li
              key={tab.label}
              className={`w-full`}
            >
              <button
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors
                  ${collapsed ? "justify-center" : ""}
                  ${activeTab === tab.label
                    ? "bg-blue-100 text-blue-800 font-semibold" // Changed highlight to blue
                    : "hover:bg-gray-100 text-primary"}
                `}
                onClick={() => {
                  setActiveTab(tab.label);
                  navigate(tab.route);
                }}
              >
                {tab.icon}
                {!collapsed && <span>{tab.label}</span>}
              </button>
            </li>
          ))}
          <hr className="bg-primary h-[1px] mt-6 w-full" />
        </ul>

        {/* Thoughts Time Box */}
        <div className={`w-full flex justify-center py-12 ${collapsed ? "hidden" : ""}`}>
          <div className="w-[206px] h-[210px] bg-secondary justify-center items-center relative rounded-xl px-3">
            <p className="font-semibold text-sm text-center pt-12">Thoughts Time</p>
            <p className="text-sm text-primary">
              We don’t have any notice for you, till then you can share your thoughts with your peers.
            </p>
            <Button className="px-6 py-3 rounded-md bg-white font-medium mt-3">
              Write Message
            </Button>
            <div className="flex absolute -top-8 left-16 w-[66px] h-[66px] rounded-full justify-center items-center bg-[#C4C4C4] shadow-[0_0_30px_rgba(253,224,71,0.8)]">
              <img
                src="/assets/icons/lamp.svg"
                alt="notification"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar