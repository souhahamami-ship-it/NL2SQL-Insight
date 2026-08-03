import { createContext, useContext, useState } from "react";
import { getToken, saveToken, removeToken } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

    const login = (token) => {
        saveToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        removeToken();
        localStorage.removeItem("chatHistory");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}