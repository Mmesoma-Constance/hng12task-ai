import { useState } from "react";

const TranslatorComponent = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es"); // Default: Spanish
  const [isLoading, setIsLoading] = useState(false);

  const languageNames = {
    en: "English",
    es: "Spanish",
    fr: "French",
    zh: "Chinese",
    ja: "Japanese",
    pt: "Portuguese",
    ru: "Russian",
    tr: "Turkish",
    hi: "Hindi",
    vi: "Vietnamese",
    bn: "Bengali",
  };

  const handleTranslate = async () => {
    if (!("ai" in self) || !("translator" in self.ai)) {
      alert("Translator API is not supported on this browser.");
      return;
    }

    try {
      setIsLoading(true);
      setTranslatedText("");

      const translator = await self.ai.translator.create({
        sourceLanguage: "en", // Assuming input is in English
        targetLanguage,
      });

      const result = await translator.translate(inputText);
      setTranslatedText(`Translated to ${languageNames[targetLanguage]}: ${result}`);
    } catch (error) {
      console.error("Translation failed:", error);
      alert("Translation error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>AI Translator</h2>
      <textarea
        rows="3"
        cols="40"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter text to translate"
      ></textarea>
      <br />
      <select onChange={(e) => setTargetLanguage(e.target.value)} value={targetLanguage}>
        {Object.entries(languageNames).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      <br />
      <button onClick={handleTranslate} disabled={isLoading}>
        {isLoading ? "Translating..." : "Translate"}
      </button>
      <h3>Translated Text:</h3>
      <p>{isLoading ? "Translating..." : translatedText}</p>
    </div>
  );
};

export default TranslatorComponent;
