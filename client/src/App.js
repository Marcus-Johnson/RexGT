import React from 'react';
import Chat from './components/Chat';

const App = () => {
  const handleClearChatHistory = () => {
    const event = new CustomEvent('clearChatHistory');
    window.dispatchEvent(event);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-800 text-white flex justify-between items-center p-4 shadow-md">
        <h3 className="text-1xl font-bold">RexGT v.3</h3>
        <div className="flex items-center">
          {/* <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="p-2 bg-gray-700 text-white rounded mx-2"
          >
            Toggle Dark Mode
          </button> */}
          <button
            onClick={handleClearChatHistory}
            className="p-2 bg-red-500 text-white rounded"
          >
            Clear Chat History
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <Chat />
      </main>
    </div>
  );
};

export default App;