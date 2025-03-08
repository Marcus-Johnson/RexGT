import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaRegCopy, 
  FaDownload, 
  FaPaperPlane, 
  FaRobot, 
  FaUser, 
  FaChevronDown,
  FaQuestion,
  FaImage,
  FaFolder,
  FaPencilAlt
} from "react-icons/fa";

import roles from "../data/roles.attribute.json";
import prompts from "../data/message.prompts.json";

const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("chat");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const modelSelectorRef = useRef(null);

  const hasStartedConversation = messages.length > 0;

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleClearChatHistory = () => {
      setMessages([]);
    };

    window.addEventListener("clearChatHistory", handleClearChatHistory);
    return () => {
      window.removeEventListener("clearChatHistory", handleClearChatHistory);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [prompt]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target)) {
        setShowModelSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() && selectedModel !== "category_chat") return;

    let userMessage = { role: "user", content: prompt };

    if (selectedModel === "category_chat") {
      if (!selectedRole || !selectedCategory) {
        toast.warning("Please select both a role and a category");
        return;
      }
      userMessage = {
        role: "user",
        content: `Category chat: ${selectedRole}, ${selectedCategory} sent.`,
      };
    }

    setMessages([...messages, userMessage]);
    setLoading(true);
    setPrompt("");

    const endpointMap = {
      chat: "/api/chat",
      image: "/api/image",
      category_chat: "/api/category_chat",
    };

    const requestBody = selectedModel === "category_chat"
      ? { role: selectedRole, category: selectedCategory }
      : { prompt, temperature: isCreativeMode ? 0.9 : 0.7 }; 

    fetch(`http://localhost:3000${endpointMap[selectedModel]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        const newResponse = data.file
          ? `/public${data.file}`
          : data.choices
          ? data.choices[0].message.content
          : data.message
          ? data.message.content
          : data.url || "";
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: newResponse },
        ]);
      })
      .catch((error) => {
        console.error("Error fetching the API:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "ai", content: "Error fetching the API response." },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isImageUrl = (url) => {
    return (
      /\.(jpeg|jpg|gif|png)$/.test(url) || url.includes("blob.core.windows.net")
    );
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Text copied to clipboard", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });
  };

  const handleDownloadImage = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [isCreativeMode, setIsCreativeMode] = useState(false);
  
  const getModelName = () => {
    if (selectedModel === "chat" && isCreativeMode) {
      return "Creative Mode";
    }
    
    switch(selectedModel) {
      case "chat": return "Chat";
      case "image": return "Image Generator";
      case "category_chat": return "Category Chat";
      default: return "Chat";
    }
  };
  
  const handleModeSelect = (mode) => {
    if (mode === "creative") {
      setSelectedModel("chat");
      setIsCreativeMode(true);
    } else {
      setSelectedModel(mode);
      setIsCreativeMode(false);
    }
    textareaRef.current.focus();
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="bottom-center" theme="colored" />
      
      {/* Only show the top navigation if the user has started a conversation */}
      {hasStartedConversation && (
        <div className="fixed z-10 top-3 left-1/2 transform -translate-x-1/2 flex space-x-1 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 p-1">
          {[
            { id: "chat", icon: <FaQuestion size={14} />, title: "General" },
            { id: "image", icon: <FaImage size={14} />, title: "Image" },
            { id: "category_chat", icon: <FaFolder size={14} />, title: "Category" },
            { id: "creative", icon: <FaPencilAlt size={14} />, title: "Creative" }
          ].map((mode) => (
            <button
              key={mode.id}
              className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                (mode.id === "creative" && isCreativeMode) || 
                (mode.id === "chat" && !isCreativeMode && selectedModel === "chat") || 
                (mode.id !== "chat" && mode.id !== "creative" && selectedModel === mode.id)
                  ? "bg-blue-500 text-white shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => handleModeSelect(mode.id)}
              title={mode.title}
            >
              <span className="mr-1.5">{mode.icon}</span>
              <span>{mode.title}</span>
            </button>
          ))}
        </div>
      )}
      
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
      >
        {messages.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="max-w-2xl w-full">
              <div className="mb-10">
                <div className="w-24 h-24 mb-6 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                  <div className="text-white text-4xl">🤖</div>
                </div>
                <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  RexGT v.3
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Your intelligent personal assistant. Select a mode below to get started.
                </p>
              </div>
              
              <div className="flex justify-center mb-8">
                <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex space-x-1">
                  {[
                    { id: "chat", title: "General Questions", icon: <FaQuestion /> },
                    { id: "image", title: "Image Generation", icon: <FaImage /> },
                    { id: "category_chat", title: "Category Chat", icon: <FaFolder /> },
                    { id: "creative", title: "Creative Writing", icon: <FaPencilAlt /> }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                        (mode.id === "creative" && isCreativeMode) || 
                        (mode.id === "chat" && !isCreativeMode && selectedModel === "chat") || 
                        (mode.id !== "chat" && mode.id !== "creative" && selectedModel === mode.id)
                          ? "bg-blue-500 text-white shadow-md"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => handleModeSelect(mode.id)}
                    >
                      <span className="mr-2">{mode.icon}</span>
                      <span className="font-medium">{mode.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
                {[
                  { 
                    title: "Ask Anything", 
                    desc: "Get answers on any topic from science to pop culture", 
                    icon: "❓",
                    mode: "chat",
                    examples: ["What makes quantum computing different?", "Explain climate change in simple terms", "History of artificial intelligence"]
                  },
                  { 
                    title: "Create Images", 
                    desc: "Generate custom images from detailed descriptions", 
                    icon: "🖼️",
                    mode: "image",
                    examples: ["A futuristic cityscape at sunset", "Photorealistic cat wearing sunglasses", "Abstract art with blue and gold"]
                  },
                  { 
                    title: "Specialized Help", 
                    desc: "Get assistance for specific roles and categories", 
                    icon: "🗂️",
                    mode: "category_chat",
                    examples: ["Select a role and category above", "Get tailored responses", "Expert-level guidance"]
                  },
                  { 
                    title: "Creative Content", 
                    desc: "Generate stories, scripts, poems and more", 
                    icon: "✍️",
                    mode: "chat",
                    examples: ["Write a short story about time travel", "Create a poem about nature", "Draft an engaging blog intro"]
                  },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-gray-200 dark:border-gray-700 overflow-hidden"
                    onClick={() => {
                      handleModeSelect(item.mode);
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start mb-3">
                        <div className="text-3xl mr-3 bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">{item.icon}</div>
                        <div>
                          <h3 className="font-medium text-lg text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-850 rounded-lg p-3 mt-2">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Examples:</p>
                        <ul className="space-y-1">
                          {item.examples.map((example, j) => (
                            <li key={j} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                              "{example}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl w-full mx-auto pt-8 pb-32">
            {messages.map((msg, index) => (
              <div key={index} className="mb-8 animate-fade-in">
                <div className="flex items-start mb-1.5 px-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white" 
                      : "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
                  }`}>
                    {msg.role === "user" ? <FaUser size={16} /> : <FaRobot size={16} />}
                  </div>
                  <div className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </div>
                </div>
                
                <div className={`pl-16 pr-4 group ${
                  msg.role === "ai" ? "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-xl" : ""
                }`}>
                  {msg.role === "ai" ? (
                    isImageUrl(msg.content) ? (
                      <div className="relative mb-2 inline-block">
                        <img
                          src={msg.content}
                          alt="Generated content"
                          className="rounded-xl max-w-full shadow-md border border-gray-200 dark:border-gray-700"
                          style={{ maxHeight: "500px" }}
                        />
                        <button
                          onClick={() => handleDownloadImage(msg.content)}
                          className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                          title="Download image"
                        >
                          <FaDownload className="text-gray-700 dark:text-gray-300" />
                        </button>
                      </div>
                    ) : msg.content.endsWith(".mp3") ? (
                      <div className="mb-2">
                        <audio 
                          controls 
                          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <source src={msg.content} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ) : (
                      <div className="relative markdown-container">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyText(msg.content)}
                            className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Copy text"
                          >
                            <FaRegCopy className="text-gray-600 dark:text-gray-300" size={14} />
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="mb-2 text-gray-800 dark:text-gray-200">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="mb-8 animate-fade-in">
                <div className="flex items-start mb-1.5 px-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 bg-gradient-to-br from-purple-400 to-purple-600 text-white">
                    <FaRobot size={16} />
                  </div>
                  <div className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    AI Assistant
                  </div>
                </div>
                
                <div className="pl-16 pr-4">
                  <div className="flex space-x-2 items-center h-8">
                    <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" style={{ animationDelay: "300ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" style={{ animationDelay: "600ms" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-gray-900 dark:via-gray-900 pb-6 pt-20">
        <div className="max-w-3xl mx-auto px-4">
          {selectedModel === "category_chat" && (
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 animate-slide-up backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Role</option>
                    {roles.starter_prompts_including_roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    {Object.keys(prompts.prompts).map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="relative shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-200 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90"
            >
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={
                    selectedModel === "image"
                      ? "Describe the image you want to generate..."
                      : selectedModel === "category_chat"
                      ? "Ask a question related to the selected role and category..."
                      : isCreativeMode
                      ? "Let's get creative! Ask for stories, poems, or creative content..."
                      : "Message RexGT..."
                  }
                  className="w-full p-4 pl-4 pr-28 border-0 bg-transparent text-gray-800 dark:text-gray-200 resize-none min-h-[56px] max-h-[200px] focus:ring-0 outline-none transition-all text-base"
                  rows={1}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center">
                  <div className="relative mr-2" ref={modelSelectorRef}>
                    <button
                      type="button"
                      onClick={() => setShowModelSelector(!showModelSelector)}
                      className="text-xs flex items-center gap-1 py-1.5 px-2.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {getModelName()}
                      <FaChevronDown size={10} className={`transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showModelSelector && (
                      <div className="absolute bottom-full right-0 mb-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                        <div className="py-1">
                          {[
                            { id: "chat", name: "Chat" },
                            { id: "image", name: "Image Generator" },
                            { id: "category_chat", name: "Category Chat" },
                            { id: "creative", name: "Creative Mode" }
                          ].map((model) => (
                            <button
                              key={model.id}
                              type="button"
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                (model.id === "creative" && isCreativeMode) || 
                                (model.id === "chat" && !isCreativeMode && selectedModel === "chat") || 
                                (model.id !== "chat" && model.id !== "creative" && selectedModel === model.id)
                                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" 
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                              onClick={() => {
                                if (model.id === "creative") {
                                  setSelectedModel("chat");
                                  setIsCreativeMode(true);
                                } else {
                                  setSelectedModel(model.id);
                                  setIsCreativeMode(false);
                                }
                                setShowModelSelector(false);
                              }}
                            >
                              {model.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!prompt.trim() && !(selectedModel === "category_chat" && selectedRole && selectedCategory)}
                    className={`p-2 rounded-lg w-10 h-10 flex items-center justify-center transition-all ${
                      prompt.trim() || (selectedModel === "category_chat" && selectedRole && selectedCategory)
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm"
                        : "bg-blue-200 dark:bg-blue-900/30 text-blue-500 dark:text-blue-300/70 cursor-not-allowed"
                    }`}
                    title="Send message"
                  >
                    <FaPaperPlane size={16} className={`${
                      prompt.trim() || (selectedModel === "category_chat" && selectedRole && selectedCategory) 
                        ? "" 
                        : "opacity-70"
                    }`} />
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                <span className="flex items-center">
                  Press 
                  <kbd className="mx-1.5 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-sans font-medium">Enter</kbd> 
                  to send
                </span>
                <span className="hidden md:inline-block">RexGT is designed to be helpful, harmless, and honest</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;