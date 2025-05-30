import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/widgets/input";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaMoon, FaSun } from "react-icons/fa"; // Add icons for dark/light

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const menuRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Toggle dark mode (simple implementation)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Close menus when clicking outside
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

  return (
    <div className="w-full">
      <div className="flex h-[96px] px-8 w-full items-center border-b-2 border-[#dbdbdb] bg-gradient-to-r from-blue-100 via-white to-blue-200 shadow-sm">
        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1 px-4 w-[415px] rounded-lg bg-secondary-2">
            <FaSearch className="text-primary" />
            <Input
              type="text"
              placeholder="Search for anything..."
              className="h-12 w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>
        {/* Right side: Profile and Icons */}
        <div className="flex items-center gap-6 ml-8">
          {/* Dark/Light Mode Toggle */}
          <button
            className="p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 transition"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? (
              <FaSun className="text-yellow-500" size={20} />
            ) : (
              <FaMoon className="text-gray-700" size={20} />
            )}
          </button>
          {/* Calendar Button */}
          <div className="relative" ref={calendarRef}>
            <img
              src="/assets/icons/calendar.svg"
              alt="calendar"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => {
                setCalendarOpen((open) => !open);
                setNotificationOpen(false);
                setMenuOpen(false);
              }}
            />
            {calendarOpen && (
              <div className="absolute left-0 top-8 z-50 min-w-[260px] bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                {/* Simple calendar mockup, replace with a real calendar component if needed */}
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
              </div>
            )}
          </div>
          {/* Notification Button */}
          <div className="relative" ref={notificationRef} style={{ minWidth: 32 }}>
            <img
              src="/assets/icons/notification.svg"
              alt="notification"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => {
                setNotificationOpen((open) => !open);
                setCalendarOpen(false);
                setMenuOpen(false);
              }}
            />
            {/* Badge */}
            {!notificationOpen && (
              <span
                className="absolute top-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                style={{ right: "-10px", left: "auto" }}
              >
                3
              </span>
            )}
            {notificationOpen && (
              <div className="absolute right-0 top-8 z-50 min-w-[220px] bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 font-semibold border-b">Notifications</div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">New order received</div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Product out of stock</div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">User signed up</div>
                <div className="px-4 py-2 text-center text-xs text-gray-400 border-t">View all</div>
              </div>
            )}
          </div>
          {/* User Menu */}
          <div className="relative flex gap-2" ref={menuRef}>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg shadow font-semibold text-yellow-800 hover:bg-yellow-200 transition"
              onClick={() => {
                setMenuOpen((open) => !open);
                setCalendarOpen(false);
                setNotificationOpen(false);
              }}
            >
              <span className="text-lg">Belrose</span>
              <MdOutlineKeyboardArrowDown
                color="#292D32"
                className="cursor-pointer"
                size={24}
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-14 z-50 min-w-[160px] bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Profile</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Settings</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
