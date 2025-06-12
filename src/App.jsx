import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AuthModal from "./components/AuthModal .jsx";

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
    <>
      <div className="w-screen flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - Only visible when authenticated */}
        <PrivateRoute>
          <Sidebar />
        </PrivateRoute>

        {/* Main Area */}
        <div className="w-full flex flex-col flex-1 overflow-hidden">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="w-full flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/food"
                element={
                  <PrivateRoute>
                    <Food />
                  </PrivateRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <PrivateRoute>
                    <Order />
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <Analytics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <PrivateRoute>
                    <Feedback />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notification />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <AdminProfile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>

        {/* Auth Modal */}
        <AuthModal />
        <Toaster position="top-right" />
      </div>
    </>
  );
};

export default App;








// const App = () => {
//   return (
    
//       <>
//         <div className="w-screen flex h-screen v-screen bg-gray-50 dark:bg-gray-900">
//           {/* Sidebar - Only visible when authenticated */}
//           <PrivateRoute>
//             <Sidebar />
//           </PrivateRoute>

//           {/* Main Area */}
//           <div className="w-full flex flex-col flex-1 overflow-hidden overflow-x-auto">
//             {/* Navbar - Only visible when authenticated */}
//             <PrivateRoute>
//               <Navbar />
//             </PrivateRoute>

//             {/* Page Content */}
//             <main className="w-full flex-1 overflow-y-auto p-4 md:p-6">
//               <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route
//                   path="/"
//                   element={
//                     <PrivateRoute>
//                       <Dashboard />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/food"
//                   element={
//                     <PrivateRoute>
//                       <Food />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/order"
//                   element={
//                     <PrivateRoute>
//                       <Order />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/analytics"
//                   element={
//                     <PrivateRoute>
//                       <Analytics />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/feedback"
//                   element={
//                     <PrivateRoute>
//                       <Feedback />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/settings"
//                   element={
//                     <PrivateRoute>
//                       <Settings />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/notifications"
//                   element={
//                     <PrivateRoute>
//                       <Notification />
//                     </PrivateRoute>
//                   }
//                 />
//                 <Route
//                   path="/profile"
//                   element={
//                     <PrivateRoute>
//                       <AdminProfile />
//                     </PrivateRoute>
//                   }
//                 />
//               </Routes>
//             </main>
//           </div>
//           <Toaster position="top-right" />
//         </div>
//       </>
    
//   );
// };

// export default App;