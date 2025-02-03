let words = [];
let filteredWords = [];
let index = 0;
let previousIndex = -1;
let progress = {};

async function loadPage(page) {
    const response = await fetch(`pages/${page}.html`);
    document.getElementById("app").innerHTML = await response.text();

    if (page === "translate" || page === "practice") {
        await fetchWords();
        setupEventListeners();
    }
}

async function fetchWords() {
    try {
        const response = await fetch('http://localhost:5000/api/words');
        words = await response.json();
        words = shuffleArray(words); // Shuffle words
        populateCategories();
        filterWords();
    } catch (error) {
        console.error('Error fetching words:', error);
    }
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function populateCategories() {
    const categorySelector = document.getElementById('category-selector');
    const categories = [...new Set(words.map(word => word.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelector.appendChild(option);
    });
}

function filterWords() {
    const selectedCategory = document.getElementById('category-selector').value;
    filteredWords = selectedCategory === "all" ? words : words.filter(word => word.category === selectedCategory);
    index = 0;
    if (!progress[selectedCategory]) {
        progress[selectedCategory] = 0;
    }
    updateProgress();
    displayWord();
}

function displayWord() {
    if (filteredWords.length === 0) {
        document.getElementById('word-display').textContent = "No words available";
        document.getElementById('pronunciation').textContent = "---";
        return;
    }
    document.getElementById('word-display').textContent = filteredWords[index].lithuanian;
    document.getElementById('pronunciation').textContent = filteredWords[index].pronunciation;
    document.getElementById('translation').textContent = filteredWords[index].translation;
    document.getElementById('category-heading').textContent = filteredWords[index].category;
}

function updateProgress() {
    const selectedCategory = document.getElementById('category-selector').value;
    document.getElementById('progress-count').textContent = progress[selectedCategory] || 0;
    document.getElementById('total-words').textContent = filteredWords.length;
}

function goToPreviousWord() {
    if (index >= 0) {
        index--;
        displayWord();
    }
}

function goToNextWord() {
    if (index < filteredWords.length - 1) {
        index++;
    } else {
        index = 0;
    }
    displayWord();
}


async function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!filteredWords.length) return;

    const response = await fetch('http://localhost:5000/api/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lithuanian: filteredWords[index].lithuanian, answer: userInput })
    });

    const result = await response.json();
    const feedbackElement = document.getElementById('feedback');
    const selectedCategory = document.getElementById('category-selector').value;

    if (result.correct) {
        feedbackElement.textContent = '✅ Correct!';
        progress[selectedCategory]++;
    } else {
        feedbackElement.textContent = `❌ Incorrect! The correct answer is "${result.correctAnswer}"`;
    }

    updateProgress();
    previousIndex = index;
    setTimeout(() => {
        feedbackElement.textContent = '';
        document.getElementById('user-input').value = '';
        if (index < filteredWords.length - 1) {
            index++;
        } else {
            index = 0;
        }
        displayWord();
    }, 1500);
}

// Load the main page on startup
window.onload = () => loadPage("main");


function setupEventListeners() {
    if (document.getElementById('submit-btn')) {
        document.getElementById('submit-btn').addEventListener('click', checkAnswer);
    }
    if (document.getElementById('prev-btn')) {
        document.getElementById('prev-btn').addEventListener('click', goToPreviousWord);
    }
    if (document.getElementById('next-btn')) {
        document.getElementById('next-btn').addEventListener('click', goToNextWord);
    }
    if (document.getElementById('category-selector')) {
        document.getElementById('category-selector').addEventListener('change', filterWords);
    }
}

