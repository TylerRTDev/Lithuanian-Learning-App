const readline = require('readline-sync');
const FlashcardSystem = require('./backend/modules/FlashcardSystem');
const ProgressTracker = require('./backend/modules/ProgressTracker');
const words = require('./data/words.json');

// Get unique categories from words.json
const categories = [...new Set(words.map(word => word.category))];

function selectCategory() {
    console.log('📚 Select a Category:');

    categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category}`);
    });

    const choice = readline.questionInt('\nEnter category number: ') - 1;

    if (choice < 0 || choice >= categories.length) {
        console.log('All Categories Selected');
        return words;
    }

    const selectedCategory = categories[choice];
    console.log(`\nSelected category: ${selectedCategory}\n`);

    return words.filter(word => word.category === selectedCategory);
}

function startFlashcards() {
    while (true) {
        const filteredWords = selectCategory();
        const flashcards = new FlashcardSystem(filteredWords);

        console.log("🚀 Lithuanian Flashcards Mode 🚀\n");

        let score = 0;

        while (true) {
            const currentWord = flashcards.showNext();
            if (!currentWord) {
                console.log("You've completed all cards in this category!");
                break;
            }

            const userAnswer = readline.question(`Translate "${currentWord.lithuanian}": `);
            const isCorrect = flashcards.checkAnswer(currentWord.lithuanian, userAnswer);

            if (isCorrect) {
                console.log("✅ Correct! (+10 points)\n");
                score += 10;
                ProgressTracker.updateProgress(currentWord.category, currentWord.lithuanian, 10);
            } else {
                console.log(`❌ Wrong! The answer is "${currentWord.translation}". (-5 points)\n`);
                score -= 5;
                ProgressTracker.updateProgress(currentWord.category, currentWord.lithuanian, -5);
            }
        }

        console.log(`Total Score: ${ProgressTracker.getTotalScore()} points 🏆\n`);

        const retry = readline.question("Do you want to choose another category? (yes/no): ").toLowerCase();
        if (retry !== 'yes') {
            console.log("Thanks for practicing! 👏");
            break;
        }
    }
}

startFlashcards();
