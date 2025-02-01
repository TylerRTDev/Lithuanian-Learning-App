const fs = require('fs');
const path = './data/progress.json';

class ProgressTracker {
    static saveProgress(learnedWords) {
        fs.writeFileSync(path, JSON.stringify({ learnedWords }));
    }

    static loadProgress() {
        try {
            const data = fs.readFileSync(path);
            return JSON.parse(data).learnedWords || [];
        } catch (err) {
            return []; // File doesn't exist yet
        }
    }
}

module.exports = ProgressTracker;