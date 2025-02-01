document.addEventListener("DOMContentLoaded", () => {
    let words = [];
    let index = 0;
    let progress = 0;

    async function fetchWords() {
        try {
            const response = await fetch('http://localhost:5000/api/words');
            words = await response.json();
            document.getElementById('total-words').textContent = words.length;
            displayWord();
        } catch (error) {
            console.error('Error fetching words:', error);
        }
    }

    function displayWord() {
        if (words.length === 0) {
            document.getElementById('word-display').textContent = "No words available";
            return;
        }
        document.getElementById('word-display').textContent = words[index]?.lithuanian || "No words available";
    }

    async function checkAnswer() {
        const userInput = document.getElementById('user-input').value.trim();

        if (!words.length) {
            console.error("No words loaded yet.");
            return;
        }

        const response = await fetch('http://localhost:5000/api/check-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lithuanian: words[index]?.lithuanian,
                answer: userInput
            })
        });

        const result = await response.json();
        const feedbackElement = document.getElementById('feedback');

        if (result.correct) {
            feedbackElement.textContent = '✅ Correct!';
            progress++;
        } else {
            feedbackElement.textContent = `❌ Incorrect! The correct answer is "${result.correctAnswer}"`;
        }

        document.getElementById('progress-count').textContent = progress;

        setTimeout(() => {
            feedbackElement.textContent = '';
            document.getElementById('user-input').value = '';
            if (index < words.length - 1) {
                index++;
            } else {
                index = 0;
                progress = 0;
            }
            displayWord();
        }, 1500);
    }

    document.getElementById('submit-btn').addEventListener('click', checkAnswer);
    fetchWords();
});
