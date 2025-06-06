"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"gpt" | "offline">("offline");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, mode }),
    });

    const data = await res.json();
    const botMessage: Message = { sender: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(51,65,85) 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-5xl h-[85vh] flex">
          {/* Sidebar */}
          <div className="hidden lg:flex w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex-col">
            <div className="p-8 border-b border-slate-200/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                </div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Switch Bot
                </h1>
              </div>

              {/* Mode selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">
                  Model Selection
                </label>
                <div className="relative">
                  <select
                    value={mode}
                    onChange={(e) =>
                      setMode(e.target.value as "gpt" | "offline")
                    }
                    className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all cursor-pointer appearance-none"
                  >
                    <option value="offline">Local Processing</option>
                    <option value="gpt">AI Integration</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="p-8">
              <div className="flex items-center gap-3 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    mode === "gpt" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                ></div>
                <span className="text-slate-600 font-medium">
                  {mode === "gpt" ? "Connected to AI" : "Running Locally"}
                </span>
              </div>
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm">
            {/* Mobile header */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 border border-white rounded-sm"></div>
                </div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Switch Bot
                </h1>
              </div>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "gpt" | "offline")}
                className="bg-white border border-slate-300 text-slate-900 px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              >
                <option value="offline">Local</option>
                <option value="gpt">AI</option>
              </select>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      Start a conversation
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Ask me anything and I'll help you with professional
                      responses.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${
                    msg.sender === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Message content */}
                  <div
                    className={`flex-1 max-w-3xl ${
                      msg.sender === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-3 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      {msg.sender === "bot" ? (
                        <div className="prose prose-slate prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="font-medium">{msg.text}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <div className="border-t border-slate-200/60 p-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder-slate-400"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-lg flex items-center justify-center transition-colors disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                <span>Press Enter to send</span>
                <span className="flex items-center gap-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      mode === "gpt" ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  ></div>
                  {mode === "gpt" ? "AI Mode" : "Local Mode"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
