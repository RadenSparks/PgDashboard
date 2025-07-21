import { useState, useRef, useEffect } from "react";
import { FaSearch, FaBars, FaMoon, FaSun } from "react-icons/fa";
import { Input } from "../widgets/input";
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
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useGetUserByIdQuery } from "../../redux/api/usersApi";
import { getCurrentUserId } from "../../utils/auth";

const Navbar = () => {
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const dropdownBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
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

  const handleSignout = () => {
    clearAuth();
    window.location.href = "/signin";
  };

  return (
    <Box w="full" bg={bgColor}>
      <Flex
        h={{ base: "64px", md: "96px" }}
        px={{ base: 4, md: 8 }}
        borderBottom="1px solid"
        borderColor={borderColor}
        bg={bgColor}
        justify="space-between"
        align="center"
        className="relative z-50"
      >
        {/* Hamburger */}
        {isMobile && (
          <IconButton
            aria-label="Menu"
            icon={<FaBars />}
            onClick={onOpen}
            display={{ base: "flex", md: "none" }}
            variant="ghost"
            fontSize="xl"
            rounded="full"
            bg={bgColor}
            _hover={{ bg: hoverBg }}
          />
        )}

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
              placeholder="Search for anything..."
              className="h-10 md:h-12 w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-sm"
            />
          </Flex>
        </Box>

        {/* Right side */}
        <Flex align="center" gap={4} className="min-w-fit">
          {/* Dark Mode */}
          <IconButton
            aria-label="Toggle dark"
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
            <img
              src="/assets/icons/calendar.svg"
              alt="calendar"
              width={28}
              height={28}
              className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition"
              onClick={() => {
                setCalendarOpen(!calendarOpen);
                setNotificationOpen(false);
                setMenuOpen(false);
              }}
            />
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
                <div className="text-center font-semibold mb-2">May 2025</div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
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
            <img
              src="/assets/icons/notification.svg"
              alt="notification"
              width={28}
              height={28}
              className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition"
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setCalendarOpen(false);
                setMenuOpen(false);
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
            />
            {!notificationOpen && notifications.some(n => !n.read) && (
              <Box
                position="absolute"
                top={0}
                right="-8px"
                bg="red.500"
                color="white"
                fontSize="xs"
                rounded="full"
                w={4}
                h={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {notifications.filter(n => !n.read).length}
              </Box>
            )}
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
                <div className="px-4 py-2 font-semibold border-b border-gray-200 dark:border-gray-600">Notifications</div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-gray-400">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                      {n.text}
                    </div>
                  ))
                )}
                <div className="px-4 py-2 text-center text-xs text-gray-400 border-t dark:border-gray-600">View all</div>
              </Box>
            )}
          </Box>

          {/* User Menu */}
          <Box position="relative" ref={menuRef} display={{ base: "none", sm: "block" }}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-600 border border-yellow-300 dark:border-yellow-500 rounded-xl text-yellow-800 dark:text-white font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-500"
              onClick={() => {
                setMenuOpen(!menuOpen);
                setNotificationOpen(false);
                setCalendarOpen(false);
              }}
            >
              <span className="text-lg max-w-[100px] truncate" title={currentUser?.username}>
                {currentUser?.username || "User"}
              </span>
              <MdOutlineKeyboardArrowDown size={24} />
            </button>
            {menuOpen && (
              <Box
                position="absolute"
                top={12}
                right={0}
                bg={dropdownBg}
                border="1px solid"
                borderColor={borderColor}
                rounded="xl"
                shadow="xl"
                py={2}
                minW="180px"
              >
                <button className={`block w-full px-4 py-2 text-left hover:bg-${hoverBg}`}>Profile</button>
                <button className={`block w-full px-4 py-2 text-left hover:bg-${hoverBg}`}>Settings</button>
                <button
                  className={`block w-full px-4 py-2 text-left hover:bg-${hoverBg}`}
                  onClick={handleSignout}
                >
                  Signout
                </button>
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
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              onClick={handleSignout}
            >
              Signout
            </button>
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
