import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "@/core/auth/ProtectedRoute";
import { ROLES } from "@/core/constants/roles";
import LoginPage from "@/modules/auth/pages/LoginPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";
import AppLayout from "@/shared/components/layouts/AppLayout";
import {
  Dashboard,
  Unauthorized,
  NotFound,
} from "@/shared/components/placeholders";

export const router = createBrowserRouter([
  // Guest-only
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  { path: "/unauthorized", element: <Unauthorized /> },

  // Protected — all wrapped in AppLayout
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <Dashboard /> },

          {
            element: (
              <ProtectedRoute
                allowedRoles={[
                  ROLES.SUPER_ADMIN,
                  ROLES.ADMIN,
                  ROLES.RH_MANAGER,
                  ROLES.RH_ASSITANT,
                  ROLES.DG,
                ]}
              />
            ),
            children: [
              {
                path: "/employees",
                element: <div className="p-8">M1 — Employees</div>,
              },
            ],
          },
          {
            element: (
              <ProtectedRoute
                allowedRoles={[
                  ROLES.SUPER_ADMIN,
                  ROLES.ADMIN,
                  ROLES.RH_MANAGER,
                  ROLES.RH_ASSITANT,
                  ROLES.CHEF_SERVICE,
                  ROLES.EMPLOYE,
                  ROLES.DG,
                ]}
              />
            ),
            children: [
              {
                path: "/leaves",
                element: <div className="p-8">M2 — Leaves</div>,
              },
            ],
          },
          {
            element: (
              <ProtectedRoute
                allowedRoles={[
                  ROLES.SUPER_ADMIN,
                  ROLES.ADMIN,
                  ROLES.RH_MANAGER,
                  ROLES.RH_ASSITANT,
                  ROLES.COMPTABLE,
                  ROLES.DG,
                ]}
              />
            ),
            children: [
              {
                path: "/payroll",
                element: <div className="p-8">M3 — Payroll</div>,
              },
            ],
          },
          {
            element: (
              <ProtectedRoute
                allowedRoles={[
                  ROLES.SUPER_ADMIN,
                  ROLES.ADMIN,
                  ROLES.RH_MANAGER,
                  ROLES.RH_ASSITANT,
                  ROLES.DG,
                ]}
              />
            ),
            children: [
              {
                path: "/contracts",
                element: <div className="p-8">M4 — Contracts</div>,
              },
            ],
          },
          {
            element: (
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} />
            ),
            children: [
              {
                path: "/users",
                element: <div className="p-8">User Management</div>,
              },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
