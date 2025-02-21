import React, { useState } from "react";
import LanguageDetector from "./LanguageDetector"; // Import the custom hook

const LanguageDetectorComponent = () => {
  const { status, detectLanguage } = LanguageDetector();
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");

  const handleDetect = async () => {
    if (status !== "ready") return;
    const detectedLang = await detectLanguage(text);
    setLanguage(detectedLang);
  };

  return (
    <div>
      <h2>Language Detection</h2>
      <textarea
        placeholder="Type some text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleDetect} disabled={status !== "ready"}>
        Detect Language
      </button>
      <p>Detected Language: {language}</p>
    </div>
  );
};

export default LanguageDetectorComponent;
