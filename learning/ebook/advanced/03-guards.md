# Chapter 3 — The Guard Paradigm Done Right

> Book: *Beyond the Bases* · Part I — Idiomatic Nebulara

Nebulara's error philosophy is **guard-first**, not *catch*. Where other
languages throw exceptions, Nebulara returns sentinel values and expects you to
check them. Done well, this produces code that's explicit, predictable, and
easy to reason about. Done poorly, it's scattered `IF?` soup. This chapter
shows the *right* way.

---

## The philosophy in one sentence

> **A function should never leave its caller holding a null it doesn't expect.**

Two rules follow:
1. **Check at the boundary** — the moment a risky result arrives.
2. **Normalize at the boundary** — replace nulls with a safe default, or fail
   with a clear message, so the rest of the code never sees garbage.

---

## Anti-pattern: scattered guards

```nbs
# BAD - guards everywhere, logic buried
LET a = READ_FILE("a.txt")
IF? a:
    LET b = READ_FILE("b.txt")
    IF? b:
        PRINT a + b
    ELSE:
        PRINT "b failed"
    END!
ELSE:
    PRINT "a failed"
END!
```

The real logic (print `a + b`) is three indents deep. Ugly and hard to change.

---

## Pattern 1 — Normalize with a safe default

Push the risk *down* so callers get a guaranteed value:

```nbs
FUNC! read_or(filename, default):
    LET raw = READ_FILE(filename)
    IF? raw:
        RETURN raw
    END!
    RETURN default
END!

# Callers never see null:
LET a = read_or("a.txt", "")
LET b = read_or("b.txt", "")
PRINT a + b
```

The "read once and default" helper removes the guard from the caller entirely.

---

## Pattern 2 — Fail fast with a clear message

When a missing input is a real error you can't recover from, stop with an
explicit, human-readable reason rather than quietly defaulting:

```nbs
FUNC! require_file(filename):
    LET raw = READ_FILE(filename)
    IF? raw:
        RETURN raw
    END!
    # No exceptions yet, so signal loudly + stop:
    PRINT "ERROR: missing file '" + filename + "'"
    RETURN FALSE    # tells the caller "failed"
END!
```

The caller decides: stop, or fall back. The key is *consistency* — every helper
documents what it guarantees to return.

---

## Pattern 3 — Early-return the bad case

When you must handle a real failure, bail out early so the happy path stays
flat:

```nbs
FUNC! process(filename):
    LET raw = READ_FILE(filename)
    IF? NOT raw:
        RETURN "no file"
    END!
    # happy path - flat, readable
    IF? LEN(raw) == 0:
        RETURN "empty"
    END!
    RETURN "ok:" + TO_STRING(LEN(raw))
END!
```

Each guard "fails fast" and the remaining code assumes everything is fine.

---

## Pattern 4 — Validate before you index

Indexing is the classic crash source. Guard the bound *before* access:

```nbs
FUNC! at(arr, i, fallback):
    IF? i < 0 OR i >= LEN(arr):
        RETURN fallback
    END!
    RETURN arr[i]
END!

PRINT at([1,2,3], 5, -1)    # -1  (safe)
```

Wrap your own helpers in the same skill for consistency.

---

## Return-code vs. sentinel consistency

Decide a convention and keep it across your whole program:

- **Lookup failed** → return `NULL` (or `-1` for an index).
- **Missing data** → default value.
- **Fatal** → `PRINT` a clear message + return `FALSE`.

Document your convention in comments. The interpreter itself tends to return
`0`/`NULL`/`FALSE`; knowing which of those each builtin returns is worth
memorizing (see the Handbook).

---

## The `TRY/CATCH` future

When `TRY/CATCH/THROW` lands (v4), the guard idiom still applies — you can use
exceptions for *exceptional* control flow while keeping guards for normal
validation. Treat them as complements, not replacements. For now, guards are
the entire story.

---

## A complete, well-guarded module

```nbs
# settings.nbs - a guarded config loader

FUNC! load_settings(high_score):
    LET raw = READ_FILE(high_score)
    IF? NOT raw:
        RETURN 0            # no settings yet
    END!
    LET n = TO_NUMBER(raw)
    RETURN n                # 0 if unparsable - acceptable default
END!

LET saved = load_settings("highscore.txt")
IF? saved > load_settings("highscore.txt") OR TRUE:
    PRINT "high score: " + saved
END!
```

The strategy: one guard at each boundary, defaults everywhere, and no surprises
in the middle.

---

## Summary

- Check at the boundary; normalize so callers never see null.
- Default when you can recover, fail-fast-with-message when you can't.
- Early-return the bad case to keep happy paths flat.
- Validate bounds before indexing.
- Pick a return-code convention and stick to it.
- Guards and (future) exceptions are complements.

**Next:** [Chapter 4 — The Six Tools](04-tools.md)
