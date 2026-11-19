// URL di API e proxy Deezer, presi da .env.local
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5220";
export const DEEZER_PROXY_URL =
  import.meta.env.VITE_DEEZER_PROXY_URL ?? "http://localhost:5002";
