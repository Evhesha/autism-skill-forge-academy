"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
};

const API_BASE_URL = "http://localhost:3000";
const STORAGE_KEY = "asf_user";
const TOKEN_KEY = "token";

const AuthContext = createContext<AuthContextValue | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const pair = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return pair ? decodeURIComponent(pair.split("=")[1] ?? "") : null;
}

function hasValidToken() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(readCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY));
}

function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed.id || !parsed.email || !parsed.name) {
      return null;
    }

    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name,
    };
  } catch {
    return null;
  }
}

function getInitialUser() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!hasValidToken()) {
    return null;
  }

  return parseStoredUser(localStorage.getItem(STORAGE_KEY));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return hasValidToken();
  });

  const login = async (payload: LoginPayload) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const data = (await response.json()) as
      | { user: { id: number | string; name: string; email: string }; token?: string }
      | { error?: string };

    if (!response.ok || !("user" in data)) {
      throw new Error(("error" in data && data.error) || "Не удалось войти.");
    }

    const normalized: AuthUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      if ("token" in data && typeof data.token === "string") {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
    }

    setUser(normalized);
    setIsAuthenticated(true);
    return normalized;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      throw new Error(data.error || "Не удалось зарегистрироваться.");
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // local logout is still applied
    }

    setUser(null);
    setIsAuthenticated(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  useEffect(() => {
    const syncSession = () => {
      const valid = hasValidToken();
      setIsAuthenticated(valid);
      if (!valid) {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    };

    syncSession();
    const intervalId = window.setInterval(syncSession, 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated, login, register, logout }),
    [isAuthenticated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
