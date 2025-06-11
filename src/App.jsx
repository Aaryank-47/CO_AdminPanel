import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Food from "./pages/Food.jsx";
import Order from "./pages/Order.jsx";
import Analytics from "./pages/Analytics.jsx";
import Feedback from "./pages/Feedback.jsx";
import Settings from "./pages/Settings.jsx";

import Notification from "./pages/Notification.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/food" element={<Food />} />
              <Route path="/order" element={<Order />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/settings" element={<Settings />} />

              {/* Navbar Pages */}
              <Route path="/notifications" element={<Notification />} />
              <Route path="/profile" element={<AdminProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
