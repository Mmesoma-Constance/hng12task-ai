import { useState, useEffect } from "react";

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

export default useLanguageDetector;
