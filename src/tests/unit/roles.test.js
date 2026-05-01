import { describe, it, expect } from "vitest";
import { ROLES, MODULE_ACCESS } from "@/core/constants/roles";

describe("ROLES constants", () => {
  it("should define all required roles", () => {
    expect(ROLES.SUPER_ADMIN).toBe("ROLE_SUPER_ADMIN");
    expect(ROLES.ADMIN).toBe("ROLE_ADMIN");
    expect(ROLES.RH_MANAGER).toBe("ROLE_RH_MANAGER");
    expect(ROLES.RH_ASSITANT).toBe("ROLE_ASSISTANT_RH");
    expect(ROLES.CHEF_SERVICE).toBe("ROLE_CHEF_DE_SERVICE");
    expect(ROLES.EMPLOYE).toBe("ROLE_EMPLOYE");
    expect(ROLES.COMPTABLE).toBe("ROLE_COMPTABLE");
  });
});

describe("MODULE_ACCESS", () => {
  it("SUPER_ADMIN should have access to all modules", () => {
    Object.values(MODULE_ACCESS).forEach((roles) => {
      expect(roles).toContain(ROLES.SUPER_ADMIN);
    });
  });

  it("EMPLOYE should only access m2_leaves", () => {
    expect(MODULE_ACCESS.m2_leaves).toContain(ROLES.EMPLOYE);
    expect(MODULE_ACCESS.m1_employees).not.toContain(ROLES.EMPLOYE);
    expect(MODULE_ACCESS.m3_payroll).not.toContain(ROLES.EMPLOYE);
    expect(MODULE_ACCESS.m4_contracts).not.toContain(ROLES.EMPLOYE);
  });

  it("COMPTABLE should only access m3_payroll", () => {
    expect(MODULE_ACCESS.m3_payroll).toContain(ROLES.COMPTABLE);
    expect(MODULE_ACCESS.m1_employees).not.toContain(ROLES.COMPTABLE);
    expect(MODULE_ACCESS.m2_leaves).not.toContain(ROLES.COMPTABLE);
    expect(MODULE_ACCESS.m4_contracts).not.toContain(ROLES.COMPTABLE);
  });
});
