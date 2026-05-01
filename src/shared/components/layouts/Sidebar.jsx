import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Banknote,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { NAV_ITEMS } from "@/core/constants/navigation";
import { useAuth } from "@/core/auth/useAuth";
import { cn } from "@/lib/utils";

const ICONS = {
  LayoutDashboard,
  Users,
  CalendarDays,
  Banknote,
  FileText,
  ShieldCheck,
};

export default function Sidebar({ open }) {
  const { user } = useAuth();

  const userRole = user?.role?.name ? "ROLE_" + user.role.name : null;

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <aside
      className={cn(
        "bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm">
          G
        </div>
        {open && (
          <span className="font-semibold text-lg tracking-tight">
            GRH System
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {visibleItems.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                )
              }
            >
              {Icon && <Icon size={18} className="shrink-0" />}
              {open && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* User info at bottom */}
      {open && user && (
        <div className="px-4 py-3 border-t border-gray-700">
          <p className="text-xs text-gray-400 truncate">{user.fullName}</p>
          <p className="text-xs text-gray-500 truncate">{user.role?.name}</p>
        </div>
      )}
    </aside>
  );
}
