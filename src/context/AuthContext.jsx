import { createContext, useContext, useEffect, useState } from "react";
import { authApi, ApiError } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, ask the backend who — if anyone — the current session
  // cookie belongs to. This is the source of truth, not localStorage.
  useEffect(() => {
    let cancelled = false;

    authApi
      .me()
      .then(({ user: sessionUser }) => {
        if (!cancelled) setUser(sessionUser);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { user: loggedInUser } = await authApi.login({ email, password });
      setUser(loggedInUser);
      return { success: true, user: loggedInUser };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed.";
      return { success: false, error: message };
    }
  };

  const signup = async (payload) => {
    try {
      const { user: newUser } = await authApi.signup(payload);
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      if (err instanceof ApiError) {
        return { success: false, error: err.message, fieldErrors: err.data?.errors };
      }
      return { success: false, error: "Signup failed." };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
