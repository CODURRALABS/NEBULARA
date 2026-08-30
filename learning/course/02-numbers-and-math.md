# Lesson 02 — Numbers & Math

Nebulara's numbers are integers (64-bit signed). Let's learn the operators and
the math builtins.

---

## 1. Basic arithmetic

```nbs
PRINT 10 + 5          # 15
PRINT 10 - 5          # 5
PRINT 10 * 5          # 50
PRINT 10 / 3          # 3   (integer division!)
PRINT 10 % 3          # 1   (remainder)
PRINT -7              # -7  (unary negation)
```

**Important:** `/` is **integer division** — it truncates toward zero.
`10 / 3` is `3`, not `3.33`. There are no floats in the base interpreter.

---

## 2. Order of operations

Standard precedence applies: `*` `/` `%` bind tighter than `+` `-`, and
parentheses override:

```nbs
PRINT 10 + 5 * 2      # 20  (5*2 first)
PRINT (10 + 5) * 2    # 30  (parens first)
```

---

## 3. Working with variables

```nbs
LET a = 7
LET b = 3
PRINT a + b           # 10
PRINT a * b           # 21
PRINT a - b           # 4
PRINT a / b           # 2
```

Update-in-place (no special `+=` operator in this build — just write it out):
```nbs
LET n = 1
n = n + 5
PRINT n               # 6
```

---

## 4. Bitwise operators

```nbs
PRINT 5 & 3      # 1   (bitwise AND)
PRINT 5 | 3      # 7   (bitwise OR)
PRINT 1 << 3     # 8   (left shift)
PRINT 16 >> 2    # 4   (right shift)
```

These are less common but handy for flags and low-level work.

---

## 5. Math builtins

```nbs
PRINT ABS(-42)      # 42        absolute value
PRINT MIN(3, 9)     # 3         smaller
PRINT MAX(3, 9)     # 9         larger
PRINT SQRT(16)      # 4         integer sqrt
PRINT POW(2, 10)    # 1024      integer power
PRINT RANDOM()      # 0..99     random int
```

Let's break these down:

- `ABS(n)` — absolute value. `ABS(-5)` → `5`.
- `MIN(a, b)` / `MAX(a, b)` — choose the smaller/larger.
- `SQRT(n)` — square root, **truncated** to an integer. `SQRT(17)` → `4`.
- `POW(base, exp)` — `base` raised to `exp`.
- `RANDOM()` — a random integer from 0 to 99 (great for guessing games).

> `FLOOR`, `CEIL`, `ROUND` exist but are pass-throughs on integers — they only
> matter once floats arrive.

---

## 6. Comparing numbers (sneak preview)

Comparison produces a **bool** that you'll use with `IF?` next:

```nbs
PRINT 10 > 5      # true
PRINT 10 < 5      # false
PRINT 10 == 10    # true
PRINT 10 != 5     # true
PRINT 5 <= 5      # true
PRINT 5 >= 6      # false
```

> In source you write `TRUE` / `FALSE`, but `PRINT` renders them as lowercase
> `true` / `false`.

---

## Combined example — a small calculator's core

```nbs
LET a = 12
LET b = 8
PRINT a + b
PRINT a - b
PRINT a * b
PRINT a / b
PRINT a % b
PRINT POW(a, 2)
```

---

## Try it

1. Compute `SQRT(100)`, `POW(3, 3)`, `ABS(-7)`, `MAX(10, 20)`.
2. Write a program that prints the average of four numbers.

```nbs
PRINT (10 + 20 + 30 + 40) / 4    # 25
```

---

## Exercises

1. What is `PRINT 7 / 2`? Why?
2. Print the remainder of `17 % 5`.
3. Write a one-line program that prints the larger of `-3` and `4`.
4. Print `2` to the power of `8`.

### Answers
1. `3` — integer division truncates (3.5 → 3).
2. `2`
3. `PRINT MAX(-3, 4)   # 4`
4. `PRINT POW(2, 8)   # 256`

---

## Checkpoint
- Integer arithmetic, precedence, integer division. ✅
- Bitwise operators exist. ✅
- `ABS`, `MIN`, `MAX`, `SQRT`, `POW`, `RANDOM`. ✅

Next: **[Lesson 03 — Strings](03-strings.md)**
