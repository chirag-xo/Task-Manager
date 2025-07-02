import React, { useState, useEffect } from 'react';
import { User } from './types';
import { storageUtils } from './utils/storage';
import { useTheme } from './hooks/useTheme';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = storageUtils.getUser();
    if (savedUser) {
      // Ensure user has preferences object for backward compatibility
      if (!savedUser.preferences) {
        savedUser.preferences = { darkMode: false };
      }
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (username: string) => {
    const newUser: User = {
      username,
      loginDate: new Date().toISOString(),
      preferences: {
        darkMode: isDark,
      },
    };
    storageUtils.saveUser(newUser);
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <Dashboard username={user.username} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;