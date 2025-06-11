import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  FastFoodIcon,
  ReceiptIcon,
  AnalyticsIcon,
  FeedbackIcon,
  SettingsIcon,
} from "./Icons.jsx";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200"
      : "hover:bg-gray-100 dark:hover:bg-gray-800";
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">
            🍽️ CO Admin
          </h2>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(
                "/"
              )}`}
            >
              <HomeIcon className="w-5 h-5" />
              <span className="ml-3">Dashboard</span>
            </Link>
            <Link
              to="/food"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(
                "/food"
              )}`}
            >
              <FastFoodIcon className="w-5 h-5" />
              <span className="ml-3">Food Items</span>
            </Link>
            <Link
              to="/order"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(
                "/order"
              )}`}
            >
              <ReceiptIcon className="w-5 h-5" />
              <span className="ml-3">Orders</span>
            </Link>
            <Link
              to="/analytics"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(
                "/analytics"
              )}`}
            >
              <AnalyticsIcon className="w-5 h-5" />
              <span className="ml-3">Analytics</span>
            </Link>
            <Link
              to="/feedback"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(
                "/feedback"
              )}`}
            >
              <FeedbackIcon className="w-5 h-5" />
              <span className="ml-3">Feedback</span>
            </Link>
            <Link
              to="/settings"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive(
                "/settings"
              )}`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="ml-3">Settings</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;