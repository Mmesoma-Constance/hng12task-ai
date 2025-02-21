// import React from "react";
// import LanguageDetectorComponent from "./LanguageDetectorComponent"; // Import the UI component

// function App() {
//   return (
//     <div>
//       <h1>Language Detector</h1>
//       <LanguageDetectorComponent />
//     </div>
//   );
// }

// export default App;

import React from "react";
import TranslatorComponent from "./TranslatorComponent";
import TranslatorChat from "./TranslatorChat";

const App = () => {
  return (
    <div>
      <h1>AI-Powered Text Translator</h1>
      {/* <TranslatorComponent /> */}
      <TranslatorChat/>
    </div>
  );
};

export default App;
