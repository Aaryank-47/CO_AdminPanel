// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAdminId = localStorage.getItem("adminId");
        const storedToken = localStorage.getItem("token");
        
        if (storedUser && storedAdminId && storedToken) {
          // Verify token with backend
          const response = await fetch('http://localhost:5000/api/v1/admin/verify-token', { 
            method: 'GET',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            setUser({
              ...JSON.parse(storedUser),
              adminId: storedAdminId,
              token: storedToken
            });
            navigate("/dashboard"); // Redirect to dashboard if authenticated
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("user");
            localStorage.removeItem("adminId");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Auth verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const login = useCallback(async (adminEmail, adminPassword) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ adminEmail, adminPassword })
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          ...data.adminInfo,
          adminId: data.adminId,
          token: data.token
        };
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(data.adminInfo));
        localStorage.setItem("adminId", data.adminId);
        localStorage.setItem("token", data.token);
        
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error("Login error:", error);
    }
  }, [navigate]);

  const signup = useCallback(async (userData) => {
    const { adminName, adminEmail, collegeName, adminPassword, phoneNumber, confirmPassword } = userData;

    if (adminPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ 
          adminName, 
          adminEmail, 
          collegeName, 
          adminPassword, 
          phoneNumber 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        // Auto-login after successful signup
        await login(adminEmail, adminPassword);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error("Registration error:", error);
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await fetch('http://localhost:5000/api/v1/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("adminId");
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("An error occurred during logout");
      console.error("Logout error:", error);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};