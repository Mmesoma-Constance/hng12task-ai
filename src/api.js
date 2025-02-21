export const detectLanguage = async (text) => {
  try {
    const response = await navigator.ml.languageDetector.detect(text);
    return response.language; // Returns language code (e.g., 'en', 'fr')
  } catch (error) {
    console.error("Language detection failed:", error);
    return "Error detecting language";
  }
};
