import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const Chats = () => {
  const [messages, setMessages] = useState([
    { text: "¡Hola! ¿En qué puedo ayudarte?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Gracias por tu mensaje. Pronto te responderemos.", sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chats</div>
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input"
          placeholder="Escribe tu mensaje..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="send-button">
          <Send size={20} />
        </button>
      </div>
      <style>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 550px;
          width: 100%;
          max-width: 420px;
          margin: 20px auto;
          background: white;
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid #ddd;
          padding: 15px;
        }

        .chat-header {
          background: linear-gradient(135deg, #00796b, #00796b);
          color: white;
          text-align: center;
          padding: 16px;
          font-size: 1.3rem;
          font-weight: bold;
          letter-spacing: 0.5px;
          border-radius: 10px;
          margin-bottom: 12px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f9fafb;
          border-radius: 10px;
          max-height: 400px;
        }

        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
          font-size: 1rem;
          line-height: 1.5;
          word-wrap: break-word;
          margin-bottom: 5px;
        }

        .message.user {
          background: #00796b;
          color: white;
          align-self: flex-end;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .message.bot {
          background: #e5e7eb;
          color: #333;
          align-self: flex-start;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .chat-input-container {
          display: flex;
          align-items: center;
          padding: 14px;
          border-top: 1px solid #ddd;
          background: white;
          border-radius: 10px;
          margin-top: 10px;
        }

        .chat-input {
          flex: 1;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 25px;
          outline: none;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .chat-input:focus {
          border-color: #00796b;
        }

        .send-button {
          background: #00796b;
          color: white;
          border: none;
          padding: 12px;
          margin-left: 10px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .send-button:hover {
          background: #00796b;
        }
      `}</style>
    </div>
  );
};

export default Chats;
