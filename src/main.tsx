import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Força reload quando o Service Worker for atualizado
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[SW] New service worker activated, reloading page...');
    window.location.reload();
  });
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
