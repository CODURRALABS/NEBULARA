# TROUBLESHOOTING
# Void - Common Issues & Solutions

## Node.js Runtime Issues

### ERR_REQUIRE_ESM
**Problem**: Mixed CommonJS/ES modules
**Solution**: Use `.mjs` extension for ES modules, or rename to `.cjs`

### Module Not Found
**Problem**: `Cannot find module './nebulara/...'`  
**Solution**: Run from project root directory

### Functions Return Raw Code
**Problem**: `rt.call()` returns function body text, not executed result
**Solution**: Node loader is stub implementation. Use compiled nebulara.exe for real execution.

## Nebulara Compiler Issues

### GCC Not Found
**Problem**: Cannot compile nbs_loader.c
**Solutions**:
1. Install MinGW-w64
2. Use Windows Subsystem for Linux (WSL)
3. Wait for nebulara.exe release

### NASM Not Found
**Problem**: Bootstrap compilation fails
**Solutions**:
1. Install NASM: `winget install nasm`
2. Run `npm run bootstrap` after installation

## Geometric Reasoning Issues

### SHA-256 Collisions
**Problem**: Different inputs produce similar signatures
**Solutions**:
- Consider SHA-512 for more entropy
- Add semantic encoding before hashing
- Use longer signature substrings

### Contradiction False Positives
**Problem**: Non-contradictory text flagged
**Solutions**:
- Strengthen detection keywords
- Add pattern matching beyond simple contains
- Use semantic analysis via Library

## Performance Issues

### High CPU Idle
**Problem**: >1% CPU when resting
**Solutions**:
- Verify Intent phase is resting
- Check no background Library fetches
- Ensure no stuck processing loops

### Memory Growth
**Problem**: Steady memory increase over time
**Solutions**:
- Review Wisdom cache size limits
- Implement cleanup for old insights
- Check Context clearing after resolution

## Architecture Validation

### Geometric Encoding Failed
**Problem**: Related concepts have distant signatures
**Solutions**:
- Verify hash normalization
- Consider alternative encoding schemes
- Add manifold transformations

### Resonance Not Finding Solutions
**Problem**: Library returns irrelevant fragments
**Solutions**:
- Tune relevance threshold
- Improve geometric distance metric
- Add multiple Library sources

## Getting Help

1. Check existing GitHub issues
2. Run `node run_tests.mjs` to verify setup
3. Read docs/STATUS.md for known limitations
4. Review nebulara/void/ASSESSMENT.md for critical analysis