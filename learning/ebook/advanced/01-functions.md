# Chapter 1 — Deep Dives into Functions

> Book: *Beyond the Bases* · Part I — Idiomatic Nebulara

You know the fundamentals of `FUNC!`. Now we push them: parameter passing,
recursion depth, scope and shadowing, and the direction the language is heading
(first-class functions).

---

## Parameters are passed by value

When you call `my_func(x)`, Nebulara copies the value of `x` into the
parameter. Changes inside the function do **not** affect the caller's variable:

```nbs
FUNC! bump(n):
    n = n + 1
    RETURN n
END!

LET v = 10
LET r = bump(v)
PRINT r      # 11
PRINT v      # 10   <- unchanged
```

One wrinkle: **arrays are reference-like**. Passing an array and mutating it
*with `PUSH`/`POP`/index assignment* affects the same underlying array visible
to the caller:

```nbs
FUNC! fill_ten(arr):
    PUSH(arr, 10)
END!

LET a = [1, 2]
fill_ten(a)
PRINT a      # [array 3]  (it now has 3 elements)
```

Know this distinction: values copy, arrays share. It's a common source of
"why did my array change?" confusion.

---

## `RETURN` exits immediately

`RETURN` not only hands back a value — it stops the rest of the function. This
lets you write early-return style flow:

```nbs
FUNC! first_word(s):
    LET i = 0
    WHILE? i < LEN(s):
        IF? CHAR_AT(s, i) == " ":
            RETURN SUBSTR(s, 0, i)
        END!
        i = i + 1
    END!
    RETURN s
END!

PRINT first_word("hello world")    # hello
PRINT first_word("hello")          # hello  (no space -> whole string)
```

Early returns keep functions flat and readable — no deep nesting of `ELSE`.

---

## Scope and shadowing

Variables declared inside a function are **local**:

```nbs
FUNC! inner(x):
    LET n = x * 2
    RETURN n
END!

LET n = 5
PRINT inner(3)     # 6  (uses inner n)
PRINT n            # 5  (outer n untouched)
```

The inner `n` *shadows* the outer one inside the function. Shadowing is legal
but can confuse — prefer distinct names unless you intend the reuse.

---

## Recursion: think in base cases

Recursion (a function calling itself) is elegant when a problem has a natural
"smaller version of itself." The two rules:

1. **A base case** that returns without recursing.
2. **A recursive step** that moves toward the base case.

Fibonacci:
```nbs
FUNC! fib(n):
    IF? n <= 1:
        RETURN n
    END!
    RETURN fib(n - 1) + fib(n - 2)
END!

PRINT fib(10)    # 55
```

`fib` counts: `fib(2)=1`, `fib(3)=2`, `fib(4)=3`, `fib(5)=5`, ..., `fib(10)=55`.

Be aware of the **call-stack depth** — deep recursion (say tens of thousands
of frames) can exhaust the stack on the base interpreter. Prefer loops for
large linear iterations; use recursion where it reads best and stays shallow.

---

## Nested functions

Nebulara's source parses nested `FUNC!` blocks (a function defined inside a
function) toward the v4 closures feature. If the parser accepts it, the inner
function is available within the outer scope. But **don't rely on capturing
outer locals** — that's the closures feature, which isn't in the shipped
interpreter yet (see Chapter 14).

---

## Closures: the roadmap

The v4 spec describes **first-class functions and closures** — passing a
function as a value, returning a function, and having it capture its
environment:

```nbs
# v4-only, NOT in the base interpreter yet:
FUNC! make_adder(n):
    RETURN FUNC! (x):
        RETURN x + n
    END!
END!
```

Until it lands, you **cannot** store a function in a variable or return one.
Work around it with explicit data + a dispatch (Chapter 3) or generic
functions that take flags.

---

## Idiomatic function patterns

**1. Pure helpers** (no side effects, same input → same output):
```nbs
FUNC! double(n): RETURN n * 2 END!
```

**2. Guarded readers** (never return null):
```nbs
FUNC! load(name, fallback):
    LET raw = READ_FILE(name)
    IF? raw:
        RETURN raw
    END!
    RETURN fallback
END!
```

**3. Accumulators**:
```nbs
FUNC! sum(arr):
    LET t = 0
    LET i = 0
    WHILE? i < LEN(arr):
        t = t + arr[i]
        i = i + 1
    END!
    RETURN t
END!
```

**4. One purpose each.** If a function does two things, split it.

---

## Summary

- Values copy; arrays share.
- Early `RETURN` flattens logic.
- Local variables shadow outer ones inside a function.
- Recursion needs a base case; mind the stack depth.
- Closures/first-class functions are v4, not in the base interpreter.
- Favor small pure functions you can reason about.

**Next:** [Chapter 2 — Advanced Data](02-data.md)
