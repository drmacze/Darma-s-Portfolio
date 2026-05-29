import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { installAudioPolicy } from "./lib/audio-policy";
import { installWelcomeKlinkSound } from "./lib/welcome-klink";
import "./styles.css";
import "./effects.css";
import "./editorial-reset.css";
import "./visual-theme.css";
import "./dlavie-shorts-rebuild.css";
import "./dlavie-scroll-effects";
import "./dlavie-lenis";

installAudioPolicy();
installWelcomeKlinkSound();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
