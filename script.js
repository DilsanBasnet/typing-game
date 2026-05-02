
const dictionary = "Variable network compiler hardware database bandwidth protocol pixel algorithm mainframe dilsan javascript logic basnet software firewall prasum peripheral pratik firmware legent bitwise boolean networking xetri risan modular automation frequency architecture".split(" ");


let currentWordIndex = 0;
let currentLetterIndex = 0;
let startTime = null;
let timer = 30;
let timerInterval = null;
let mistakes = 0;
let totalkeystrokes = 0;
let testHistory = [];


const wrapper = document.getElementById('words-wrapper');
const input = document.getElementById('hidden-input');
const caret = document.getElementById('caret');
const historyList = document.getElementById('history-list');

function init() {
    wrapper.innerHTML = '';
    wrapper.style.top = "0px"
    currentWordIndex = 0;
    currentLetterIndex = 0;
    startTime = null;
    timer = 30;
    mistakes = 0;
    totalkeystrokes = 0;
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
        wrapper.style.top = `-${currentTop - 5}px`;
    }
}

input.addEventListener('input', (e) => {
    if (!startTime) startEngine();

    const val = input.value;
    const activeWord = wrapper.children[currentWordIndex];
    const letters = activeWord.children;

    if(val.endsWith(' ')) {
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
            totalkeystrokes++;

            if(char === target.innerText) 
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
    const wpm = Math.round((totalkeystrokes /5 ) / mins) || 0;
    const acc = Math.round(((totalkeystrokes - mistakes) / totalkeystrokes) * 100) || 100;

    document.getElementById('wpm-val').innerText = wpm;
    document.getElementById('acc-val').innerText = acc + "%";
}

function saveToHistory(wpm , acc) {
    const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit' , minute:'2-digit'});
    testHistory.unshift({wpm, acc, time: timeLabel});
    if(testHistory.length > 5) testHistory.pop();

    historyList.innerHTML = testHistory.map(h => `
        <div class ="history-item">
        <span class = "h-wpm"> ${h.wpm} wpm </span>
        <span class = "h-acc"> ${h.acc} acc </span>
        <span class = "h-time"> ${h.time}</span>
        </div>
`).join('');
}
function endGame() {
    clearInterval(timerInterval);
    const finalWpm = document.getElementById('wpm-val').innerText;
    const finalAcc = document.getElementById('acc-val').innerText;

    saveToHistory(finalWpm, finalAcc);

    alert(`Test Complete!\nSpeed: ${finalWpm} WPM\nAccuracy: ${finalAcc}`)
    init();
}
window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') e.preventDefault();
    if (e.key === 'Enter' && document.activeElement !== input) init();
});
document.body.addEventListener('click', () => input.focus());

init();


