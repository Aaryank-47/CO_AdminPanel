import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check auth status on initial load
 useEffect(() => {
  const checkAuthStatus = async () => {
    const adminToken = localStorage.getItem("adminToken");
    const adminInfo = localStorage.getItem("admin");
    if(!adminToken){
      console.error('Not getting adminToekn from the local storage ');
    }
    console.log("adminToken : ", adminToken);

    try {
      setLoading(true);
      const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/verify-token', {
        method: 'GET',
        // credentials: 'include',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type' : 'application/json'
        }
      });

      if (!response.ok) throw new Error("Not authenticated");

      const data = await response.json();
      if(!data){
        console.error("Error in getting the data ");
      }
      console.log("data.adminInfo : ",adminInfo);
      setUser(adminInfo);

      // ✅ Redirect only if on auth pages (avoid infinite loop)
      if (['/login', '/signup'].includes(location.pathname)) {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.log("Auth check failed:", error.message);
      setUser(null);2

      // ✅ Redirect to login only if already not on auth pages
      if (!['/login', '/signup'].includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  checkAuthStatus();
  // ✅ Only run once on mount
}, []);


  const logout = async () => {
    try {
      await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/logout', {
        method: 'POST',
        credentials:'include',
        headers: {
          // 'Authorization': `Bearer ${adminToken}`,
          'Content-Type' : 'application/json'
        }
      });

      localStorage.removeItem("admin");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminToken");


    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setUser(null);
      toast.success("Logged out successfully");
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      setUser,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


















// // src/context/AuthContext.jsx
// import { createContext, useState, useEffect, useContext, useCallback } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-hot-toast";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const clearAuthData = () => {
//     localStorage.removeItem("admin");
//     localStorage.removeItem("adminId");
//     localStorage.removeItem("adminToken");
//     setUser(null);
//   };

//   // Initialize auth state
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const admin = localStorage.getItem("admin");
//         const adminId = localStorage.getItem("adminId");
//         const adminToken = localStorage.getItem("adminToken");

//         if (!admin || !adminId || !adminToken) {
//           clearAuthData();
//           return;
//         }

//         // Verify token with backend
//         const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/verify-token', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${adminToken}`,
//             'Content-Type': 'application/json'
//           },
//           credentials: 'include' // Essential for cookies
//         });

//         if (!response.ok) {
//           throw new Error("Token verification failed");
//         }

//         const data = await response.json();
//         setUser({
//           ...JSON.parse(admin),
//           adminId,
//           adminToken
//         });

//       } catch (error) {
//         console.error("Auth verification error:", error);
//         clearAuthData();
//       } finally {
//         setLoading(false);
//         setAuthChecked(true);
//       }
//     };

//     checkAuthStatus();
//   }, [navigate, location.pathname]);

//   const login = useCallback(async (adminEmail, adminPassword) => {
//     try {
//       setLoading(true);
      
//       const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/login', {
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json"
//         },
//         credentials: 'include', // Essential for cookies
//         body: JSON.stringify({ adminEmail, adminPassword })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Login failed");
//       }

//       const data = await response.json();
      
//       // Validate response structure
//       if (!data?.adminInfo || !data?.adminId || !data?.adminToken) {
//         throw new Error("Invalid response data from server");
//       }

//       // Store all auth data
      // localStorage.setItem("admin", JSON.stringify(data.adminInfo));
      // localStorage.setItem("adminId", data.adminId);
      // localStorage.setItem("adminToken", data.adminToken);

//       // Update state
//       setUser({
//         ...data.adminInfo,
//         adminId: data.adminId,
//         adminToken: data.adminToken
//       });

//       toast.success("Logged in successfully");
//       navigate('/dashboard');
      
//       return true;
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(error.message || "Login failed. Please try again.");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   const signup = useCallback(async (userData) => {
//     const { adminName, adminEmail, collegeName, adminPassword, phoneNumber, confirmPassword, role } = userData;

//     if (adminPassword !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return false;
//     }

//     try {
//       const response = await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           adminName,
//           adminEmail,
//           collegeName,
//           adminPassword,
//           phoneNumber,
//           role
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Registration failed");
//       }

//       toast.success("Account created successfully!");
//       navigate('/login');
//       return true;
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error(error.message || "Registration failed. Please try again.");
//       return false;
//     }
//   }, [navigate]);

//   const logout = useCallback(async () => {
//     try {
//       await fetch('https://canteen-order-backend.onrender.com/api/v1/admin/logout', {
//         method: 'POST',
//         credentials: 'include'
//       });
//     } catch (error) {
//       console.error("Logout API error:", error);
//     } finally {
//       clearAuthData();
//       toast.success("Logged out successfully");
//       navigate('/login');
//     }
//   }, [navigate]);

//   // Function to get auth headers for API requests
//   const getAuthHeaders = useCallback(() => {
//     const adminToken = localStorage.getItem("adminToken");
//     return {
//       'Authorization': `Bearer ${adminToken}`,
//       'Content-Type': 'application/json'
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{
//       user,
//       loading: loading || !authChecked,
//       login,
//       signup,
//       logout,
//       getAuthHeaders,
//       isAuthenticated: !!user
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };