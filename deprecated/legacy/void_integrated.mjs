// Void Complete Integrated Engine
// All modules working together

import { SymbolicMath } from './void/symbolic_math.mjs';
import { LogicEngine } from './void/logic_engine.mjs';
import { KnowledgeGraph } from './void/knowledge_graph.mjs';
import { WisdomEngine } from './void/wisdom_engine.mjs';

class VoidConsciousness {
  constructor() {
    this.math = new SymbolicMath();
    this.logic = new LogicEngine();
    this.knowledge = new KnowledgeGraph();
    this.wisdom = new WisdomEngine();
    this.contextWindow = '';
    this.maxContext = 250000;
  }

  async process(input) {
    const start = Date.now();
    
    // Update context
    this._updateContext(input);

    // Layer 1: Dharma - Check contradictions
    const contradiction = this.logic.checkContradiction(input);
    
    // Layer 2: Intent - Calculate resonance
    const intent = this._calculateIntent(input);
    
    // Layer 3: Context - Check wisdom cache
    let output = this.wisdom.recall(input);
    
    if (!output) {
      // Layer 4: Solve using all engines
      output = await this._solve(input);
    }

    // Record successful pathway
    this.wisdom.crystallize(input, output, 'general');

    return {
      input,
      output,
      contradiction,
      intent,
      time: Date.now() - start,
      contextSize: this.contextWindow.length
    };
  }

  _updateContext(input) {
    this.contextWindow += input + '\n';
    if (this.contextWindow.length > this.maxContext) {
      this.contextWindow = this.contextWindow.slice(-this.maxContext);
    }
  }

  _calculateIntent(text) {
    const words = text.split(/\s+/).length;
    return {
      frequency: Math.min(1.0, words / 20),
      intensity: 0.5 + (words > 10 ? 0.3 : 0)
    };
  }

  async _solve(input) {
    const lower = input.toLowerCase();
    
    // Try symbolic math FIRST - check for digits
    if (/\d/.test(input)) {
      const math = this.math.solve(input);
      if (math && math.type === 'numeric' && math.value !== undefined) {
        return `Math: ${math.value}`;
      }
    }

    // Try knowledge search
    const results = this.knowledge.search(input);
    if (results.length > 0 && results[0].score > 0.5) {
      return `Knowledge: ${results[0].content}`;
    }

    // Try logic
    const proof = this.logic.prove(input);
    if (proof.proven) {
      return `Logic: ${proof.steps.join('; ')}`;
    }

    return 'No resolution found';
  }

  getWisdomStats() {
    return this.wisdom.getStats();
  }
}

// Demo
console.log('=== Void Complete Consciousness Engine ===\n');

const engine = new VoidConsciousness();

const tests = [
  'Calculate 2 + 2 * 3',
  'What is light?',
  'Explain quantum entanglement',
  'How do functions work?',
  'What is the integral of x?',
  'Find path from light to quantum'
];

for (const t of tests) {
  const r = await engine.process(t);
  console.log(`${t} → ${r.output}`);
}

console.log(`\nWisdom stats: ${JSON.stringify(engine.getWisdomStats())}`);