# Void Native Compiler Blueprint
# Nebulara standalone compiler for x86/x64 bare metal

## Architecture

```
.nbs source → Lexer → Parser → AST → Codegen → Machine Code
```

## Core Components Needed

### 1. Lexer (tokenize.nbs)
```
FUNC! "tokenize"
RUN!
  SOURCE = ARGS[0]
  TOKENS = []
  
  FOR! CHAR in SOURCE:
    IF? CHAR == " " THEN:
      CONTINUE
    END!
    TOKENS.ADD CHAR
  END!
  
  RETURN TOKENS
END!
```

### 2. Parser (parse.nbs)
```
DATA! "ASTNode"
  type = ""
  value = ""
  children = []
END!

FUNC! "parse_to_ast"
RUN!
  TOKENS = ARGS[0]
  ROOT = ASTNode{type: "program"}
  
  # Build tree
  RETURN ROOT
END!
```

### 3. x86 Codegen (codegen.nbs)
```
FUNC! "to_x86"
RUN!
  AST = ARGS[0]
  INSTRUCTIONS = []
  
  # Map AST to x86 opcodes
  RETURN INSTRUCTIONS
END!
```

## Native Compilation Target

### x64 Calling Convention
- RDI: first argument
- RSI: second argument
- RDX: third argument
- RAX: return value

### Memory Layout
- .text: code section
- .data: initialized data
- .bss: uninitialized data

## Stdlib Functions (native)

```
# void/stdlib.nbs
FUNC! "PRINT"        # Write to stdout
FUNC! "SHA256"     # Hash function
FUNC! "HTTP_GET"    # Network fetch
FUNC! "DISTANCE"    # Vector distance
FUNC! "EVAL"      # Expression evaluator
```

## Bootstrapping Plan

1. Write lexer in JS (complete)
2. Write parser in JS (complete)  
3. Write x86 codegen (in progress)
4. Assemble to executable
5. Self-host: compiler compiles itself