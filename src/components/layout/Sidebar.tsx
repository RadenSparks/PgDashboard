import { Button } from "../widgets/button";
import React, { useState, useEffect } from "react";
import {
  MdDashboard,
  MdCategory,
  MdLocalOffer,
  MdPostAdd,
  MdShoppingCart,
  MdPeople,
  MdInventory2,
  MdAdminPanelSettings,
  MdLabel,
  MdComment,
  MdPhotoLibrary,
  MdCollectionsBookmark,
} from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, useBreakpointValue, Tooltip } from "@chakra-ui/react";
import { useGetUserByIdQuery } from "../../redux/api/usersApi";
import { getCurrentUserId } from "../../utils/auth";

const Logo = ({ size = 80 }: { size?: number }) => (
  <img
    src="/assets/icons/logo-01.svg"
    alt="Pengoo Logo"
    width={size}
    height={size}
    draggable={false}
    style={{
      display: "block",
      objectFit: "contain",
      pointerEvents: "none",
      userSelect: "none",
    }}
  />
);

const tabs = [
  { label: "Dashboard", icon: <MdDashboard size={22} />, route: "/" },
  { label: "Products", icon: <MdInventory2 size={22} />, route: "/products" },
  { label: "Categories", icon: <MdCategory size={22} />, route: "/categories" },
  { label: "Voucher", icon: <MdLocalOffer size={22} />, route: "/voucher" },
  { label: "Posts", icon: <MdPostAdd size={22} />, route: "/posts" },
  { label: "Orders", icon: <MdShoppingCart size={22} />, route: "/orders" },
  { label: "Comments", icon: <MdComment size={22} />, route: "/comments" },
  { label: "Media", icon: <MdPhotoLibrary size={22} />, route: "/media" },
  { label: "Tags", icon: <MdLabel size={22} />, route: "/tags" },
  { label: "Permission", icon: <MdAdminPanelSettings size={22} />, route: "/permission" },
  { label: "Users", icon: <MdPeople size={22} />, route: "/users" },
  { label: "Collections", icon: <MdCollectionsBookmark size={22} />, route: "/collections" },
  { label: "Publishers", icon: <MdAdminPanelSettings size={22} />, route: "/publishers" },
];

type SidebarContentProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  navigate: (path: string) => void;
};

