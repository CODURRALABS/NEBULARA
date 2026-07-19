// Void Knowledge Graph Engine
// Semantic search and multi-hop reasoning

import crypto from 'crypto';

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

class KnowledgeGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this._seedGraph();
  }

  _seedGraph() {
    // Core nodes
    this.addNode('light', {
      content: 'Light travels at 299,792,458 m/s',
      embeddings: this._embed('light'),
      domain: 'physics',
      relations: ['wave', 'particle', 'speed']
    });

    this.addNode('quantum', {
      content: 'Quantum mechanics governs microscopic phenomena',
      embeddings: this._embed('quantum'),
      domain: 'physics',
      relations: ['wave', 'duality', 'entanglement']
    });

    this.addNode('function', {
      content: 'Function encapsulates reusable logic',
      embeddings: this._embed('function'),
      domain: 'math',
      relations: ['programming', 'logic', 'variable']
    });

    this.addNode('calculus', {
      content: 'Calculus studies rates of change and accumulation',
      embeddings: this._embed('calculus'),
      domain: 'math',
      relations: ['derivative', 'integral', 'limit']
    });

    // Connect nodes
    this.addEdge('light', 'quantum');
    this.addEdge('function', 'calculus');
  }

  addNode(id, data) {
    this.nodes.set(id, data);
    this.edges.set(id, []);
  }

  addEdge(from, to) {
    if (this.edges.has(from)) {
      this.edges.get(from).push(to);
    }
  }

  _embed(text) {
    const hash = sha256(text);
    const vec = [];
    for (let i = 0; i < 16; i++) {
      vec.push(parseInt(hash.substr(i * 2, 2), 16) / 255);
    }
    return vec;
  }

  search(query) {
    const queryVec = this._embed(query);
    const results = [];

    for (const [id, node] of this.nodes) {
      const score = this._similarity(queryVec, node.embeddings);
      if (score > 0.3) {
        results.push({ id, content: node.content, score });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  _similarity(v1, v2) {
    let dot = 0;
    let mag1 = 0, mag2 = 0;
    for (let i = 0; i < v1.length; i++) {
      dot += v1[i] * v2[i];
      mag1 += v1[i] ** 2;
      mag2 += v2[i] ** 2;
    }
    return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
  }

  multiHop(start, end) {
    // BFS for path
    const visited = new Set([start]);
    const queue = [[start, [start]]];

    while (queue.length) {
      const [node, path] = queue.shift();
      if (node === end) return path;

      const neighbors = this.edges.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }

    return null;
  }
}

export { KnowledgeGraph };