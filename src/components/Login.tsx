import React, { useState } from 'react';
import { User, LogIn, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsSubmitting(true);
      // Simulate loading for better UX
      setTimeout(() => {
        onLogin(username.trim());
        setIsSubmitting(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="max-w-md w-full space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-0 duration-500 delay-200">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-300">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-400">
            Enter your username to continue to your tasks
          </p>
        </div>
        
        <form className="mt-8 space-y-6 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-500" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800"
                  placeholder="Enter your username"
                  disabled={isSubmitting}
                />
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isSubmitting}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Continue to Dashboard
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;