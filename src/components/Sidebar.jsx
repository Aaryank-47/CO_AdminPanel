import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  FastFoodIcon,
  ReceiptIcon,
  AnalyticsIcon,
  FeedbackIcon,
  SettingsIcon,
  UserIcon
} from "./Icons.jsx";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200"
      : "hover:bg-gray-100 dark:hover:bg-gray-800";
  };

  const menuItems = [
    { path: "/", icon: <HomeIcon className="w-5 h-5" />, label: "Dashboard" },
    { path: "/food", icon: <FastFoodIcon className="w-5 h-5" />, label: "Food Items" },
    { path: "/order", icon: <ReceiptIcon className="w-5 h-5" />, label: "Orders" },
    { path: "/analytics", icon: <AnalyticsIcon className="w-5 h-5" />, label: "Analytics" },
    { path: "/feedback", icon: <FeedbackIcon className="w-5 h-5" />, label: "Feedback" },
    { path: "/settings", icon: <SettingsIcon className="w-5 h-5" />, label: "Settings" },
  ];

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 h-screen bg-white shadow-sm border-r border-gray-100">
          <div className="flex items-center h-20 px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3 group">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600 transition-all duration-300 group-hover:rotate-12">
                <FastFoodIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                CO <span className="text-orange-500 transition-all duration-300 group-hover:text-orange-600">Admin</span>
              </h2>
            </div>
          </div>
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${isActive(item.path)
                    ? "bg-gradient-to-r from-orange-50 to-orange-50/70 text-orange-600 font-medium border-l-4 border-orange-500 shadow-[0_4px_12px_rgba(249,115,22,0.1)]"
                    : "text-gray-600 hover:bg-orange-50/50 hover:text-orange-500 hover:translate-x-1 hover:shadow-[0_2px_8px_rgba(249,115,22,0.1)]"
                    }`}
                >
                  <span className={`p-1.5 rounded-md transition-colors ${isActive(item.path)
                    ? "bg-orange-100 text-orange-600"
                    : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-500"}`}>
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.label}</span>
                  {isActive(item.path) && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 transition-all duration-300 group-hover:rotate-6">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <button className="text-xs text-orange-500 hover:text-orange-600 transition-colors duration-200 flex items-center">
                  Sign Out
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation for smaller screens */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 px-4 md:hidden z-50">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center text-xs ${isActive(item.path) ? "text-orange-500" : "text-gray-500"}`}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Sidebar;



















// import { Link, useLocation } from "react-router-dom";
// import {
//   HomeIcon,
//   FastFoodIcon,
//   ReceiptIcon,
//   AnalyticsIcon,
//   FeedbackIcon,
//   SettingsIcon,
//   UserIcon
// } from "./Icons.jsx";

// const Sidebar = () => {
//   const location = useLocation();

//   const isActive = (path) => {
//     return location.pathname === path
//       ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200"
//       : "hover:bg-gray-100 dark:hover:bg-gray-800";
//   };

//   return (
//     <div className="hidden md:flex md:flex-shrink-0">
//       <div className="flex flex-col w-64 h-screen bg-white shadow-sm border-r border-gray-100">
//         {/* Logo/Header with premium styling */}
//         <div className="flex items-center h-20 px-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3 group">
//             <div className="p-2 rounded-lg bg-orange-100 text-orange-600 transition-all duration-300 group-hover:rotate-12">
//               <FastFoodIcon className="w-6 h-6" />
//             </div>
//             <h2 className="text-xl font-bold text-gray-800">
//               CO <span className="text-orange-500 transition-all duration-300 group-hover:text-orange-600">Admin</span>
//             </h2>
//           </div>
//         </div>

//         {/* Navigation - Premium interactions */}
//         <div className="flex-1 px-3 py-4 overflow-y-auto">
//           <nav className="space-y-2">
//             {[
//               { path: "/", icon: <HomeIcon className="w-5 h-5" />, label: "Dashboard" },
//               { path: "/food", icon: <FastFoodIcon className="w-5 h-5" />, label: "Food Items" },
//               { path: "/order", icon: <ReceiptIcon className="w-5 h-5" />, label: "Orders" },
//               { path: "/analytics", icon: <AnalyticsIcon className="w-5 h-5" />, label: "Analytics" },
//               { path: "/feedback", icon: <FeedbackIcon className="w-5 h-5" />, label: "Feedback" },
//               { path: "/settings", icon: <SettingsIcon className="w-5 h-5" />, label: "Settings" },
//             ].map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${isActive(item.path)
//                   ? "bg-gradient-to-r from-orange-50 to-orange-50/70 text-orange-600 font-medium border-l-4 border-orange-500 shadow-[0_4px_12px_rgba(249,115,22,0.1)]"
//                   : "text-gray-600 hover:bg-orange-50/50 hover:text-orange-500 hover:translate-x-1 hover:shadow-[0_2px_8px_rgba(249,115,22,0.1)]"
//                   }`}
//               >
//                 <span className={`p-1.5 rounded-md transition-colors ${isActive(item.path)
//                   ? "bg-orange-100 text-orange-600"
//                   : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-500"}`}>
//                   {item.icon}
//                 </span>
//                 <span className="ml-3">{item.label}</span>
//                 {isActive(item.path) && (
//                   <span className="ml-auto w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
//                 )}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         {/* User Profile with elegant styling */}
//         <div className="p-4 border-t border-gray-100">
//           <div className="flex items-center space-x-3 group">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-600 transition-all duration-300 group-hover:rotate-6">
//               <UserIcon className="w-5 h-5" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-700">Admin User</p>
//               <button className="text-xs text-orange-500 hover:text-orange-600 transition-colors duration-200 flex items-center">
//                 Sign Out
//                 <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;