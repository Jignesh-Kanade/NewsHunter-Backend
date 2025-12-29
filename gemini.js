const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/chat", async (req, res) => {
    try {
        const { headline, message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Build context if headline exists
        const finalPrompt = headline
            ? `The user is asking about the news headline: "${headline}".\nQuestion: ${message}`
            : message;

        const result = await model.generateContent(finalPrompt);

        res.json({ reply: result.response.text() });
    } catch (error) {
        console.error("Gemini error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
