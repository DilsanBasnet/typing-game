
const dictionary = "Variable network compiler hardware database bandwidth protocol pixel algorithm mainframe dilsan javascript logic basnet software firewall prasum peripheral pratik firmware legent bitwise boolean networking xetri risan modular automation frequency architecture".split(" ");


let currentWordIndex = 0;
let currentLetterIndex = 0;
let startTime = null;
let timer = 30;
let timerInterval = null;
let mistakes = 0;
let totalkeystrokes = 0;
let testHistory = [];
let isGameActive = true;
let wordsGeneratedCount = 0;


const wrapper = document.getElementById('words-wrapper');
const input = document.getElementById('hidden-input');
const caret = document.getElementById('caret');
const historyList = document.getElementById('history-list');
const wpmEl = document.getElementById('wpm-val');
const accEl = document.getElementById('acc-val');
const timerEl = document.getElementById('timer-val');

function init() {
    wrapper.innerHTML = '';
    wrapper.style.top = "0px"
    currentWordIndex = 0;
    CurrentLetterIndex = 0;
    startTime = null;
    timer = 30;
    mistakes = 0;
    totalKeystrokes = 0;
    clearInterval(timerInterval);
    

    document.getElementById('timer-val').innerText ="30";
    document.getElementById('wpm-val').innerText = "0";
    document.getElementById('acc-val').innerText = "0%";

    for(let i=0; i<80; i++) {
        const w = document.createElement('div');
        w.className = 'word';
        const wordText = dictionary[Math.floor(Math.random() * dictionary.length)];
        wordText.split('').forEach(char => {
            const s = document.createElement('span');
            s.className = 'letter';
            s.innerText = char;
            w.appendChild(s);
        });
        wrapper.appendChild(w);
    }
    positionCaret();
    input.value = '';
    input.focus();
}

function positionCaret () {
    const activeWord = wrapper.children[currentWordIndex];
    const activeLetter = activeWord.children[currentLetterIndex];

    if(activeLetter) {
        caret.style.left = activeLetter.offsetLeft + "px";
        caret.style.top = activeLetter.offsetTop + "px";
    } 
    else {
        caret.style.left = (activeWord.offsetLeft + activeWord.offsetWidth) + "px";
        caret.style.top = activeWord.offsetTop + "px";
    }

    
    const currentTop = activeWord.offsetTop;
    if(currentTop > 40) {
        wrapper.style.top = `-${currentTop - 0}px`;
    }
}

input.addEventListener('input', (e) => {
    if (!startTime) startEngine();

    const val = input.value;
    const activeWord = wrapper.children[currentWordIndex];
    const letters = activeWord.children;

    if(val.endsWith('')) {
        currentWordIndex++;
        currentLetterIndex = 0;
        input.value = '';
    }
    else if(e.inputType === 'deleteContentBackward') {
        if(currentLetterIndex > 0) {
            currentLetterIndex--;
            letters[currentLetterIndex].classList.remove('correct', 'incorrect');
        }
    }
    else {
        const char = val.slice(-1);
        const target = letters[currentLetterIndex];

        if(target) {
            totalKeystrokes++;

            if(char == target.innerText) 
                {
                target.classList.add('correct');
            } else {
                target.classList.add('incorrect');
                mistakes++;
            }
            currentLetterIndex++;
        }
    }
    updateStats();
    positionCaret();
});

function startEngine() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timer--;
        document.getElementById('timer-val').innerText = timer;
        if(timer <= 0) endGame();
    }, 1000);
}
function updateStats() {
    const mins = (Date.now() - startTime) / 60000;
    const wpm = Math.round((totalKeystrokes /5 ) / mins) || 0;
    const acc = Math.round((totalKeystrokes - mistakes) / totalKeystrokes) * 100 || 100;

    document.getElementById('wpm-val').innerText = wpm;
    document.getElementById('acc-val').innerText = acc + "%";
}

function endGame() {
    clearInterval(timerInterval);
    alert(`Results\nWPM: ${document.getElementById('wpm-val').innerText}\nAccuracy: ${document.getElementById('acc-val').innerText}`);
    init();
}
window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') e.preventDefault();
    if (e.key == 'Enter' && document.activeElement !== input) init();
});

init();


