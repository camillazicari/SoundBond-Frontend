import express from "express"
import cors from "cors"
import fetch from "node-fetch";
const app = express();

app.use(cors());

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

app.listen(5002, () => console.log("Server in ascolto su porta 5002"));
