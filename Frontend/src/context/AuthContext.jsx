import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem('aiml_username');
    const storedToken = localStorage.getItem('aiml_token');
    if (storedUsername && storedToken) {
      setUsername(storedUsername);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const loginUser = (newUsername, newToken) => {
    setUsername(newUsername);
    setToken(newToken);
    localStorage.setItem('aiml_username', newUsername);
    localStorage.setItem('aiml_token', newToken);
  };

  const logout = () => {
    setUsername(null);
    setToken(null);
    localStorage.removeItem('aiml_username');
    localStorage.removeItem('aiml_token');
  };

  const isAuthenticated = !!username && !!token;

  return (
    <AuthContext.Provider value={{ username, token, isAuthenticated, loading, login: loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
