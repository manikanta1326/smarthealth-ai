import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";

import HealthProvider from "./context/HealthProvider";
import AuthProvider from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HealthProvider>
          <App />
        </HealthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);