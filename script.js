// Game State
const state = {
  dividend: 14,
  divisor: 3,
  itemsRemaining: 14,
  itemsPerGroup: 0,
  isFinished: false,
  feedback: 'none' // 'none', 'correct', 'incorrect'
};

// DOM Elements
const els = {
  dividendInput: document.getElementById('input-dividend'),
  divisorInput: document.getElementById('input-divisor'),
  equationDisplay: document.getElementById('equation-display'),
  basketsContainer: document.getElementById('baskets-container'),
  pileContainer: document.getElementById('pile-container'),
  itemsRemainingCount: document.getElementById('items-remaining-count'),
  distributeControls: document.getElementById('distribute-controls'),
  guessControls: document.getElementById('guess-controls'),
  guessFormCard: document.getElementById('guess-form-card'),
  successMsg: document.getElementById('success-msg'),
  successEquation: document.getElementById('success-equation'),
  errorMsg: document.getElementById('error-msg'),
  explanationSection: document.getElementById('explanation-section'),
  explanationText: document.getElementById('explanation-text'),
  restartBtn: document.getElementById('restart-btn'),
  distributeBtn: document.getElementById('distribute-btn'),
  checkBtn: document.getElementById('check-btn'),
  guessQuotient: document.getElementById('guess-quotient'),
  guessRemainder: document.getElementById('guess-remainder')
};

// Initialize
function init() {
  attachListeners();
  updateInputs();
  resetGame();
}

function attachListeners() {
  // Restart
  els.restartBtn.addEventListener('click', () => {
    // Keep numbers, reset progress
    resetGame();
  });

  // Distribute
  els.distributeBtn.addEventListener('click', () => {
    if (state.itemsRemaining >= state.divisor) {
      state.itemsRemaining -= state.divisor;
      state.itemsPerGroup += 1;
      render();
    }
  });

  // Check Answer
  els.checkBtn.addEventListener('click', checkAnswer);

  // Inputs
  els.dividendInput.addEventListener('change', (e) => updateNumbers('dividend', e.target.value));
  els.divisorInput.addEventListener('change', (e) => updateNumbers('divisor', e.target.value));

  // Control Buttons (+/-)
  document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      if (action === 'inc-dividend') updateNumbers('dividend', state.dividend + 1);
      if (action === 'dec-dividend') updateNumbers('dividend', state.dividend - 1);
      if (action === 'inc-divisor') updateNumbers('divisor', state.divisor + 1);
      if (action === 'dec-divisor') updateNumbers('divisor', state.divisor - 1);
    });
  });
}

function updateNumbers(type, value) {
  let val = parseInt(value, 10);
  if (isNaN(val)) return;

  if (type === 'dividend') {
    state.dividend = Math.max(1, Math.min(99, val));
  }
  if (type === 'divisor') {
    state.divisor = Math.max(1, Math.min(9, val));
  }

  updateInputs();
  resetGame(); // Auto reset on number change
}

function updateInputs() {
  els.dividendInput.value = state.dividend;
  els.divisorInput.value = state.divisor;
  els.equationDisplay.textContent = `${state.dividend} ÷ ${state.divisor} = ?`;
}

function resetGame() {
  state.itemsRemaining = state.dividend;
  state.itemsPerGroup = 0;
  state.isFinished = false;
  state.feedback = 'none';
  
  // Reset Guesses
  els.guessQuotient.value = '';
  els.guessRemainder.value = '';

  render();
}

function checkAnswer() {
  const actualQuotient = Math.floor(state.dividend / state.divisor);
  const actualRemainder = state.dividend % state.divisor;
  
  const qGuess = parseInt(els.guessQuotient.value, 10);
  const rGuess = parseInt(els.guessRemainder.value, 10);

  if (qGuess === actualQuotient && rGuess === actualRemainder) {
    state.isFinished = true;
    state.feedback = 'correct';
    render();
  } else {
    state.feedback = 'incorrect';
    render();
    setTimeout(() => {
      state.feedback = 'none';
      render();
    }, 2500);
  }
}

