# Nebulara — Builtins Cheat Sheet

All **31** built-in functions verified in the interpreter VM
(`Compiler/nbs-bootstrap.c`). Builtins are global — no import needed.

## Output & input
| Builtin | Signature | Returns |
|---------|-----------|---------|
| `PRINT` | `PRINT(value)` | prints value + newline |

## Type helpers
| Builtin | Signature | Returns |
|---------|-----------|---------|
| `LEN` | `LEN(x)` | string bytes / array count / `0` otherwise |
| `TYPEOF` | `TYPEOF(x)` | `"int"` `"string"` `"bool"` `"array"` `"null"` `"func"` `"error"` |
| `TO_STRING` | `TO_STRING(x)` | string representation |
| `TO_NUMBER` | `TO_NUMBER(s)` | parse string → int (`atoll`), int passes through, else `0` |

## String
| Builtin | Signature | Returns |
|---------|-----------|---------|
| `CHAR_AT` | `CHAR_AT(s, i)` | 1-char string or `NULL` if out of range |
| `SUBSTR` | `SUBSTR(s, start, len)` | substring, clamped to bounds |
| `TRIM` | `TRIM(s)` | strips leading/trailing whitespace |
| `TO_UPPER` | `TO_UPPER(s)` | uppercase copy (else `""`) |
| `TO_LOWER` | `TO_LOWER(s)` | lowercase copy (else `""`) |
| `CHAR` | `CHAR(code)` | int code point → 1-char string |
| `ORD` | `ORD(s)` | first char → int code point (0 if empty) |

## Math (integer)
| Builtin | Signature | Returns |
|---------|-----------|---------|
| `ABS` | `ABS(n)` | absolute value (0 if not int) |
| `MIN` | `MIN(a, b)` | smaller |
| `MAX` | `MAX(a, b)` | larger |
| `SQRT` | `SQRT(n)` | integer sqrt (truncated) |
| `POW` | `POW(base, exp)` | integer power |
| `FLOOR` | `FLOOR(n)` | pass-through on ints |
| `CEIL` | `CEIL(n)` | pass-through on ints |
| `ROUND` | `ROUND(n)` | pass-through on ints |
| `RANDOM` | `RANDOM()` | random int `0..99` |

## Arrays
| Builtin | Signature | Returns |
|---------|-----------|---------|
| `PUSH` | `PUSH(arr, value)` | appends in place, returns arr |
| `POP` | `POP(arr)` | removes & returns last (`NULL` if empty) |

## System / IO
| Builtin | Signature | Returns |
|---------|-----------|---------|
| `TIME` | `TIME()` | epoch seconds (int) |
| `SLEEP` | `SLEEP(ms)` | sleeps, returns `0` |
| `READ_FILE` | `READ_FILE(path)` | file contents string, `NULL` on error |
| `WRITE_FILE` | `WRITE_FILE(path, content)` | `TRUE` on success, `FALSE` on error |

## Program arguments
| Builtin | Signature | Returns |
|---------|-----------|---------|
| `ARGUMENT_COUNT` | `ARGUMENT_COUNT()` | number of CLI args |
| `ARGUMENT` | `ARGUMENT(i)` | the `i`-th CLI arg |

## FFI (C interop)
| Builtin | Signature | Returns |
|---------|-----------|---------|
| `FFI_LOAD` | `FFI_LOAD(name, path)` | load DLL/so as `name` |
| `FFI_REGISTER` | `FFI_REGISTER(lib, sym, retType, nArgs)` | register a function |
| `FFI_CALL` | `FFI_CALL(lib, sym, args...)` | call the function |

---

### Examples
```nbs
PRINT LEN("hello")          # 5
PRINT TYPEOF(42)            # int
PRINT TO_UPPER("hi")        # HI
PRINT SUBSTR("hello", 1, 3) # ell
PRINT ABS(-42)              # 42
PRINT SQRT(16)              # 4
PRINT POW(2, 10)            # 1024
PRINT MAX(3, 9)             # 9
PRINT ORD("A")              # 65
PRINT CHAR(65)              # A
```

> Note: `ARGUMENT`/`ARGUMENT_COUNT` need a `.nbs` run with arguments passed.
> `SLEEP`, `TIME`, `RANDOM`, and `READ_FILE`/`WRITE_FILE` behave as described
> and are handy for real programs.
