<p align="center">
  <img src="logo.png" alt="Nebulara Logo" width="120"/>
</p>

# Nebulara Language Specification v3.0


## File Extension
`.nbs` - Nebulara Source

## Comments
```
# This is a line comment
```

## Keywords

| Keyword | Usage | Example |
|---------|-------|---------|
| `FUNC!` | Define function | `FUNC! add(a, b):` |
| `END!` | Block end | `END!` |
| `LET` | Variable declaration | `LET x = 10` |
| `CONST` | Constant declaration | `CONST PI = 314` |
| `IF?` | Conditional | `IF? x > 10:` |
| `ELSE` | Else branch | `ELSE:` |
| `ELSEIF?` | Else-if branch | `ELSEIF? x > 5:` |
| `WHILE?` | While loop | `WHILE? i < 10:` |
| `FOR!` | For loop | `FOR! i = 1 TO 10:` |
| `TO` | FOR loop range | `FOR! i = 1 TO 10:` |
| `STEP` | FOR loop step | `FOR! i = 0 TO 20 STEP 5:` |
| `RETURN` | Return value | `RETURN a + b` |
| `BREAK` | Exit loop | `BREAK` |
| `CONTINUE` | Skip iteration | `CONTINUE` |
| `TRY!` | Try block | `TRY!` |
| `CATCH!` | Catch block | `CATCH! err:` |
| `FINALLY!` | Finally block | `FINALLY!` |
| `ENDTRY!` | End try block | `ENDTRY!` |
| `THROW` | Throw exception | `THROW("error")` |
| `AND` | Logical AND | `IF? a AND b:` |
| `OR` | Logical OR | `IF? a OR b:` |
| `NOT` | Logical NOT | `IF? NOT done:` |
| `TRUE` | Boolean true | `LET x = TRUE` |
| `FALSE` | Boolean false | `LET x = FALSE` |
| `NULL` | Null value | `IF? x == NULL:` |
| `IMPORT` | Import module | `IMPORT "std/math.nbs"` |
| `GO!` | Launch goroutine | `GO! name()` |
| `CHAN!` | Create channel | `CHAN!(16)` |
| `SEND!` | Send to channel | `SEND! ch, val` |
| `RECV!` | Receive from channel | `RECV!(ch)` |
| `SELECT!` | Select on channels | `SELECT!` |
| `MUTEX!` | Create mutex | `MUTEX!(m)` |
| `LOCK!` | Lock mutex | `LOCK!(m)` |
| `UNLOCK!` | Unlock mutex | `UNLOCK!(m)` |
| `YIELD!` | Yield to scheduler | `YIELD!` |
| `SLEEP!` | Sleep | `SLEEP!(ms)` |

## Types

| Type | Description | Example |
|------|-------------|---------|
| Int | 64-bit signed integer | `42`, `-7` |
| String | UTF-8 text | `"hello"` |
| Bool | Boolean | `TRUE`, `FALSE` |
| Array | Dynamic list | `[1, 2, 3]` |
| Null | Absence of value | `NULL` |
| Func | Function reference | `FUNC! name():` |
| Channel | Buffered channel | `CHAN!(16)` |
| Mutex | Mutual-exclusion lock | `MUTEX!(m)` |

> **Floats, maps (`{"k": v}`) and closures / first-class functions are planned
> (v4) but not yet in the language.**

## Syntax

### Variable Declaration
```
LET x = 10
LET name = "Nebulara"
LET arr = [1, 2, 3]
x = 20               # reassignment (no LET)
```

### Function Definition
```
FUNC! add(a, b):
  RETURN a + b
END!

FUNC! greet(name):
  PRINT "Hello " + name
END!

FUNC! noArgs():
  PRINT "no parameters"
END!
```

### Function Call
```
PRINT add(3, 4)        # prints 7
greet("World")          # prints "Hello World"
```

### Control Flow

#### If/Else
```
IF? x > 10:
  PRINT "big"
ELSEIF? x > 5:
  PRINT "medium"
ELSE:
  PRINT "small"
END!
```

#### While Loop
```
LET i = 1
WHILE? i <= 5:
  PRINT i
  i = i + 1
END!
```

#### For Loop
```
FOR! i = 1 TO 5:
  PRINT i
END!

# With STEP
FOR! i = 0 TO 20 STEP 5:
  PRINT i
END!
```

#### Try/Catch/Throw
```
TRY!
  LET x = TO_NUMBER("not a number")
CATCH! err:
  PRINT "Error: " + err
FINALLY!
  PRINT "always runs"
ENDTRY!
```

`THROW(expr)` raises an exception with a value (typically a string). If no
`TRY!` block is active, the program terminates with an uncaught exception
error. `FINALLY!` is optional and always runs.

### Constants

`CONST` declares an immutable value. Reassigning a constant is a compile-time
error.

```
CONST PI = 314
PRINT PI
# PI = 4   # error: cannot reassign constant
```

### Modules & Import

`IMPORT "path.nbs"` loads and executes another source file in the same
namespace, making its functions available. Imports are deduplicated (each path
is loaded once).

```
IMPORT "std/math.nbs"
PRINT min(8, 3)   # 3
```

### Concurrency

Nebulara's VM provides cooperative concurrency with goroutines, channels and
mutexes (single-threaded, non-preemptive scheduler). Wait-groups (`WAIT!`)
have token/opcode support but no parser yet — v4.

```
LET ch = CHAN!(16)
GO! writer()
LET msg = RECV!(ch)
SEND! ch, "data"
```

### Operators

#### Arithmetic
```
+   # addition / string concatenation
-   # subtraction
*   # multiplication
/   # division
%   # modulo
-   # unary negation
```

