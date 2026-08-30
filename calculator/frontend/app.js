'use strict';
/**
 * Nebulara Calculator — Frontend Logic
 * app.js
 *
 * State machine:
 *   IDLE      → waiting for first number
 *   INPUT_A   → user is typing operand A
 *   OP_SET    → operator chosen, waiting for B
 *   INPUT_B   → user is typing operand B
 *   RESULT    → result displayed
 */

const API = 'http://localhost:3000/calc';

// ── State ─────────────────────────────────────────────────────────────────────
let state = {
  a:      '',       // first operand (string while typing)
  b:      '',       // second operand
  op:     null,     // current operator symbol: + - * / % pow gcd
  phase:  'IDLE',   // IDLE | INPUT_A | OP_SET | INPUT_B | RESULT
  last:   null,     // last result for chaining
};

// ── DOM refs ──────────────────────────────────────────────────────────────────
const elExpr    = document.getElementById('expr');
const elResult  = document.getElementById('result');
const elStatus  = document.getElementById('status');
const elHistory = document.getElementById('history');

// ── Display ───────────────────────────────────────────────────────────────────
const OP_LABELS = { '+':'＋', '-':'－', '*':'×', '/':'÷', '%':'mod', 'pow':'xʸ', 'gcd':'gcd', 'max':'max', 'min':'min' };

function showResult(val, err) {
  elResult.classList.remove('loading', 'error');
  if (err) {
    elResult.classList.add('error');
    elResult.textContent = err;
    elStatus.textContent = 'error from nebulara engine';
  } else {
    elResult.textContent = val;
    elStatus.textContent = '← nebulara calc-engine.nbs';
  }
}

function updateDisplay() {
  const { a, b, op, phase } = state;
  const opLabel = op ? (OP_LABELS[op] || op) : '';

  if (phase === 'IDLE' || phase === 'INPUT_A') {
    elExpr.textContent   = '\u00a0';
    elResult.textContent = a || '0';
    elStatus.textContent = '\u00a0';
    elResult.classList.remove('loading','error');
  } else if (phase === 'OP_SET') {
    elExpr.textContent   = `${a} ${opLabel}`;
    elResult.textContent = a;
    elResult.classList.remove('loading','error');
  } else if (phase === 'INPUT_B') {
    elExpr.textContent   = `${a} ${opLabel} ${b}`;
    elResult.textContent = b;
    elResult.classList.remove('loading','error');
  }
  // RESULT phase: showResult() handles it directly
}

// ── API call ──────────────────────────────────────────────────────────────────
async function calculate(op, a, b) {
  elResult.classList.add('loading');
  elResult.textContent = '…';
  elStatus.textContent = 'asking nebulara…';

  try {
    const res = await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ op, a: Number(a), b: Number(b) }),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    return { result: 0, error: `Server unreachable: ${e.message}` };
  }
}

// ── History ───────────────────────────────────────────────────────────────────
const historyItems = [];

function addHistory(exprStr, resultVal, isError) {
  historyItems.unshift({ exprStr, resultVal, isError });
  if (historyItems.length > 30) historyItems.pop();
  renderHistory();
}

