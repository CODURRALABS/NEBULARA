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

## 2. How to use a module: the `USE` keyword

Nebulara v4 introduces `USE "module"` to load a file and access its functions
through a namespace:

```nbs
USE "math"
PRINT math.clamp(15, 0, 10)     # 10
```

- The module name is the file's stem (`math.nbs` → namespace `math`).
- Files load once and are cached.
- Circular `USE` is a compile error.

---

## 3. If your build lacks `USE`

The base interpreter may not expose `USE` yet. Two workarounds:

**Workaround A — call by name if the file is bundled/concatenated.** Many
stdlib files are self-contained; you can paste the functions you need, or
prepend the file's content to yours before running.

**Workaround B — just reimplement the small helper.** Most stdlib functions
are tiny. For example, instead of `clamp`:

```nbs
FUNC! clamp(v, lo, hi):
    IF? v < lo:
        RETURN lo
    END!
    IF? v > hi:
        RETURN hi
    END!
    RETURN v
END!
PRINT clamp(15, 0, 10)    # 10
```

This "vendor the function" approach is totally idiomatic given how small the
helpers are.

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
- `USE` namespaces modules (when supported). ✅
- You can vendor helpers or use `USE`. ✅
- You can verify code with `test.nbs`. ✅

Next: **[Lesson 11 — Putting It Together](11-project.md)**
