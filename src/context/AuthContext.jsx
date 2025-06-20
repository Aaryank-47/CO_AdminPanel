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
        const storedadminToken = localStorage.getItem("adminToken");

        // if(!storedUser || !storedAdminId || !storedToken){
        //   throw new Error("Not getting token or user or adminId", error.message);
        // }

        // console.log("storedUser : ",storedUser)
        // console.log("storedAdminId : ", storedAdminId)
        console.log("storedToken : ", storedadminToken)

        if (storedUser && storedAdminId && storedadminToken) {
          // Verify token with backend
          const response = await fetch('http://localhost:5000/api/v1/admin/verify-token', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${storedadminToken}`
            }
          });

          const data = await response.json();
          console.log("data : ", data)

          if (response.ok) {
            setUser({
              ...JSON.parse(storedUser),
              adminId: storedAdminId,
              adminToken: storedadminToken
            });
            console.log("adminToken Sccuessfully get verified");
            // navigate("/dashboard"); // Redirect to dashboard if authenticated
          } else if (!response.ok) {
            // Token is invalid, clear storage
            localStorage.removeItem("user");
            localStorage.removeItem("adminId");
            localStorage.removeItem("adminToken");
            throw new Error("Error in verifying the token : ", data.message)
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

      console.log("Login response : ", response);
      console.log("Login response status : ", response.status);
      console.log("Login reponse headers : ", response.headers);

      if (!response.ok) {
        throw new Error("Login failed with status: " + response.status);
      }

      const data = await response.json();
      if (!data) {
        throw new Error("No data received from server : ", data.message);
      }
      console.log("data : ", data)

      if (response.ok) {
        const userData = {
          ...data.adminInfo,
          adminId: data.adminId,
          adminToken: data.adminToken
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(data.adminInfo));
        localStorage.setItem("adminId", data.adminId);
        localStorage.setItem("adminToken", data.adminToken);

        console.log("adminToken : ", data.adminToken);
        console.log("adminId", data.adminId)

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
    const { adminName, adminEmail, collegeName, adminPassword, phoneNumber, confirmPassword, role  } = userData;

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
          phoneNumber,
          role 
        }),
      });

      const data = await response.json();
      console.log("data : ", data);

      if (response.ok) {
        toast.success("Account created successfully!");
        // Auto-login after successful signup
        navigate("/login");
      } else if (!response.ok) {
        toast.error(data.message || "Registration failed");
        console.log("Singup reponse failed : ", data.message)
      }
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error("Registration error:", error);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await fetch('http://localhost:5000/api/v1/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminToken");
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