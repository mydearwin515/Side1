// Personality type mapping
// Use question IDs for category mapping
const PERSONALITY_A_IDS = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 65, 69, 73, 77, 81, 85, 89];
const PERSONALITY_B_IDS = [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70, 74, 78, 82, 86, 90];
const PERSONALITY_C_IDS = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 63, 67, 71, 75, 79, 83, 87, 91];
const PERSONALITY_D_IDS = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92];

const TEMPERAMENTS = {
    A: {
        name: "Melancholic (black bile)",
        description: "People with melancholic dispositions tend to be loyal, kind people who value family above all else. They’re sensitive and often feel their emotions strongly. People with this temperament love to love and often make doting parents and partners. If you have this temperament, you likely remember details about people and know how to make someone feel special. But you may be seen as pessimistic by some."
    },
    B: {
        name: "Phlegmatic (phlegm)",
        description: "People with a phlegmatic disposition are often intuitive, introverted, empathetic, and unassuming. They’re abstract thinkers who may not default to black-and-white thinking. If you have this type, nuance may be crucial to you. You enjoy harmonious relationships and are typically even-tempered. People may have told you that you’re indecisive, so having fewer options may be more helpful for you."
    },
    C: {
        name: "Choleric (yellow bile)",
        description: "People with choleric temperaments are typically success-oriented. They often rise to the top of organizations or start their own businesses as entrepreneurs. If you have this temperament, you may be a natural leader and have trouble thriving in subordinate positions. You’re a logical, analytical thinker that may prefer subjects such as math to more creative subjects such as art. You may not be invested in politeness and may have been told that you’re rude or bossy. You enjoy a challenge and can be highly competitive."
    },
    D: {
        name: "Sanguine (blood)",
        description: "People with sanguine temperaments are typically outgoing, cheerful, and optimistic. They’re quite extroverted and love adventure. People with this type may get bored easily and not enjoy routine. They jump at the chance to learn something new but often have trouble sticking with something for very long. If you have this temperament, you may end up accumulating many degrees or diplomas over your lifetime. Your thirst for experiences might leave you susceptible to harmful behaviors."
    }
};

function getPersonalityScores(questions, answers) {
    let scores = { A: 0, B: 0, C: 0, D: 0 };
    for (let i = 0; i < questions.length; i++) {
        const id = questions[i].id;
        const val = answers[i] || 0;
        if (PERSONALITY_A_IDS.includes(id)) scores.A += val;
        if (PERSONALITY_B_IDS.includes(id)) scores.B += val;
        if (PERSONALITY_C_IDS.includes(id)) scores.C += val;
        if (PERSONALITY_D_IDS.includes(id)) scores.D += val;
    }
    return scores;
}

window.onload = async function () {
    const resultText = document.getElementById('resultText');
    let answers = [];
    try {
        answers = JSON.parse(localStorage.getItem('personalityAnswers')) || [];
    } catch (e) { }
    let questions = [];
    try {
        const module = await import('./questions.js');
        questions = module.QUESTIONS;
    } catch (e) { }
    if (answers.length && questions.length) {
        const scores = getPersonalityScores(questions, answers);
        // Get sorted temperament types by score
        const sortedTypes = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
        const primaryType = sortedTypes[0];
        const secondaryType = sortedTypes[1];
        const primary = TEMPERAMENTS[primaryType];
        const secondary = TEMPERAMENTS[secondaryType];
        // Aesthetic result card
        resultText.innerHTML = `
        <div id="resultCard" style="max-width:600px;margin:48px 0 0 48px;padding:32px 32px 32px 28px;background:rgba(255,255,255,0.92);border-radius:22px;box-shadow:0 8px 32px rgba(60,60,60,0.10);text-align:left;">
            <h2 style="font-size:2.1rem;font-weight:700;color:#1a1a1a;margin-bottom:18px;letter-spacing:-0.02em;">Your Temperament Profile</h2>
            <div style="display:flex;flex-direction:column;gap:28px;">
                <div style="background:rgba(249,246,240,0.7);border-radius:16px;padding:18px 18px 18px 14px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="font-size:1.18rem;font-weight:600;color:#1a1a1a;margin-bottom:8px;">Primary: <span style="color:#3a7bd5;">${primary.name}</span></div>
                    <div style="font-size:1.04rem;line-height:1.7;color:#333;margin-bottom:10px;">${primary.description}</div>
                    <div style="font-size:1.02rem;color:#7b7468;">Score: <strong>${scores[primaryType]}</strong></div>
                </div>
                <div style="background:rgba(249,246,240,0.5);border-radius:16px;padding:16px 16px 16px 12px;box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                    <div style="font-size:1.08rem;font-weight:500;color:#1a1a1a;margin-bottom:6px;">Secondary: <span style="color:#f7971e;">${secondary.name}</span></div>
                    <div style="font-size:0.98rem;line-height:1.6;color:#444;margin-bottom:8px;">${secondary.description}</div>
                    <div style="font-size:0.98rem;color:#7b7468;">Score: <strong>${scores[secondaryType]}</strong></div>
                </div>
            </div>
            <div style="margin-top:32px;font-size:1.08rem;color:#555;text-align:left;">
                <span style="font-weight:600;color:#3a7bd5;">A</span>: ${scores.A} &nbsp;|&nbsp; <span style="font-weight:600;color:#f7971e;">B</span>: ${scores.B} &nbsp;|&nbsp; <span style="font-weight:600;color:#e84c3d;">C</span>: ${scores.C} &nbsp;|&nbsp; <span style="font-weight:600;color:#43cea2;">D</span>: ${scores.D}
            </div>
        </div>
        `;
        // PDF download logic
        document.getElementById('downloadPdfBtn').onclick = async function () {
            // Load jsPDF if not present
            if (!window.jsPDF) {
                await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            }
            const { jsPDF } = window.jspdf || window;
            if (jsPDF) {
                const doc = new jsPDF({ unit: 'pt', format: 'a4' });
                const card = document.getElementById('resultCard');
                doc.html(card, {
                    callback: function (pdf) {
                        pdf.save('temperament-result.pdf');
                    },
                    x: 32,
                    y: 32,
                    width: 520
                });
            } else {
                alert('PDF download is not available. Please contact support.');
            }
        };
    } else {
        resultText.textContent = 'No result found. Please take the test.';
    }
};
