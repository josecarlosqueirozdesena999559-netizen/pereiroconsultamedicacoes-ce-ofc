import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Desregistrar Service Worker temporariamente para eliminar problemas de cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('[SW] Service Worker unregistered for debugging');
    });
  });
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
