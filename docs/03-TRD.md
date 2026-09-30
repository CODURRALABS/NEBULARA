# 03 — TRD: Technical Requirements Document

Status: DRAFT v0.1 · Companion to 02-PRD

---

## 1. Host & Target Platforms

| Era | Host (development) | Target (runtime) |
|---|---|---|
| Stage 0–3 | Windows 10/11 x64, MinGW-w64 g++ | Same (hosted userspace program) |
| Stage 4–5 | Any x86-64 + GCC/Clang | Bare metal x86-64 (UEFI boot), then hosted again for dev convenience |

Constraint: the C++ core must compile with `-std=c++17 -static` and **zero external
dependencies** (no Boost, no vcpkg). The C standard library is the only floor.

## 2. Language Implementation Requirements (Nebulara v4 Core)

### 2.1 Pipeline
```
source.nbs → Lexer → Tokens → Parser → AST → IR-gen → PRIM-IR
PRIM-IR ⇄ text serialization (round-trip artifact)
PRIM-IR → Bytecode (.nbsc) → VM execution
PRIM-IR → Source projection (decompiler output)
```

### 2.2 Value Model
| Type | Representation |
|---|---|
| Int | int64_t |
| Float | double (IEEE 754) — NEW in v4 |
| String | UTF-8, length-prefixed, immutable views over refcounted buffers |
| Bool | byte |
| Array | dynamic vector of Values |
| Map | open-addressing hash map, insertion-order preserved — NEW in v4 |
| Func/Closure | code pointer + captured env — upgraded in v4 |
| Null | singleton |

### 2.3 Round-Trip Guarantee (the decompiler contract)
- `parse(src) → IR → project(IR)` must re-parse to a **semantically identical** AST
- Identity criteria: same control-flow graph; same value semantics; identifier
  names preserved when provenance present; formatting MAY differ
- Acceptance: ≥99% semantic preservation across `lang/tests/corpus`
- Provenance: `META` blocks survive all transforms and ride inside `.nbsc`

### 2.4 VM Requirements
- Register-based bytecode (not stack) — chosen for provenance-friendly decoding
- ≥ 60 opcodes projected (superset of Nebulara v3's 40+)
- Deterministic execution given same input + seed (required for evolution replay)
- Checkpoint/resume primitives from day one (Vortex durable machines depend on it)

### 2.5 Performance Budgets (Stage 1 exit)
- Lexer+Parser: ≥ 1 MB source / second single-core
- VM dispatch: within 10× of equivalent Lua interpreter on arithmetic benchmark
- Startup (`run hello.nbs`): < 50 ms cold

## 3. Memory & Runtime

- Refcounting + cycle collector (no stop-the-world GC pauses; organisms must die politely)
- Arena allocation per moment-machine; whole-machine teardown = arena drop
- Hard memory ceilings per machine/organism (metabolism enforcement point)

## 4. Security Requirements (bootstrap era)

- Every file-system/network builtin gated behind an explicit capability grant flag
- Default-deny: `READ_FILE`, `WRITE_FILE`, future `NET_*` require `--cap fs.read` style grants or interactive approval
- Audit log: append-only JSONL of capability uses, tamper-evident (hash chain)

## 5. Testing Requirements

| Suite | Location | Gate |
|---|---|---|
| Unit (lexer/parser/IR/VM) | `tests/unit` | every commit |
| Language conformance | `lang/tests/*.nbs` | every commit; examples from spec MUST pass verbatim |
| Round-trip corpus | `lang/tests/corpus` | nightly + pre-release |
| Integration (vortex spawn/dissolve) | `tests/integration` | stage exits |

Test runner: `scripts/test.bat` / `scripts/test.sh`, zero-dependency (plain asserts).

## 6. Portability Rules for Future Self-Hosting

- No C++ feature may be load-bearing unless it has a named Nebulara-v4-or-later counterpart
  (mapping table maintained in `lang/spec/host-mapping.md`)
- All runtime services exposed to Nebulara via a narrow, documented FFI surface
  (successor of today's `neb-ffi.c`)
- Endianness/little-x86 assumptions isolated to clearly marked modules

## 7. Build System

- Single `build.bat` (Windows) / `Makefile` (POSIX), no generators
- One-command: build, test, run-example
- Compiler warnings = errors (`-Wall -Wextra`)

## 8. Versioning

- OS stages: `STAGE-n` per ROADMAP
- Language: semver `4.x.y`; IR format version stamped in every `.nbsc` header
