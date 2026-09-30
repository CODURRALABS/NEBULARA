# 06 — NEBULARA v4 LANGUAGE SPEC (DELTA from v3)

Status: DRAFT v0.1 · Base: Nebulara Language Specification v3.0
v3 remains fully supported; everything here is additive unless marked ⚠ CHANGED.

---

## 1. New Types

| Type | Literal | Notes |
|------|---------|-------|
| `Float` | `3.14`, `2.5e-3` | IEEE 754 double. Ints auto-promote in mixed arithmetic |
| `Map` | `{"key": value, "age": 30}` | insertion-ordered, string keys at v4.0 |
| `Closure` | see §3 | first-class function values with captured environment |

```
LET pi = 3.14159
LET user = {"name": "ayush", "score": 99.5}
PRINT user["name"]          # ayush
user["score"] = user["score"] + 0.5
```

New builtins: `KEYS(m)`, `HAS_KEY(m, k)`, `DEL_KEY(m, k)`,
`TO_FLOAT(x)`, `IS_MAP(v)`, `IS_FLOAT(v)`.

⚠ CHANGED: `SQRT`, `POW`, division now return Float when operands are Float
(or when exactness fails). `FLOOR/CEIL/ROUND` now actually convert Float→Int.

## 2. Numeric Rules

```
Int op Int     → Int        (/ stays integer division)
Float anywhere → Float
Int / Float    → Float
"str" + num    → string concat (unchanged, TO_STRING applied)
```

## 3. Closures & First-Class Functions

```
FUNC! make_counter():
  LET n = 0
  RETURN FUNC!():
    n = n + 1          # captures n by reference
    RETURN n
  END!
END!

LET tick = make_counter()
PRINT tick()    # 1
PRINT tick()    # 2

FUNC! apply(f, x):
  RETURN f(x)
END!
PRINT apply(FUNC!(v): RETURN v * 2 END!, 21)   # 42 — anonymous funcs
```

Functions are values: assignable, storable in maps/arrays, passable.
`TYPEOF(closure)` returns `"func"`.

## 4. META Blocks (Provenance — the Primordia contract)

Any top-level or nested definition may carry a META block:

```
META author:"ayush", intent:"safe file dedup", risk:LOW
FUNC! dedup(path): ... END!
```

Rules:
- META survives lexing→IR→bytecode and is embedded in `.nbsc`
- Decompiler renders META back verbatim
- Unknown keys are preserved (forward compatibility), never dropped
- Reserved keys (enforced later by Vortex/Eden): `author, intent, risk,
  origin, lineage, fitness`

This is what makes **no dark binaries** possible: provenance is a language-level
construct, not an afterthought.

## 5. Modules

```
# file: mathx.nbs
FUNC! clamp(x, lo, hi): ... END!

# consumer
USE "mathx"
PRINT mathx.clamp(15, 0, 10)   # 10
```

- Files are modules; module name = filename stem
- `USE` loads once (cached), exposes its public top-level names via namespace
- Circular USE is a compile error

## 6. IR Round-Trip Contract (normative for implementation)

1. `PRIM-IR` is the single source of truth after parsing
2. Source projection (`decompile`) renders IR to valid v4 syntax
3. Acceptance test: for corpus C, for all programs p:
   `semantically_equal(p, parse(project(ir(parse(p))))) == TRUE`
4. Semantic identity = same CFG + same evaluation traces on corpus inputs
5. Local names preserved where declared; compiler temporaries rendered as `tmp_N`

## 7. Bytecode (.nbsc) Format v2

```
header : magic "NBSC" · ir_version:u32 · flags:u32
meta   : serialized META blocks
ir     : PRIM-IR section (embedded — enables decompilation WITHOUT source)
code   : register bytecode
pool   : constant pool (strings/floats interned)
```

The embedded IR section is mandatory. A `.nbsc` without IR is invalid by
definition on Primordia.

## 8. Standard Library Additions (pure-Nebulara, self-hosted targets)

| Module | v4 additions |
|---|---|
| `collections.nbs` | map utilities: merge, filter_keys, invert |
| `json.nbs` | real json_parse/json_stringify over Maps (replaces FFI stub) |
| `serialize.nbs` NEW | genome/fossil-friendly canonical serialization |
| `provenance.nbs` NEW | read META of loaded modules at runtime |

## 9. Compatibility & Migration

- All v3 programs run unchanged EXCEPT: programs relying on integer-only SQRT/POW
  must use `TO_INT(SQRT(x))` if they need truncation (migration note, one-line fix)
- `neb check` upgraded to flag closure capture mistakes (captured var mutated
  after function factory returns — warning only)

## 10. Explicit Non-Goals for v4

- No classes/OOP (maps + closures cover composition; revisit at v5 with evidence)
- No concurrency primitives yet (Vortex orchestrates processes, not threads)
- No manual pointers (systems subset arrives at Stage 4 as separate opt-in dialect)
