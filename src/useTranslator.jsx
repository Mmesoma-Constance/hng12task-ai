import { useState, useEffect } from "react";

const useTranslator = () => {
  const [translator, setTranslator] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTranslator = async () => {
      try {
        if (!window.AITranslatorFactory) {
          throw new Error("AI Translator API is not available in this browser.");
        }

        // ✅ Ensure options are passed
        const options = {
          model: "chrome/en-to-multilingual", // Adjust based on your needs
        };

        const translatorInstance = await window.AITranslatorFactory.create(options);
        setTranslator(translatorInstance);
      } catch (err) {
        console.error("Error initializing translator:", err);
        setError(err.message);
      }
    };

    loadTranslator();
  }, []);

  return { translator, error };
};

export default useTranslator;