#### Bitwise
```
&   # bitwise AND: 5 & 3 → 1
|   # bitwise OR:  5 | 3 → 7
<<  # left shift:  1 << 3 → 8
>>  # right shift:  8 >> 2 → 2
```

#### Comparison
```
==  # equal
!=  # not equal
<   # less than
>   # greater than
<=  # less or equal
>=  # greater or equal
```

#### Logical
```
AND  # logical and
OR   # logical or
NOT  # logical not
```

#### String
```
+   # concatenation: "hello" + " " + "world" → "hello world"
```

### Arrays
```
LET arr = [10, 20, 30]
PRINT arr[0]         # 10
arr[1] = 99          # mutation: arr is now [10, 99, 30]
PRINT LEN(arr)       # 3
```

Arrays support index-based assignment (`arr[i] = value`) to mutate elements in place.

### Built-in Functions

#### Output & Input

| Function | Signature | Description |
|----------|-----------|-------------|
| `PRINT` | `PRINT(value)` | Print value to stdout with newline. Accepts any type. |

#### String Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `LEN` | `LEN(value)` | Returns the length of a string (byte count) or array (element count). Returns `0` for other types. |
| `TYPEOF` | `TYPEOF(value)` | Returns the type name as a string: `"int"`, `"string"`, `"bool"`, `"array"`, `"null"`, `"func"` |
| `TO_STRING` | `TO_STRING(value)` | Convert value to its string representation. |
| `TO_NUMBER` | `TO_NUMBER(value)` | Parse a string as an integer (`atoll`). Returns `0` for non-parseable strings. Returns the value unchanged if already an int. |
| `CHAR_AT` | `CHAR_AT(str, index)` | Returns the single-character string at `index`. Returns `NULL` if index is out of bounds. |
| `SUBSTR` | `SUBSTR(str, start, length)` | Returns a substring starting at `start` for `length` characters. Clamps to string bounds. |
| `TRIM` | `TRIM(str)` | Removes leading and trailing whitespace (spaces, tabs, newlines, carriage returns). |
| `TO_UPPER` | `TO_UPPER(str)` | Returns an uppercase copy of the string. Returns `""` for non-strings. |
| `TO_LOWER` | `TO_LOWER(str)` | Returns a lowercase copy of the string. Returns `""` for non-strings. |
| `CHAR` | `CHAR(code)` | Convert an integer code point to a single-character string. |
| `ORD` | `ORD(char)` | Convert the first character of a string to its integer code point. Returns `0` for empty strings. |

#### Math Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `ABS` | `ABS(n)` | Absolute value. Returns `0` for non-integers. |
| `MIN` | `MIN(a, b)` | Returns the smaller of two integers. |
| `MAX` | `MAX(a, b)` | Returns the larger of two integers. |
| `SQRT` | `SQRT(n)` | Integer square root (truncated). |
| `POW` | `POW(base, exp)` | Integer power: `base` raised to `exp`. |
| `FLOOR` | `FLOOR(n)` | Floor (no-op on integers, passes value through). |
| `CEIL` | `CEIL(n)` | Ceiling (no-op on integers, passes value through). |
| `ROUND` | `ROUND(n)` | Round (no-op on integers, passes value through). |
| `RANDOM` | `RANDOM()` | Returns a random integer from `0` to `99`. |

#### Array Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `PUSH` | `PUSH(arr, value)` | Appends `value` to the end of `arr`. Returns the modified array. |
| `POP` | `POP(arr)` | Removes and returns the last element. Returns `NULL` if the array is empty. |

#### System Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `TIME` | `TIME()` | Returns the current epoch time in seconds. |
| `SLEEP` | `SLEEP(ms)` | Sleeps for `ms` milliseconds. |
| `READ_FILE` | `READ_FILE(path)` | Reads and returns the entire contents of a file as a string. Returns `NULL` if the file cannot be opened. |
| `WRITE_FILE` | `WRITE_FILE(path, content)` | Writes `content` to the file at `path`. Returns `TRUE` on success, `FALSE` on failure. |

#### Program Argument Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `ARGUMENT_COUNT` | `ARGUMENT_COUNT()` | Returns the number of command-line arguments passed to the program. |
| `ARGUMENT` | `ARGUMENT(i)` | Returns the `i`-th command-line argument as a string. |

#### FFI (C Interop)

| Function | Signature | Description |
|----------|-----------|-------------|
| `FFI_LOAD` | `FFI_LOAD(name, path)` | Loads a shared library (`name` for lookup, `path` to the DLL/so). |
| `FFI_REGISTER` | `FFI_REGISTER(lib, sym, retType, nArgs)` | Registers a function from a loaded library. `retType` codes: `0`=void, `1`=int, `2`=float, `3`=double, `4`=string, `5`=pointer. |
| `FFI_CALL` | `FFI_CALL(lib, sym, args...)` | Calls a registered foreign function. |

> **Note:** `CONST PI = 314` is a valid declaration; the value `314` (not `3.14`)
> reflects that Nebulara uses 64-bit integers, not floats (floats are planned).

## Example Programs

### Factorial
```
FUNC! factorial(n):
  IF? n <= 1:
    RETURN 1
  END!
  RETURN n * factorial(n - 1)
END!

PRINT factorial(5)    # 120
PRINT factorial(10)   # 3628800
```

### Array Mutation
```
LET arr = [1, 2, 3]
PUSH(arr, 4)
# PRINT arr prints "[array 4]" (element count), not the element list
arr[0] = 99
PRINT arr             # [array 3]
PRINT POP(arr)        # 3
```

### Try/Catch/Throw
```
TRY!
  LET result = TO_NUMBER("not a number")
  IF? result == 0:
    THROW("parse failed")
  END!
CATCH! err:
  PRINT err
ENDTRY!
```
