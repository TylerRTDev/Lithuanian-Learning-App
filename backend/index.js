const express = require('express');
const cors = require('cors');
const fs = require('fs');
const words = require('./data/words.json');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/words', (req, res) => {
    res.json(words);
});

app.get('/api/test', (req, res) => {
    const fs = require('fs');
    const words = JSON.parse(fs.readFileSync('./data/words.json', 'utf-8'));
    res.json(words);
});

app.post('/api/check-answer', (req, res) => {
    const { lithuanian, answer } = req.body;
    const word = words.find(w => w.lithuanian === lithuanian);

    if (word) {
        const isCorrect = word.translation.toLowerCase() === answer.toLowerCase();
        res.json({ correct: isCorrect, correctAnswer: word.translation });
    } else {
        res.status(400).json({ error: 'Word not found' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
