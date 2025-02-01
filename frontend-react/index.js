const express = require('express');
const cors = require('cors');
const FlashcardSystem = require('./modules/FlashcardSystem');
const ProgressTracker = require('./modules/ProgressTracker');
const words = require('./data/words.json');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/words', (req, res) => {
    res.json(words);
});

app.post('/api/check-answer', (req, res) => {
    const { lithuanian, answer } = req.body;
    const word = words.find(w => w.lithuanian === lithuanian);
    if (word) {
        const isCorrect = word.translation.toLowerCase() === answer.toLowerCase();
        if (isCorrect) {
            ProgressTracker.updateProgress(word.category, word.lithuanian, 10);
        } else {
            ProgressTracker.updateProgress(word.category, word.lithuanian, -5);
        }
        res.json({ correct: isCorrect, correctAnswer: word.translation });
    } else {
        res.status(400).json({ error: 'Word not found' });
    }
});

app.get('/api/progress', (req, res) => {
    res.json(ProgressTracker.loadProgress());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
