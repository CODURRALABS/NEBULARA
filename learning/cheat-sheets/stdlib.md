# Nebulara — Standard Library Cheat Sheet

The standard library lives in `std/*.nbs` and is written **in Nebulara itself**.
Load a module with `IMPORT`, then call its functions directly:
```nbs
IMPORT "std/math.nbs"
PRINT clamp(15, 0, 10)     # 10
```
The v4 spec describes `USE` for namespaced access (`math.clamp(...)`) but it
isn't implemented yet — with `IMPORT`, functions are top-level.

## math.nbs
| Function | Returns |
|----------|---------|
| `abs(x)` | absolute value |
| `min(a,b)` / `max(a,b)` | smaller / larger |
| `clamp(v, lo, hi)` | v bounded to [lo, hi] |
| `sum_array(arr)` | sum |
| `average(arr)` | mean (0 if empty) |

## math_ext.nbs
`sin_approx(x)  cos_approx(x)  ln_approx(x)  mean(arr)  median(arr)
stddev(arr)  variance(arr)  dot(a,b)  vec_add(a,b)  vec_scale(v,s)
lerp(a,b,t)  clamp_val(v,lo,hi)  map_range(v,lo,hi,nlo,nh)`

## string.nbs
`concat(a,b)  repeat(s,n)  reverse(s)  contains(s,sub)  to_upper(s)
to_lower(s)  trim(s)  substring(s,start,len)`

## collections.nbs
`find(arr,v)  contains(arr,v)  reverse_array(arr)  sum_array(arr)
max_array(arr)  min_array(arr)`

## primitives.nbs
`is_string(v)  is_number(v)  is_bool(v)  is_array(v)  is_null(v)
to_int(v)  to_str(v)`

## map.nbs (map as data)
`MAP            MAP_SIZE(m)      MAP_HAS(m,k)   MAP_GET(m,k)
MAP_SET(m,k,v)  MAP_REMOVE(m,k)  MAP_KEYS(m)    MAP_VALUES(m)
MAP_MERGE(a,b)`

## set.nbs (set as data)
`SET            SET_HAS(s,v)    SET_ADD(s,v)   SET_REMOVE(s,v)
SET_UNION(a,b)  SET_INTERSECT(a,b)  SET_DIFF(a,b)  SET_SIZE(s)`

## sort.nbs
`sort(arr)  sort_strings(arr)  binary_search(arr,v)  find_min(arr)  find_max(arr)`

## rand.nbs
`rand_range(lo,hi)  rand_bool()  rand_choice(arr)  shuffle(arr)  rand_string(n)`

## fmt.nbs
`pad_left(s,w)  pad_right(s,w)  repeat_char(c,n)  fmt(s, ...args)`

## time.nbs
`now()  elapsed(start)  sleep(ms)  format_time(t)`

## os.nbs
`exec(cmd)  cwd()  platform()  list_dir(path)`

## net.nbs (may require FFI / stubs)
`http_get(url)  http_post(url, body)  serve(port)`

## json.nbs
`json_parse(str)  json_stringify(value)`  (map/array serialization)

## args.nbs
`args  program_name()  has_flag(name)  find_arg(name)`

## kanban.nbs (example app module)
`create_task(...)  move_task(...)  get_task(...)  print_board(...)`

## test.nbs (assertions)
`ASSERT_EQUALS(a,b)  ASSERT_NOT_EQUALS(a,b)  ASSERT_TRUE(x)
ASSERT_FALSE(x)  TEST_SUMMARY()`

---

### Style note
The stdlib is **self-hosted teaching gold** — every function is written in pure
Nebulara. Reading `std/math.nbs` or `std/sort.nbs` is an excellent way to learn
idiomatic `.nbs`. Use them as your first "real-world reads."

> As with the core builtins, some stdlib modules are richer than the minimal
> interpreter exposes. Test a module before relying on it in a critical script.
