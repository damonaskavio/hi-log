import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";

// add this to prompt for a refresh
const updateSW = registerSW({
  onNeedRefresh() {
    if (
      confirm("There is an update to the app. Reload and apply the update?")
    ) {
      updateSW(true);
    }
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
