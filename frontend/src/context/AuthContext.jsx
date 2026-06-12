import { createContext, useContext, useMemo, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

const readStorage = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch (_error) {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch (_error) {
    // Authentication still works for the current session if storage is unavailable.
  }
};

const removeStorage = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (_error) {
    // Ignore storage errors caused by browser privacy settings.
  }
};

const getStoredUser = () => {
  try {
    const storedUser = readStorage("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (_error) {
    removeStorage("token");
    removeStorage("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    writeStorage("token", data.token);
    writeStorage("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    writeStorage("token", data.token);
    writeStorage("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    removeStorage("token");
    removeStorage("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      register
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
