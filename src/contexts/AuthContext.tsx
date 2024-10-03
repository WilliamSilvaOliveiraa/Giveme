import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode"; // Certifique-se de que o import está correto (sem chaves)

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true); // Estado para verificar o carregamento

  useEffect(() => {
    console.log("useEffect: Verificando token...");
    const token = localStorage.getItem("accessToken");

    if (token) {
      console.log("Token encontrado:", token);
      try {
        const decoded: any = jwtDecode(token);
        console.log("Token decodificado:", decoded);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          console.log("Token válido, ainda não expirado.");
          setIsAuthenticated(true);
        } else {
          console.log("Token expirado, removendo token...");
          localStorage.removeItem("accessToken");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
    } else {
      console.log("Nenhum token encontrado.");
      setIsAuthenticated(false);
    }
    setLoading(false); // O carregamento termina após a verificação do token
  }, []);

  const login = (token: string) => {
    console.log("login: Salvando token no localStorage e autenticando...");
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("logout: Removendo token do localStorage e desautenticando...");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      <>
        {" "}
        {console.log(
          "Renderizando AuthProvider, loading:",
          loading,
          "isAuthenticated:",
          isAuthenticated
        )}
        {!loading && children}
        {/* Só renderiza o children se não estiver carregando */}{" "}
      </>
    </AuthContext.Provider>
  );
};
