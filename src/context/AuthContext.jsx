import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("user_role");

    if (token) {
      try {
        const decodedUser = jwtDecode(token);

        // restore role if available
        const updatedUser = storedRole
          ? { ...decodedUser, role: storedRole }
          : decodedUser;

        setUser(updatedUser);
      } catch (error) {
        setUser(null);
      }
    }
  }, []);

  const login = (tokens) => {
    if (!tokens?.access) {
      console.error("Invalid login payload:", tokens);
      return;
    }

    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    localStorage.setItem("user_role", tokens.role); 

    const decodedUser = jwtDecode(tokens.access);
    const updatedUser = { ...decodedUser, role: tokens.role };

    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role"); 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
