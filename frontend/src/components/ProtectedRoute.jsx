import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-banana-50 to-lilac/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-royal/20 border-t-royal rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink/60">Loading royal credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
