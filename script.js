import { QUESTIONS, RATING_OPTIONS } from './questions.js';

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let randomizedQuestions = [];
let currentIndex = 0;
let answers = [];

function showQuestion() {
    const questionBox = document.getElementById('questionBox');
    const ratingButtons = document.getElementById('ratingButtons');
    const progress = document.getElementById('progress');
    questionBox.innerHTML = `<p>${randomizedQuestions[currentIndex].text}</p>`;
    ratingButtons.innerHTML = '';
    RATING_OPTIONS.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.label;
        btn.className = 'button';
        btn.onclick = () => selectAnswer(opt.value);
        ratingButtons.appendChild(btn);
    });
    // Estimate: 96 questions, ~1.5 seconds per question = ~2.5 minutes per 96 questions
    // We'll use 1.5 seconds per question for estimate
    const totalSeconds = randomizedQuestions.length * 1.5;
    const secondsLeft = Math.max(0, Math.round(totalSeconds - currentIndex * 1.5));
    const minutesLeft = Math.ceil(secondsLeft / 60);
    progress.textContent = `Estimated time left: ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}`;
}

function selectAnswer(value) {
    answers.push(parseInt(value));
    currentIndex++;
    if (currentIndex < randomizedQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    // Disable leave warning before redirecting to result
    if (window.testInProgress !== undefined) window.testInProgress = false;
    localStorage.setItem('personalityAnswers', JSON.stringify(answers));
    window.location.href = 'result.html';
}

window.addEventListener('DOMContentLoaded', () => {
    randomizedQuestions = shuffle([...QUESTIONS]);
    currentIndex = 0;
    answers = [];
    showQuestion();
});
