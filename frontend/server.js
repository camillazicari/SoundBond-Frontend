import express from "express"
import cors from "cors"
import fetch from "node-fetch";
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
}));

app.get("/api/search", async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: "Parametro di ricerca mancante" });
    }

    try {
        const response = await fetch(`https://api.deezer.com/search?q=${q}`);
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



app.listen(5002, () => console.log("Server in ascolto su porta 5002"));
