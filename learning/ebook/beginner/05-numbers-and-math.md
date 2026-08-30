# Chapter 5 — Numbers and Math

> Book: *Nebulara From Zero* · Part II — The Language Spine

Now we work with numbers for real: arithmetic, the tricky bits of integer
division, and the math helpers Nebulara provides.

---

## The four operations

```nbs
PRINT 10 + 5     # 15   addition
PRINT 10 - 5     # 5    subtraction
PRINT 10 * 5     # 50   multiplication
PRINT 10 / 3     # 3    division
```

And remainder (modulo):
```nbs
PRINT 10 % 3     # 1   the remainder of 10 divided by 3
```

---

## Integer division: the important bit

Here's the thing that trips people up. `10 / 3` prints `3`, not `3.33`.

Nebulara counts numbers as **integers**, so division **truncates** — it throws
away the fractional part and keeps the whole part.

```nbs
PRINT 7 / 2    # 3     (3.5 -> 3)
PRINT 9 / 4    # 2     (2.25 -> 2)
```

If you need the remainder too, use `%`:
```nbs
PRINT 7 / 2    # 3
PRINT 7 % 2    # 1
```
Together, `7 / 2` and `7 % 2` fully describe "7 divided by 2": it's 3, remainder 1.

---

## Order of operations

Nebulara follows standard math precedence: `*`, `/`, `%` bind tighter than
`+`, `-`, and parentheses override everything.

```nbs
PRINT 10 + 5 * 2       # 20   (5*2 = 10, then +10)
PRINT (10 + 5) * 2     # 30   (parentheses first)
```

When in doubt, **add parentheses** — they make your intent obvious and prevent
mistakes.

---

## Negative numbers

Use the unary minus to make a negative:
```nbs
PRINT -7        # -7
PRINT 5 - 10    # -5
```

---

## Math helpers

Nebulara gives you useful builtins for common math:

```nbs
PRINT ABS(-42)     # 42    absolute value
PRINT MIN(3, 9)    # 3     the smaller of two
PRINT MAX(3, 9)    # 9     the larger of two
PRINT SQRT(16)     # 4     square root (as an int)
PRINT POW(2, 10)   # 1024  2 to the power 10
PRINT RANDOM()     # 0..99 a random int
```

A few notes:
- `SQRT(16)` is `4`; `SQRT(17)` is `4` too (truncated).
- `POW(base, exp)` — power, always an int.
- `RANDOM()` is great for games and tests (0 up to 99).

`FLOOR`, `CEIL`, `ROUND` also exist but simply pass ints through unchanged —
they matter only when floats arrive in a future version.

---

## Bitwise operators (a bonus)

Nebulara supports bit-level operations. If you don't need them yet, skim:

```nbs
PRINT 5 & 3     # 1   AND
PRINT 5 | 3     # 7   OR
PRINT 1 << 3    # 8   shift left
PRINT 16 >> 2   # 4   shift right
```

These act on the binary representation of numbers — handy for flags and
low-level work.

---

## Comparing numbers

Comparison gives you a **bool** (`TRUE`/`FALSE`), which you'll use for
decisions in Chapter 8:

```nbs
PRINT 10 > 5       # true
PRINT 10 < 5       # false
PRINT 10 == 10     # true     (equal — note the double =)
PRINT 10 != 5      # true     (not equal)
PRINT 5 <= 5       # true
PRINT 5 >= 6       # false
```

Remember: `==` means "is equal to"; a single `=` means "assign" (Chapter 4).

---

## A practical example — a tip calculator

```nbs
LET bill = 100
LET tip_percent = 15
LET tip = bill * tip_percent / 100
LET total = bill + tip
PRINT "Tip: " + tip
PRINT "Total: " + total
```
```
Tip: 15
Total: 115
```

`100 * 15 / 100` → `1500 / 100` → `15`. Order matters here; do the
multiplication before the division to avoid rounding loss.

---

## Try it

1. Print the results of `17 / 3` and `17 % 3`.
2. Fix the precedence: write `(8 + 2) * 3` and see it's `30`.
3. Print `SQRT(100)`, `POW(3, 3)`, `ABS(-8)`, `MAX(10, 2)`.

---

## Chapter takeaways

- Operators: `+ - * / %`; `/` is **integer division** (truncates).
- Precedence: `* / %` before `+ -`; use parentheses to be clear.
- Helpers: `ABS`, `MIN`, `MAX`, `SQRT`, `POW`, `RANDOM`.
- Comparison (`==`, `<`, `>`, ...) yields a bool.
- `==` (compare) vs `=` (assign) are different.

**Next:** [Chapter 6 — Strings](06-strings.md)
