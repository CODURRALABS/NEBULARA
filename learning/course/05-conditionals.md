# Lesson 05 — Conditionals

Programs make decisions. Nebulara uses `IF?`/`ELSEIF?`/`ELSE` blocks closed with
`END!`.

---

## 1. A single `IF?`

```nbs
LET age = 20
IF? age >= 18:
    PRINT "adult"
END!
```
```
adult
```

Pattern:
```nbs
IF? <condition>:
    <body>
END!
```
- The condition goes after `IF?`.
- A **colon** `:` ends the condition line.
- The body is indented (indentation is a style convention, not required).
- `END!` closes the block.

---

## 2. `IF? ... ELSE`

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

---

## 3. `ELSEIF?` for multiple cases

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

---

## 4. Comparison operators

```nbs
==    equal
!=    not equal
<     less than
>     greater than
<=    less or equal
>=    greater or equal
```

```nbs
PRINT 10 == 10     # TRUE
PRINT 3 != 4       # TRUE
PRINT 5 > 9        # FALSE
```

---

## 5. Logical words — `AND` `OR` `NOT`

Note: these are **words**, not symbols like `&&`/`||`/`!`:

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

```nbs
LET a = TRUE
LET b = FALSE
PRINT a AND b      # false
PRINT a OR b       # true
PRINT NOT a        # false
```

> `TRUE`/`FALSE` are the literal words you type; `PRINT` output shows them
> lowercase (`true`/`false`). Both refer to the same booleans.

---

## 6. Truthiness & `NULL`

In conditions, values are "truthy" or "falsy":
- Falsy: `NULL`, `0`, `FALSE`, empty string `""`, empty array `[]`
- Truthy: everything else (any non-zero int, non-empty string, non-empty array, `TRUE`)

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

---

## 7. Full example — a small grade / status checker

```nbs
LET age = 17
LET has_id = TRUE

IF? age >= 18 AND has_id:
    PRINT "Entry allowed"
ELSEIF? age >= 18:
    PRINT "Need an ID to enter"
ELSE:
    PRINT "Too young to enter"
END!
```
```
Too young to enter
```

---

## Try it

Write a program that:
1. Sets a temperature.
2. Prints `"hot"` if > 30, `"cold"` if < 10, `"mild"` otherwise.

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

---

## Exercises

1. Write `IF?` that prints `"positive"`, `"negative"`, or `"zero"` for a number.
2. Using `AND`, check that a number is between 10 and 20 (inclusive).
3. What prints?
```nbs
LET x = 0
IF? x:
    PRINT "yes"
ELSE:
    PRINT "no"
END!
```

### Answers
1.
```nbs
LET n = -5
IF? n > 0:
    PRINT "positive"
ELSEIF? n < 0:
    PRINT "negative"
ELSE:
    PRINT "zero"
END!
```
2.
```nbs
LET n = 15
IF? n >= 10 AND n <= 20:
    PRINT "in range"
END!
```
3. `"no"` — `0` is falsy.

---

## Checkpoint
- `IF?`/`ELSEIF?`/`ELSE` with `END!`. ✅
- Comparison operators and logical `AND`/`OR`/`NOT` words. ✅
- Truthiness rules. ✅

Next: **[Lesson 06 — Loops](06-loops.md)**
