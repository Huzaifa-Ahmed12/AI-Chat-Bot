import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Logout from "./Logout";

function MainChat() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ai/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reversed = res.data.history;
      setHistory(reversed);
      if (!selectedId && reversed.length) {
        setSelectedId(reversed[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const sendPrompt = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ai/prompt",
        { prompt, conversationId: selectedId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newId = res.data.conversationId;
      setSelectedId(newId);
      setPrompt("");
      fetchHistory();
    } catch (error) {
      console.error("Failed to send prompt:", error);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setSelectedId(null);
    setPrompt("");
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, selectedId]);

  const selectedChat = history.find((h) => h._id === selectedId);

  const getFallbackTitle = (text) => {
    if (!text) return "New Conversation";
    const keywords = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3);
    if (keywords.length === 0)
      return text.slice(0, 20) + (text.length > 20 ? "..." : "");
    const title = keywords.slice(0, 2).join(" ");
    return (
      title.charAt(0).toUpperCase() +
      title.slice(1) +
      (text.length > 30 ? "..." : "")
    );
  };

  return (
    <div className="flex h-screen bg-[#1e1e2e] text-white">
      <div
        className={`transition-all duration-300 bg-[#11111b] border-r border-gray-700 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <span className="font-bold text-lg hidden sm:block">
            {sidebarOpen ? "Conversations" : "💬"}
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? "⏴" : "⏵"}
          </button>
        </div>
        {sidebarOpen && (
          <div className="px-4 mb-2">
            <button
              onClick={startNewConversation}
              className="w-full bg-green-600 hover:cursor-pointer hover:bg-green-700 rounded-md py-2 text-white font-semibold"
            >
              + New Conversation
            </button>
          </div>
        )}
        <div className="overflow-y-auto px-2 space-y-1">
          {history.length === 0 && sidebarOpen && (
            <p className="text-gray-500 px-2">
              No conversations yet. Start a new one!
            </p>
          )}
          {history.map((chat) => (
            <div
              key={chat._id}
              className={`cursor-pointer p-2 rounded hover:bg-[#313244] ${
                selectedId === chat._id ? "bg-[#45475a]" : ""
              }`}
              onClick={() => setSelectedId(chat._id)}
              title={chat.prompt}
            >
              {sidebarOpen ? chat.title || getFallbackTitle(chat.prompt) : "💬"}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-[#11111b] p-4 text-center text-2xl font-bold border-b border-gray-700 flex justify-between">
          <h1>Interest Based AI-Agent</h1>
          <Logout />
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {selectedChat ? (
            selectedChat.messages?.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } w-full`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xl whitespace-pre-wrap break-words ${
                    msg.role === "user" ? "bg-[#313244]" : "bg-[#45475a] w-full"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">
              Select a conversation or start a new one.
            </p>
          )}
          <div ref={chatEndRef} />
        </main>

        <footer className="p-4 bg-[#11111b] border-t border-gray-700">
          <div className="max-w-4xl mx-auto flex gap-2">
            <textarea
              className="flex-1 p-3 rounded-md bg-[#313244] text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Type your message..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={sendPrompt}
              disabled={loading}
              className={ ` px-5 py-2 bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white rounded-md ${loading ? "opacity-50" : ""} `}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default MainChat;
