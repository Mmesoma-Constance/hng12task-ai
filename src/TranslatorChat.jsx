import { useState, useEffect } from "react";

function TranslatorChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(savedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter a message.");
      return;
    }
    setErrorMessage("");
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMessage = {
      text: inputText,
      time: timestamp,
      translated: null,
      language: "fr",
      loading: false,
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputText("");
  };

  const handleTranslate = async (index, targetLanguage) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, loading: true, language: targetLanguage } : msg))
    );

    try {
      if ("ai" in self && "translator" in self.ai) {
        const translator = await self.ai.translator.create({
          sourceLanguage: "en",
          targetLanguage: targetLanguage,
        });

        const translatedText = await translator.translate(messages[index].text);
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === index ? { ...msg, translated: translatedText, loading: false } : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === index ? { ...msg, translated: "Translation not supported.", loading: false } : msg
          )
        );
      }
    } catch (error) {
      console.error("Translation failed:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 0 ? (
          <p className="empty-message">No messages yet. Start chatting!</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message">
              <p>
                <strong>{msg.time}</strong>: {msg.text}
              </p>

              <div className="translate-section">
                <select
                  value={msg.language}
                  onChange={(e) => handleTranslate(index, e.target.value)}
                >
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="zh">Chinese</option>
                </select>
                <button onClick={() => handleTranslate(index, msg.language)}>Translate</button>
              </div>

              {msg.loading && <p className="loading">Translating...</p>}
              {msg.translated && (
                <p className="translated">Translated to {msg.language}: {msg.translated}</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #1e1e1e;
          color: white;
          padding: 10px;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column-reverse;
        }
        .empty-message {
          text-align: center;
          font-style: italic;
          opacity: 0.7;
        }
        .message {
          background: #2a2a2a;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 5px;
        }
        .translate-section {
          display: flex;
          gap: 10px;
          margin-top: 5px;
        }
        .loading {
          font-style: italic;
          color: yellow;
        }
        .translated {
          color: lightgreen;
        }
        .chat-input {
          display: flex;
          gap: 10px;
          background: #333;
          padding: 10px;
          border-radius: 5px;
        }
        .chat-input input {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 5px;
        }
        .chat-input button {
          padding: 10px;
          border: none;
          border-radius: 5px;
          background: #007bff;
          color: white;
          cursor: pointer;
        }
        .error {
          color: red;
          text-align: center;
          margin-top: 5px;
        }
      `}</style>
    </div>
  );
}

export default TranslatorChat;
