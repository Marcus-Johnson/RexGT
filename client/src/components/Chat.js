import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import roles from '../data/roles.attribute.json';
import prompts from '../data/message.prompts.json';

const Chat = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('chat');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClearChatHistory = () => {
      setMessages([]);
    };

    window.addEventListener('clearChatHistory', handleClearChatHistory);

    return () => {
      window.removeEventListener('clearChatHistory', handleClearChatHistory);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let userMessage = { role: 'user', content: prompt };

    if (selectedModel === 'category_chat') {
      userMessage = {
        role: 'user',
        content: `Category chat: ${selectedRole}, ${selectedCategory} sent.`,
      };
    }

    setMessages([...messages, userMessage]);
    setLoading(true);
    setPrompt('');

    const endpointMap = {
      chat: '/api/chat',
      image: '/api/image',
      category_chat: '/api/category_chat',
    };

    const requestBody = selectedModel === 'category_chat'
      ? { role: selectedRole, category: selectedCategory }
      : { prompt };

    fetch(`http://localhost:3000${endpointMap[selectedModel]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('API Response:', data);
        const newResponse = data.choices
          ? data.choices[0].message.content
          : data.message
          ? data.message.content
          : data.url || data.file || '';
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'ai', content: newResponse },
        ]);
      })
      .catch((error) => {
        console.error('Error fetching the API:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'ai', content: 'Error fetching the API response.' },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isImageUrl = (url) => {
    return /\.(jpeg|jpg|gif|png)$/.test(url) || url.includes("blob.core.windows.net");
  };

  const selectMessage = (index) => {
    chatContainerRef.current.scrollTop = index * 100; // Scroll to selected message
  };

  return (
    <div className={`flex h-full ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col flex-1">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 chat-container">
          {messages.length === 0 && !loading && (
            <div className="text-gray-500 text-center">Type a message and select a model to start...</div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'} p-4 rounded-lg`}
            >
              {msg.role === 'ai' ? (
                isImageUrl(msg.content) ? (
                  <img src={msg.content} alt="Generated content" className="generated-image" />
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )
              ) : (
                msg.content
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col p-4 border-t border-gray-300 relative">
          <div className="flex items-center mb-4">
            {selectedModel === 'category_chat' ? (
              <>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border border-gray-300 rounded-l-lg p-2 bg-white flex-1 mr-2"
                >
                  <option value="">Select Role</option>
                  {roles.starter_prompts_including_roles.map((role, index) => (
                    <option key={index} value={role}>{role}</option>
                  ))}
                </select>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-r-lg p-2 bg-white flex-1"
                >
                  <option value="">Select Category</option>
                  {Object.keys(prompts.prompts).map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </>
            ) : (
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg"
              />
            )}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border border-gray-300 rounded-r-lg p-2 bg-white ml-2"
            >
              <option value="chat">Chat</option>
              <option value="image">Image Generator</option>
              <option value="category_chat">Category Chat</option>
            </select>
            <button type="submit" className="ml-4 p-2 bg-blue-500 text-white rounded-lg">
              Send
            </button>
          </div>
          {loading && (
            <div className="loading-indicator absolute bottom-15 left-4">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chat;