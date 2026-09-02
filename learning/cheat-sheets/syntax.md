# Nebulara — Syntax Cheat Sheet

One page. Everything you type most often. (Verified against `nebulara`.)

```
# This is a comment
```

## Comments
```nbs
# line comment
```

## Variables
```nbs
LET x = 10          # mutable variable
CONST PI = 314      # constant (immutable)
x = 20              # reassign (no LET)
```

## Types & literals
```nbs
42          # int (64-bit signed)
-7          # negative int
"hello"     # string
TRUE        # bool
FALSE       # bool
NULL        # null
[1, 2, 3]   # array
```

## Operators
| Kind | Operators |
|------|-----------|
| Arithmetic | `+  -  *  /  %` |
| Unary | `-` (negation) |
| Bitwise | `&  |  <<  >>` |
| Comparison | `==  !=  <  >  <=  >=` |
| Logical | `AND  OR  NOT` (words, not symbols) |
| String | `+` (concatenation) |

## Control flow
```nbs
IF? x > 10:
    PRINT "big"
ELSEIF? x > 5:
    PRINT "medium"
ELSE:
    PRINT "small"
END!

WHILE? i < 10:
    i = i + 1
END!

FOR! i = 1 TO 5:          # STEP, e.g. "TO 20 STEP 5"
    PRINT i
END!
```

## Functions
```nbs
FUNC! add(a, b):
    RETURN a + b
END!

PRINT add(3, 4)          # 7
```

## Exceptions
```nbs
TRY!
    THROW("something went wrong")
CATCH! err:
    PRINT "Caught: " + err
FINALLY!
    PRINT "always runs"
ENDTRY!
```

## Arrays
```nbs
LET arr = [10, 20, 30]
PRINT arr[0]          # 10
arr[1] = 99           # mutate in place
PUSH(arr, 40)         # append
LET last = POP(arr)   # pop last
PRINT LEN(arr)        # length
```

## Common builtins
```nbs
PRINT(x)              # output
LEN(x)                # string bytes / array length
TYPEOF(x)             # "int" "string" "bool" "array" "null"
TO_STRING(x)          # convert to string
TO_NUMBER(s)          # parse string to int
TO_UPPER(s) / TO_LOWER(s)
CHAR_AT(s, i) / SUBSTR(s, start, len)
TRIM(s)               # strip whitespace
CHAR(code) / ORD(ch)  # code <-> char
ABS(n) / MIN(a,b) / MAX(a,b)
SQRT(n) / POW(b,e)    # integer math
RANDOM()              # 0..99
TIME()                # epoch seconds
READ_FILE(p) / WRITE_FILE(p, content)
```

## Keywords at a glance
```
FUNC! END! LET CONST
IF? ELSEIF? ELSE END!
WHILE? FOR! TO STEP
RETURN BREAK CONTINUE
TRY! CATCH! FINALLY! THROW ENDTRY!
IMPORT GO! CHAN! SEND! RECV! SELECT!
MUTEX! LOCK! UNLOCK! YIELD! SLEEP!
TRUE FALSE NULL
AND OR NOT
PRINT LEN TYPEOF
```

---

## Gotchas (read these!)
- `PRINT arrayName` prints `[array N]` (count), **not** the element list.
- Keywords use **suffix symbols**: `IF?` has a `?`, `FUNC!`/`END!`/`FOR!` have a `!`.
- `END!` closes blocks. There are **no braces** `{}`. Exception blocks use `ENDTRY!`.
- Logical operators are **words**, not `&&`/`||`/`!`.
- Integer division: `7 / 2` → `3` (truncates).
- `FLOOR`, `CEIL`, `ROUND` are currently pass-through no-ops on ints.
- Booleans print as lowercase `true`/`false`; you *type* `TRUE`/`FALSE`.
- Exceptions use `TRY!`/`CATCH!`/`ENDTRY!` (note the `!`) — `THROW` takes
  parens: `THROW("msg")`.
