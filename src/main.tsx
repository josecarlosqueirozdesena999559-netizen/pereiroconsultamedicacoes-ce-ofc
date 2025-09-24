import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('main.tsx loading...');
console.log('Document ready:', document.readyState);
console.log('Root element found:', !!document.getElementById("root"));

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Creating React root and rendering App...');
  createRoot(rootElement).render(<App />);
}
