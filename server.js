const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());

// Load OpenAI API configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // API key loaded from environment variable
});
const openai = new OpenAIApi(configuration);

// Load the knowledge base
const knowledgeBase = fs.readFileSync('knowledge-base.txt', 'utf-8');

// Endpoint to handle chatbot messages
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `You are a helpful assistant. Use the following knowledge base to answer questions:\n\n${knowledgeBase}\n\nQuestion: ${message}\nAnswer:`,
            max_tokens: 100,
        });

        const answer = response.data.choices[0].text.trim();
        res.json({ reply: answer });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error communicating with OpenAI API.');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
