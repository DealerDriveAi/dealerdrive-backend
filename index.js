const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/respond', async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful automotive BDC assistant that responds clearly to customer objections.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