const SidebarContent: React.FC<SidebarContentProps> = ({
  collapsed,
  activeTab,
  setActiveTab,
  navigate,
}) => {
  const userId = getCurrentUserId();
  const { data: currentUser } = useGetUserByIdQuery(userId!, { skip: !userId });

  return (
    <div
      className={`flex flex-col h-full overflow-y-auto border-r-2 bg-gradient-to-b from-blue-50 via-white to-blue-100 shadow-xl ${collapsed ? "w-[72px]" : "w-[260px]"} transition-all duration-300 scrollbar-hide`}
      style={{
        scrollbarWidth: "none", // For Firefox
        scrollbarColor: "transparent transparent", // For Firefox
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center px-3 mb-4 mt-3">
        <span
          className="inline-flex items-center justify-center shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-100 to-blue-300 rounded-full transition-all duration-300"
          style={{ width: collapsed ? 44 : 64, height: collapsed ? 44 : 64 }}
        >
          <Logo size={collapsed ? 32 : 48} />
        </span>
      </div>
      {/* Welcome Section */}
      <section className="w-full px-3 border-b-2 border-gray-200 py-6 flex flex-col items-center">
        {!collapsed ? (
          <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-2 bg-gradient-to-br from-yellow-100 to-yellow-200 px-4 py-4 rounded-2xl shadow border border-yellow-200">
            <img
              src={currentUser?.avatar_url ?? undefined}
              alt={currentUser?.username || 'User avatar'}
              className="rounded-full object-cover border-4 border-yellow-400"
              width={56}
              height={56}
              tabIndex={0}
              aria-label={currentUser?.username ? `Avatar of ${currentUser.username}` : 'User avatar'}
            />
            <span
              className="text-yellow-800 text-lg font-bold mt-2 max-w-[140px] truncate"
              title={currentUser?.username}
            >
              Welcome, {currentUser?.username || "User"}!
            </span>
            <span className="text-yellow-700 text-sm font-medium text-center">
              Glad to see you back 👋
            </span>
          </div>
        ) : (
          <Tooltip label={currentUser?.username} placement="right" hasArrow>
            <img
              src={currentUser?.avatar_url ?? undefined}
              alt={currentUser?.username || 'User avatar'}
              className="rounded-full object-cover border-2 border-yellow-400"
              width={32}
              height={32}
              tabIndex={0}
              aria-label={currentUser?.username ? `Avatar of ${currentUser.username}` : 'User avatar'}
            />
          </Tooltip>
        )}
      </section>
      {/* Tabs */}
      <ul className={`flex flex-col gap-1 py-6 w-full px-2 ${collapsed ? "items-center" : ""}`}>
        {tabs.map((tab) => (
          <li key={tab.label} className="w-full">
            <Tooltip label={collapsed ? tab.label : ""} placement="right" hasArrow>
              <button
                className={`flex items-center gap-3 w-full px-2 py-2 rounded-xl transition-all duration-300
                ${collapsed ? "justify-center" : ""}
                ${activeTab === tab.label
                  ? "bg-blue-300 border-l-4 border-blue-600 text-blue-900 font-semibold shadow"
                  : "hover:bg-blue-50 text-blue-700"}
              `}
                onClick={() => {
                  setActiveTab(tab.label);
                  navigate(tab.route);
                }}
                aria-current={activeTab === tab.label ? "page" : undefined}
                aria-label={tab.label}
                tabIndex={0}
                aria-expanded={activeTab === tab.label}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveTab(tab.label);
                    navigate(tab.route);
                  }
                }}
              >
                {tab.icon}
                {!collapsed && <span className="truncate">{tab.label}</span>}
              </button>
            </Tooltip>
          </li>
        ))}
        <hr className="bg-blue-200 h-[1px] mt-6 w-full" />
      </ul>
    </div>
  );
};

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const found = tabs.find(tab => tab.route === location.pathname);
    if (found) setActiveTab(found.label);
  }, [location.pathname]);

  // Drawer for mobile
  if (isMobile) {
    return (
      <Drawer isOpen={!!isOpen} placement="left" onClose={onClose ?? (() => {})}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <SidebarContent
            collapsed={false}
            setCollapsed={() => {}}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navigate={navigate}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  // --- Place the button absolutely, below the navbar, so it's never obscured ---
  return (
    <div
      className={`relative h-screen transition-all duration-300 z-[200] ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
      style={{ minWidth: collapsed ? 72 : 260 }}
    >
      {/* Collapse/Expand Button */}
      <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right" hasArrow>
        <Button
          onClick={() => setCollapsed((prev) => !prev)}
          className="fixed z-[210] left-[60px] md:left-[244px] transition-all duration-300 bg-white border border-gray-200 shadow-lg p-1 w-10 h-10 flex items-center justify-center hover:bg-blue-100 focus:outline-none rounded-full"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          tabIndex={0}
          type="button"
          style={{
            top: 88, // Place below the navbar (adjust if your navbar height changes)
            left: collapsed ? 60 : 244, // 72px sidebar - 12px overlap, or 260px - 16px overlap
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            border: "1.5px solid #e5e7eb",
            outline: 'none',
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setCollapsed(prev => !prev);
            }
          }}
        >
          <img
            src="/assets/icons/lefticon.svg"
            height={24}
            width={24}
            alt="toggle sidebar"
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </Tooltip>
      <SidebarContent
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigate={navigate}
      />
    </div>
  );
};

export default Sidebar;