import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  UsersRound,
  Users,
  Headphones,
  Handshake,
  BarChart3,
  ClipboardList,
} from "lucide-react";

import LogOut from "./log-out.svg?react";
import ProfileImg from "./profile.jpg";

const getInitials = (name) => {
  const parts = name.split(" ");
  return parts[0][0].toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
};

const Sidebar = () => {
  const userName = "Raj Kumar";

  const [isOpen, setIsOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const location = useLocation();

  // Handle auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 767) {
        setIsSmallScreen(true);
        setIsOpen(false);
      } else {
        setIsSmallScreen(false);
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((x) => !x);

  // Sidebar width depends on screen + collapse state
  const sidebarWidth = isOpen ? "w-64" : isSmallScreen ? "w-12" : "w-20";

  // NAV ITEM
  const NavItem = ({ to, label, Icon }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`group relative flex items-center px-4 py-2   mb-2 rounded-md transition-all
          ${isActive ? "text-green-500 bg-[#3e412c]" : "text-gray-300 hover:text-blue-300"}`}
      >
        {/* Icon (small on mobile) */}
        <Icon
          className={`transition-all
            ${isSmallScreen ? "w-4 h-4" : "w-5 h-5"}
          `}
        />

        {/* Label text (visible only when expanded) */}
        {isOpen && (
          <span className="ml-3 text-sm sm:text-base md:text-lg">
            {label}
          </span>
        )}

        {/* Tooltip when collapsed */}
        {!isOpen && (
          <span
            className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
            group-hover:opacity-100 transition-all"
          >
            {label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`
        ${sidebarWidth}
        h-auto flex flex-col justify-between
        bg-gradient-to-b from-[#3c6565] via-[#131d1d] to-[#1C2B2B]
        text-gray-300 transition-all duration-300
      `}
    >
      {/* TOP SECTION */}
      <div>
        {/* Profile + toggle */}
        <div
          className="flex items-center justify-center px-4 py-4 cursor-pointer"
          onClick={toggleSidebar}
        >
          <div className="flex flex-col items-center w-full">
            {/* Avatar */}
            <div
              className="
                rounded-full overflow-hidden border border-gray-500 shadow
                h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16
                flex items-center justify-center
              "
            >
              {ProfileImg ? (
                <img src={ProfileImg} className="h-full w-full object-cover" />
              ) : (
                <span className="text-white font-bold text-lg">
                  {getInitials(userName)}
                </span>
              )}
            </div>

            {/* Name (only when open) */}
            {isOpen && (
              <span className="mt-2 font-semibold tracking-wide text-xs sm:text-sm md:text-base">
                {userName}
              </span>
            )}
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-4">
          <NavItem to="/" label="Home" Icon={Home} />
          <NavItem to="/leads" label="Leads" Icon={UsersRound} />
          <NavItem to="/customers" label="Customers" Icon={Users} />
          <NavItem to="/support" label="Support" Icon={Headphones} />
          <NavItem to="/deals" label="Deals" Icon={Handshake} />
          <NavItem to="/reports" label="Reports" Icon={BarChart3} />
          <NavItem to="/taskAndActivities" label="Tasks" Icon={ClipboardList} />
        </nav>
      </div>



      {/* BOTTOM SECTION */}
      <div className="flex items-center px-4 py-4 border-t border-[#1e293b] relative">
        {isOpen ? (
          <>
            <LogOut className="w-6 h-6 text-red-500 mr-3" />
            <p className="text-sm font-medium text-red-500">Log Out</p>
          </>
        ) : (
          <div className="group cursor-pointer">
            <LogOut className="text-red-500 w-5 h-5" />

            <span
              className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
              group-hover:opacity-100 transition-all"
            >
              Log Out
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
