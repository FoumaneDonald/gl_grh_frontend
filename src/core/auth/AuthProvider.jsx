import { useEffect, useState } from "react";
import { useAuth } from "@/core/auth/useAuth";
import { useAuthStore } from "@/core/auth/authStore";

export default function AuthProvider({ children }) {
  const [checking, setChecking] = useState(true);
  const { validateSession } = useAuth();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const init = async () => {
      if (token) {
        await validateSession();
      }
      setChecking(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs once on mount

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return children;
}
