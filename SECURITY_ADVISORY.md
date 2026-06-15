# Security Advisory

## Memory Safety Model

Nebulara provides memory-safe execution through:

1. **Bounds Checking**
   - All array accesses checked against length
   - String operations bounds-validated
   - Heap allocations tracked

2. **Stack Protection**
   - Stack pointer bounds in VM
   - Stack overflow detection planned

3. **FFI Security**
   - All native calls go through adapters
   - Type marshaling enforced
   - Buffer overflow prevention in adapters

4. **Bytecode Verification**
   - Opcodes validated before execution
   - Invalid jumps caught  
   - Memory access validated

## Safe Execution Flags

```
--safe    # Enable all checks (default)
--fast    # Skip bounds checks (UNSAFE)
```

## Reporting

Security bugs: security@codurralabs.com