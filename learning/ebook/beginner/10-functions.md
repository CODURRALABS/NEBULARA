# Chapter 10 — Functions

> Book: *Nebulara From Zero* · Part III — Structuring Programs

Repeating code makes programs long and fragile. **Functions** let you name a
block of logic, reuse it, and give it inputs and outputs. They're the building
block of any real program.

---

## The problem functions solve

Imagine you need to double a number in ten places. You *could* write
`n * 2` each time. But if the logic grows (double and add tax), you'd have to
edit ten places. A function writes it **once** and calls it everywhere.

---

## Defining and calling

```nbs
FUNC! greet():
    PRINT "Hello!"
END!

greet()
greet()
```
```
Hello!
Hello!
```

- `FUNC!` starts the definition; `END!` ends it.
- A function with **no pieces** needs no parameter list, but keep the `()`.
- Calling is just the name with `()`.

---

## Parameters: inputs

Give a function data to work with:

```nbs
FUNC! greet(name):
    PRINT "Hello, " + name
END!

greet("Ayush")
greet("Sam")
```
```
Hello, Ayush
Hello, Sam
```

Multiple parameters, comma-separated:
```nbs
FUNC! add(a, b):
    RETURN a + b
END!

PRINT add(3, 4)     # 7
PRINT add(10, 20)   # 30
```

---

## `RETURN`: sending a result out

So far functions only printed. Use `RETURN` to hand a value *back* to the
caller, so it can be used in expressions:

```nbs
FUNC! square(n):
    RETURN n * n
END!

PRINT square(5)     # 25
LET x = square(3)   # 9
PRINT square(square(2))   # 16   (functions compose!)
```

`RETURN` also **stops the function** immediately:

```nbs
FUNC! classify(n):
    IF? n < 0:
        RETURN "negative"
    END!
    RETURN "non-negative"
END!

PRINT classify(-5)    # negative
PRINT classify(5)     # non-negative
```

---

## Functions without `RETURN`

If there's no `RETURN`, the function just runs and finishes:

```nbs
FUNC! show(msg):
    PRINT TO_UPPER(msg)
END!

show("wow")
```
```
WOW
```

---

## Using a function's result

Because a function call *is* a value, use it anywhere a value fits:

```nbs
FUNC! triple(n):
    RETURN n * 3
END!

PRINT triple(4) + 1     # 13
```

---

## Combining functions

Build big behavior from small pieces:

```nbs
FUNC! double(n):
    RETURN n * 2
END!

FUNC! add_tax(n):
    RETURN n + n / 10
END!

PRINT add_tax(double(100))    # 220
```

---

## A helper to sum arrays

Recall the accumulator from Chapter 9 — wrap it in a reusable function:

```nbs
FUNC! sum(arr):
    LET total = 0
    LET i = 0
    WHILE? i < LEN(arr):
        total = total + arr[i]
        i = i + 1
    END!
    RETURN total
END!

PRINT sum([1, 2, 3, 4])    # 10
```

Now you can sum any array without rewriting the loop.

---

## Recursion: a function calling itself

A function can call itself — this is **recursion**. A classic example,
factorial (`5! = 5 × 4 × 3 × 2 × 1 = 120`):

```nbs
FUNC! factorial(n):
    IF? n <= 1:
        RETURN 1
    END!
    RETURN n * factorial(n - 1)
END!

PRINT factorial(5)    # 120
```

`factorial(n)` breaks into `n × factorial(n-1)`, backing down to `factorial(1)`
which returns `1`. Recursion is elegant once you get it — but always ensure a
**base case** (like `n <= 1`) so it eventually stops.

---

## Scope: variables inside are local

Variables you create inside a function belong to that function. They don't
leak out, and the function doesn't see your outer variables by default. Keep
helper state inside helpers.

---

## Try it

1. Write `greet(name)` and call it.
2. Write `is_even(n)` returning a bool (`n % 2 == 0`).
3. Write `repeat_word(w, n)` that returns `w` repeated `n` times.
4. Write `factorial` and print `factorial(6)` (expect 720).

---

## Chapter takeaways

- `FUNC!` / `END!` define a reusable block.
- Parameters are inputs; `RETURN` sends a value back (and stops the function).
- Function calls are values — use them in expressions.
- Compose small functions; use recursion with a base case.
- Variables inside are local.

**Next:** [Chapter 11 — Handling Errors](11-errors.md)
