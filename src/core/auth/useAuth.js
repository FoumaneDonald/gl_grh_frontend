import { useAuthStore } from "@/core/auth/authStore";
import { authService } from "@/modules/auth/services/authService";

export const useAuth = () => {
  const { token, user, isAuthenticated, setToken, setUser, clearAuth } =
    useAuthStore();

  // Called after a successful login/register — fetches the full user profile
  const fetchAndStoreUser = async (token) => {
    setToken(token);
    const response = await authService.me();
    setUser(response);
  };

  // Called once on app load — validates stored token is still good
  const validateSession = async () => {
    if (!token) return;
    const response = await authService.me();
    setUser(response);
  };

  const logout = () => {
    clearAuth();
  };

  // user.role is a Role object: { id, name, description }
  // name values match RoleEnum: SUPER_ADMIN, ADMIN, RH_MANAGER, etc.
  const hasRole = (requiredRoles) => {
    if (!user?.role?.name) return false;
    const userRole = "ROLE_" + user.role.name; // e.g. "ROLE_RH_MANAGER"
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole);
    }
    return userRole === requiredRoles;
  };

  return {
    token,
    user,
    isAuthenticated,
    fetchAndStoreUser,
    validateSession,
    logout,
    hasRole,
  };
};
