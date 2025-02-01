class FlashcardSystem {
    constructor(words) {
        this.words = words;
        this.currentIndex = 0;
    }

    // Show next flashcard (Lithuanian -> Translation)
    showNext() {
        if (this.currentIndex >= this.words.length) return null;
        const currentWord = this.words[this.currentIndex];
        this.currentIndex++;
        return currentWord;
    }

    // Check if user's answer matches the translation
    checkAnswer(lithuanianWord, userAnswer) {
        const word = this.words.find(w => w.lithuanian === lithuanianWord);
        return word.translation.toLowerCase() === userAnswer.toLowerCase();
    }
}

module.exports = FlashcardSystem;