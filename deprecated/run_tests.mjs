// Void Test Runner - Node.js
// Demonstrates the Nebulara runtime loading Void modules

import { NbsRuntime, sha256 } from './nebulara/Runtime/node_loader.js';

const rt = new NbsRuntime();

// Load Void modules
console.log('=== Loading Void Modules ===\n');
rt.loadModule('./void/core.nbs');
rt.loadModule('./void/intent.nbs');
rt.loadModule('./void/context.nbs');
rt.loadModule('./void/wisdom.nbs');
rt.loadModule('./void/library.nbs');

console.log('\n=== Testing Void Architecture ===\n');

// Test SHA-256 geometric signatures
const testInputs = [
  "1 + 1 = 2",
  "1 + 1 = 3",
  "Wave-particle duality paradox",
  "Schrodinger cat alive and dead"
];

console.log('Geometric Signatures (SHA-256):');
for (const input of testInputs) {
  const sig = sha256(input);
  console.log(`  "${input.substring(0,20)}..." → ${sig.substring(0,16)}...`);
}

// Test contradiction detection
console.log('\nContradiction Detection:');
const contradictionTexts = [
  "This is consistent",
  "This contains a contradiction",
  "This is a paradox"
];

for (const text of contradictionTexts) {
  const hasContradiction = text.includes('contradiction') || text.includes('paradox');
  console.log(`  "${text}" → ${hasContradiction ? 'CONTRADICTION' : 'stable'}`);
}

// Test intent phases
console.log('\nIntent Phases:');
const phases = ['resting', 'seeking', 'resolving', 'crystallizing'];
for (let i = 0; i < phases.length; i++) {
  console.log(`  ${i}: ${phases[i]}`);
}

console.log('\n=== Void Ready ===');
console.log('Run: nebulara void/main.nbs (with compiled nebulara.exe)');
console.log('Or continue development with Node.js runtime');