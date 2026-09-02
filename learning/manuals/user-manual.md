# Nebulara User Manual

*Reference for running and writing Nebulara programs.*

**Scope:** the core language and the verified runtime builtins. This manual
describes what **actually runs** on the current interpreter
(`Compiler/nebulara.exe`). Spec-only features are marked `[planned]`.

---

## 1. Getting and running

### 1.1 Install options
- **Binary:** use `Compiler/nebulara.exe` (newest) or `build/nebulara.exe`.
- **Build:** `gcc -static -O2 Compiler/nbs-bootstrap.c -o nebulara -lm`.
- **Package:** `npm install -g nebulara` / Python `nebulara` (wrap the C core).

### 1.2 Run a file
```bash
nebulara hello.nbs
```
Output is printed to stdout. Exit happens when the program ends.

### 1.3 REPL
Use `neb-cli repl` for interactive exploration (see Toolchain Manual §2).

> **Pin your binary.** Behavior varies between `build/` (older) and `Compiler/`
> (newer). Keep one canonical interpreter for a project.

---

## 2. Language model

### 2.1 File format
- Files end in `.nbs`.
- One statement per line (roughly); blocks are structured with `:`/`END!`.
- `#` starts a comment (to end of line).

### 2.2 Case sensitivity
Keywords are **uppercase** (`PRINT`, `LET`, `IF?`). Identifiers are
case-sensitive (`X` ≠ `x`).

### 2.3 The four-stage pipeline
```
text → lexer(tokens) → parser(AST) → compiler(bytecode) → VM(output)
```
Error stage matters: parse errors = structure problem; runtime errors = logic.

---

## 3. Types

| Type | Syntax | Notes |
|------|--------|-------|
| Int | `42`, `-7`, `0` | 64-bit signed, whole numbers |
| String | `"hi"`, `""` | double quotes; **no single quotes** |
| Bool | `TRUE`, `FALSE` | print as lowercase `true`/`false` |
| Null | `NULL` | "no value"; falsy |
| Array | `[1,2,3]` | ordered list; any types |

- **No float in the base interpreter** `[planned]` — numbers are integers.
- **No map literal `{}`** `[planned]` — use parallel arrays / encoded strings.

### 3.1 Truthiness (for `IF?`)
Falsy: `0`, `NULL`, `FALSE`, `""`, `[]`. Truthy: everything else.
`IF? x:` means "if x is not null/empty/zero".

---

## 4. Variables

| Keyword | Meaning |
|---------|---------|
| `LET x = ...` | declare (changeable); redefine without `LET` |
| `CONST x = ...` | declare (fixed) |

```nbs
LET age = 25
age = 26            # reassign (no LET)
CONST MAX = 99
```
Dynamically typed: a variable can hold any type, and be reassigned to a new
type. Naming: `snake_case` vars, `UPPER_CASE` constants.

---

## 5. Operators

### 5.1 Arithmetic
`+  -  *  /  %`
- `/` is **integer division** — truncates (`7 / 2 = 3`).
- `%` gives the remainder (`7 % 2 = 1`).
- `+` on strings concatenates; string + number auto-converts the number.

### 5.2 Comparison
`==  !=  <  >  <=  >=`  → bool. (`==` compares; `=` assigns.)

### 5.3 Logic (words)
`AND  OR  NOT`

### 5.4 Bitwise
`&  |  <<  >>`

### 5.5 Precedence
`* / %` bind tighter than `+ -`. Use parentheses to be explicit.

---

## 6. Control flow

### 6.1 Conditionals
```nbs
IF? cond:
    ...
ELSEIF? cond2:
    ...
ELSE:
    ...
END!
```

### 6.2 Loops
```nbs
WHILE? cond:
    ...
    BREAK       # exit loop
    CONTINUE    # next iteration
END!

FOR! i = start TO end [STEP n]:
    ...
END!
```
`FOR!` is **inclusive** of `end`. Use `STEP` to control the increment.

---

## 7. Functions

```nbs
FUNC! name(p1, p2):
    LET local_var = ...
    RETURN p1 + p2
END!
```
- `RETURN` sends a value back **and immediately stops the function**.
- Parameters are passed **by value**; arrays are shared/mutable.
- Variables inside are local (shadow outer).
- Recursion works; mind stack depth.
- **Closures / first-class functions** `[planned]` — not available.

---

## 8. Verified builtin reference

All of these have been verified against the current interpreter.

