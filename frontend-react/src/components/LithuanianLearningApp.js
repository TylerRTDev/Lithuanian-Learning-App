import { useState, useEffect } from 'react';

export default function LithuanianLearningApp() {
    const [words, setWords] = useState([]);
    const [index, setIndex] = useState(0);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        fetch('/api/words')
            .then(response => response.json())
            .then(data => setWords(data));
    }, []);

    const handleSubmit = () => {
        fetch('/api/check-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lithuanian: words[index]?.lithuanian,
                answer: input
            })
        })
            .then(response => response.json())
            .then(result => {
                if (result.correct) {
                    setFeedback('✅ Correct!');
                    setProgress(progress + 1);
                } else {
                    setFeedback(`❌ Incorrect! The correct answer is "${result.correctAnswer}"`);
                }
                setTimeout(() => {
                    setFeedback('');
                    setInput('');
                    if (index < words.length - 1) {
                        setIndex(index + 1);
                    } else {
                        setIndex(0);
                        setProgress(0);
                    }
                }, 1500);
            });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-md rounded-lg p-6 w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Translate this word:</h2>
                <div className="text-3xl font-semibold mb-4">{words[index]?.lithuanian || 'Loading...'}</div>
                <input
                    type="text"
                    className="w-full p-2 border rounded mb-4"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter translation..."
                />
                <button
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                {feedback && <p className="mt-4 text-lg font-semibold">{feedback}</p>}
                <div className="mt-6 text-gray-600">Progress: {progress}/{words.length}</div>
            </div>
        </div>
    );
}
