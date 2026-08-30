# Chapter 8 — Making Decisions

> Book: *Nebulara From Zero* · Part II — The Language Spine

A program that always does the same thing is limited. **Conditionals** let it
choose — "if this is true, do one thing; otherwise, do another."

Nebulara's decision keyword is `IF?` — the question mark is a hint that it asks
a yes/no question.

---

## The basic `IF?`

```nbs
LET age = 20
IF? age >= 18:
    PRINT "adult"
END!
```
```
adult
```

Anatomy:
- `IF?` followed by a condition (which is `TRUE` or `FALSE`).
- A **colon** `:` ends the condition line.
- The body is indented by convention.
- `END!` closes the block.

If the condition is `FALSE`, the body is skipped.

---

## `IF?` with `ELSE`

`ELSE` runs when the condition is `FALSE`:

```nbs
LET n = 3
IF? n % 2 == 0:
    PRINT "even"
ELSE:
    PRINT "odd"
END!
```
```
odd
```
Only one branch runs — never both.

---

## `ELSEIF?` for several cases

Chain as many as you need:

```nbs
LET score = 85
IF? score >= 90:
    PRINT "A"
ELSEIF? score >= 80:
    PRINT "B"
ELSEIF? score >= 70:
    PRINT "C"
ELSE:
    PRINT "F"
END!
```
```
B
```
The first condition that's true wins; the rest are skipped.

---

## Conditions: comparisons

These produce `TRUE`/`FALSE`:

```nbs
==   equal        !=   not equal
<    less than    >    greater than
<=   at most      >=   at least
```

```nbs
IF? 10 == 10:  PRINT "equal"  END!
IF? 3 != 4:    PRINT "diff"   END!
IF? 5 > 9:     PRINT "big"    END!   # false -> skipped
```

---

## Combining conditions: `AND`, `OR`, `NOT`

Nebulara uses **words** for logic (not symbols like `&&`):

```nbs
IF? age >= 18 AND registered:
    PRINT "can vote"
END!

IF? temp > 30 OR raining:
    PRINT "stay in"
END!

IF? NOT is_deleted:
    PRINT "still here"
END!
```

- `A AND B` — true only if **both** are true.
- `A OR B` — true if **either** is true.
- `NOT A` — flips a bool.

```nbs
PRINT TRUE AND FALSE    # false
PRINT TRUE OR FALSE     # true
PRINT NOT TRUE          # false
```

---

## What counts as true: truthiness

Many values can act like a bool in an `IF?`. In Nebulara:
- **Falsy:** `NULL`, `0`, `FALSE`, empty string `""`, empty array `[]`.
- **Truthy:** everything else (non-zero numbers, non-empty strings/arrays).

```nbs
LET maybe = NULL
IF? maybe:
    PRINT "has value"
ELSE:
    PRINT "no value"
END!
```
```
no value
```
This is handy: `IF? data:` is shorthand for "if data is not null/empty."

---

## A practical example — a temperature message

```nbs
LET temp = 35
IF? temp > 30:
    PRINT "hot"
ELSEIF? temp < 10:
    PRINT "cold"
ELSE:
    PRINT "mild"
END!
```
```
hot
```

---

## Try it

1. Write an `IF?` that prints whether a number is positive, negative, or zero.
2. Use `AND` to check if a number is between 10 and 20 (inclusive).
3. Use `NOT` with a `TRUE` value. What prints?

---

## Chapter takeaways

- `IF?` / `ELSEIF?` / `ELSE` decide which code runs; `END!` closes the block.
- Comparisons (`==`, `<`, `>`, ...) yield bools.
- Logic words `AND`, `OR`, `NOT`.
- Truthiness: `0`, `NULL`, `FALSE`, empty = falsy; everything else truthy.

**Next:** [Chapter 9 — Repeating Work](09-loops.md)