### 8.1 Output
| Builtin | Returns | Notes |
|---------|---------|-------|
| `PRINT(x)` | — | print value + newline. `PRINT arr` prints `[array N]`, not elements |

### 8.2 Type
| Builtin | Returns |
|---------|---------|
| `TYPEOF(x)` | `"int" \| "string" \| "bool" \| "null" \| "array"` |
| `TO_STRING(x)` | string form |
| `TO_NUMBER(s)` | int parsed from string, `0` if unparsable |

### 8.3 Math
| Builtin | Returns |
|---------|---------|
| `ABS(x)` | absolute value |
| `MIN(a,b)` / `MAX(a,b)` | smaller / larger |
| `SQRT(x)` | integer square root |
| `POW(b,e)` | b to power e (int) |
| `RANDOM()` | random int `0..99` |
| `FLOOR/CEIL/ROUND(x)` | pass int through (no-op until floats) |

### 8.4 String
| Builtin | Returns |
|---------|---------|
| `LEN(s)` | character (byte) count |
| `TO_UPPER(s)` / `TO_LOWER(s)` | case-converted string |
| `CHAR_AT(s,i)` | 1-char string at `i` (0-based), or `NULL` if out of range |
| `SUBSTR(s,start,len)` | slice, clamped to the end |
| `TRIM(s)` | trimmed of leading/trailing whitespace |
| `CHAR(code)` | char for a numeric code |
| `ORD(s)` | numeric code of first char |

### 8.5 Array
| Builtin | Returns |
|---------|---------|
| `LEN(arr)` | element count |
| `PUSH(arr,v)` | append; arr mutated |
| `POP(arr)` | last element (removed), or `NULL` if empty |

### 8.6 Time & Program
| Builtin | Returns |
|---------|---------|
| `TIME()` | current time value (epoch-ish) |
| `SLEEP(ms)` | sleep `ms` milliseconds, returns `0` |
| `ARGUMENT_COUNT()` | number of command-line arguments |
| `ARGUMENT(i)` | `i`-th command-line argument as a string |

### 8.7 Files
| Builtin | Returns |
|---------|---------|
| `READ_FILE(name)` | file contents string, or null-sentinel if missing |
| `WRITE_FILE(name, text)` | writes/overwrites file |

Guard reads: `LET c = READ_FILE("x"); IF? c: ... END!`

### 8.8 FFI
| Builtin | Returns |
|---------|---------|
| `FFI_LOAD(name, path)` | 0 on success |
| `FFI_REGISTER(lib, sym, retType, nArgs)` | 0 on success |
| `FFI_CALL(lib, sym, args...)` | native call result |

Return-type codes for `FFI_REGISTER`: `0` void, `1` int, `2` float,
`3` double, `4` string, `5` pointer. Refer to functions by **lib name +
symbol** (no handles). Example:

```nbs
FFI_LOAD("msvcrt", "msvcrt.dll")
FFI_REGISTER("msvcrt", "abs", 1, 1)
PRINT FFI_CALL("msvcrt", "abs", -42)   # 42
```

---

## 9. Spec'd but not in the shipped binaries

| Feature | Symptom |
|---------|---------|
| floats, maps, closures, `USE` | `[planned]`, not built |
| `WAIT!` wait groups | tokens/opcodes exist, no parser |
| JSON `DATA!`/`RUN!` | tokens defined, parser not implemented |
| concurrency in native codegen | VM-only today |

`SLEEP`, `ARGUMENT_COUNT`, `ARGUMENT`, and exceptions (`TRY!`/`CATCH!`/
`FINALLY!`/`ENDTRY!`/`THROW`) **are implemented** in the current source — if a
shipped `.exe` reports an undefined-function or parse error for them, rebuild
`Compiler/nbs-bootstrap.c`. Use the **guard idiom** (`IF?`) for sentinel-return
builtins.

---

## 10. Example

```nbs
# A verified, runnable program
FUNC! average(arr):
    IF? LEN(arr) == 0:
        RETURN 0
    END!
    LET total = 0
    LET i = 0
    WHILE? i < LEN(arr):
        total = total + arr[i]
        i = i + 1
    END!
    RETURN total / LEN(arr)
END!

LET scores = [90, 78, 85, 92]
PRINT "Average: " + average(scores)      # Average: 86
```

---

## Revisions
- v1.0 — verified against `Compiler/nebulara.exe`; builtins split by category.
