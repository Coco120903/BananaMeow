import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE } from "../lib/api.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const currentToken = localStorage.getItem("adminToken");
      
      if (!currentToken) {
        setLoading(false);
        return;
      }

      // Update token state if it changed in localStorage
      if (currentToken !== token) {
        setToken(currentToken);
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/admin/verify`, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAdmin(data.admin);
        } else {
          localStorage.removeItem("adminToken");
          setToken(null);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("adminToken");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Direct function to set admin state (used when logging in via unified login)
  const setAdminAuth = (adminData, adminToken) => {
    localStorage.setItem("adminToken", adminToken);
    setToken(adminToken);
    setAdmin(adminData);
  };

  const login = async (username, password) => {
    // Use the unified login endpoint (admin uses username as "email")
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Check if this is actually an admin login
    if (!data.data.isAdmin) {
      throw new Error("Invalid admin credentials");
    }

    localStorage.setItem("adminToken", data.data.token);
    setToken(data.data.token);
    setAdmin(data.data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, token, loading, login, logout, setAdminAuth, isAuthenticated: !!admin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
