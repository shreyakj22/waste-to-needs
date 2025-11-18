import React, { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I'm your Gemini-powered Waste2Needs assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn’t get that. 🤖";
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Something went wrong while talking to AI." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          color: "white",
          fontSize: "28px",
          border: "none",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "25px",
            width: "320px",
            height: "420px",
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Waste2Needs Chatbot 🤖
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.from === "user" ? "#DCF8C6" : "#F1F0F0",
                  color: "#000",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  maxWidth: "75%",
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ddd",
              padding: "8px",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "8px",
                fontSize: "14px",
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}