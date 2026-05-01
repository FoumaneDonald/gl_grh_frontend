import { ROLES } from "@/core/constants/roles";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/",
    icon: "LayoutDashboard",
    roles: Object.values(ROLES), // everyone
  },
  {
    label: "Employees",
    path: "/employees",
    icon: "Users",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RH_MANAGER,
      ROLES.RH_ASSITANT,
      ROLES.DG,
    ],
  },
  {
    label: "Leaves",
    path: "/leaves",
    icon: "CalendarDays",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RH_MANAGER,
      ROLES.RH_ASSITANT,
      ROLES.CHEF_SERVICE,
      ROLES.EMPLOYE,
      ROLES.DG,
    ],
  },
  {
    label: "Payroll",
    path: "/payroll",
    icon: "Banknote",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RH_MANAGER,
      ROLES.RH_ASSITANT,
      ROLES.COMPTABLE,
      ROLES.DG,
    ],
  },
  {
    label: "Contracts",
    path: "/contracts",
    icon: "FileText",
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.RH_MANAGER,
      ROLES.RH_ASSITANT,
      ROLES.DG,
    ],
  },
  {
    label: "User Management",
    path: "/users",
    icon: "ShieldCheck",
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
];
