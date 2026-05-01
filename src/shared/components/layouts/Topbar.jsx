import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/core/auth/useAuth";
import { Button } from "@/components/ui/button";

export default function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      {/* Left — hamburger */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* Right — user + logout */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
          <p className="text-xs text-gray-500">{user?.role?.name}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={18} className="text-gray-600" />
        </Button>
      </div>
    </header>
  );
}
