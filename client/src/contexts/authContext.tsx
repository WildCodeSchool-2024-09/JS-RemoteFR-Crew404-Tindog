// Objective: Create a context to handle the auth of the app
import { createContext, useContext, useState } from "react";
import api from "../services/api";

type AuthContextType = {
  user: UserType | null;
  handleLogin: (user: UserType) => void;
  handleLogout: () => void;
};

type UserType = {
  id: number;
  username: string;
  email: string;
};

// Create a context for the auth
const AuthContext = createContext<AuthContextType | null>(null);

type ChildrenType = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: ChildrenType) => {
  // Provide the current auth to the entire app
  const [user, setUser] = useState<UserType | null>(null);

  const handleLogin = (user: UserType) => {
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook to use the auth
export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return auth;
};
