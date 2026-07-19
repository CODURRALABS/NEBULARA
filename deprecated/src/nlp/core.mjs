// Void NLP Core
class NLPCore {
  constructor() {
    this.intentPatterns = this._loadIntentPatterns();
    this.stopwords = this._loadStopwords();
  }
  tokenize(text) {
    const tokens = [];
    let i = 0;
    while (i < text.length) {
      if (/\s/.test(text[i])) { i++; continue; }
      if (/\d/.test(text[i])) {
        let num = '';
        while (i < text.length && /[\d.]/.test(text[i])) { num += text[i]; i++; }
        tokens.push({ type: 'NUMBER', value: num });
        continue;
      }
      if (/[a-zA-Z]/.test(text[i])) {
        let word = '';
        while (i < text.length && /[a-zA-Z']/.test(text[i])) { word += text[i]; i++; }
        tokens.push({ type: 'WORD', value: word.toLowerCase(), isStopword: this.stopwords.has(word.toLowerCase()) });
        continue;
      }
      if (/[.!?,;:]/.test(text[i])) { tokens.push({ type: 'PUNCT', value: text[i] }); i++; continue; }
      tokens.push({ type: 'OTHER', value: text[i] }); i++;
    }
    return tokens;
  }
  recognizeIntent(text) {
    const lower = text.toLowerCase();
    const intents = [];
    const cats = this.intentPatterns.categories;
    for (const [intent, patterns] of Object.entries(cats)) {
      for (const pattern of patterns) {
        // Special handling for math operators
        if (['+', '-', '*', '/', '%', '^'].includes(pattern)) {
          if (lower.includes(pattern)) {
            intents.push({ intent, confidence: 0.9 });
          }
        } else {
          const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'i');
          if (regex.test(lower)) {
            intents.push({ intent, confidence: 0.7 });
          }
        }
      }
    }
    intents.sort((a, b) => b.confidence - a.confidence);
    let questionType = 'open';
    if (lower.startsWith('what')) questionType = 'what';
    else if (lower.startsWith('who')) questionType = 'who';
    else if (lower.startsWith('how')) questionType = 'how';
    else if (lower.startsWith('why')) questionType = 'why';
    else if (lower.startsWith('where')) questionType = 'where';
    else if (lower.startsWith('when')) questionType = 'when';
    return {
      primary: intents[0] || { intent: 'unknown', confidence: 0 },
      all: intents,
      questionType,
      hasQuestionMark: text.includes('?'),
      isNegative: this._isNegative(lower)
    };
  }
  _isNegative(lower) {
    return ['not', "n't", 'no', 'never', 'don', 'doesn', 'didn', 'isn', 'aren'].some(n => lower.includes(n));
  }
  extractEntities(text) {
    const entities = [];
    const emailPattern = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g;
    let match;
    while ((match = emailPattern.exec(text)) !== null) entities.push({ type: 'EMAIL', value: match[0], confidence: 0.9 });
    const urlPattern = /\b(https?:\/\/[^\s]+|www\.[^\s]+)\b/g;
    while ((match = urlPattern.exec(text)) !== null) entities.push({ type: 'URL', value: match[0], confidence: 0.9 });
    const quantityPattern = /\b(\d+(?:\.\d+)?)\s*(miles?|km|meters?|feet|pounds?|kg|dollars?|%|percent|years?|months?|days?|hours?|minutes?|seconds?)\b/gi;
    while ((match = quantityPattern.exec(text)) !== null) entities.push({ type: 'QUANTITY', value: match[0], number: parseFloat(match[1]), unit: match[2], confidence: 0.85 });
    const stopWords = new Set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'tell', 'explain', 'describe', 'give', 'know', 'like', 'think', 'say', 'help']);
    const personPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    while ((match = personPattern.exec(text)) !== null) {
      const name = match[1];
      if (!stopWords.has(name.toLowerCase())) {
        entities.push({ type: 'PERSON', value: name, confidence: 0.7 });
      }
    }
    const topicMap = {
      programming: ['code', 'programming', 'software', 'algorithm', 'function'],
      science: ['science', 'physics', 'chemistry', 'biology'],
      math: ['math', 'equation', 'calculate', 'number', 'algebra'],
      philosophy: ['philosophy', 'meaning', 'existence', 'consciousness'],
      technology: ['technology', 'computer', 'ai', 'machine learning']
    };
    const lower = text.toLowerCase();
    for (const [topic, keywords] of Object.entries(topicMap)) {
      if (keywords.some(k => lower.includes(k))) entities.push({ type: 'TOPIC', value: topic, confidence: 0.6 });
    }
    return entities;
  }
  analyzeSentiment(text) {
    const positive = ['amazing', 'awesome', 'excellent', 'great', 'good', 'happy', 'love', 'like', 'beautiful', 'perfect'];
    const negative = ['terrible', 'horrible', 'bad', 'awful', 'hate', 'sad', 'angry', 'fail', 'wrong', 'problem'];
    const lower = text.toLowerCase();
    let score = 0;
    for (const w of positive) if (lower.includes(w)) score += 0.2;
    for (const w of negative) if (lower.includes(w)) score -= 0.2;
    const label = score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral';
    return { score, label, intensity: Math.abs(score) > 0.3 ? 'high' : Math.abs(score) > 0.1 ? 'medium' : 'low' };
  }
  extractKeywords(text, topN = 5) {
    const tokens = this.tokenize(text);
    const freq = {};
    for (const t of tokens) { if (!t.isStopword && t.type !== 'PUNCT') freq[t.value] = (freq[t.value] || 0) + 1; }
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([word, count]) => ({ word, count }));
  }
  similarity(text1, text2) {
    const tokens1 = this.tokenize(text1).filter(t => !t.isStopword && t.type !== 'PUNCT');
    const tokens2 = this.tokenize(text2).filter(t => !t.isStopword && t.type !== 'PUNCT');
    if (tokens1.length === 0 || tokens2.length === 0) return 0;
    const t1 = new Set(tokens1.map(t => t.value));
    const t2 = new Set(tokens2.map(t => t.value));
    const inter = new Set([...t1].filter(x => t2.has(x)));
    const union = new Set([...t1, ...t2]);
    const jaccard = union.size > 0 ? inter.size / union.size : 0;
    // Also check for substring similarity
    const lower1 = text1.toLowerCase();
    const lower2 = text2.toLowerCase();
    let substringBonus = 0;
    if (lower1.includes(lower2) || lower2.includes(lower1)) substringBonus = 0.3;
    // Check for word overlap
    const words1 = lower1.split(/\s+/);
    const words2 = lower2.split(/\s+/);
    const commonWords = words1.filter(w => words2.includes(w));
    const wordOverlap = Math.max(...words1.map(w1 => words2.filter(w2 => w1.includes(w2) || w2.includes(w1)).length), 0) / Math.max(words1.length, 1);
    return Math.min(jaccard + substringBonus + wordOverlap * 0.2, 1.0);
  }
  _loadIntentPatterns() {
    return {
      categories: {
        greeting: ['hello', 'hi', 'hey', 'greetings', 'welcome'],
        farewell: ['bye', 'goodbye', 'farewell', 'see you'],
        question: ['what', 'who', 'where', 'when', 'why', 'how'],
        identity: ['who are you', 'your name', 'what are you'],
        capability: ['can you', 'what can you do', 'help me'],
        explanation: ['explain', 'tell me about', 'what is', 'what are', 'describe'],
        comparison: ['compare', 'difference between', 'versus', 'better', 'worse'],
        definition: ['define', 'what does', 'meaning of'],
        list: ['list', 'give me', 'name', 'what are some'],
        advice: ['should', 'recommend', 'suggestion', 'advice'],
        problem: ['problem', 'issue', 'error', 'bug', 'fix', 'solve', 'help'],
        tutorial: ['how to', 'tutorial', 'guide', 'step', 'instructions', 'teach'],
        math: ['calculate', 'compute', 'solve', 'math', 'equation', '+', '-', '*', '/'],
        code: ['code', 'program', 'function', 'algorithm', 'programming', 'debug'],
        opinion: ['i think', 'i believe', 'i feel', 'in my opinion', 'personally'],
        request: ['can you', 'could you', 'would you', 'please', 'help me']
      }
    };
  }
  _loadStopwords() {
    return new Set(['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their']);
  }
}
export { NLPCore };
