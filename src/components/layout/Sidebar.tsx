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
  MdFeedback,
} from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, useBreakpointValue, Tooltip } from "@chakra-ui/react";
import { useGetUserByIdQuery } from "../../redux/api/usersApi";
import { getCurrentUserId } from "../../utils/auth";

const Logo = ({ size = 80 }: { size?: number }) => (
  <img
    src="/assets/icons/logopengoo.png"
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
  { label: "Bảng điều khiển", icon: <MdDashboard size={22} />, route: "/" },
  { label: "Sản phẩm", icon: <MdInventory2 size={22} />, route: "/products" },
  { label: "Danh mục", icon: <MdCategory size={22} />, route: "/categories" },
  { label: "Voucher", icon: <MdLocalOffer size={22} />, route: "/voucher" },
  { label: "Bài viết", icon: <MdPostAdd size={22} />, route: "/posts" },
  { label: "Đơn hàng", icon: <MdShoppingCart size={22} />, route: "/orders" },
  { label: "Bình luận", icon: <MdComment size={22} />, route: "/comments" },
  { label: "Thư viện", icon: <MdPhotoLibrary size={22} />, route: "/media" },
  { label: "Thẻ", icon: <MdLabel size={22} />, route: "/tags" },
  // { label: "Phân quyền", icon: <MdAdminPanelSettings size={22} />, route: "/permission" },
  { label: "Người dùng", icon: <MdPeople size={22} />, route: "/users" },
  { label: "Bộ sưu tập", icon: <MdCollectionsBookmark size={22} />, route: "/collections" },
  { label: "Nhà phát hành", icon: <MdAdminPanelSettings size={22} />, route: "/publishers" },
  { label: "Yêu cầu", icon: <MdFeedback size={22} />, route: "/feedback" },
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
        scrollbarWidth: "none",
        scrollbarColor: "transparent transparent",
      }}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center px-3 mb-4 mt-3">
        <span
          className="inline-flex items-center justify-center shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-100 to-blue-300 rounded-full transition-all duration-300"
          style={{ width: collapsed ? 43 : 80, height: collapsed ? 56 : 80 }}
        >
          <Logo size={collapsed ? 57 : 68} />
        </span>
      </div>
      {/* Welcome Section */}
      <section className="w-full px-3 border-b-2 border-gray-200 py-6 flex flex-col items-center">
        {!collapsed ? (
          <div className="w-full max-w-xs mx-auto flex flex-col items-center gap-2 bg-gradient-to-br from-yellow-100 to-yellow-200 px-4 py-4 rounded-2xl shadow border border-yellow-200">
            <img
              src={currentUser?.avatar_url ?? undefined}
              alt={currentUser?.username || 'Ảnh người dùng'}
              className="rounded-full object-cover border-4 border-yellow-400"
              width={56}
              height={56}
              tabIndex={0}
              aria-label={currentUser?.username ? `Ảnh đại diện của ${currentUser.username}` : 'Ảnh người dùng'}
            />
            <span
              className="text-yellow-800 text-lg font-bold mt-2 max-w-[140px] truncate"
              title={currentUser?.username}
            >
              Xin chào, {currentUser?.username || "Người dùng"}!
            </span>
            <span className="text-yellow-700 text-sm font-medium text-center">
              Rất vui được gặp lại bạn 👋
            </span>
          </div>
        ) : (
          <Tooltip label={currentUser?.username} placement="right" hasArrow>
            <img
              src={currentUser?.avatar_url ?? undefined}
              alt={currentUser?.username || 'Ảnh người dùng'}
              className="rounded-full object-cover border-2 border-yellow-400"
              width={32}
              height={32}
              tabIndex={0}
              aria-label={currentUser?.username ? `Ảnh đại diện của ${currentUser.username}` : 'Ảnh người dùng'}
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
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, collapsed, setCollapsed }) => {
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

  return (
    <div
      className={`relative h-screen transition-all duration-300 z-[200] ${collapsed ? 'w-[72px]' : 'w-[260px]'}`}
      style={{ minWidth: collapsed ? 72 : 260 }}
    >
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