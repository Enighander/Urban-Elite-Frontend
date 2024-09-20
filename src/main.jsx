import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import.meta.env.VITE_MIDTRANS_CLIENT_KEY && (() => {
  const script = document.createElement('script');
  script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
  script.onload = () => {
    console.log("Midtrans snap.js script loaded successfully.");
  };
  script.onerror = () => {
    console.error("Failed to load Midtrans snap.js script.");
  };
  document.head.appendChild(script);
})();

document.body.classList.add("bg-gray-200", "dark:bg-gray-900", "text-black", "dark:text-white");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
