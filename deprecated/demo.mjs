#!/usr/bin/env node

// Void AI — Interactive CLI Demo
// Zero-training conversational AI engine

import { VoidAI } from './src/void-ai.mjs';

const ai = new VoidAI();

console.log('');
console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║                                                          ║');
console.log('║                   VOID AI ENGINE                        ║');
console.log('║           Frontier Conversational Intelligence          ║');
console.log('║                                                          ║');
console.log('║         Zero training • Pure symbolic reasoning         ║');
console.log('║         Type "exit" to quit, "help" for commands       ║');
console.log('║                                                          ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log('');

const session = ai.startSession();

function printResponse(r) {
  console.log('');
  console.log(`  You: ${r.userInput}`);
  console.log('');
  console.log(`  Void: ${r.response}`);
  if (r.suggestions && r.suggestions.length > 0) {
    console.log('');
    console.log(`  Suggestions: ${r.suggestions.join(' | ')}`);
  }
  console.log('');
}

function printHelp() {
  console.log('');
  console.log('  Commands:');
  console.log('    exit, quit, q    - Exit the conversation');
  console.log('    help, ?          - Show this help message');
  console.log('    stats            - Show session statistics');
  console.log('    history          - Show conversation history');
  console.log('    clear            - Clear conversation history');
  console.log('    knowledge <topic>- Search knowledge base');
  console.log('    reason <entity>  - Run reasoning on an entity');
  console.log('    compare <a> vs <b> - Compare two things');
  console.log('    add fact <entity> is <definition> - Add knowledge');
  console.log('');
  console.log('  Try asking about:');
  console.log('    - Programming (Python, JavaScript, Rust, etc.)');
  console.log('    - Science (physics, chemistry, biology)');
  console.log('    - Math (algebra, calculus, statistics)');
  console.log('    - Famous people (Einstein, Newton, Turing)');
  console.log('    - Countries (USA, Japan, Germany)');
  console.log('    - Technology (AI, quantum computing, blockchain)');
  console.log('    - Animals, food, music, art, history...');
  console.log('');
}

function processInput(input) {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (!trimmed) return;

  // Commands
  if (lower === 'exit' || lower === 'quit' || lower === 'q') {
    const endResponse = ai.chat('Goodbye');
    printResponse(endResponse);
    console.log('  Session ended. Thank you for chatting with Void AI!');
    console.log('');
    process.exit(0);
  }

  if (lower === 'help' || lower === '?') {
    printHelp();
    return;
  }

  if (lower === 'stats') {
    const stats = ai.getStats();
    console.log('');
    console.log('  Session Statistics:');
    console.log(`    Messages: ${stats.conversation.messages}`);
    console.log(`    Topics discussed: ${stats.conversation.topics.length}`);
    console.log(`    User engagement: ${(stats.conversation.engagement * 100).toFixed(0)}%`);
    console.log(`    Knowledge base: ${stats.knowledge.facts} facts, ${stats.knowledge.concepts} concepts`);
    console.log(`    Response time: ${stats.engine.responseTime}ms`);
    console.log('');
    return;
  }

  if (lower === 'history') {
    const history = ai.getHistory();
    console.log('');
    console.log('  Conversation History:');
    history.forEach((msg, i) => {
      console.log(`    ${i + 1}. ${msg.role === 'user' ? 'You' : 'Void'}: ${msg.content.substring(0, 80)}${msg.content.length > 80 ? '...' : ''}`);
    });
    console.log('');
    return;
  }

  if (lower === 'clear') {
    ai.clearHistory();
    console.log('  Conversation history cleared.');
    console.log('');
    return;
  }

  if (lower.startsWith('knowledge ') || lower.startsWith('search ')) {
    const query = trimmed.substring(trimmed.indexOf(' ') + 1);
    const results = ai.search(query);
    console.log('');
    console.log(`  Knowledge results for "${query}":`);
    results.forEach((r, i) => {
      console.log(`    ${i + 1}. ${r.name}: ${r.definition}`);
    });
    if (results.length === 0) {
      console.log('    No results found.');
    }
    console.log('');
    return;
  }

  if (lower.startsWith('reason ')) {
    const entity = trimmed.substring(trimmed.indexOf(' ') + 1);
    const result = ai.reason(entity);
    console.log('');
    console.log(`  Reasoning about "${entity}":`);
    Object.entries(result).forEach(([key, value]) => {
      console.log(`    ${key}: ${JSON.stringify(value)}`);
    });
    console.log('');
    return;
  }

  if (lower.startsWith('compare ')) {
    const vsIndex = lower.indexOf(' vs ');
    if (vsIndex > 0) {
      const a = trimmed.substring(8, vsIndex);
      const b = trimmed.substring(vsIndex + 4);
      const result = ai.compare(a, b);
      console.log('');
      console.log(`  Comparison: ${a} vs ${b}`);
      console.log(`    ${result.comparison}`);
      console.log('');
      return;
    }
  }

  if (lower.startsWith('add fact ')) {
    const factText = trimmed.substring(9);
    const isIndex = factText.indexOf(' is ');
    if (isIndex > 0) {
      const entity = factText.substring(0, isIndex);
      const definition = factText.substring(isIndex + 4);
      ai.addKnowledge(entity, { type: 'user_fact', definition: definition });
      console.log('');
      console.log(`  Added knowledge: ${entity} is ${definition}`);
      console.log('');
      return;
    }
  }

  // Default: chat
  const response = ai.chat(trimmed);
  printResponse(response);
}

// Read from stdin
process.stdin.setEncoding('utf-8');
let buffer = '';

process.stdout.write('  You: ');

process.stdin.on('data', (chunk) => {
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop();
  
  for (const line of lines) {
    processInput(line);
    if (buffer === '' && lines.length > 0) {
      process.stdout.write('  You: ');
    }
  }
});

process.stdin.on('end', () => {
  if (buffer) processInput(buffer);
  console.log('');
  console.log('  Session ended. Thank you for chatting with Void AI!');
  console.log('');
});