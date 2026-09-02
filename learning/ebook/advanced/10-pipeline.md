# Chapter 10 — The Pipeline: lexer → parser → compiler → VM

> Book: *Beyond the Bases* · Part IV — Inside the Engine

Every language implementation runs a **pipeline** that transforms your source
text into something executable. Nebulara's is: **lexer → parser → compiler →
VM**. This chapter walks each stage.

---

## The four stages (overview)

```
"text of your .nbs file"
        │  lexer (tokenizer)
        ▼
   tokens (words + symbols)
        │  parser
        ▼
   AST (a tree of structure)
        │  compiler (codegen)
        ▼
   bytecode (VM instructions)
        │  virtual machine
        ▼
   output (printed results)
```

---

## Stage 1 — The lexer

The lexer reads raw characters and groups them into **tokens**: meaningful
words and symbols.

`PRINT 10 + 5` becomes roughly:
```
KEYWORD(PRINT)  NUMBER(10)  PLUS(+)  NUMBER(5)
```

Nebulara's lexer recognizes:
- **Keywords** — `PRINT`, `LET`, `IF?`, `FUNC!`, ... (uppercase words).
- **Identifiers** — variable/function names.
- **Numbers** — integer literals.
- **Strings** — quoted text.
- **Symbols** — `+ - * / % = < > ( ) [ ] , : !` etc.
- **Comments** — `# ...` (skipped).
- **Newlines/marks** — the `:`/`!`/`?`-bearing markers that structure blocks.

The `Compiler/generate_nbs_lexer.py` / `lexer.nbs` implement tokenization.
*Uppercase keywords* are exactly what makes the lexer's job distinct — it can
recognize reserved words by shape.

**Lexer error:** unknown characters produce a lex error — the file never gets
past here.

---

## Stage 2 — The parser

The parser takes the flat token stream and builds an **AST (Abstract Syntax
Tree)** — a structured representation of the program's meaning.

For `IF? x > 0:` ... `END!`, it builds a tree node `IfStatement` with a
condition child (`x > 0`) and a body child (the statements inside).

Nebulara's **block structure** makes parsing tractable and readable:
- `IF?`/`WHILE?`/`FUNC!`/`FOR!` open a block.
- `:` (or the matching marker) plus indentation/structure marks the body.
- `END!` (or `ELSE`/`ELSEIF?`) closes the block.

The parser lives in `Compiler/`.`nbs_parser.c` and the self-hosted
`Grammar/*.nbs` files. Because blocks are explicit, the AST maps cleanly to
both a tree and a knowledge-graph node structure.

**Parse error:** a misplaced `END!` or malformed statement errors here — the
program is rejected before any code runs. This is why a stray token like
`TRY:` (wrong keyword — must be `TRY!`) fails at parse time.

---

## Stage 3 — The compiler (codegen)

The compiler walks the AST and emits **bytecode** — compact instructions the VM
understands. This is where `compiler.nbs` / `neb_codegen` and
`neb-ir`/`Compilers/neb-ir.c` come in.

For `PRINT 10 + 5` it might emit something like:
```
PUSH 10
PUSH 5
ADD
PRINT_TOP
```

The compiler also does the **symbol/scope** management: resolving which
variable a name refers to and recording function and variable definitions. This
is also where the **intermediate representation** (IR) can be produced for
inspection or other backends (JS/Python/native).

---

## Stage 4 — The virtual machine

The VM reads the bytecode and executes it against a runtime state: a **value
stack**, variables, and the global/interpreter memory.

For the sequence above, the VM:
1. Pushes `10`.
2. Pushes `5`.
3. Pops both, adds → pushes `15`.
4. Prints the top of the stack.

The VM is implemented in `nbs-bootstrap.c` (the main `nebulara.bin.c` core) —
see Chapter 11 for the value model and dispatch.

---

## Why this matters to you

- **Reading errors:** a *parse* error and a *runtime* error come from different
  stages — knowing which helps you debug (parse = structure; runtime = logic).
- **Doc drift debugging:** if a keyword isn't recognized, it's failing at the
  lexer or parser — confirming it's not implemented in your build.
- **Transpiling/native:** the same AST feeds multiple backends, which is why
  Nebulara reaches JS/Python/native from one source.

---

## Summary

- Text → tokens (lexer) → AST (parser) → bytecode (compiler) → output (VM).
- Lexer: keywords/identifiers/numbers/strings/symbols.
- Parser: builds the AST; blocks via `:`/`END!`.
- Compiler: emits bytecode (+ optional IR).
- VM: runs bytecode on a value stack.
- Understand the stages to read errors and reason about doc drift.

**Next:** [Chapter 11 — The VM & Bytecode](11-vm.md)
