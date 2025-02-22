import { useState, useEffect } from "react";
import "./TranslatorChat.css";

function TranslatorChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [languageDetector, setLanguageDetector] = useState(null);

  useEffect(() => {
    const initLanguageDetector = async () => {
      if ("ai" in self && "languageDetector" in self.ai) {
        const capabilities = await self.ai.languageDetector.capabilities();
        if (capabilities.capabilities === "readily") {
          setLanguageDetector(await self.ai.languageDetector.create());
        } else if (capabilities.capabilities === "after-download") {
          const detector = await self.ai.languageDetector.create({
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(`Downloading model: ${e.loaded} / ${e.total}`);
              });
            },
          });
          await detector.ready;
          setLanguageDetector(detector);
        }
      }
    };
    initLanguageDetector();
  }, []);

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
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let detectedLanguage = "en";
    if (languageDetector) {
      const detected = await languageDetector.detect(inputText);
      detectedLanguage = detected?.language || "en";
    }

    const newMessage = {
      text: inputText,
      time: timestamp,
      translated: null,
      language: detectedLanguage,
      loading: false,
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputText("");
  };

  const handleTranslate = async (index, targetLanguage) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, loading: true, translated: null } : msg))
    );

    try {
      if ("ai" in self && "translator" in self.ai) {
        const translator = await self.ai.translator.create({
          sourceLanguage: messages[index].language,
          targetLanguage,
        });
        const translatedText = await translator.translate(messages[index].text);
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === index
              ? {
                  ...msg,
                  translated: translatedText,
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
                <strong>{msg.time}</strong>: {msg.text} ({languageNames[msg.language]})
              </p>
              <div className="translate-section">
                <select onChange={(e) => handleTranslate(index, e.target.value)}>
                  {Object.keys(languageNames).map((lang) => (
                    <option key={lang} value={lang}>
                      {languageNames[lang]}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleTranslate(index, "en")}>Translate</button>
              </div>
              {msg.loading && <p className="loading">Translating...</p>}
              {msg.translated && <p className="translated">{msg.translated}</p>}
              <button className="delete-button" onClick={() => handleDelete(index)}>
                Delete
              </button>
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
