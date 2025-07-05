// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RealTimeClock from "./RealTimeClock";
import ThemeToggle from "./ThemeToggle";
import {
  BellIcon,
  ChevronDownIcon,
  UserIcon,
  PowerIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand with animation */}
          <div className="flex-shrink-0 flex items-center group">
            <div className="text-2xl font-bold text-orange-600 flex items-center transition-all duration-300 hover:text-orange-700">
              <span className="mr-2 group-hover:rotate-12 transition-transform duration-300">🍽️</span>
              <span className="hidden sm:inline">CO <span className="text-orange-500">Admin</span></span>
              <span className="sm:hidden">CO</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <RealTimeClock className="text-sm font-medium text-black px-3 py-1 rounded-lg bg-gray-50" />

            {user ? (
              <div className="flex items-center space-x-6">
                {/* Notifications with badge */}
                <Link
                  to="/notifications"
                  className="relative p-1.5 rounded-full hover:bg-orange-50 transition-colors duration-200"
                >
                  <span className="sr-only">Notifications</span>
                  <div className="relative">
                    <BellIcon className="h-5 w-5 text-black hover:text-orange-600 transition-colors" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500 border-2 border-white"></span>
                  </div>
                </Link>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 focus:outline-none group bg-white border-black"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-shadow">
                      {user.name?.charAt(0) || "A"}
                    </div>
                    <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-gray-100 overflow-hidden">
                      <div className="py-1">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-t border-gray-100"
                        >
                          <PowerIcon className="h-4 w-4 mr-2 text-gray-400" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Login
              </Link>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <RealTimeClock className="text-xs font-medium text-black px-2 py-1 rounded-md bg-white" />

            {user ? (
              <div className="flex items-center space-x-3 ">
                <button
                  onClick={toggleProfileMenu}
                  className="relative p-1 rounded-md hover:bg-orange-50 transition-colors bg-white border-black flex items-center justify-center"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium shadow-md group-hover:shadow-lg transition-shadow">
                    {user.name?.charAt(0) || "A"}
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 top-[60px] w-56 rounded-xl shadow-lg bg-white ring-1 ring-gray-100 overflow-hidden z-50">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors border-t border-gray-100"
                      >
                        <PowerIcon className="h-4 w-4 mr-2 text-gray-400" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-sm"
              >
                Login
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;




















// import { Link } from "react-router-dom";
// import { BellIcon, UserCircleIcon, MoonIcon, SunIcon } from "./Icons.jsx";
// import ThemeToggle from "./ThemeToggle";
// import { useAuth } from "../context/AuthContext.jsx";
// import RealTimeClock from "./RealTimeClock.jsx";

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//       <div className="flex items-center">
//         <button className="md:hidden mr-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//         <RealTimeClock />
//       </div>
//       <div className="flex items-center space-x-4">
//         <ThemeToggle />
//         <Link
//           to="/notifications"
//           className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 relative"
//         >
//           <BellIcon className="w-6 h-6" />
//           <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//         </Link>
//         <div className="relative group">
//           <button className="flex items-center space-x-2 focus:outline-none">
//             <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
//               {user?.name?.charAt(0) || "A"}
//             </div>
//             <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">
//               {user?.name || "Admin"}
//             </span>
//           </button>
//           <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
//             <Link
//               to="/profile"
//               className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               Your Profile
//             </Link>
//             <button
//               onClick={logout}
//               className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
//             >
//               Sign out
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;