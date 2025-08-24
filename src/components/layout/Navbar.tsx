import { useState, useRef, useEffect } from "react";
import { FaSearch, FaMoon, FaSun, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Input } from "../widgets/input";
import { Button } from "../widgets/button";
import { Avatar, AvatarImage, AvatarFallback } from "../widgets/avatar";
import { Badge } from "../widgets/badge";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { clearAuth } from "../../utils/auth";
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { useGetUserByIdQuery } from "../../redux/api/usersApi";
import { getCurrentUserId } from "../../utils/auth";

const Navbar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order received", read: false },
    { id: 2, text: "Product out of stock", read: false },
    { id: 3, text: "User signed up", read: false },
  ]);

  const menuRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const userId = getCurrentUserId();
  const { data: currentUser } = useGetUserByIdQuery(userId!, { skip: !userId });
  const { isOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue(
    "linear-gradient(90deg, #e0ecff 0%, #c3e0ff 40%, #e0f7fa 100%)",
    "linear-gradient(90deg, #232946 0%, #1a2233 100%)"
  );
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const dropdownBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("yellow.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
        notificationRef.current && !notificationRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
        setCalendarOpen(false);
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add: Close dropdown on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Add: Focus first menu item when menu opens
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (menuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [menuOpen]);

  // Add: User info for dropdown
  const userDisplay = (
    <Flex align="center" gap={3} px={4} py={3} borderBottom="1px solid" borderColor={borderColor}>
      <Avatar className="w-10 h-10 border-2 border-yellow-400">
        <AvatarImage src={currentUser?.avatar_url ?? undefined} alt={currentUser?.username ?? undefined} />
        <AvatarFallback>{currentUser?.username?.[0] || "U"}</AvatarFallback>
      </Avatar>
      <Box>
        <Text fontWeight="bold" color="blue.700" fontSize="md" noOfLines={1}>
          {currentUser?.username || "Người dùng"}
        </Text>
        <Text fontSize="xs" color="gray.500" noOfLines={1}>
          {currentUser?.email || ""}
        </Text>
      </Box>
    </Flex>
  );

  const handleSignout = () => {
    clearAuth();
    window.location.href = "/signin";
  };

  return (
    <Box
      w="full"
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={110}
      bgGradient="linear(to-r, blue.400, cyan.300, pink.200)"
      style={{
        backdropFilter: "blur(8px)",
        borderBottom: "1.5px solid #e5e7eb",
        boxShadow: "0 2px 12px 0 rgba(30,64,175,0.06)",
        backgroundColor: "rgba(29, 114, 194, 0.85)",
      }}
    >
      <Flex
        h={{ base: "64px", md: "80px" }}
        px={{ base: 4, md: 8 }}
        borderBottom="1px solid"
        borderColor={borderColor}
        bg={bgColor}
        justify="space-between"
        align="center"
        className="relative"
      >
        {/* Collapse/Expand Button */}
        <Tooltip label={collapsed ? "Mở rộng menu" : "Thu gọn menu"} placement="right" hasArrow>
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className={`
              group
              w-11 h-11
              bg-white
              border border-blue-200
              shadow-xl
              rounded-full
              flex items-center justify-center
              transition-all duration-300
              hover:bg-blue-100
              focus:outline-none focus:ring-2 focus:ring-blue-400
              active:scale-95
              mr-4
            `}
            aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
            aria-pressed={collapsed}
            tabIndex={0}
            type="button"
            style={{
              boxShadow: "0 4px 16px 0 rgba(30,64,175,0.10)",
              outline: 'none',
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                setCollapsed(prev => !prev);
              }
            }}
          >
            <span className="sr-only">{collapsed ? "Mở rộng menu" : "Thu gọn menu"}</span>
            <img
              src="/assets/icons/lefticon.svg"
              height={28}
              width={28}
              alt=""
              className={`
                transition-transform duration-300
                ${collapsed ? "rotate-180" : ""}
                group-hover:scale-110
              `}
              style={{ filter: "drop-shadow(0 1px 2px rgba(30,64,175,0.10))" }}
            />
          </button>
        </Tooltip>

        {/* Search Bar */}
        <Box flex="1" display={{ base: "none", sm: "block" }} px={4}>
          <Flex
            align="center"
            gap={2}
            bg={useColorModeValue("gray.100", "gray.700")}
            px={4}
            py={2}
            rounded="xl"
            border={`1px solid ${borderColor}`}
            maxW={{ base: "100%", md: "415px" }}
            mx="auto"
          >
            <FaSearch className="text-blue-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="h-10 md:h-12 w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm"
            />
          </Flex>
        </Box>

        {/* Right side */}
        <Flex align="center" gap={4} className="min-w-fit">
          {/* Dark Mode */}
          <IconButton
            aria-label="Chuyển chế độ sáng/tối"
            icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
            rounded="full"
            bg={bgColor}
            _hover={{ bg: hoverBg }}
          />

          {/* Calendar */}
          <Box position="relative" ref={calendarRef} display={{ base: "none", sm: "block" }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setCalendarOpen(!calendarOpen);
                setNotificationOpen(false);
                setMenuOpen(false);
              }}
              aria-label="Mở lịch"
            >
              <img
                src="/assets/icons/calendar.svg"
                alt="calendar"
                width={28}
                height={28}
                className="rounded"
              />
            </Button>
            {calendarOpen && (
              <Box
                position="absolute"
                top={10}
                left={0}
                zIndex={40}
                bg={dropdownBg}
                border="1px solid"
                borderColor={borderColor}
                rounded="xl"
                shadow="xl"
                p={4}
                minW="260px"
                color={textColor}
              >
                <div className="text-center font-semibold mb-2">Tháng 5/2025</div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  <span>CN</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
                  <span className="col-span-4" />
                  {[...Array(31)].map((_, i) => (
                    <span
                      key={i}
                      className={`rounded px-1 ${i === 0 ? "bg-yellow-300 dark:bg-yellow-500" : ""}`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </Box>
            )}
          </Box>

          {/* Notification */}
          <Box position="relative" ref={notificationRef} display={{ base: "none", sm: "block" }}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setCalendarOpen(false);
                setMenuOpen(false);
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
              aria-label="Thông báo"
            >
              <img
                src="/assets/icons/notification.svg"
                alt="notification"
                width={28}
                height={28}
                className="rounded"
              />
              {notifications.some(n => !n.read) && (
                <Badge
                  variant="destructive"
                  className="absolute top-0 right-0 text-xs px-1 py-0.5"
                  style={{ transform: "translate(40%,-40%)" }}
                >
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>
            {notificationOpen && (
              <Box
                position="absolute"
                right={0}
                top={10}
                zIndex={40}
                bg={dropdownBg}
                border="1px solid"
                borderColor={borderColor}
                rounded="xl"
                shadow="xl"
                minW="220px"
                color={textColor}
              >
                <div className="px-4 py-2 font-semibold border-b border-gray-200 dark:border-gray-600">Thông báo</div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-gray-400">Không có thông báo</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                      {n.text}
                    </div>
                  ))
                )}
                <div className="px-4 py-2 text-center text-xs text-gray-400 border-t dark:border-gray-600">Xem tất cả</div>
              </Box>
            )}
          </Box>

          {/* User Menu */}
          <Box position="relative" ref={menuRef} display={{ base: "none", sm: "block" }}>
            <Button
              variant="secondary"
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setNotificationOpen(false);
                setCalendarOpen(false);
              }}
              aria-label="Mở menu người dùng"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls="user-menu-dropdown"
            >
              <Avatar className="w-8 h-8 border-2 border-yellow-400">
                <AvatarImage src={currentUser?.avatar_url ?? undefined} alt={currentUser?.username ?? undefined} />
                <AvatarFallback>{currentUser?.username?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <span className="text-lg max-w-[100px] truncate" title={currentUser?.username}>
                {currentUser?.username || "Người dùng"}
              </span>
              <MdOutlineKeyboardArrowDown size={24} />
            </Button>
            {menuOpen && (
              <Box
                id="user-menu-dropdown"
                position="absolute"
                top={12}
                right={0}
                bg={dropdownBg}
                border="1px solid"
                borderColor={borderColor}
                rounded="2xl"
                shadow="2xl"
                py={2}
                minW="220px"
                zIndex={100}
                style={{
                  animation: "fadeIn 0.18s cubic-bezier(.4,0,.2,1)",
                  boxShadow: "0 8px 32px 0 rgba(30,64,175,0.10)",
                }}
              >
                {userDisplay}
                <Button
                  ref={firstMenuItemRef}
                  variant="ghost"
                  className="w-full text-left px-4 py-2 rounded-none hover:bg-blue-50 focus:bg-blue.100"
                  tabIndex={0}
                  onClick={() => {
                    setMenuOpen(false);
                    // TODO: navigate to profile page
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FaUser size={18} />
                    Hồ sơ
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-left px-4 py-2 rounded-none hover:bg-blue-50 focus:bg-blue.100"
                  tabIndex={0}
                  onClick={() => {
                    setMenuOpen(false);
                    // TODO: navigate to settings page
                  }}
                >
                  <span className="flex items-center gap-2">
                    <FaCog size={18} />
                    Cài đặt
                  </span>
                </Button>
                <Box px={4} py={2}>
                  <Button
                    variant="ghost"
                    className="w-full text-left px-0 py-2 text-red-600 rounded-none hover:bg-red-50 focus:bg-red.100"
                    onClick={handleSignout}
                    tabIndex={0}
                  >
                    <span className="flex items-center gap-2">
                      <FaSignOutAlt size={18} />
                      Đăng xuất
                    </span>
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>

      {/* Drawer (Mobile) */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={bgColor} color={textColor}>
          <DrawerCloseButton />
          <Box p={4}>
            <Button
              variant="ghost"
              className="block w-full text-left px-4 py-2"
              onClick={handleSignout}
            >
              Đăng xuất
            </Button>
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
