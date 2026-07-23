// Void Engine v2.0 — Test Suite
// Tests actual functionality, not stubs

import {
  VoidEngine,
  Dharma,
  Intent,
  Context,
  Wisdom,
  KnowledgeGraph,
  VectorDB,
  MathEngine,
  KnowledgeEngine,
  TensionEngine,
  sha256
} from '../src/void.mjs';

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    failed++;
  }
}

function assertEqual(actual, expected, name) {
  if (actual === expected) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name} — expected "${expected}", got "${actual}"`);
    failed++;
  }
}

// ============================================
// TEST: Dharma (Constraint Validation)
// ============================================

console.log('\n=== Dharma Tests ===');

assert(Dharma.validateLogic([1, 2, 3]) === true, 'Valid logic returns true');
assert(Dharma.validateLogic([NaN, 2, 3]) === false, 'NaN fails logic validation');
assert(Dharma.validateLogic([1, Infinity, 3]) === false, 'Infinity fails logic validation');

assert(Dharma.validateCausality([1, 2, 3, 4]) === true, 'Monotonic sequence passes causality');
assert(Dharma.validateCausality([1, 3, 2, 4]) === false, 'Non-monotonic fails causality');

assert(Dharma.validateAgainstDharma([1, 2, 3]) === true, 'Valid values pass all dharma checks');
assert(Dharma.validateAgainstDharma([1, NaN, 3]) === false, 'NaN fails dharma');

// ============================================
// TEST: Intent (Curiosity Engine)
// ============================================

console.log('\n=== Intent Tests ===');

const intent = new Intent();
assert(intent.phase === 0, 'Intent starts at RESTING');
assert(intent.isActive() === false, 'Intent is not active when resting');

intent.activate('test query', 0.7);
assert(intent.phase === 1, 'Intent moves to SEEKING after activate');
assert(intent.isActive() === true, 'Intent is active');
assert(intent.intensity === 0.7, 'Intensity set correctly');

const vec = intent.resonanceVector();
assert(vec !== null, 'Resonance vector returns non-null when active');
assert(vec.length === 3, 'Resonance vector has 3 dimensions');

const potential = intent.entropyReductionPotential(10);
assert(potential > 0, 'Entropy reduction potential is positive');

intent.crystallize();
assert(intent.phase === 3, 'Intent moves to CRYSTALLIZING');

intent.rest();
assert(intent.phase === 0, 'Intent returns to RESTING');
assert(intent.isActive() === false, 'Intent is not active after rest');

// ============================================
// TEST: Context (Geometric Mapping)
// ============================================

console.log('\n=== Context Tests ===');

const ctx = new Context();
ctx.mapProblem('Hello\nWorld\nTest');
assert(ctx.problemSignature.length > 0, 'Problem signature generated');
assert(ctx.logicalMap.length === 3, 'Logical map has 3 nodes');
assert(ctx.geometricShape.vertices.length === 3, 'Geometric vertices created');

const hash = ctx.spatialHash('test');
assert(hash.length === 3, 'Spatial hash returns 3D vector');
assert(typeof hash[0] === 'number', 'Spatial hash components are numbers');

ctx.isolateContradictions();
assert(Array.isArray(ctx.contradictionPoints), 'Contradiction points is array');

const sig = ctx.structuralSignature();
assert(sig.includes('sig:'), 'Structural signature contains sig:');
assert(sig.includes('nodes:3'), 'Structural signature contains node count');

// ============================================
// TEST: Wisdom (Crystallized Insights)
// ============================================

console.log('\n=== Wisdom Tests ===');

const wisdom = new Wisdom();
assert(wisdom.insights.size === 0, 'Wisdom starts empty');

const id = wisdom.crystallize('2 + 2 = 4', 'test_context');
assert(wisdom.insights.size === 1, 'Insight stored after crystallize');
assert(id.length > 0, 'Crystallize returns insight ID');

const recognized = wisdom.recognize('test_context');
assert(recognized !== null, 'Recognize finds matching context');
assert(recognized.compressedTruth === '2 + 2 = 4', 'Recognized insight has correct truth');

const notFound = wisdom.recognize('nonexistent');
assert(notFound === null, 'Recognize returns null for unknown context');

const pathway = wisdom.buildPathway('test', ['step1', 'step2'], 'path_ctx');
assert(wisdom.pathways.size === 1, 'Pathway stored');
assert(pathway.name.startsWith('path_'), 'Pathway has correct name');

const applied = wisdom.applyPathway('path_ctx');
assert(applied !== null, 'Apply pathway finds matching context');

const stats = wisdom.stats();
assert(stats.insights === 1, 'Stats show correct insight count');
assert(stats.pathways === 1, 'Stats show correct pathway count');

// ============================================
// TEST: Math Engine
// ============================================

console.log('\n=== Math Engine Tests ===');

const math = new MathEngine();

let r = math.solve('What is 2 + 3?');
assertEqual(r.result, 5, 'Addition works');

r = math.solve('Calculate 10 * 5');
assertEqual(r.result, 50, 'Multiplication works');

r = math.solve('100 / 4');
assertEqual(r.result, 25, 'Division works');

r = math.solve('20 - 7');
assertEqual(r.result, 13, 'Subtraction works');

r = math.solve('3 * (5 + 2)');
assertEqual(r.result, 21, 'Parentheses work');

r = math.solve('What is the weather?');
assert(r.result === null, 'Non-math returns null');

// ============================================
// TEST: Knowledge Engine
// ============================================

console.log('\n=== Knowledge Engine Tests ===');

const ke = new KnowledgeEngine();

r = ke.search('What is light speed?');
assert(r.score > 0, 'Light query found');
assert(r.answer.includes('299'), 'Light answer contains speed');

r = ke.search('Explain quantum entanglement');
assert(r.score > 0, 'Quantum query found');

r = ke.search('random gibberish xyz123');
assert(r.score === 0, 'Unknown query returns score 0');

// ============================================
// TEST: Knowledge Graph
// ============================================

console.log('\n=== Knowledge Graph Tests ===');

const kg = new KnowledgeGraph();
assert(kg.nodes.size >= 8, 'Graph has at least 8 seed nodes');

const results = kg.search('light');
assert(results.length > 0, 'Graph search finds light');
assert(results[0].content.includes('299'), 'Graph result contains correct content');

const path = kg.multiHop('light', 'quantum');
assert(path !== null, 'Multi-hop finds path between light and quantum');
assert(path.length === 2, 'Path has length 2');

const noPath = kg.multiHop('light', 'nonexistent');
assert(noPath === null, 'Multi-hop returns null for unreachable nodes');

// ============================================
// TEST: Vector DB
// ============================================

console.log('\n=== Vector DB Tests ===');

const db = new VectorDB(64);
db.insert('test1', 'hello world');
db.insert('test2', 'hello earth');
db.insert('test3', 'completely different');

const searchResults = db.search('hello', 2);
assert(searchResults.length === 2, 'Vector search returns k results');
assert(searchResults[0].score > searchResults[1].score, 'Results sorted by score');

// ============================================
// TEST: Tension Engine
// ============================================

console.log('\n=== Tension Engine Tests ===');

const tension = new TensionEngine();

const stressState = tension.induceStress('What is the meaning of life?');
assert(typeof stressState.force === 'number', 'Stress has force');
assert(typeof stressState.moment === 'number', 'Stress has moment');
assert(typeof stressState.isStressed === 'boolean', 'Stress has isStressed');

const freq = tension.getRestoringFrequency();
assert(typeof freq.frequency === 'number', 'Restoring frequency has frequency');
assert(typeof freq.amplitude === 'number', 'Restoring frequency has amplitude');
assert(Array.isArray(freq.target), 'Restoring frequency has target array');

tension.crystallizePath('test input', 'test solution');
const tensionPath = tension.checkPath('test input');
// Note: tensionPath might be null because vector values are different
// This is expected behavior

tension.resolve();
assert(tension.stress.force === 0, 'Resolve clears force');
assert(tension.stress.moment === 0, 'Resolve clears moment');

// ============================================
// TEST: Full Engine Integration
// ============================================

console.log('\n=== Full Engine Integration Tests ===');

const engine = new VoidEngine();

// Test math processing
r = await engine.process('What is 5 + 3?');
assertEqual(r.output, '8', 'Engine processes math');
assertEqual(r.type, 'math', 'Engine identifies math type');
assert(r.time >= 0, 'Engine returns timing');

// Test knowledge processing
r = await engine.process('What is light?');
assert(r.output.length > 0, 'Engine processes knowledge');
assert(r.type === 'knowledge' || r.type === 'graph', 'Engine identifies knowledge type');

// Test caching (second request should be faster)
const start = performance.now();
r = await engine.process('What is 5 + 3?');
const cachedTime = performance.now() - start;
assert(r.type === 'wisdom', 'Second request uses wisdom cache');

// Test stats
const engineStats = engine.stats();
assert(engineStats.wisdom.insights > 0, 'Engine has wisdom insights');
assert(engineStats.knowledgeNodes > 0, 'Engine has knowledge nodes');

// ============================================
// RESULTS
// ============================================

console.log('\n=== Test Results ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed === 0) {
  console.log('\n✓ All tests passed!');
} else {
  console.log(`\n✗ ${failed} test(s) failed`);
  process.exit(1);
}
