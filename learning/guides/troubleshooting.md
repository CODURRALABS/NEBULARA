# Guide: Troubleshooting

The most common Nebulara problems, and how to diagnose them. The #1 theme:
**docs drift from the binary — probe before you trust.**

---

## The decision tree

```
Something not working?
  1. Which stage is it?  parse  vs  runtime
  2. Is the feature even in my build?   (probe)
  3. Is it a null/sentinel I forgot to guard?
```

---

## 1. Parse errors (the program won't even start)

**Symptoms:** error mentioning a token/keyword, unexpected character, or
malformed block.

**Causes & fixes:**

| Cause | Fix |
|-------|-----|
| Single quotes instead of double | `'hi'` → `"hi"` |
| Lowercase keyword | `print` → `PRINT` |
| Missing `END!` / stray `:` | Count your block closers (`IF?`…`END!`, etc.) |
| Exception keywords without `!` (`TRY:` instead of `TRY!`) | Use `TRY!`/`CATCH!`/`FINALLY!`/`ENDTRY!` |
| Feature not implemented in your build | It errors at parse — **rebuild from source** or guard |

**Verify a keyword parses:** run a probe file containing it. If it errors at
parse, your binary is older than the source — rebuild `nbs-bootstrap.c`.

---

## 2. Runtime errors

**Symptoms:** program starts, then fails partway (undefined function, etc.).

**Causes & fixes:**

| Message hint | Meaning | Fix |
|--------------|---------|-----|
| "undefined function" | builtin is `[planned]` (e.g. `USE`, `WAIT!`) or you're running an old `.exe` | rebuild `Compiler/nbs-bootstrap.c`; probe with `IF?` and remove/guard |
| null / crash on access | forgot to guard a read/lookup | `IF? result:` before using |

---

## 3. The "expected X, got something else" class

| You tried | Reality |
|-----------|---------|
| `PRINT arr` → want `[1,2,3]` | prints `[array N]` (count). Loop to print elements |
| `7 / 2` → want `3.5` | prints `3` (integer division). No floats in base |
| floats / `3.14` | not supported — integers only |
| `{"a":1}` maps | parse error — maps are `[planned]`; use parallel arrays |
| closures / function values | `[planned]` — not available |
| `true` in source | write `TRUE` (it only *prints* lowercase) |

---

## 4. "USE" doesn't work

`USE` is spec'd but **not implemented** yet. Use `IMPORT` instead:
```nbs
IMPORT "std/math.nbs"
PRINT clamp(15, 0, 10)     # works: top-level
```
With `IMPORT`, module functions are in your namespace — there's no
namespace prefix.

---

## 5. The does-this-run checklist

Before losing time, run these quick probes:
```nbs
# probe.nbs
PRINT LEN("hi")        # 2 ?
PRINT TYPEOF(1)        # int ?
SLEEP(10)              # error here => SLEEP absent, rebuild from source
TRY!                   # error here => exceptions absent, rebuild from source
    PRINT "x"
CATCH! e:
    PRINT "caught"
ENDTRY!
```
Whatever line errors tells you exactly what your build lacks.

---

## 6. Output looks wrong

- **Booleans print lowercase** (`true`), you type uppercase (`TRUE`).
- **`PRINT [array]` shows count** — loop to print items.
- **Newlines** — use `"\n"` inside strings for line breaks, not raw newlines.

---

## 7. Files

- **Read returns nothing?** Guard it:
  ```nbs
  LET c = READ_FILE("f.txt")
  IF? c: ... ELSE: PRINT "missing" END!
  ```
- **Write didn't appear?** Check the working directory (files are relative to
  where you run the interpreter). Ensure the target directory exists.

---

## Golden rules

1. **Probe first.** A 5-second test file beats reading stale docs.
2. **The source is truth.** Old shipped binaries lag; rebuild from source.
3. **Guard every sentinel.** `IF?` before using `READ_FILE`/`POP`/lookups.
4. **Use verified features** (see the [builtins cheat sheet](../cheat-sheets/builtins.md)).
5. **Pin your interpreter** — `build/` differs from `Compiler/`.

If you're still stuck, say which **binary**, which **line**, and the **exact
error** — that's everything needed to diagnose it.
