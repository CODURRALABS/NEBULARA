# Nebulara Standard Library Manual

*Reference for every module in `std/*.nbs`.*

The standard library is written **in Nebulara itself** (self-hosted teaching
gold). Modules live in `std/*.nbs`. Load a module, then use its names:

```nbs
USE "math"
PRINT math.clamp(15, 0, 10)     # 10
```

> **Build note:** if your interpreter lacks `USE`, you can concatenate the
> module into your file (see [modules guide](../guides/modules.md)). Always
> test a module in your build before depending on it in a critical script —
> some stdlib modules are richer than the minimal interpreter exposes.

---

## math.nbs — basic numeric helpers
| Function | Returns |
|----------|---------|
| `abs(x)` | absolute value |
| `min(a,b)` / `max(a,b)` | smaller / larger |
| `clamp(v, lo, hi)` | v bounded to [lo, hi] |
| `sum_array(arr)` | sum of elements |
| `average(arr)` | mean (0 if empty) |

```nbs
USE "math"
PRINT math.clamp(15, 0, 10)     # 10
PRINT math.average([10, 20, 30])# 20
```

## math_ext.nbs — extended math
```
sin_approx(x)   cos_approx(x)   ln_approx(x)
mean(arr)       median(arr)     stddev(arr)    variance(arr)
dot(a,b)        vec_add(a,b)    vec_scale(v,s)
lerp(a,b,t)     clamp_val(v,lo,hi)   map_range(v,lo,hi,nlo,nh)
```
Approximations give integer-friendly math flavor on the integer runtime.

## string.nbs — text utilities
| Function | Returns |
|----------|---------|
| `concat(a,b)` | a + b |
| `repeat(s,n)` | s repeated n times |
| `reverse(s)` | reversed string |
| `contains(s,sub)` | true/false |
| `to_upper(s)` / `to_lower(s)` | case conversion |
| `trim(s)` | stripped of surrounding whitespace |
| `substring(s,start,len)` | slice |

## collections.nbs — array utilities
| Function | Returns |
|----------|---------|
| `find(arr,v)` | index or `-1` |
| `contains(arr,v)` | true/false |
| `reverse_array(arr)` | reversed copy |
| `sum_array(arr)` | sum |
| `max_array(arr)` / `min_array(arr)` | extremum |

## primitives.nbs — type checks & conversions
| Function | Returns |
|----------|---------|
| `is_string(v)` | bool |
| `is_number(v)` | bool |
| `is_bool(v)` | bool |
| `is_array(v)` | bool |
| `is_null(v)` | bool |
| `to_int(v)` | int |
| `to_str(v)` | string |

## map.nbs — map as data (`{"k": v}` may be `[planned]`; these use an internal encoding)
```
MAP            MAP_SIZE(m)      MAP_HAS(m,k)   MAP_GET(m,k)
MAP_SET(m,k,v) MAP_REMOVE(m,k)  MAP_KEYS(m)    MAP_VALUES(m)
MAP_MERGE(a,b)
```
Provides map-like behavior until native `{}` literals land.

## set.nbs — set as data
```
SET            SET_HAS(s,v)    SET_ADD(s,v)   SET_REMOVE(s,v)
SET_UNION(a,b) SET_INTERSECT(a,b)  SET_DIFF(a,b)  SET_SIZE(s)
```

## sort.nbs — sorting & search
| Function | Returns |
|----------|---------|
| `sort(arr)` | sorted (ascending) |
| `sort_strings(arr)` | string-sorted |
| `binary_search(arr,v)` | index or `-1` |
| `find_min(arr)` / `find_max(arr)` | extremum |

## rand.nbs — randomness
| Function | Returns |
|----------|---------|
| `rand_range(lo,hi)` | random int in range |
| `rand_bool()` | true/false |
| `rand_choice(arr)` | random element |
| `shuffle(arr)` | shuffled |
| `rand_string(n)` | random string of length n |

## fmt.nbs — formatting
| Function | Returns |
|----------|---------|
| `pad_left(s,w)` / `pad_right(s,w)` | padded string |
| `repeat_char(c,n)` | c × n |
| `fmt(s, ...args)` | formatted string (placeholder style) |

## time.nbs — time helpers
| Function | Returns |
|----------|---------|
| `now()` | current time |
| `elapsed(start)` | time since start |
| `sleep(ms)` | pause `[depends: builtin SLEEP is not in base interpreter]` |
| `format_time(t)` | formatted time string |

## os.nbs — operating system (may need FFI / stubs)
| Function | Returns |
|----------|---------|
| `exec(cmd)` | run a command |
| `cwd()` | current working directory |
| `platform()` | platform name |
| `list_dir(path)` | directory listing |

## net.nbs — networking (may require FFI / stubs)
| Function | Returns |
|----------|---------|
| `http_get(url)` | response |
| `http_post(url, body)` | response |
| `serve(port)` | simple server |

## json.nbs — JSON
| Function | Returns |
|----------|---------|
| `json_parse(str)` | parsed value (map/array) |
| `json_stringify(value)` | serialized string |

Uses the `json`/`map` machinery for serialization.

## args.nbs — command-line arguments
```
args            program_name()     has_flag(name)     find_arg(name)
```
Reading command-line arguments may depend on the base interpreter's
`ARGUMENT` support, which is **not in the shipped binary** — see Doc Drift.

## kanban.nbs — example app module
```
create_task(...)   move_task(...)   get_task(...)   print_board(...)
```
A small kanban-board app written as a module — a great end-to-end example.

## test.nbs — assertions
| Function | Purpose |
|----------|---------|
| `ASSERT_EQUALS(a,b)` | pass if equal, else report |
| `ASSERT_NOT_EQUALS(a,b)` | pass if not equal |
| `ASSERT_TRUE(x)` | pass if truthy |
| `ASSERT_FALSE(x)` | pass if falsy |
| `TEST_SUMMARY()` | print pass/fail summary |

```nbs
USE "test"
ASSERT_EQUALS(2 + 2, 4)
ASSERT_TRUE("yay")
TEST_SUMMARY()
```

---

## Using stdlib modules as learning material
Because every function is pure Nebulara, the stdlib is the best "real-world"
reading you can find:
- `std/math.nbs` — clean helper style.
- `std/sort.nbs` — algorithms (search/sort) in `.nbs`.
- `std/kanban.nbs` — a structured application module.

Reading these teaches idiomatic structure faster than most tutorials.

---

## Revisions
- v1.0 — full module & function catalog with examples.
