import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { API_BASE } from "../lib/api.js";

const AuthContext = createContext(null);

// Helper to get stored token
const getStoredToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

// Helper to get stored user
const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        try {
          const response = await fetch(`${API_BASE}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setToken(null);
          }
        } catch (err) {
          console.error("Token verification failed:", err);
        }
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      
      // If admin, also store admin token for admin panel
      if (data.data.isAdmin) {
        localStorage.setItem("adminToken", data.data.token);
      }
      
      setToken(data.data.token);
      setUser(data.data.user);
      setLoading(false);

      return { 
        success: true, 
        message: data.message, 
        isAdmin: data.data.isAdmin,
        user: data.data.user,
        token: data.data.token
      };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setLoading(false);

      // Return data for verification step
      return { 
        success: true, 
        message: data.message,
        requiresVerification: data.requiresVerification,
        verificationCode: data.verificationCode, // For demo/dev - remove in production
        emailFailed: data.emailFailed
      };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const verifyRegistration = async (email, code) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Store token and user after successful verification
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      
      setToken(data.data.token);
      setUser(data.data.user);
      setLoading(false);

      return { success: true, message: data.message };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const resendVerificationCode = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/resend-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      setLoading(false);

      return { 
        success: true, 
        message: data.message,
        verificationCode: data.verificationCode, // For demo/dev - remove in production
        emailFailed: data.emailFailed
      };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    setUser(null);
    setToken(null);
    setError(null);
  };

  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Update failed");
      }

      // Update stored user
      localStorage.setItem("user", JSON.stringify(data.data.user));
      setUser(data.data.user);
      setLoading(false);

      return { success: true, message: data.message };
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: !!user && !!token,
      login,
      register,
      verifyRegistration,
      resendVerificationCode,
      logout,
      updateProfile,
      clearError: () => setError(null)
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
