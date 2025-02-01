class QuizSystem {
    constructor(words) {
        this.words = words;
    }

    generateQuestion() {
        const correctWord = this.words[Math.floor(Math.random() * this.words.length)];
        const wrongChoices = this.words
            .filter(w => w !== correctWord)
            .slice(0, 2)
            .map(w => w.translation);

        const choices = [...wrongChoices, correctWord.translation].sort(() => Math.random() - 0.5);

        return {
            question: `What is "${correctWord.lithuanian}" in English?`,
            choices,
            correctAnswer: correctWord.translation
        };
    }
}

module.exports = QuizSystem;