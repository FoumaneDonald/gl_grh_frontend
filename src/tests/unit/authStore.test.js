import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/core/auth/authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("should have empty initial state", () => {
    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should set token correctly", () => {
    useAuthStore.getState().setToken("test-token");
    expect(useAuthStore.getState().token).toBe("test-token");
  });

  it("should set user and mark as authenticated", () => {
    const mockUser = {
      id: 1,
      fullName: "Super Admin",
      email: "super.admin@email.com",
      role: { id: 1, name: "SUPER_ADMIN" },
    };
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it("should clear auth state on logout", () => {
    useAuthStore.getState().setToken("test-token");
    useAuthStore.getState().setUser({ id: 1, fullName: "Test" });
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
