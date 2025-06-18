const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Set up OpenAI instance for v4
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/respond", async (req, res) => {
  const prompt = req.body.message;
  console.log("Received prompt:", prompt);

  if (!prompt) {
    return res.status(400).json({ response: "Missing prompt" });
  }

  try {
    const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo", // or "gpt-4"
  messages: [{ role: "user", content: prompt }],
});

    console.log("OpenAI raw response:", completion.data);

    const result = completion.choices[0].message.content;

    if (!result) {
      return res.status(500).json({ response: "No content returned from OpenAI." });
    }

    res.json({ response: result });
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
    res.status(500).json({ response: "OpenAI request failed." });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


