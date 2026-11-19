// Indirizzi dei servizi usati dal frontend.
// Si configurano con le variabili d'ambiente di Vite (file .env.local), vedi .env.example.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5220";
export const DEEZER_PROXY_URL =
  import.meta.env.VITE_DEEZER_PROXY_URL ?? "http://localhost:5002";
