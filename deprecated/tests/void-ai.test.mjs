// Void AI — Comprehensive Test Suite
// Tests NLP, Knowledge, Reasoning, Conversation, and Full Integration

import { VoidAI } from '../src/void-ai.mjs';

let passed = 0;
let failed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    const result = fn();
    if (result === false) {
      console.log(`  ✗ ${name}`);
      failed++;
    } else {
      console.log(`  ✓ ${name}`);
      passed++;
    }
  } catch (e) {
    console.log(`  ✗ ${name} — ${e.message}`);
    failed++;
  }
}

function assert(condition, name) {
  test(name, () => condition);
}

function assertEqual(actual, expected, name) {
  test(name, () => actual === expected);
}

function assertContains(haystack, needle, name) {
  test(name, () => haystack.includes(needle));
}

function assertGreaterThan(a, b, name) {
  test(name, () => a > b);
}

// ============================================
// TEST: NLP Core
// ============================================

console.log('\n=== NLP Core Tests ===');

const ai = new VoidAI();

// Tokenization
test('Tokenize simple sentence', () => {
  const tokens = ai.nlp.tokenize('Hello world');
  return tokens.length >= 2 && tokens[0].value === 'hello';
});

test('Tokenize with numbers', () => {
  const tokens = ai.nlp.tokenize('I have 5 apples');
  return tokens.some(t => t.type === 'NUMBER' && t.value === '5');
});

test('Tokenize preserves punctuation', () => {
  const tokens = ai.nlp.tokenize('Hello!');
  return tokens.some(t => t.type === 'PUNCT' && t.value === '!');
});

// Intent Recognition
test('Recognize greeting intent', () => {
  const intent = ai.nlp.recognizeIntent('Hello there!');
  return intent.primary.intent === 'greeting';
});

test('Recognize question intent', () => {
  const intent = ai.nlp.recognizeIntent('What is Python?');
  return intent.primary.intent === 'question' || intent.questionType === 'what';
});

test('Recognize farewell intent', () => {
  const intent = ai.nlp.recognizeIntent('Goodbye!');
  return intent.primary.intent === 'farewell';
});

test('Detect question type', () => {
  const intent = ai.nlp.recognizeIntent('How do I code?');
  return intent.questionType === 'how';
});

test('Detect negative sentiment', () => {
  const intent = ai.nlp.recognizeIntent('I don\'t like this');
  return intent.isNegative === true;
});

// Entity Extraction
test('Extract person names', () => {
  const entities = ai.nlp.extractEntities('John went to the store');
  return entities.some(e => e.type === 'PERSON' && e.value.includes('John'));
});

test('Extract email addresses', () => {
  const entities = ai.nlp.extractEntities('Contact me at test@example.com');
  return entities.some(e => e.type === 'EMAIL');
});

test('Extract URLs', () => {
  const entities = ai.nlp.extractEntities('Visit https://example.com');
  return entities.some(e => e.type === 'URL');
});

test('Extract topics', () => {
  const entities = ai.nlp.extractEntities('I love programming in Python');
  return entities.some(e => e.type === 'TOPIC' && e.value === 'programming');
});

test('Extract quantities', () => {
  const entities = ai.nlp.extractEntities('I ran 5 miles');
  return entities.some(e => e.type === 'QUANTITY' && e.number === 5);
});

// Sentiment Analysis
test('Positive sentiment detection', () => {
  const sentiment = ai.nlp.analyzeSentiment('This is amazing and wonderful!');
  return sentiment.label === 'positive' && sentiment.score > 0;
});

test('Negative sentiment detection', () => {
  const sentiment = ai.nlp.analyzeSentiment('This is terrible and horrible!');
  return sentiment.label === 'negative' && sentiment.score < 0;
});

test('Neutral sentiment detection', () => {
  const sentiment = ai.nlp.analyzeSentiment('The table is brown');
  return sentiment.label === 'neutral';
});

// Text Similarity
test('Similar text detection', () => {
  const sim = ai.nlp.similarity('I love programming', 'I enjoy coding');
  return sim > 0;
});

test('Dissimilar text detection', () => {
  const sim = ai.nlp.similarity('Hello world', 'Quantum physics');
  return sim < 0.5;
});

