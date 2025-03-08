import React, { useState } from 'react';
import Chat from './components/Chat';
import { FaMoon, FaSun, FaTrash, FaRobot, FaEllipsisV } from 'react-icons/fa';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClearChatHistory = () => {
    const event = new CustomEvent('clearChatHistory');
    window.dispatchEvent(event);
    setShowDropdown(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm text-gray-800 dark:text-white flex justify-between items-center py-3 px-4 md:px-6">
        <div className="flex items-center">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md mr-3">
            <FaRobot className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              RexGT
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">v.4.0 Community</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Menu"
            >
              <FaEllipsisV size={18} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                <div className="py-1">
                  <button
                    onClick={handleClearChatHistory}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaTrash size={14} />
                    <span>Clear chat history</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>
      
      <footer className="py-2 px-4 text-center text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div>Powered by ChatGPT</div>
          <div>© {new Date().getFullYear()} All Rights Reserved</div>
        </div>
      </footer>
    </div>
  );
};

export default App;