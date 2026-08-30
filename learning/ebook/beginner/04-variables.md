# Chapter 4 — Variables

> Book: *Nebulara From Zero* · Part I — Foundations

A variable is a **named box** that holds a value. Instead of retyping `42`
everywhere, you store it once and refer to the name. Nebulara has two ways to
create a box: `LET` (changeable) and `CONST` (fixed).

---

## `LET` — a changeable variable

```nbs
LET age = 25
PRINT age        # 25

age = 26         # change it
PRINT age        # 26
```

A few things to notice:
- `LET` appears **once**, on first declaration.
- To change the value later, just write the name and `=` — **no `LET`**.
- `=` assigns a value; it's not "equals" in the math sense but "put this in".

---

## `CONST` — a constant

Some values shouldn't change. Use `CONST` for those:

```nbs
CONST PI = 3     # an integer approximation of pi
PRINT PI         # 3
```

`CONST` communicates "this stays fixed" — good for things like limits, rates,
and configuration that shouldn't be modified by your code.

---

## Variables hold any type

A variable can hold any value, and you can reassign it to a different type:

```nbs
LET message = "hello"     # string
message = "world"         # still a string
LET n = 10                # int
n = "ten"                 # now a string (Nebulara is dynamically typed)
```

Nebulara is **dynamically typed**: a variable isn't locked to one type. Be
careful, though — changing types can surprise you. Prefer keeping a variable's
type consistent.

---

## Naming rules and style

- Names use letters, digits, and `_`.
- They can't start with a digit.
- Avoid keywords (`PRINT`, `LET`, `IF?`, ...) as names.

Common style:
- Variables: `snake_case` — `user_age`, `total_score`.
- Constants: `UPPER_CASE` — `MAX_ITEMS`, `SECONDS_PER_MINUTE`.

```nbs
LET user_name = "Ayush"
LET high_score = 9000
CONST MAX_LEVEL = 99
```

---

## Using variables in expressions

Variables behave exactly like the values they hold, anywhere a value is allowed:

```nbs
LET a = 10
LET b = 5
PRINT a + b        # 15
PRINT a * b        # 50
PRINT "a is " + a  # a is 10
```

---

## Updating a variable (common pattern)

A recurring pattern is *read the variable, compute, store back*:

```nbs
LET score = 100
score = score + 50
PRINT score        # 150
```

`score = score + 50` means: "take the current score (100), add 50, and store
the result (150) back into score."

---

## Full example

```nbs
# Budget calculator
CONST TAX_RATE = 10
LET income = 2000
LET tax = income / TAX_RATE       # 200  (integer division!)
LET after_tax = income - tax
PRINT "Income: " + income
PRINT "After tax: " + after_tax
```
```
Income: 2000
After tax: 1800
```

*(Note: `income / TAX_RATE` is integer division — Chapter 5 explains this.)*

---

## Try it

1. Declare `LET name` and `LET age`, print a sentence using both.
2. Declare a `CONST` for days-per-week and use it in a calculation.
3. Start a counter at `0`, add `10` three times, print it.

```nbs
LET counter = 0
counter = counter + 10
counter = counter + 10
counter = counter + 10
PRINT counter     # 30
```

---

## Chapter takeaways

- `LET` declares a changeable variable; reassign without `LET`.
- `CONST` declares a fixed value.
- Variables can hold any type (dynamic typing).
- Names: `snake_case` (vars), `UPPER_CASE` (constants).
- `x = x + 1` is the "update" pattern.

**Next:** [Chapter 5 — Numbers and Math](05-numbers-and-math.md)