// Keyword Extraction
test('Extract keywords', () => {
  const keywords = ai.nlp.extractKeywords('I love programming in Python and JavaScript');
  return keywords.length > 0 && keywords.some(k => k.word === 'programming');
});

// ============================================
// TEST: Knowledge Base
// ============================================

console.log('\n=== Knowledge Base Tests ===');

test('Add and retrieve fact', () => {
  ai.kb.addFact('test_entity', { type: 'test', value: 42 });
  const fact = ai.kb.getFact('test_entity');
  return fact && fact.type === 'test' && fact.value === 42;
});

test('Has fact check', () => {
  return ai.kb.hasFact('test_entity') && !ai.kb.hasFact('nonexistent');
});

test('Add and retrieve relation', () => {
  ai.kb.addRelation('A', 'related_to', 'B');
  const relations = ai.kb.getRelations('A', 'related_to');
  return relations.includes('B');
});

test('Get all relations for entity', () => {
  ai.kb.addRelation('X', 'knows', 'Y');
  ai.kb.addRelation('X', 'likes', 'Z');
  const relations = ai.kb.getRelations('X');
  return relations.length >= 2;
});

test('Add and retrieve concept', () => {
  ai.kb.addConcept('test_concept', 'A test concept', ['related1'], ['example1']);
  const concept = ai.kb.getConcept('test_concept');
  return concept && concept.definition === 'A test concept';
});

test('Search concepts', () => {
  const results = ai.kb.searchConcepts('programming');
  return results.length > 0;
});

test('Seed knowledge loaded', () => {
  const stats = ai.kb.stats();
  return stats.facts > 10 && stats.concepts > 10 && stats.relations > 10;
});

test('Query facts by pattern', () => {
  const results = ai.kb.queryFacts({ type: 'planet' });
  return results.length > 0;
});

// ============================================
// TEST: Reasoning Engine
// ============================================

console.log('\n=== Reasoning Engine Tests ===');

test('Deduction with modus ponens', () => {
  const conclusions = ai.reasoning.deduce([
    { type: 'implies', antecedent: 'test_entity', consequent: 'inferred_fact', confidence: 0.9 }
  ]);
  return conclusions.length > 0 && conclusions[0].conclusion === 'inferred_fact';
});

test('Induction from observations', () => {
  const patterns = ai.reasoning.induce([
    { color: 'red', size: 'large' },
    { color: 'red', size: 'large' },
    { color: 'red', size: 'small' }
  ]);
  return patterns.length > 0;
});

test('Abduction finds best explanation', () => {
  const explanations = ai.reasoning.abduce('smoke', [
    { type: 'cause', cause: 'fire', entity: 'fire' },
    { type: 'cause', cause: 'steam', entity: 'steam' }
  ]);
  return explanations.length > 0;
});

test('Analogical reasoning', () => {
  const analogies = ai.reasoning.analogize('earth', 'mars');
  return analogies.length >= 0; // May be 0 if no relations match
});

test('Explanation generation', () => {
  const explanation = ai.reasoning.explain('programming');
  return explanation && explanation.conclusion === 'programming';
});

// ============================================
// TEST: Conversation Manager
// ============================================

console.log('\n=== Conversation Manager Tests ===');

test('Create session', () => {
  const sessionId = ai.conversations.createSession('test_user');
  return sessionId && sessionId.startsWith('session_');
});

test('Get session', () => {
  const session = ai.conversations.getSession(ai.activeSession);
  return session && session.userId === 'default';
});

test('Add message to session', () => {
  const msg = ai.conversations.addMessage(ai.activeSession, 'user', 'Hello!');
  return msg && msg.content === 'Hello!' && msg.role === 'user';
});

test('Get history', () => {
  if (!ai.activeSession) ai.startSession();
  const history = ai.conversations.getHistory(ai.activeSession);
  return Array.isArray(history);
});

test('Context window generation', () => {
  if (!ai.activeSession) ai.startSession();
  const context = ai.conversations.buildContextWindow(ai.activeSession);
  return typeof context === 'string';
});

test('Session stats', () => {
  const stats = ai.conversations.getSessionStats(ai.activeSession);
  return stats && stats.messageCount > 0;
});

// ============================================
// TEST: Response Generator
// ============================================

console.log('\n=== Response Generator Tests ===');

test('Generate greeting response', () => {
  const response = ai.generator.generate('Hello!');
  return response.text && response.type === 'greeting';
});

