// Void Real HTTP Fetcher - Complete
// Uses actual HTTP calls to trusted sources

import https from 'https';
import http from 'http';

const TRUSTED_DOMAINS = [
  'wikipedia.org', 'arxiv.org', 'docs.rs', 'mathworld.wolfram.com',
  'gutenberg.org', 'plato.stanford.edu', 'developer.mozilla.org',
  'nasa.gov', 'w3.org', 'ietf.org'
];

class RealHttpFetcher {
  constructor() {
    this.cache = new Map();
    this.allowedSources = TRUSTED_DOMAINS;
  }

  isTrusted(url) {
    try {
      const { hostname } = new URL(url);
      return this.allowedSources.some(d => hostname.includes(d));
    } catch {
      return false;
    }
  }

  async fetch(url, timeout = 5000) {
    return new Promise((resolve) => {
      if (!this.isTrusted(url)) {
        resolve({ error: 'Untrusted source', content: '', source: 'blocked' });
        return;
      }

      let timer = setTimeout(() => resolve({ error: 'Timeout', content: '' }), timeout);
      
      const client = url.startsWith('https') ? https : http;
      
      client.get(url, { headers: { 'User-Agent': 'Void-Engine/1.0' } }, (res) => {
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          clearTimeout(timer);
          try {
            const json = JSON.parse(data);
            resolve({
              status: res.statusCode,
              extract: json.extract || json.title || '',
              content: data.substring(0, 10000),
              source: url
            });
          } catch {
            resolve({
              status: res.statusCode,
              content: data.substring(0, 10000),
              source: url
            });
          }
        });
      }).on('error', (e) => {
        clearTimeout(timer);
        resolve({ error: e.message, content: '' });
      });
    });
  }

  async searchWikipedia(query) {
    const q = encodeURIComponent(query);
    const url = https://en.wikipedia.org/api/rest_v1/page/summary/;
    return this.fetch(url);
  }

  async searchMathworld(query) {
    const url = https://mathworld.wolfram.com/.html;
    return this.fetch(url);
  }

  async searchArxiv(query) {
    const q = encodeURIComponent(query);
    const url = https://export.arxiv.org/api/query?search_query=&max_results=1;
    return this.fetch(url);
  }

  _findTrustedUrl(query) {
    const lower = query.toLowerCase();
    
    if (lower.includes('light') || lower.includes('physics')) {
      return 'https://en.wikipedia.org/api/rest_v1/page/summary/Speed_of_light';
    }
    
    if (lower.includes('quantum')) {
      return 'https://en.wikipedia.org/api/rest_v1/page/summary/Quantum_mechanics';
    }
    
    if (lower.includes('function')) {
      return 'https://en.wikipedia.org/api/rest_v1/page/summary/Function_(mathematics)';
    }
    
    return null;
  }

  _structure(content, url) {
    const sentences = content.split(/[.!?]+/).filter(s => s.length > 20);
    return {
      url,
      summary: sentences.slice(0, 3).join('. '),
      length: sentences.length
    };
  }
}

export { RealHttpFetcher };
