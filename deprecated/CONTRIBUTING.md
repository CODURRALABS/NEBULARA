# Contributing to Nebulara

## Development Setup

```bash
# Clone
git clone https://github.com/CODURRALABS/NEBULARA.git
cd NEBULARA

# Build native compiler
gcc VM/bootstrap.c -o nebulara.exe -municode

# Run tests
nebulara.exe Grammar/grammar.nbs
```

## Language Reference

### Functions

```
FUNC! name
RUN!
  # statements
END!
```

### Data

```
DATA! "Name"
  field1 = value1
  field2 = value2
END!
```

### Control Flow

```
IF? condition:
  # true branch
END!

FOR! var IN iterable:
  # body
END!

WHILE? condition:
  # body  
END!
```

## Architecture

1. **Tokenizer** - `VM/bootstrap.c` - converts source to tokens
2. **Parser** - `Compiler/nubaparse.nbs` - builds AST
3. **Codegen** - `Compiler/transpiler.nbs` - emits bytecode
4. **Runtime** - `VM/bootstrap.c` - executes bytecode

## Adding Features

- Add opcodes to `VM/bootstrap.c`
- Extend tokenizer for new keywords
- Update grammar in `Grammar/enhanced-grammar.nbs`
- Add FFI adapters to `Lib/`

## Testing

Each `.nbs` file should compile:
```bash
nebulara.exe Compiler/transpiler.nbs -o test.exe
test.exe
```

## Code Style

- Lowercase with underscores
- Comments start with `#`
- No external dependencies in core