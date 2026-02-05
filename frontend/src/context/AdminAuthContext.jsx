import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE } from "../lib/api.js";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/auth/admin/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
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

  const login = async (username, password) => {
    const response = await fetch(`${API_BASE}/api/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("adminToken", data.token);
    setToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, token, loading, login, logout, isAuthenticated: !!admin }}
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
