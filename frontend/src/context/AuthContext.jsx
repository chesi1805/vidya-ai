import React, { createContext, useContext, useEffect, useState } from "react";
import { api, saveToken, clearToken, hasToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restore() {
      if (hasToken()) {
        try {
          const { user } = await api.me();
          setUser(user);
        } catch {
          clearToken();
        }
      }
      setLoading(false);
    }
    restore();
  }, []);

  async function login(email, password, name) {
    const { token, user } = await api.login(email, password, name);
    saveToken(token);
    setUser(user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
