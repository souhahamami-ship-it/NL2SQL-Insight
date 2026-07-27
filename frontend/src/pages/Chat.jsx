import { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5097/chat";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const askAI = async () => {
    const userQuestion = question.trim();
    if (!userQuestion || loading) return;

    setError(null);
    setLoading(true);
    setQuestion("");

    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);

    try {
      const response = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    question: userQuestion,
  }),
});


      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          answer: data.answer,
          sql: data.generated_sql,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the assistant. Check the server and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askAI();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="app">
      <header className="app-header">

    <div className="app-header-title">
        <span className="app-eyebrow">
            Natural language → SQL
        </span>

        <h1>AI Sales Assistant</h1>
    </div>

    <div className="header-actions">

        <Link to="/dashboard" className="btn-ghost">
            Dashboard
        </Link>

        <button
            className="btn-ghost"
            onClick={clearChat}
            disabled={messages.length === 0}
        >
            Clear Chat
        </button>

    </div>

</header>

      <main className="chat-window">
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <p className="empty-state-title">Ask about products, customers, sales, or inventory...</p>
            <p className="empty-state-body">
              Try “Show products that are out of stock.” 
              or “What is the total revenue?”
            </p>
          </div>
        )}

        {messages.map((msg, index) =>
          msg.role === "user" ? (
            <div className="bubble bubble-user" key={index}>
              {msg.content}
            </div>
          ) : (
            <div className="bubble bubble-assistant" key={index}>
              <p className="answer-text">{msg.answer}</p>

              {msg.sql && (
                <details className="sql-slip">
                  <summary>
                    <span className="sql-tag">SQL</span>
                    <span>View generated query</span>
                  </summary>
                  <pre className="sql-code">{msg.sql}</pre>
                </details>
              )}
            </div>
          )
        )}

        {loading && (
          <div className="bubble bubble-assistant bubble-loading">
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}

        <div ref={scrollRef} />
      </main>

      <footer className="composer">
        <textarea
          className="composer-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Your AI Sales Assistant"
          rows={1}
        />
        <button
          className="btn-primary"
          onClick={askAI}
          disabled={loading || !question.trim()}
        >
          {loading ? "Asking…" : "Ask"}
        </button>
      </footer>
    </div>
  );
}

