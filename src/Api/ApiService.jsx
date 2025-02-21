export const detectLanguage = async (text) => {
  const response = await fetch("https://chromeai.googleapis.com/language-detection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  return data.language;
};

export const summarizeText = async (text) => {
  const response = await fetch("https://chromeai.googleapis.com/summarizer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  return data.summary;
};

export const translateText = async (text, targetLang) => {
  const response = await fetch("https://chromeai.googleapis.com/translator", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target: targetLang }),
  });

  const data = await response.json();
  return data.translation;
};
