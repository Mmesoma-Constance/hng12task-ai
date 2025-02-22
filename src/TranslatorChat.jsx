import { useState, useEffect } from "react";
import "./TranslatorChat.css"; // Import the CSS file

const useLanguageDetector = () => {
  const [detector, setDetector] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const loadDetector = async () => {
      if ("ai" in window && "languageDetector" in window.ai) {
        const newDetector = await window.ai.languageDetector.create();
        await newDetector.ready;
        setDetector(newDetector);
        setStatus("ready");
      } else {
        setStatus("not supported");
      }
    };

    loadDetector();
  }, []);

  const detectLanguage = async (text) => {
    if (!detector) return "unknown";
    const results = await detector.detect(text);
    return results[0]?.detectedLanguage || "unknown";
  };

  return { status, detectLanguage };
};

function TranslatorChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { status, detectLanguage } = useLanguageDetector();

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    setMessages(savedMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const languageNames = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish",
    ru: "Russian",
    tr: "Turkish",
    fr: "French",
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      setErrorMessage("Please enter a message.");
      return;
    }
    setErrorMessage("");
    const detectedLanguage = await detectLanguage(inputText);
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMessage = {
      text: inputText,
      time: timestamp,
      translated: null,
      language: detectedLanguage,
      selectedLanguage: "fr",
      loading: false,
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputText("");
  };

  const handleTranslate = async (index) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, loading: true } : msg))
    );

    try {
      if ("ai" in self && "translator" in self.ai) {
        const translator = await self.ai.translator.create({
          sourceLanguage: "en",
          targetLanguage: messages[index].selectedLanguage,
        });

        const translatedText = await translator.translate(messages[index].text);

        setMessages((prev) =>
          prev.map((msg, i) =>
            i === index
              ? {
                  ...msg,
                  translated: `Translated to ${languageNames[messages[index].selectedLanguage]}: ${translatedText}`,
                  loading: false,
                }
              : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === index
              ? {
                  ...msg,
                  translated: "Translation not supported.",
                  loading: false,
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Translation failed:", error);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === index
            ? { ...msg, translated: "Translation failed. Please try again.", loading: false }
            : msg
        )
      );
    }
  };

  const handleLanguageChange = (index, selectedLanguage) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, selectedLanguage } : msg))
    );
  };

  const handleDelete = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 0 ? (
          <p className="empty-message centered">No messages yet. Start chatting!</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="message">
              <p>
                <strong>{msg.time}</strong>: {msg.text} ({languageNames[msg.language] || "Unknown"})
              </p>

              <div className="translate-section">
                <select
                  value={msg.selectedLanguage}
                  onChange={(e) => handleLanguageChange(index, e.target.value)}
                >
                  {Object.keys(languageNames).map((lang) => (
                    <option key={lang} value={lang}>
                      {languageNames[lang]}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleTranslate(index)}>Translate</button>
              </div>

              {msg.loading && <p className="loading">Translating...</p>}
              {msg.translated && <p className="translated">{msg.translated}</p>}
              <button className="delete-button" onClick={() => handleDelete(index)}>Delete</button>
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
    </div>
  );
}

export default TranslatorChat;