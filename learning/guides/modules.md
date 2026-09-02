# Guide: Modules & the Standard Library

The standard library is a set of **self-hosted** `.nbs` modules in `std/`. This
guide walks you through loading them with `IMPORT` and notes that the
`USE` keyword is spec'd but **not implemented** (v4).

---

## What's in `std/`

`math.nbs`, `math_ext.nbs`, `string.nbs`, `collections.nbs`, `primitives.nbs`,
`map.nbs`, `set.nbs`, `sort.nbs`, `rand.nbs`, `fmt.nbs`, `time.nbs`,
`os.nbs`, `net.nbs`, `json.nbs`, `args.nbs`, `kanban.nbs`, `test.nbs`, and a few
test helpers. See the [Standard Library Manual](../manuals/stdlib-manual.md)
for the full function catalog.

---

## Loading a module: `IMPORT`

`IMPORT "path.nbs"` loads and executes a module file in the same namespace,
making its functions available directly:

```nbs
IMPORT "std/math.nbs"
PRINT clamp(15, 0, 10)     # 10
```

Imports are deduplicated (each path loads once). Function names are lowercase
in modules, distinct from all-caps builtins.

---

## The `USE` keyword (spec'd, not implemented)

The v4 spec describes `USE "module"` for **namespaced** access:

```nbs
# v4 preview - not yet implemented
USE "math"
PRINT math.clamp(5, 0, 10)
```

`USE` does **not** parse yet — use `IMPORT` today, which pastes module
functions into your namespace directly. Revisit this once v4 lands.

---

## Workaround: concatenate the module into your file

Since module code is pure Nebulara, you can also **include it by hand**:

1. Open `std/math.nbs` (or whichever module you need).
2. Paste its function definitions into your file.
3. Call the functions directly:
   ```nbs
   # after pasting in math.nbs's functions:
   PRINT clamp(15, 0, 10)    # 10
   ```

For shell users, concatenate:
```
# on Linux/macOS
cat std/math.nbs myapp.nbs > combined.nbs
nebulara combined.nbs
```

`IMPORT` is the cleaner equivalent of this and is implemented.

---

## Which modules need care

| Module | Caution |
|--------|---------|
| `os`, `net` | may need FFI / stubs — test before relying |
| `time` | `sleep(ms)` needs `SLEEP` — implemented in current source; rebuild from source for old binaries |
| `args` | needs `ARGUMENT_COUNT`/`ARGUMENT` builtins — implemented in current source |
| `map`/`set` | provide data types until native `{}` literals land (v4) |

Useful defaults: `math`, `string`, `collections`, `sort`, `rand`, `fmt`,
`primitives`, `test`.

---

## Testing with `test.nbs`

`IMPORT` the module, then call assertion helpers directly:
```nbs
IMPORT "std/test.nbs"
ASSERT_EQUALS(2 + 2, 4)
ASSERT_TRUE("hello")
TEST_SUMMARY()
```

---

## Recommended workflow

1. **Prefer `IMPORT "std/xxx.nbs"`** — implemented, deduplicated, same namespace.
2. Avoid `USE` — spec'd but not yet implemented.
3. For portability, prefer modules that are pure functions over those needing
   FFI/`sleep`/args.
4. Rebuild from source to get every builtin (`SLEEP`, `ARGUMENT_COUNT`,
   `ARGUMENT`, exceptions) in your binary.
