# Guide: Modules & the Standard Library

The standard library is a set of **self-hosted** `.nbs` modules in `std/`. This
guide walks you through loading them and working around a big gotcha: the
`USE` keyword may not be in your build.

---

## What's in `std/`

`math.nbs`, `math_ext.nbs`, `string.nbs`, `collections.nbs`, `primitives.nbs`,
`map.nbs`, `set.nbs`, `sort.nbs`, `rand.nbs`, `fmt.nbs`, `time.nbs`,
`os.nbs`, `net.nbs`, `json.nbs`, `args.nbs`, `kanban.nbs`, `test.nbs`, and a few
test helpers. See the [Standard Library Manual](../manuals/stdlib-manual.md)
for the full function catalog.

---

## Loading a module: `USE`

The intended mechanism:
```nbs
USE "math"
PRINT math.clamp(15, 0, 10)     # 10
```
`USE "name"` exposes the module's functions through a namespace.

---

## The gotcha: `USE` may not be built in

`USE`/`IMPORT` are **documented (spec)** but may not be wired into your
shipped binary. Verify first:

```nbs
# probe.nbs
USE "math"
PRINT math.clamp(5, 0, 10)
```
- If it runs and prints `5`, `USE` works — use it everywhere.
- If it errors, `USE` isn't available **in your build**.

> This is the single most common "why didn't it work?" moment in Nebulara.
> Docs describe `USE`; the binary might not have it yet. Probe.

---

## Workaround: concatenate the module into your file

Since module code is pure Nebulara, you can **include it by hand**:

1. Open `std/math.nbs` (or whichever module you need).
2. Paste its function definitions into your file (rename namespace-based calls
   to direct function calls).
3. Call the functions directly:
   ```nbs
   # after pasting in math.nbs's functions:
   PRINT clamp(15, 0, 10)    # 10  (no namespace)
   ```

For shell users, concatenate:
```
# on Linux/macOS
cat std/math.nbs myapp.nbs > combined.nbs
nebulara combined.nbs
```

---

## Calling patterns without `USE`

Without a namespace, call module functions **directly**:
```nbs
# math functions are now top-level after pasting
PRINT average([10, 20, 30])    # 20
```
With `USE`, the same call is `math.average(...)`. Pick one style per project.

---

## Which modules need care

| Module | Caution |
|--------|---------|
| `os`, `net` | may need FFI / stubs — test before relying |
| `time` | `sleep(ms)` needs `SLEEP` (not in base) — probe |
| `args` | needs `ARGUMENT` builtins (not in base) — probe |
| `map`/`set` | provide data types until native `{}` literals land |

Useful defaults: `math`, `string`, `collections`, `sort`, `rand`, `fmt`,
`primitives`, `test`.

---

## Testing with `test.nbs`

If `USE` works:
```nbs
USE "test"
ASSERT_EQUALS(2 + 2, 4)
ASSERT_TRUE("hello")
TEST_SUMMARY()
```
(With concatenation, call `ASSERT_EQUALS` / `TEST_SUMMARY` directly.)

---

## Recommended workflow

1. **Probe** whether `USE` works in your binary (tiny file).
2. **If yes:** `USE "module"` + namespaced calls.
3. **If no:** concatenate the module source into your file; call functions
   directly.
4. Keep module-heavy code portable by preferring modules that are pure
   functions over those needing FFI/sleep/args.