function renderHistory() {
  elHistory.innerHTML = '';
  if (!historyItems.length) return;
  for (const item of historyItems) {
    const li = document.createElement('li');
    li.className = 'history-item' + (item.isError ? ' h-error' : '');
    li.innerHTML = `<span class="h-expr">${escHtml(item.exprStr)}</span><span class="h-result">${escHtml(String(item.resultVal))}</span>`;
    li.addEventListener('click', () => {
      if (!item.isError) {
        state = { a: String(item.resultVal), b: '', op: null, phase: 'INPUT_A', last: null };
        updateDisplay();
      }
    });
    elHistory.appendChild(li);
  }
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.getElementById('clearHist').addEventListener('click', () => {
  historyItems.length = 0;
  renderHistory();
});

// ── Input helpers ─────────────────────────────────────────────────────────────
function appendDigit(d) {
  const { phase } = state;

  if (phase === 'IDLE' || phase === 'INPUT_A') {
    if (state.a === '0') state.a = d;
    else state.a = (state.a + d).slice(0, 15);
    state.phase = 'INPUT_A';
  } else if (phase === 'OP_SET' || phase === 'INPUT_B') {
    if (state.b === '0') state.b = d;
    else state.b = (state.b + d).slice(0, 15);
    state.phase = 'INPUT_B';
  } else if (phase === 'RESULT') {
    // Start fresh after result
    state = { a: d, b: '', op: null, phase: 'INPUT_A', last: state.last };
  }
  updateDisplay();
}

function setOperator(op) {
  const { phase } = state;

  if (phase === 'RESULT') {
    // chain: use last result as A
    state = { a: String(state.last), b: '', op, phase: 'OP_SET', last: null };
  } else if (phase === 'INPUT_B') {
    // evaluate current then set new op
    triggerEquals(op);
    return;
  } else {
    if (!state.a) state.a = '0';
    state.op    = op;
    state.phase = 'OP_SET';
  }
  state.op    = op;
  state.phase = 'OP_SET';
  highlightOp(op);
  updateDisplay();
}

function highlightOp(op) {
  document.querySelectorAll('.btn-op').forEach(b => b.classList.remove('active'));
  if (op) {
    document.querySelectorAll('.btn-op').forEach(b => {
      if (b.dataset.op === op) b.classList.add('active');
    });
  }
}

async function triggerEquals(chainOp) {
  const { a, b, op } = state;
  if (!op || !b) return;

  const opLabel  = OP_LABELS[op] || op;
  const exprStr  = `${a} ${opLabel} ${b}`;
  const data     = await calculate(op, a, b);
  const isError  = !!data.error;
  const display  = isError ? data.error : String(data.result);

  elExpr.textContent = exprStr + ' =';
  showResult(display, data.error || null);
  addHistory(exprStr, isError ? data.error : data.result, isError);

  state.last  = isError ? 0 : data.result;
  state.phase = 'RESULT';
  highlightOp(null);

  if (chainOp) {
    state = { a: String(state.last), b: '', op: chainOp, phase: 'OP_SET', last: null };
    highlightOp(chainOp);
    updateDisplay();
  }
}

async function triggerFn(fn) {
  const { a, phase } = state;
  const val = phase === 'INPUT_B' ? state.b : (a || '0');
  let exprStr;

  // Functions that need two operands (use a & b)
  if ((fn === 'pow' || fn === 'gcd') && phase !== 'INPUT_B') {
    setOperator(fn);
    return;
  }
  if ((fn === 'pow' || fn === 'gcd') && phase === 'INPUT_B') {
    exprStr = `${fn}(${state.a}, ${state.b})`;
    const data = await calculate(fn, state.a, state.b);
    const isError = !!data.error;
    elExpr.textContent = exprStr + ' =';
    showResult(isError ? data.error : String(data.result), data.error || null);
    addHistory(exprStr, isError ? data.error : data.result, isError);
    state.last  = isError ? 0 : data.result;
    state.phase = 'RESULT';
    highlightOp(null);
    return;
  }

  // Single-operand functions
  const label = { sqrt: '√', abs: '|x|', factorial: 'n!', prime: 'prime?' }[fn] || fn;
  exprStr = `${label}(${val})`;
  const data = await calculate(fn, val, 0);
  const isError = !!data.error;

  elExpr.textContent = exprStr + ' =';

  if (fn === 'prime' && !isError) {
    const isPrime = data.result === 1;
    showResult(isPrime ? 'prime ✓' : 'not prime', null);
    addHistory(exprStr, isPrime ? 'prime' : 'not prime', false);
  } else {
    showResult(isError ? data.error : String(data.result), data.error || null);
    addHistory(exprStr, isError ? data.error : data.result, isError);
  }

  state.last  = isError ? 0 : data.result;
  state.phase = 'RESULT';
}

function clearAll() {
  state = { a: '', b: '', op: null, phase: 'IDLE', last: null };
  elExpr.textContent    = '\u00a0';
  elResult.textContent  = '0';
  elStatus.textContent  = '\u00a0';
  elResult.classList.remove('loading','error');
  highlightOp(null);
}

function negate() {
  const { phase } = state;
  if (phase === 'INPUT_A' || phase === 'IDLE') {
    if (state.a && state.a !== '0') {
      state.a = state.a.startsWith('-') ? state.a.slice(1) : '-' + state.a;
    }
  } else if (phase === 'INPUT_B' || phase === 'OP_SET') {
    if (state.b && state.b !== '0') {
      state.b = state.b.startsWith('-') ? state.b.slice(1) : '-' + state.b;
    }
  } else if (phase === 'RESULT') {
    state.a     = state.last ? String(-state.last) : '0';
    state.last  = null;
    state.phase = 'INPUT_A';
  }
  updateDisplay();
}

// ── Button event delegation ───────────────────────────────────────────────────
document.querySelector('.btn-grid').addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  if      (action === 'num')    appendDigit(btn.dataset.val);
  else if (action === 'op')     setOperator(btn.dataset.op);
  else if (action === 'fn')     triggerFn(btn.dataset.fn);
  else if (action === 'eq')     triggerEquals(null);
  else if (action === 'clear')  clearAll();
  else if (action === 'negate') negate();
});

// ── Keyboard support ──────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') { appendDigit(e.key); return; }
  const opMap = { '+':'+', '-':'-', '*':'*', '/':'/', '%':'%' };
  if (opMap[e.key]) { setOperator(opMap[e.key]); return; }
  if (e.key === 'Enter' || e.key === '=') { triggerEquals(null); return; }
  if (e.key === 'Escape' || e.key.toLowerCase() === 'c') { clearAll(); return; }
  if (e.key === 'Backspace') {
    const { phase } = state;
    if (phase === 'INPUT_A' && state.a.length > 0) {
      state.a = state.a.slice(0, -1) || '';
      updateDisplay();
    } else if (phase === 'INPUT_B' && state.b.length > 0) {
      state.b = state.b.slice(0, -1) || '';
      updateDisplay();
    }
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
updateDisplay();
