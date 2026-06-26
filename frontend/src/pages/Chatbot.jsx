import { useState } from "react";
import { askChatbot } from "../services/chatbotApi";
import { Bot, User, Send, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Step 5: Navigation Import

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Step 5: Initialize Navigation Hook

  async function send() {
    if (!message.trim() || isLoading) return;

    const userPrompt = message.trim();
    setMessage("");

    const updatedHistory = [...chatHistory, { sender: "user", text: userPrompt }];
    setChatHistory(updatedHistory);

    try {
      setIsLoading(true);
      const res = await askChatbot(userPrompt);
      if (res.success) {
        setChatHistory([...updatedHistory, { sender: "bot", text: res.reply }]);
      } else {
        setChatHistory([
          ...updatedHistory,
          { sender: "bot", text: "Sorry, I ran into an issue handling that request. Please try again." }
        ]);
      }
    } catch (err) {
      console.error(err);
      setChatHistory([
        ...updatedHistory,
        { sender: "bot", text: "Could not connect to the AI service stream." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-2)] px-4 pt-6 pb-24 md:px-8">
      <div className="mx-auto max-w-3xl mb-4">
        {/* Step 5: Elegant Back Navigation Trigger Link Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>

      <div className="mx-auto max-w-3xl bg-white rounded-3xl border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col h-[75vh]">
        
        {/* Chat Component Banner Header */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Bot size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">SmartHealth AI</h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500 fill-amber-500" /> Powered by Gemini Core v1.5
              </p>
            </div>
          </div>
        </div>

        {/* Messaging Logs Node Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Bot size={28} />
              </div>
              <h3 className="font-bold text-gray-700 text-lg">Your Personal Wellness Companion</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Ask questions regarding your health logs, active goals, dietary metrics, or calculate dynamic training analytics safely.
              </p>
            </div>
          )}

          {chatHistory.map((chat, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${
                chat.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                chat.sender === "user" 
                  ? "bg-neutral-800 border-neutral-700 text-white" 
                  : "bg-blue-50 border-blue-100 text-blue-600"
              }`}>
                {chat.sender === "user" ? <User size={15} /> : <Bot size={15} />}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${
                chat.sender === "user"
                  ? "bg-neutral-900 border-neutral-800 text-white rounded-tr-none"
                  : "bg-white border-gray-100 text-gray-800 rounded-tl-none"
              }`}>
                {chat.text}
              </div>
            </div>
          ))}

          {/* Loading Indicator State Block */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                <Bot size={15} />
              </div>
              <div className="p-4 rounded-2xl text-sm bg-white border border-gray-100 text-gray-400 rounded-tl-none flex items-center gap-2 shadow-sm">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                <span>Processing context telemetry...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Interactive Panel Form */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="w-full bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400 py-1"
              placeholder="Ask anything about your health or metrics..."
            />
            <button
              onClick={send}
              disabled={!message.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-sm"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}