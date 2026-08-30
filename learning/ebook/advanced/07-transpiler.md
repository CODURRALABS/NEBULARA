# Chapter 7 — Transpiling to JavaScript & Python

> Book: *Beyond the Bases* · Part III — Going Universal

Nebulara's "write once, run anywhere" promise is realized by the **transpiler**:
it converts `.nbs` source into JavaScript or Python that runs on those runtimes.

---

## The idea

You write Nebulara; `neb-pipeline` emits runnable JS or Python:

```bash
neb-pipeline app.nbs --js       # app.js
neb-pipeline app.nbs --py       # app.py
neb-pipeline app.nbs            # default (JS)
```

Now the same logic runs in a browser (JS) or any Python host — no Nebulara
install needed on the target.

---

## An example translation

A Nebulara source like:
```nbs
FUNC! square(n):
    RETURN n * n
END!
PRINT square(4)
```
translates roughly to:
```javascript
function square(n) {
    return n * n;
}
console.log(square(4));
```
or to Python:
```python
def square(n):
    return n * n
print(square(4))
```

The mapping is nearly one-to-one because the languages share a similar shape.

---

## The intermediate representation (IR)

Between the parse tree and the emitted code sits an **IR** — a normalized
intermediate form:

```bash
neb-pipeline app.nbs --ir
```

Readable IR is great for **debugging the compiler**: you can confirm your code
lowered the way you expect before it becomes JS/Python or bytecode.

---

## Keyword/feature mapping

Because Nebulara keywords differ (uppercase `PRINT`, `FUNC!`, `END!`, truthy
sentinels), the transpiler must map semantics, not just names:

| Nebulara | JS | Python |
|----------|----|--------|
| `PRINT x` | `console.log(x)` | `print(x)` |
| `LET a = 1` | `let a = 1` | `a = 1` |
| `FUNC! f():` ... `END!` | `function f() {` ... `}` | `def f():` ... |
| `IF? c:` ... `END!` | `if (c) {` ... `}` | `if c:` ... |
| `WHILE? c:` ... `END!` | `while (c) {` ... `}` | `while c:` ... |
| `TRUE/FALSE` | `true/false` | `True/False` |

The guard idiom maps cleanly: `IF? x:` → truthiness checks in both targets.

---

## What you can rely on

- Core language (variables, functions, loops, decisions) transpiles well.
- The builtins that exist only in the interpreter need a runtime shim on the
  target — e.g., a `READ_FILE`/`WRITE_FILE` implementation in JS (using
  `fetch`/Node `fs`) or Python (`open`).

---

## When to transpile vs. interpret

- **Interpret** when you just need to run on the host.
- **Transpile to JS** to ship a browser/web version.
- **Transpile to Python** to drop into a Python ecosystem.
- **`--check`** to statically validate before transpiling.

---

## Summary

- `neb-pipeline --js | --py | --ir`.
- The language maps nearly one-to-one; key words transform to target idiom.
- `--ir` shows the lowering for debugging.
- Builtins need runtime shims on target platforms.

**Next:** [Chapter 8 — Calling C with FFI](08-ffi.md)
