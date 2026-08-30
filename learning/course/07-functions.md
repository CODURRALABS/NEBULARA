# Lesson 07 — Functions

Functions bundle logic so you can reuse it. Nebulara functions use
`FUNC! ... END!` and can take parameters and `RETURN` values.

---

## 1. Defining and calling

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

Pattern:
```nbs
FUNC! name(params):
    <body>
END!
```

---

## 2. Parameters

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

Multiple parameters:
```nbs
FUNC! add(a, b):
    RETURN a + b
END!

PRINT add(3, 4)     # 7
PRINT add(10, 20)   # 30
```

---

## 3. `RETURN` — send a value back

```nbs
FUNC! square(n):
    RETURN n * n
END!

PRINT square(5)     # 25
PRINT square(square(2))   # 16  (functions compose)
```

`RETURN` also **exits** the function immediately:
```nbs
FUNC! classify(n):
    IF? n < 0:
        RETURN "negative"
    END!
    RETURN "non-negative"
END!

PRINT classify(-5)     # negative
PRINT classify(5)      # non-negative
```

---

## 4. Function with no `RETURN`

If a function has no `RETURN`, it finishes after the body:

```nbs
FUNC! shout(msg):
    PRINT TO_UPPER(msg)
END!

shout("wow")
```
```
WOW
```

---

## 5. Calling inside expressions

Function calls are values — use them anywhere a value fits:

```nbs
FUNC! triple(n):
    RETURN n * 3
END!

LET x = triple(4)
PRINT x                  # 12
PRINT triple(5) + 1      # 16
```

---

## 6. Helpers and composition

Compose small functions to build bigger ones:

```nbs
FUNC! double(n):
    RETURN n * 2
END!

FUNC! add_one(n):
    RETURN n + 1
END!

PRINT add_one(double(10))    # 21  (double first, then +1)
```

---

## 7. Using a helper to sum an array

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

---

## 8. A note on scope

Variables declared **inside** a function are local to it. The function's
parameters are local too. (Advanced closure support arrives in Nebulara v4 —
for now, keep helper state inside helpers.)

---

## Full example — factorial

```nbs
FUNC! factorial(n):
    IF? n <= 1:
        RETURN 1
    END!
    RETURN n * factorial(n - 1)
END!

PRINT factorial(5)    # 120
PRINT factorial(10)   # 3628800
```

This is **recursion** — a function calling itself. It's a classic milestone.

---

## Try it

1. Write `FUNC! greet(name)` and call it with your own name.
2. Write a `max3(a, b, c)` returning the largest of three numbers (use `MAX`).

```nbs
FUNC! max3(a, b, c):
    RETURN MAX(MAX(a, b), c)
END!
PRINT max3(3, 9, 5)    # 9
```

---

## Exercises

1. Write `FUNC! is_even(n)` returning a bool (`n % 2 == 0`).
2. Write `FUNC! repeat_word(w, n)` that returns `w` repeated `n` times (loop + string concat).
3. Write a recursive `countdown(n)` that prints `n..1` then `"Blast off!"`.

### Answers
1.
```nbs
FUNC! is_even(n):
    RETURN n % 2 == 0
END!
PRINT is_even(4)   # TRUE
PRINT is_even(7)   # FALSE
```
2.
```nbs
FUNC! repeat_word(w, n):
    LET result = ""
    LET i = 0
    WHILE? i < n:
        result = result + w
        i = i + 1
    END!
    RETURN result
END!
PRINT repeat_word("ha", 3)    # hahaha
```
3.
```nbs
FUNC! countdown(n):
    IF? n <= 0:
        PRINT "Blast off!"
        RETURN
    END!
    PRINT n
    countdown(n - 1)
END!
countdown(3)
```

---

## Checkpoint
- `FUNC!`/`END!`, parameters, calls. ✅
- `RETURN` values and early exit. ✅
- Functions compose and can recurse. ✅

Next: **[Lesson 08 — Exceptions](08-exceptions.md)**
