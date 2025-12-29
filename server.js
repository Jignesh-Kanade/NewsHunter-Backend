const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const geminiRoutes = require("./gemini");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // <--- Needed for req.body
app.use(express.urlencoded({ extended: true }));

// ✅ Gemini routes
app.use("/api/gemini", geminiRoutes);

const NEWS_API_KEY = process.env.NEWSDATA_API_KEY;

// ✅ News routes
app.get("/news", async (req, res) => {
    try {
        const sources = [
            { name: "The Economic Times", domain: "economictimes.indiatimes.com" },
            { name: "The Hindu", domain: "thehindu.com" },
            { name: "NDTV", domain: "ndtv.com" },
            { name: "Times Of India", domain: "timesofindia.indiatimes.com" },
        ];

        const requests = sources.map((s) =>
            axios.get("https://newsdata.io/api/1/news", {
                params: {
                    apikey: NEWS_API_KEY,
                    domainurl: s.domain,
                    language: "en",
                    country: "in",
                },
            })
        );

        const responses = await Promise.all(requests);

        const formattedData = {};
        sources.forEach((s, i) => {
            formattedData[s.name] = responses[i].data.results || [];
        });

        res.json(formattedData);
    } catch (error) {
        console.error("Backend error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

const PORT = 5000;
// const HOST = "192.168.1.4";
app.listen(PORT, () =>
    console.log(`✅ Server running at http://localhost:${PORT}`)
);