// Rendering Logic
function render() {
  const canDistribute = state.itemsRemaining >= state.divisor;

  // 1. Render Baskets
  els.basketsContainer.innerHTML = '';
  for (let i = 0; i < state.divisor; i++) {
    const isFull = !canDistribute;
    const basketEl = document.createElement('div');
    basketEl.className = `relative flex flex-col items-center justify-end w-24 h-32 sm:w-32 sm:h-40 bg-white/50 border-4 border-b-8 rounded-2xl transition-all duration-300 ${isFull ? 'border-green-400 bg-green-50/50' : 'border-slate-300'}`;
    
    // Items inside basket
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'flex flex-wrap justify-center content-end p-2 w-full h-full overflow-hidden';
    
    for (let j = 0; j < state.itemsPerGroup; j++) {
      itemsContainer.appendChild(createAppleIcon());
    }
    
    // Label
    const label = document.createElement('div');
    label.className = 'absolute -bottom-10 font-bold text-slate-400 text-sm';
    label.textContent = `Basket ${i + 1}`;

    basketEl.appendChild(itemsContainer);
    basketEl.appendChild(label);
    els.basketsContainer.appendChild(basketEl);
  }

  // 2. Render Pile
  els.pileContainer.innerHTML = '';
  if (state.itemsRemaining === 0) {
    els.pileContainer.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-300 font-medium italic p-4">All apples distributed!</div>';
  } else {
    for (let i = 0; i < state.itemsRemaining; i++) {
      els.pileContainer.appendChild(createAppleIcon());
    }
  }
  els.itemsRemainingCount.textContent = state.itemsRemaining;

  // 3. Toggle Controls
  if (canDistribute) {
    els.distributeControls.classList.remove('hidden');
    els.guessControls.classList.add('hidden');
    els.guessControls.classList.remove('flex');
  } else {
    els.distributeControls.classList.add('hidden');
    els.guessControls.classList.remove('hidden');
    els.guessControls.classList.add('flex');
  }

  // 4. Feedback States
  if (state.isFinished) {
    els.guessFormCard.classList.add('hidden');
    els.successMsg.classList.remove('hidden');
    els.successEquation.textContent = `${state.dividend} ÷ ${state.divisor} = ${Math.floor(state.dividend/state.divisor)} R ${state.dividend % state.divisor}`;
    
    // Show Explanation
    els.explanationSection.classList.remove('hidden');
    els.explanationText.innerText = getStaticExplanation(state.dividend, state.divisor);

  } else {
    els.guessFormCard.classList.remove('hidden');
    els.successMsg.classList.add('hidden');
    els.explanationSection.classList.add('hidden');
  }

  if (state.feedback === 'incorrect') {
    els.errorMsg.classList.remove('hidden');
  } else {
    els.errorMsg.classList.add('hidden');
  }

  // Refresh Icons
  lucide.createIcons();
}

function createAppleIcon() {
  const div = document.createElement('div');
  div.className = 'bounce-enter inline-block m-1 transform transition-all duration-300 hover:scale-125';
  // Use SVG string for Apple (Red)
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple w-6 h-6 sm:w-8 sm:h-8 text-red-500"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>`;
  return div;
}

function getStaticExplanation(div, divsr) {
  const q = Math.floor(div / divsr);
  const r = div % divsr;
  
  if (r === 0) {
    return `Amazing! We shared ${div} apples equally among ${divsr} baskets. Each basket got exactly ${q} apples, and there were 0 left over. Perfect sharing!`;
  }
  
  return `Great work! We started with ${div} apples. When we shared them into ${divsr} baskets, every basket got ${q} apples. But we had ${r} apple${r > 1 ? 's' : ''} left over that couldn't fit evenly. That's the remainder!`;
}

// Start
document.addEventListener('DOMContentLoaded', init);
