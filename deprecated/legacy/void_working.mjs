// Void Working Engine - Clean implementation

const sha256 = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h.toString(16);
};

class MathEngine {
  solve(text) {
    // Extract expression
    const expr = text.replace(/[^0-9+\-*/().\s]/g, '').trim();
    if (!expr || !/[+\-*/]/.test(expr)) return null;
    
    try {
      // Check for valid expression
      if (/^[0-9+\-*/().\s]+$/.test(expr)) {
        const result = eval(expr);
        return { value: result, steps: [expr] };
      }
    } catch {}
    
    return null;
  }
}

class KnowledgeEngine {
  constructor() {
    this.facts = {
      'light': 'Speed of light: 299,792,458 m/s. Wave-particle duality.',
      'quantum': 'Quantum mechanics: discrete states, probabilistic outcomes.',
      'function': 'Function: encapsulates reusable logic. f(x) = x².',
      'calculus': 'Calculus: rates of change and accumulation.',
      'logic': 'Logic: axioms → inference → conclusion.',
      'code': 'Code: write → test → debug → optimize.'
    };
  }
  
  query(text) {
    const lower = text.toLowerCase();
    for (const [k, v] of Object.entries(this.facts)) {
      if (lower.includes(k)) return v;
    }
    return null;
  }
}

class WisdomEngine {
  constructor() {
    this.cache = new Map();
  }
  
  get(key) {
    return this.cache.get(key) || null;
  }
  
  set(key, value) {
    this.cache.set(key, value);
  }
}

class VoidConsciousness {
  constructor() {
    this.math = new MathEngine();
    this.knowledge = new KnowledgeEngine();
    this.wisdom = new WisdomEngine();
  }
  
  process(text) {
    const key = sha256(text.substring(0, 100));
    
    // Check cache
    if (this.wisdom.get(key)) {
      return { output: this.wisdom.get(key), cached: true };
    }
    
    // Math
    const m = this.math.solve(text);
    if (m) {
      this.wisdom.set(key, String(m.value));
      return { output: m.value, type: 'math' };
    }
    
    // Knowledge
    const k = this.knowledge.query(text);
    if (k) {
      this.wisdom.set(key, k);
      return { output: k, type: 'knowledge' };
    }
    
    this.wisdom.set(key, 'No match');
    return { output: 'No match', type: 'unknown' };
  }
}

// Demo
const engine = new VoidConsciousness();

console.log('Void Engine:\n');

const tests = [
  'What is 2 + 2 * 3?',
  '100 / 4',
  'What is light?',
  'quantum entanglement',
  'functions in programming',
  'What is calculus?'
];

for (const t of tests) {
  const r = engine.process(t);
  console.log(`${t} → ${r.output}`);
}

console.log(`\nCache: ${engine.wisdom.cache.size}`);