// Void Wisdom Engine
// Self-modifying pathways and crystallization

import crypto from 'crypto';

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

class WisdomEngine {
  constructor() {
    this.pathways = new Map();
    this.patterns = new Map();
  }

  // Record a successful pathway
  crystallize(input, output, context) {
    const key = sha256(input.substring(0, 100));
    
    const pathway = {
      input: key,
      output,
      context: context || 'general',
      timestamp: Date.now(),
      usage: 1,
      confidence: 1.0
    };

    this.pathways.set(key, pathway);
    this._updatePatterns(input, output);
  }

  // Retrieve crystallized wisdom
  recall(input) {
    const key = sha256(input.substring(0, 100));
    
    if (this.pathways.has(key)) {
      const pathway = this.pathways.get(key);
      pathway.usage += 1;
      pathway.confidence = Math.min(1.0, pathway.confidence + 0.01);
      return pathway.output;
    }

    return null;
  }

  _updatePatterns(input, output) {
    const words = input.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (word.length > 3) {
        const count = this.patterns.get(word) || 0;
        this.patterns.set(word, count + 1);
      }
    }
  }

  // Evolve pathways based on feedback
  evolve(feedback) {
    for (const [key, pathway] of this.pathways) {
      if (feedback[key] === 'success') {
        pathway.confidence = Math.min(1.0, pathway.confidence + 0.1);
      } else if (feedback[key] === 'failure') {
        pathway.confidence = Math.max(0.0, pathway.confidence - 0.2);
      }
    }
  }

  // Get most used pathways
  getStats() {
    const sorted = [...this.pathways.entries()]
      .map(([k, v]) => ({ key: k, usage: v.usage, confidence: v.confidence }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);
    
    return {
      total: this.pathways.size,
      patterns: this.patterns.size,
      topPathways: sorted
    };
  }
}

export { WisdomEngine };