const readline = require('readline-sync');
const FlashcardSystem = require('./modules/FlashcardSystem');
const words = require('./data/words.json');

// Get unique categories from words.json
const categories = [...new Set(words.map(word => word.category))];

function selectCategory() {
    console.log('📚 Select a Category:');

    // Display categories with numbers (e.g., 1. Greetings, 2. Numbers...)
    categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category}`);
    });

    const choice = readline.questionInt('\nEnter category number: ') - 1;

    if (choice < 0 || choice >= categories.length) {
        console.log('All Categories Selected');
        return words; // Fallback to all words
    }

    const selectedCategory = categories[choice];
    console.log(`\nSelected category: ${selectedCategory}\n`);

    // Filter words by selected category
    return words.filter(word => word.category === selectedCategory);
}

function startFlashcards() {
    while (true) {
        const filteredWords = selectCategory(); // Get words for chosen category
        const flashcards = new FlashcardSystem(filteredWords);

        console.log("🚀 Lithuanian Flashcards Mode 🚀\n");

        while (true) {
            const currentWord = flashcards.showNext();
            if (!currentWord) {
                console.log("You've completed all cards in this category!");
                break;
            }

            const userAnswer = readline.question(`Translate "${currentWord.lithuanian}": `);
            const isCorrect = flashcards.checkAnswer(currentWord.lithuanian, userAnswer);

            if (isCorrect) {
                console.log("✅ Correct!\n");
            } else {
                console.log(`❌ Wrong! The answer is "${currentWord.translation}"\n`);
            }
        }

        // Ask if the user wants to retry
        const retry = readline.question("Do you want to choose another category? (yes/no): ").toLowerCase();
        if (retry !== 'yes') {
            console.log("Thanks for practicing! 👏");
            break;
        }
    }
}

startFlashcards();
