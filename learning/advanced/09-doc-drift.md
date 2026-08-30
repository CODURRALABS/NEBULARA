# Advanced 09 — Doc Drift: What's Real vs. Planned

This is the single most useful thing to understand about the Nebulara repo:
**the documentation is ahead of the shipped binaries.** The docs describe a
richer, newer language than the built executables implement. This guide maps
the gap so you never get surprised.

---

## The three layers of truth

1. **Shipped binaries** (`build/`, `Compiler/*.exe`) — what actually runs today.
2. **Current source** (`Compiler/nbs-bootstrap.c`, `*.c`) — richer than the
   binaries; contains builtins and keywords not wired into the executables.
3. **Docs / spec** (`README.md`, `SPEC.md`, `*.md`) — most aspirational;
   describes v4 features and the PRIMORDIA vision.

---

## What's confirmed working (verified)

Run these freely with `Compiler/nebulara.exe`:

- Language: `LET`/`CONST`, `FUNC!`/`END!`, `IF?`/`ELSEIF?`/`ELSE`,
  `WHILE?`, `FOR!`/`TO`/`STEP`, `RETURN`, `BREAK`, `CONTINUE`,
  `TRUE`/`FALSE`/`NULL`, `AND`/`OR`/`NOT`, arrays with indexing,
  string `+` concatenation.
- Builtins: `PRINT, LEN, TYPEOF, TO_STRING, TO_NUMBER, RANDOM, TIME,
  TO_UPPER, TO_LOWER, CHAR_AT, SUBSTR, TRIM, CHAR, ORD, ABS, MIN, MAX,
  SQRT, POW, FLOOR, CEIL, ROUND, PUSH, POP, READ_FILE, WRITE_FILE`.
- FFI: `FFI_LOAD`, `FFI_REGISTER`, `FFI_CALL`.

### In source but not in shipped binaries
| Feature | In source? | Runs today? |
|---------|-----------|-------------|
| `SLEEP(ms)` | yes | **no** — undefined-function runtime error |
| `ARGUMENT_COUNT()` / `ARGUMENT(i)` | yes | **no** |
| `TRY` / `CATCH` / `THROW` / `FINALLY` | spec'd | **no** — parse error |

### Documented (spec) but not yet in the language
| Feature | Where |
|---------|-------|
| Float type, float arithmetic | v4 spec (`SPEC.md`) |
| Map type `{"k": v}` | v4 spec |
| Closures / first-class functions | v4 spec |
| `USE` modules / `IMPORT` | v4 spec |
| Round-trip decompilation of `.nbsc` | PRIMORDIA project |

---

## Why this happens

The project is a staged bootstrap. The **self-hosted** toolchain (`.nbs` files:
`Compiler/compiler.nbs`, `Grammar/*.nbs`) and the C source are written toward
the v4 feature set, while the **packaged executables** lag behind. The docs
describe the target, not always the current binary.

---

## A practical policy for writing Nebulara code

1. **Prefer verified features** from the "confirmed working" list above.
2. **Guard errors** with `IF?` checks (builtins return `0`/`NULL`/`FALSE`).
3. **Test before you trust** any feature marked spec'd — write a tiny probe
   file and run it (e.g. a `TRY:` probe to see if exceptions parse).
4. **Pin your binary.** Note which `nebulara` you're using; behaviors differ
   between `build/` (older) and `Compiler/` (newer).

This policy keeps your scripts working across builds and makes upgrades smooth.
The [learning README](../README.md) and handbook embed the same guidance.
