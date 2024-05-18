import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthencationProvider } from "./context/Authencation";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthencationProvider>
        <App />
    </AuthencationProvider>
  </React.StrictMode>
);

reportWebVitals();
