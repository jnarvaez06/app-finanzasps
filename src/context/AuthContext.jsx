import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL_LOGIN } from '../api/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al iniciar, recuperar token si existe
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL_LOGIN}/validate`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${storedToken}`,
        "Content-Type": "application/json"
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido o expirado");
        return res.json();
      })
      .then((data) => {
        setToken(storedToken);
        setIsAuthenticated(true);
      })
      .catch((err) => {
        sessionStorage.removeItem("token");
        setToken(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (newToken) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);
