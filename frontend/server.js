import process from "node:process";
import express from "express"
import cors from "cors"
import fetch from "node-fetch";
const app = express();

// Origini ammesse separate da virgola, es. ALLOWED_ORIGINS=https://soundbond.vercel.app
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173").split(",");
const port = process.env.PORT ?? 5002;

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));

app.get("/api/search", async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Parametro di ricerca mancante" });
    }

    try {
        const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.get("/api/genres", async (req, res) => {
    try {
        const response = await fetch(`https://api.deezer.com/genre`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.get("/api/artists", async (req, res) => {
    const { genre_id } = req.query;

    if (!genre_id) {
        return res.status(400).json({ error: "Parametro 'id' mancante" });
    }

    try {
        const response = await fetch(`https://api.deezer.com/genre/${genre_id}/artists`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Errore durante la richiesta a Deezer", details: error.message });
    }
});

// Brani più ascoltati di un genere. /genre/{id}/artists restituisce la classifica
// generale (non filtrata per genere), quindi le playlist usano la classifica del genere.
app.get("/api/genre-tracks", async (req, res) => {
    const { genre_id } = req.query;

    if (!genre_id) {
        return res.status(400).json({ error: "Parametro 'genre_id' mancante" });
    }

    try {
        const response = await fetch(`https://api.deezer.com/chart/${encodeURIComponent(genre_id)}/tracks?limit=100`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Errore durante la richiesta a Deezer", details: error.message });
    }
});

app.get("/api/songs", async (req, res) => {
    const { artist_id } = req.query;

    if (!artist_id) {
        return res.status(400).json({ error: "Parametro 'id' mancante" });
    }

    try {
        const response = await fetch(`https://api.deezer.com/artist/${artist_id}/top?limit=5`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Errore durante la richiesta a Deezer", details: error.message });
    }
});



app.listen(port, () => console.log(`Server in ascolto su porta ${port}`));
