import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/core/auth/authStore";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/core/auth/useAuth";

describe("useAuth — hasRole", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("returns false when no user is set", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.hasRole("ROLE_SUPER_ADMIN")).toBe(false);
  });

  it("returns true when user role matches", () => {
    act(() => {
      useAuthStore.getState().setUser({
        id: 1,
        fullName: "Super Admin",
        role: { name: "SUPER_ADMIN" },
      });
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.hasRole("ROLE_SUPER_ADMIN")).toBe(true);
  });

  it("returns true when role is in allowed array", () => {
    act(() => {
      useAuthStore.getState().setUser({
        id: 1,
        fullName: "RH Manager",
        role: { name: "RH_MANAGER" },
      });
    });
    const { result } = renderHook(() => useAuth());
    expect(
      result.current.hasRole(["ROLE_SUPER_ADMIN", "ROLE_RH_MANAGER"]),
    ).toBe(true);
  });

  it("returns false when role is not in allowed array", () => {
    act(() => {
      useAuthStore.getState().setUser({
        id: 1,
        fullName: "Employe",
        role: { name: "EMPLOYE" },
      });
    });
    const { result } = renderHook(() => useAuth());
    expect(
      result.current.hasRole(["ROLE_SUPER_ADMIN", "ROLE_RH_MANAGER"]),
    ).toBe(false);
  });
});
