// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RealTimeClock from "./RealTimeClock";
import ThemeToggle from "./ThemeToggle";

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
    <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow">
      <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
        🍽️ CO Admin
      </div>
      <div className="flex items-center gap-6">
        <RealTimeClock />
        {user ? (
          <>
            <Link to="/notifications" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              🔔
            </Link>
            <div className="relative" ref={profileRef}>
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="Profile menu"
                aria-expanded={isProfileOpen}
              >
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  {user.name?.charAt(0) || "A"}
                </div>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link 
            to="/login" 
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Login
          </Link>
        )}
        <ThemeToggle />
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