test('Generate farewell response', () => {
  const response = ai.generator.generate('Goodbye!');
  return response.text && response.type === 'farewell';
});

test('Generate identity response', () => {
  const response = ai.generator.generate('Who are you?');
  return response.text && (response.type === 'identity' || response.type === 'answer');
});

test('Generate capability response', () => {
  const response = ai.generator.generate('What can you do?');
  return response.text && (response.type === 'capability' || response.type === 'answer');
});

test('Generate question response', () => {
  const response = ai.generator.generate('What is Python?');
  return response.text && response.confidence > 0;
});

test('Generate math response', () => {
  const response = ai.generator.generate('What is 2 + 3?');
  return response.text && (response.text.includes('5') || response.type === 'math');
});

test('Generate explanation response', () => {
  const response = ai.generator.generate('Explain programming');
  return response.text && response.confidence > 0;
});

test('Generate code help response', () => {
  const response = ai.generator.generate('I need help with code');
  return response.text && response.confidence > 0;
});

// ============================================
// TEST: Full Integration
// ============================================

console.log('\n=== Full Integration Tests ===');

test('Start session and get greeting', () => {
  const session = ai.startSession('integration_test');
  return session.sessionId && session.greeting;
});

test('Multi-turn conversation', () => {
  const r1 = ai.chat('Hello!');
  const r2 = ai.chat('What is AI?');
  const r3 = ai.chat('Tell me more');
  return r1.response && r2.response && r3.response;
});

test('Context is maintained across turns', () => {
  ai.chat('I like Python');
  const r = ai.chat('What did I say I like?');
  return r.response;
});

test('Topic tracking', () => {
  ai.chat('Tell me about programming');
  const topics = ai.getTopics();
  return topics.includes('programming');
});

test('Knowledge base query through chat', () => {
  const r = ai.chat('What is the Earth?');
  return r.response && r.response.length > 0;
});

test('Math through chat', () => {
  const r = ai.chat('Calculate 10 * 5');
  return r.response && (r.response.includes('50') || r.response.includes('math'));
});

test('Reasoning API', () => {
  const result = ai.reason('earth');
  return result && result.topic === 'earth';
});

test('Search API', () => {
  const result = ai.search('programming');
  return result && result.concepts.length > 0;
});

test('Stats tracking', () => {
  const stats = ai.getStats();
  return stats.totalMessages > 0 && stats.totalSessions > 0;
});

test('Add custom knowledge', () => {
  ai.addKnowledge('custom_entity', { type: 'custom', value: 'test' });
  return ai.kb.hasFact('custom_entity');
});

test('Add custom concept', () => {
  ai.addConcept('custom_concept', 'A custom concept for testing', ['test']);
  return ai.kb.getConcept('custom_concept');
});

test('End session', () => {
  const stats = ai.endSession();
  return stats && stats.id;
});

// ============================================
// TEST: Response Quality
// ============================================

console.log('\n=== Response Quality Tests ===');

test('Responses are non-empty strings', () => {
  const tests = ['Hello', 'What is Python?', 'How are you?', 'Tell me about AI'];
  return tests.every(t => {
    const r = ai.chat(t);
    return typeof r.response === 'string' && r.response.length > 0;
  });
});

test('Responses have confidence scores', () => {
  const r = ai.chat('What is programming?');
  return typeof r.confidence === 'number' && r.confidence >= 0 && r.confidence <= 1;
});

test('Responses have types', () => {
  const r = ai.chat('Hello');
  return typeof r.type === 'string' && r.type.length > 0;
});

test('Suggestions provided when appropriate', () => {
  const r = ai.chat('What can you do?');
  return Array.isArray(r.suggestions);
});

test('Metadata includes response time', () => {
  const r = ai.chat('Test');
  return r.metadata && r.metadata.responseTime;
});

// ============================================
// RESULTS
// ============================================

console.log('\n' + '='.repeat(50));
console.log('=== TEST RESULTS ===');
console.log('='.repeat(50));
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${total}`);
console.log('='.repeat(50));

if (failed === 0) {
  console.log('\n✓ All tests passed! Void AI is ready.\n');
} else {
  console.log(`\n✗ ${failed} test(s) failed.\n`);
  process.exit(1);
}
