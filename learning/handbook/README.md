# Nebulara — Language Handbook

An authoritative, organized reference to the Nebulara language. Use it when you
need to look something up. For a guided learning path, see the
[Course](../course/README.md) instead.

> **Source of truth note:** this handbook reflects **what actually runs** on the
> current interpreter (rebuild `Compiler/nbs-bootstrap.c` for the full feature
> set). Items marked *[planned]* exist in the language spec (`SPEC.md`) but are
> not yet implemented — treat those as forward-looking. Old shipped `.exe`
> binaries may lag the source.

## Contents
1. [Lexical structure & comments](#lexical)
2. [Types](#types)
3. [Variables: `LET`, `CONST`](#variables)
4. [Operators](#operators)
5. [Control flow](#control)
6. [Functions](#functions)
7. [Arrays](#arrays)
8. [Built-in functions](#builtins)
9. [Standard library](#stdlib)
10. [Keywords reference](#keywords)
11. [Spec'd features not yet in binaries](#notyet)

---

<a name="lexical"></a>
## 1. Lexical structure

- Files end in `.nbs`.
- **Comments** start with `#` and go to end of line: `# this is a comment`
- Keywords are **UPPERCASE words**, some with a suffix symbol:
  - `?` on conditions: `IF?`, `WHILE?`, `ELSEIF?`
  - `!` on blocks/imperatives: `FUNC!`, `END!`, `FOR!`
- No semicolons are required; statements end at a newline.
- Block bodies are indented by convention (not required).
- Blocks close with `END!`.

---

<a name="types"></a>
## 2. Types

| Type | Literal examples | `TYPEOF` returns |
|------|------------------|------------------|
| Int | `42`, `-7`, `0` | `"int"` |
| String | `"hello"`, `""` | `"string"` |
| Bool | `TRUE`, `FALSE` | `"bool"` |
| Null | `NULL` | `"null"` |
| Array | `[1, 2, 3]`, `[]` | `"array"` |
| Func | a function value | `"func"` |

- Ints are 64-bit signed. **No float type in the base interpreter** (v4 adds it).
- `PRINT` renders bools as lowercase `true`/`false`.
- The value `NULL` means "no value"; comparisons to it use `== NULL`.

---

<a name="variables"></a>
## 3. Variables

```nbs
LET x = 10       # mutable
x = 20           # reassign (no LET)
CONST PI = 314   # constant

LET s = "text"
LET b = TRUE
LET arr = [1, 2]
LET nothing = NULL
```

Rules:
- `LET` on first declaration; reassignment omits it.
- `CONST` for values that must not change.
- Names: letters/digits/`_`, not starting with a digit; avoid keywords.

---

<a name="operators"></a>
## 4. Operators

**Arithmetic** (all integer in base interpreter):
```
+  -  *  /  %    ( / is integer division: 7/2 = 3 )
-                (unary negation)
```
`+` also **concatenates strings** and auto-converts a number: `"x" + 5` -> `"x5"`.

**Bitwise:**
```
&  |  <<  >>     e.g. 5&3=1, 5|3=7, 1<<3=8, 16>>2=4
```

**Comparison** (produce a bool):
```
==  !=  <  >  <=  >=
```

**Logical** (words, not symbols):
```
AND  OR  NOT
```

Precedence: `* / %` bind tighter than `+ -`; parentheses override.
`>` `>=` `<` `<=` `==` `!=` for comparison; `AND` `OR` for logic.

---

<a name="control"></a>
## 5. Control flow

**If / ElseIf / Else:**
```nbs
IF? cond:
    ...
ELSEIF? cond2:
    ...
ELSE:
    ...
END!
```

**While:**
```nbs
WHILE? cond:
    ...
END!
```

**For (inclusive by default, optional STEP):**
```nbs
FOR! i = 1 TO 5:        # 1,2,3,4,5
    ...
END!
FOR! i = 0 TO 20 STEP 5:
    ...
END!
```

**Loop control:** `BREAK` exits, `CONTINUE` skips to next iteration.

**Truthiness:** falsy = `NULL`, `0`, `FALSE`, empty string `""`, empty array
`[]`. Everything else is truthy.

---

<a name="functions"></a>
## 6. Functions

```nbs
FUNC! name(params):
    ...
    RETURN value
END!
```

- Parameters are local to the function.
- `RETURN` sends a value and exits immediately.
- Functions without `RETURN` end after the body.
- Functions can be **recursive** and compose with each other.

---

<a name="arrays"></a>
## 7. Arrays

```nbs
LET a = [10, 20, 30]
a[0]          # 10  (0-based)
a[1] = 99     # mutate in place
PUSH(a, 40)   # append
POP(a)        # remove & return last
LEN(a)        # count
```

- Indexing is 0-based.
- `PRINT a` shows `[array N]` (count), **not** the elements.

---

<a name="builtins"></a>
## 8. Built-in functions

Verified present in the runtime:

**Output** — `PRINT(v)`

**Type/conversion** —
- `LEN(x)` (string bytes / array count / 0)
- `TYPEOF(x)` -> `"int"|"string"|"bool"|"array"|"null"|"func"`
- `TO_STRING(x)`
- `TO_NUMBER(s)` (parse int; `0` if unparseable; int passes through)

**String** —
- `CHAR_AT(s, i)` (1-char string or `NULL`)
- `SUBSTR(s, start, len)` (clamped)
- `TRIM(s)`
- `TO_UPPER(s)` / `TO_LOWER(s)`
- `CHAR(code)` / `ORD(s)`

**Math** —
- `ABS(n)`, `MIN(a,b)`, `MAX(a,b)`, `SQRT(n)` (int), `POW(b,e)`, `RANDOM()` (0..99)
- `FLOOR(n)`, `CEIL(n)`, `ROUND(n)` — pass-through no-ops on ints

**Arrays** — `PUSH(arr, v)`, `POP(arr)`

**System/IO** —
- `TIME()` (epoch seconds)
- `SLEEP(ms)`
- `READ_FILE(path)` (string or `NULL`)
- `WRITE_FILE(path, content)` (`TRUE`/`FALSE`)
- `ARGUMENT_COUNT()`, `ARGUMENT(i)` (command-line args)

**FFI** — `FFI_LOAD(name, path)`, `FFI_REGISTER(lib, sym, retType, nArgs)`,
`FFI_CALL(lib, sym, args...)`

*Note: the shipped binaries may lag the source — rebuild `nbs-bootstrap.c` to
get every builtin above.*

---

<a name="stdlib"></a>
## 9. Standard library (`std/*.nbs`)

Self-hosted `.nbs` modules. Functions are lowercase (distinct from all-caps
builtins). Notable modules:

- `math.nbs`: `abs, min, max, clamp, sum_array, average`
- `math_ext.nbs`: `sin_approx, mean, median, stddev, lerp, map_range, ...`
- `string.nbs`: `concat, repeat, reverse, contains, to_upper, trim, substring`
- `collections.nbs`: `find, contains, reverse_array, sum_array, ...`
- `sort.nbs`: `sort, sort_strings, binary_search, find_min, find_max`
- `map.nbs` / `set.nbs`: `MAKE`, `SIZE`, `HAS`, `GET`, `SET`, `REMOVE`, `KEYS`, ...
- `rand.nbs`: `rand_range, rand_bool, rand_choice, shuffle, rand_string`
- `fmt.nbs`: `pad_left, pad_right, repeat_char, fmt`
- `time.nbs`: `now, elapsed, sleep, format_time`
- `os.nbs`: `exec, cwd, platform, list_dir`
- `json.nbs`: `json_parse, json_stringify`
- `primitives.nbs`: `is_string, is_number, is_bool, is_array, is_null, to_int, to_str`
- `test.nbs`: `ASSERT_EQUALS, ASSERT_NOT_EQUALS, ASSERT_TRUE, ASSERT_FALSE, TEST_SUMMARY`

To load: `IMPORT "std/math.nbs"` then call `clamp(...)` directly.
`USE` is spec'd for v4 (namespaced: `math.clamp(...)`) but isn't implemented
yet.

---

<a name="keywords"></a>
## 10. Keywords quick reference

| Keyword | Meaning |
|---------|---------|
| `FUNC!` / `END!` | function definition / block end |
| `LET` / `CONST` | declare mutable / constant |
| `IF?` `ELSEIF?` `ELSE` | conditional |
| `WHILE?` | while loop |
| `FOR!` `TO` `STEP` | counted loop |
| `RETURN` | value out of function |
| `BREAK` / `CONTINUE` | loop control |
| `TRUE` `FALSE` `NULL` | literals |
| `AND` `OR` `NOT` | logical operators |
| `TRY!` `CATCH!` `FINALLY!` `ENDTRY!` `THROW` | exception handling |
| `IMPORT` | load a module file |
| `GO!` `CHAN!` `SEND!` `RECV!` `SELECT!` `MUTEX!` `LOCK!` `UNLOCK!` `YIELD!` `SLEEP!` | concurrency |
(`GO`, `CHAN`, `SEND`, `RECV`, `SELECT`, `LOCK`, `MUTEX`, `UNLOCK`, `YIELD`,
`RUN`, `DATA`).

---

<a name="notyet"></a>
## 11. Spec'd features not yet implemented

These are defined in `SPEC.md` / the compiler but not yet implemented. Don't
build on them yet:

- Float type & float arithmetic (v4)
- Map type `{"k": v}` (v4)
- Closures & first-class functions (v4)
- `USE` module namespacing (v4) — `IMPORT` is implemented, `USE` is not
- Wait groups (`WAIT!`) and JSON `DATA!`/`RUN!` — tokens/opcodes exist, no parser
- Concurrency in native codegen — VM-only today

For now, guard errors with `IF?` checks (Lesson 08) and use the verified
builtins in this handbook. Exceptions (`TRY!`/`CATCH!`/`FINALLY!`/`ENDTRY!`/
`THROW`), `SLEEP`, `ARGUMENT_COUNT`, `ARGUMENT`, and `IMPORT` **are**
implemented in the current source.
