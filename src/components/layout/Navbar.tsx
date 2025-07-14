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

  // Drawer for mobile menu
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(event.target as Node) &&
        calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
        notificationRef.current && !notificationRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
        setCalendarOpen(false);
        setNotificationOpen(false);
      }
      if (
        calendarRef.current && !calendarRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false);
      }
      if (
        notificationRef.current && !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSignout(): void {
    clearAuth();
    window.location.href = "/signin";
  }

  return (
    <Box w="full">
      <Flex
        h={{ base: "64px", md: "96px" }}
        px={{ base: 4, md: 8 }}
        w="full"
        align="center"
        borderBottom="2px"
        borderColor="#dbdbdb"
        bgGradient="linear(to-r, blue.100, white, blue.200)"
        boxShadow="sm"
        justify="space-between"
      >
        {/* Hamburger for mobile */}
        {isMobile && (
          <IconButton
            aria-label="Open menu"
            icon={<FaBars />}
            variant="ghost"
            fontSize="2xl"
            onClick={onOpen}
            mr={2}
            rounded="full"
            bg="white"
            boxShadow="md"
            _hover={{ bg: "blue.50" }}
          />
        )}

        {/* Center: Search Bar */}
        <Box flex="1" display={{ base: "none", sm: "flex" }} justifyContent="center">
          <Flex
            align="center"
            gap={2}
            px={4}
            w={{ base: "100%", md: "415px" }}
            rounded="xl"
            bg="gray.100"
            boxShadow="sm"
            border="1px solid #e5e7eb"
          >
            <FaSearch className="text-primary" />
            <Input
              type="text"
              placeholder="Search for anything..."
              className="h-10 md:h-12 w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
          </Flex>
        </Box>

        {/* Right side: Profile and Icons */}
        <Flex align="center" gap={{ base: 2, md: 6 }} ml={{ base: 2, md: 8 }}>
          {/* Dark/Light Mode Toggle */}
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "dark" ? <FaSun color="#ECC94B" /> : <FaMoon color="#2D3748" />}
            onClick={toggleColorMode}
            variant="ghost"
            size="md"
            rounded="full"
            bg="white"
            boxShadow="md"
            _hover={{ bg: "yellow.50" }}
          />
          {/* Calendar Button */}
          <Box position="relative" ref={calendarRef} display={{ base: "none", sm: "block" }}>
            <img
              src="/assets/icons/calendar.svg"
              alt="calendar"
              width={28}
              height={28}
              className="cursor-pointer rounded-lg hover:bg-blue-50 transition"
              onClick={() => {
                setCalendarOpen((open) => !open);
                setNotificationOpen(false);
                setMenuOpen(false);
              }}
            />
            {calendarOpen && (
              <Box position="absolute" left={0} top={10} zIndex={50} minW="260px" bg="white" border="1px solid" borderColor="gray.200" rounded="xl" shadow="xl" p={4}>
                <div className="text-center font-semibold mb-2">May 2025</div>
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-700">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  <span className="col-span-4"></span>
                  <span className="rounded bg-yellow-200 px-1">1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                  <span>11</span>
                  <span>12</span>
                  <span>13</span>
                  <span>14</span>
                  <span>15</span>
                  <span>16</span>
                  <span>17</span>
                  <span>18</span>
                  <span>19</span>
                  <span>20</span>
                  <span>21</span>
                  <span>22</span>
                  <span>23</span>
                  <span>24</span>
                  <span>25</span>
                  <span>26</span>
                  <span>27</span>
                  <span>28</span>
                  <span>29</span>
                  <span>30</span>
                  <span>31</span>
                </div>
              </Box>
            )}
          </Box>
          {/* Notification Button */}
          <Box position="relative" ref={notificationRef} minW={8} display={{ base: "none", sm: "block" }}>
            <img
              src="/assets/icons/notification.svg"
              alt="notification"
              width={28}
              height={28}
              className="cursor-pointer rounded-lg hover:bg-blue-50 transition"
              onClick={() => {
                setNotificationOpen((open) => !open);
                setCalendarOpen(false);
                setMenuOpen(false);
                setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
              }}
            />
            {notifications.some(n => !n.read) && !notificationOpen && (
              <Box
                position="absolute"
                top={0}
                right="-10px"
                bg="red.500"
                color="white"
                fontSize="xs"
                rounded="full"
                w={4}
                h={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="md"
              >
                {notifications.filter(n => !n.read).length}
              </Box>
            )}
            {notificationOpen && (
              <Box position="absolute" right={0} top={10} zIndex={50} minW="220px" bg="white" border="1px solid" borderColor="gray.200" rounded="xl" shadow="xl" py={2}>
                <div className="px-4 py-2 font-semibold border-b">Notifications</div>
                {notifications.length === 0 ? (
                  <div className="px-4 py-2 text-gray-400">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">{n.text}</div>
                  ))
                )}
                <div className="px-4 py-2 text-center text-xs text-gray-400 border-t">View all</div>
              </Box>
            )}
          </Box>
          {/* User Menu */}
          <Box position="relative" ref={menuRef} display={{ base: "none", sm: "flex" }} gap={2}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-xl shadow font-semibold text-yellow-800 hover:bg-yellow-200 transition"
              onClick={() => {
                setMenuOpen((open) => !open);
                setCalendarOpen(false);
                setNotificationOpen(false);
              }}
            >
              <span
                className="text-lg max-w-[100px] truncate"
                title={currentUser?.username}
              >
                {currentUser?.username || "User"}
              </span>
              <MdOutlineKeyboardArrowDown
                color="#292D32"
                className="cursor-pointer"
                size={24}
              />
            </button>
            {menuOpen && (
              <Box position="absolute" right={0} top={16} zIndex={50} minW="180px" bg="white" border="1px solid" borderColor="gray.200" rounded="xl" shadow="xl" py={2}>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">Profile</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">Settings</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg" onClick={handleSignout}>Signout</button>
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>

      {/* Mobile Drawer for menu */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <Box p={4}>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
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
