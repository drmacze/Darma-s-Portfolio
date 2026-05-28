import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { installAudioPolicy } from "./lib/audio-policy";
import "./styles.css";
import "./effects.css";
import "./editorial-reset.css";

installAudioPolicy();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
