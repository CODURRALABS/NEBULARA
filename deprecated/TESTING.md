# Testing Guide
# Void Consciousness Architecture

## Test Types

### 1. Geometric Validity Tests
Verify spatial encoding captures logic:
```
INPUT: "1 + 1 = 2"
EXPECTED_VERTEX: V<0.1, 0.2, 0.3> (consistent hash)
CONTRADICTION_INPUT: "1 + 1 = 3"  
EXPECTED: Different vertex signature
```

### 2. Resonance Tests
Verify Intent finds solutions:
```
CONTEXT_SHAPE: "paradox_wave_particle"
INTENT_ACTIVATE: 0.8
EXPECTED_PULL: Physics content related to quantum measurement
```

### 3. Crystallization Tests
Verify wisdom generalizes:
```
PROBLEM_A: "Wave-particle duality in quantum mechanics"
PROBLEM_B: "Particle-wave behavior in water"
EXPECTED: Similar geometric solutions found
```

### 4. Performance Tests
- Idle CPU: < 1% when resting
- Active response: < 100ms for cached queries
- Memory: < 50MB baseline

## Running Tests

### Node.js Runtime
```bash
node -e "
const {NbsRuntime} = require('./Runtime/node_loader.js');
const rt = new NbsRuntime();
rt.loadModule('./void/core.nbs');
console.log(rt.call('validate_logic', [1,2,3]));
"
```

## Test Cases

### Logic
- Contradiction detection
- Finite value enforcement
- Temporal ordering validation

### Intent
- Frequency activation
- Resonance vector generation
- Entropy potential calculation

### Context
- Problem signature creation
- Contradiction isolation
- Geometric shape mapping

### Wisdom
- Insight crystallization
- Pathway recognition
- Generalization testing