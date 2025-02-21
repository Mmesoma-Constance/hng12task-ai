import React, { useState } from "react";
import useTranslator from "./useTranslator"; // Import the custom translation hook

const TranslatorComponent = () => {
  const { status, translateText } = useTranslator();
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en"); // Default to English

  const handleTranslate = async () => {
    if (status !== "ready") return;
    const translated = await translateText(text, targetLanguage);
    setTranslatedText(translated);
  };

  return (
    <div>
      <h2>Text Translator</h2>
      <textarea
        placeholder="Type text to translate..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="pt">Portuguese</option>
        <option value="es">Spanish</option>
        <option value="ru">Russian</option>
        <option value="tr">Turkish</option>
        <option value="fr">French</option>
      </select>
      <button onClick={handleTranslate} disabled={status !== "ready"}>
        Translate
      </button>
      <p>Translated Text: {translatedText}</p>
    </div>
  );
};

export default TranslatorComponent;
