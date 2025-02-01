const fs = require('fs');
const path = './data/progress.json';

class ProgressTracker {
    static loadProgress() {
        try {
            const data = fs.readFileSync(path, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            return {}; // Return empty progress if file doesn't exist
        }
    }

    static saveProgress(progress) {
        fs.writeFileSync(path, JSON.stringify(progress, null, 2));
    }

    static updateProgress(category, learnedWord, points) {
        const progress = this.loadProgress();
        
        if (!progress[category]) {
            progress[category] = { wordsLearned: [], score: 0 };
        }

        if (!progress[category].wordsLearned.includes(learnedWord)) {
            progress[category].wordsLearned.push(learnedWord);
        }

        progress[category].score += points; // Update score

        this.saveProgress(progress);
    }

    static getTotalScore() {
        const progress = this.loadProgress();
        return Object.values(progress).reduce((acc, category) => acc + (category.score || 0), 0);
    }
}

module.exports = ProgressTracker;
