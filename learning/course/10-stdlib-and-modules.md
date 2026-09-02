# Lesson 10 — Standard Library & Modules

The standard library is a set of `.nbs` files in `std/`, each full of small
helper functions — all written **in Nebulara itself**. This is also your best
training material for reading idiom.

---

## 1. The stdlib modules

| File | Tools |
|------|-------|
| `math.nbs` | `abs`, `min`, `max`, `clamp`, `sum_array`, `average` |
| `math_ext.nbs` | `sin_approx`, `mean`, `median`, `stddev`, `lerp`, `map_range` ... |
| `string.nbs` | `concat`, `repeat`, `reverse`, `contains`, `to_upper`, `trim` ... |
| `collections.nbs` | `find`, `contains`, `reverse_array`, `sum_array` ... |
| `sort.nbs` | `sort`, `sort_strings`, `binary_search` ... |
| `map.nbs` / `set.nbs` | dictionary & set data structures |
| `rand.nbs` | `rand_range`, `rand_bool`, `shuffle`, `rand_string` |
| `fmt.nbs` | `pad_left`, `pad_right`, `repeat_char`, `fmt` |
| `time.nbs` | `now`, `elapsed`, `sleep`, `format_time` |
| `os.nbs` | `exec`, `cwd`, `platform`, `list_dir` |
| `json.nbs` | `json_parse`, `json_stringify` |
| `test.nbs` | `ASSERT_*`, `TEST_SUMMARY` |
| `primitives.nbs` | `is_string`, `is_number`, `to_int`, `to_str` ... |

See the [stdlib cheat sheet](../cheat-sheets/stdlib.md) for the full function
lists.

---

## 2. How to use a module: `IMPORT`

`IMPORT "path.nbs"` loads a module file into the same namespace, so its
functions become directly available:

```nbs
IMPORT "std/math.nbs"
PRINT clamp(15, 0, 10)     # 10
```

- Imports are deduplicated (each path is loaded once).
- Function names stay lowercase (`clamp`), distinct from all-caps builtins.

---

## 3. The `USE` keyword (spec'd, not implemented)

The v4 spec describes `USE "module"` with a namespace:

```nbs
# v4 preview - not yet implemented
USE "math"
PRINT math.clamp(15, 0, 10)     # 10
```

`USE` is **not implemented** yet — use `IMPORT` today. Also, never assume
module functions are namespaced: with `IMPORT` they're top-level.

---

## 4. Reading the stdlib as a learner

Open `std/math.nbs` and `std/collections.nbs`. Notice:
- They use only features you've learned: `LET`, `IF?`, `WHILE?`, `RETURN`, `LEN`.
- The names are lowercase (`abs`, `min`) — **distinct** from the all-caps
  builtins (`ABS`, `MIN`). The stdlib *reimplements* some builtins in pure
  Nebulara.
- Each function is short and single-purpose — great role models.

---

## 5. Tests with `test.nbs`

`test.nbs` provides assertions to check your work:

```nbs
ASSERT_EQUALS(2 + 2, 4)
ASSERT_TRUE(ABS(-5) == 5)
ASSERT_NOT_EQUALS("a", "b")
TEST_SUMMARY()
```

This is a tiny testing framework you can use to verify your own exercises.

---

## Try it

1. Open `std/math.nbs` and read `average`.
2. Reimplement `max` yourself and test it.
3. Use `ASSERT_EQUALS` to check that `add(2,3)` (your function) returns 5.

---

## Exercises

1. Using stdlib `math`, what does `math.clamp(100, 0, 50)` return?
2. Write your own `average(arr)` and test it with `ASSERT_EQUALS`.
3. Name three modules you'd reach for when building a text-processing tool.

### Answers
1. `50` (clamped to the upper bound)
2. See the `sum`/loop pattern from Lesson 06/07, wrap it, then assert.
3. `string.nbs`, `collections.nbs`, `fmt.nbs` (plus `json.nbs` for data).

---

## Checkpoint
- The stdlib is `.nbs` files full of small helpers. ✅
- `IMPORT` loads a module into your namespace. ✅
- `USE` namespacing is spec'd for v4 (not implemented). ✅
- You can verify code with `test.nbs`. ✅

Next: **[Lesson 11 — Putting It Together](11-project.md)**
