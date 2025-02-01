class FlashcardSystem {
    constructor(words) {
        this.words = this.shuffleArray(words);
        this.currentIndex = 0;
    }

    // Fisher-Yates Shuffle Algorithm
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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
