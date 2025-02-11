const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Function to merge all category files dynamically
function getAllWords() {
    const dataFolder = './data/';
    let allWords = [];

    fs.readdirSync(dataFolder).forEach(file => {
        if (file.endsWith('.json')) {
            const words = JSON.parse(fs.readFileSync(path.join(dataFolder, file), 'utf8'));
            allWords = allWords.concat(words);
        }
    });
    return allWords;
}

// API to get words by category or all categories
app.get('/api/words/:category', (req, res) => {
    const category = req.params.category;

    // If "all" is requested, merge all category JSON files
    if (category === "all") {
        return res.json(getAllWords());
    }

    // Fetch a specific category
    const filePath = `./data/${category}.json`;
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Category not found" });
    }

    const words = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(words);
});

// API to check user answer
app.post('/api/check-answer', (req, res) => {
    const { lithuanian, answer, category } = req.body;
    let words = [];
    
    if (category === "all") {
        words = getAllWords(); // Get all words to check answer across categories
    } else {
        const filePath = `./data/${category}.json`;
        if (fs.existsSync(filePath)) {
            words = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    }
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
