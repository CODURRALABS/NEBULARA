# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ |

## Reporting Vulnerabilities

Email security@codurralabs.com

## Security Features

- **Memory safety** - Bounds checking on all array access
- **Type safety** - Compile-time type checking
- **Safe FFI** - All external calls go through validated adapters
- **Bytecode validation** - Invalid opcodes terminate safely

## Known Issues

- Stack overflow not yet detected
- Integer overflow in arithmetic
- FFI adapters may need sanitization