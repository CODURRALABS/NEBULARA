# Chapter 11 — Handling Errors

> Book: *Nebulara From Zero* · Part III — Structuring Programs

Things go wrong: a file isn't there, a number doesn't parse, an index is out
of range. Good programs don't crash — they check and respond. This chapter is
about Nebulara's **error style**, which is a little unusual but very teachable.

---

## Two kinds of "errors"

1. **Syntax / fatal errors** — the program can't even be understood
   (a typo in a keyword). The interpreter stops before running. You fix these
   by reading the error message.

2. **Runtime "failures"** — the program runs, but a function can't do its job
   (file missing, bad index). Nebulara usually **doesn't crash** here; it
   returns a *sentinel value* you check.

We focus on the second kind, because that's what you manage in code.

---

## Sentinel values: the heart of it

When a builtin can't do its job, it returns a "nothing" value instead of
throwing:

- `CHAR_AT("hi", 99)` → `NULL` (index out of range)
- `POP(empty_array)` → `NULL`
- `TO_NUMBER("abc")` → `0`
- `READ_FILE("missing.txt")` → probably `NULL`

Your job: **check before you use.**

---

## The checking pattern: `IF?` first

The build uses `IF?` to test a value's truthiness (falsy = `NULL`, `0`,
`FALSE`, empty):

```nbs
LET data = READ_FILE("notes.txt")
IF? data:
    PRINT data
ELSE:
    PRINT "Could not read the file."
END!
```

`IF? data:` means "if data isn't null/empty, proceed; otherwise handle it."
This is the **guard pattern** — the core Nebulara error-handling idiom.

---

## A helper you can rely on

Wrap a risky operation in a function that always returns something safe:

```nbs
FUNC! read_or(message, default):
    LET data = READ_FILE(message)
    IF? data:
        RETURN data
    END!
    RETURN default
END!

LET body = read_or("notes.txt", "No notes yet.")
PRINT body
```

Now callers never see `NULL`.

---
## Exceptions: `TRY!` / `CATCH!` / `THROW`

Nebulara also supports true exceptions as a jump-out handler — an alternative
to sentinel-guard chains:

```nbs
TRY!
    LET n = TO_NUMBER("not a number")
    IF? n == 0:
        THROW("parse failed")
    END!
    PRINT n
CATCH! err:
    PRINT "Caught: " + err
ENDTRY!
```

`THROW(value)` raises; `CATCH! err:` binds the value to `err`; `FINALLY!` (optional)
always runs; `ENDTRY!` closes the block. Note the `!` suffixes and parens on
`THROW`. These are implemented in the current source — rebuild from source if a
shipped `.exe` errors on them.

For most input-validation code the guard pattern below remains a clean fit.

---

## Proving a feature works before you use it

Since docs can drift from the binary, adopt this habit: **probe first.** Write
a tiny test file and run it.

```nbs
# probe.nbs - does TRY! parse?
TRY!
    PRINT "hi"
CATCH! e:
    PRINT "caught"
ENDTRY!
```

If the interpreter errors at parse time, your build is older than the source —
rebuild from `Compiler/nbs-bootstrap.c` to get the current feature set.

---

## Common guard checklist

| Risk | Check |
|------|-------|
| File missing | `IF? READ_FILE(...)` |
| Index out of range | compare your index against `LEN(arr)` - 1 |
| Bad string-to-number | `TO_NUMBER` returns `0`? validate |
| `POP` empty array | test `LEN(arr)` before `POP` |
| Negative/short input | validate length before `SUBSTR` |

---

## A defensive example

```nbs
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

PRINT average([4, 6, 8])    # 6
PRINT average([])           # 0  (no crash thanks to the guard)
```

Dividing by zero would crash; the empty-array guard prevents it.

---

## Try it

1. Write a guard for `READ_FILE` that prints a friendly message on failure.
2. Test what `TO_NUMBER` returns for `"12x"` and guard against it.
3. Write a `safe_pop(arr)` that returns `0` if the array is empty.

---

## Chapter takeaways

- Fatal errors = fix the source. Runtime "failures" = sentinel values.
- Sentinel values: `NULL`, `0`, `FALSE` — check with `IF?`.
- The guard pattern (`IF? result:`) is Nebulara's main error idiom.
- Exceptions (`TRY!`/`CATCH!`/`FINALLY!`/`ENDTRY!`/`THROW`) are implemented in
  the current source — rebuild from source if a shipped binary lacks them.
- Probe uncertain features with a tiny test file.

**Next:** [Chapter 12 — Files and the Real World](12-files.md)
