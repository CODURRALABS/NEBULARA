# Lesson 01 — Values & Variables

Now that you can print, let's give your program memory. Nebulara has six value
types and two ways to name a value.

---

## 1. The six types

```nbs
# int        - whole numbers (64-bit signed)
LET a = 42

# string     - text in double quotes
LET b = "hello"

# bool       - TRUE or FALSE
LET c = TRUE

# null       - "no value"
LET d = NULL

# array      - an ordered list (next lessons)
LET e = [1, 2, 3]

# func       - a function value (lesson 07)
```

There's no `float` in the base interpreter — numbers are integers. (Floats are
planned in Nebulara v4 / the PRIMORDIA project, not the core here.)

---

## 2. `LET` — a mutable variable

`LET` declares a variable you can change later:

```nbs
LET x = 10
PRINT x          # 10

x = 20           # reassign WITHOUT LET
PRINT x          # 20
```

Key rule: **`LET` only on first declaration.** After that, just write the name.

---

## 3. `CONST` — a constant

`CONST` declares a value that should not change:

```nbs
CONST PI = 314    # (integer approximation)
PRINT PI          # 314
```

Use `CONST` for values that are fixed by nature or config. It communicates
"this never changes" to anyone reading your code.

---

## 4. `TYPEOF` — ask what something is

```nbs
PRINT TYPEOF(42)         # int
PRINT TYPEOF("hi")       # string
PRINT TYPEOF(TRUE)       # bool
PRINT TYPEOF(NULL)       # null
PRINT TYPEOF([1,2,3])    # array
```

`TYPEOF` returns the type name as a string. It's a great debugging tool.

---

## 5. `TO_STRING` & `TO_NUMBER` — converting

```nbs
PRINT TO_STRING(42)      # "42"  (the string "42")
PRINT TO_NUMBER("99")    # 99    (the int 99)
PRINT TO_STRING("keep")  # keep  (strings pass through)
PRINT TO_NUMBER(5)       # 5     (ints pass through)
```

These let you move between text and numbers — essential for reading input and
writing output.

---

## 6. Naming rules

- Names can contain letters, digits, and `_`.
- They cannot start with a digit.
- Avoid uppercase keywords like `PRINT`, `IF?` as names.
- By convention, use lowercase/`snake_case` for variables and `UPPER_CASE`
  for `CONST` values.

```nbs
LET user_name = "ayush"
LET user2 = "ok"
LET _temp = 10       # leading underscore ok
```

---

## Full example

```nbs
LET greeting = "Hello"
LET count = 5
CONST MAX_ITEMS = 100

PRINT greeting        # Hello
PRINT count           # 5
PRINT MAX_ITEMS       # 100

count = count + 1
PRINT count           # 6
```

---

## Try it

1. Declare three variables: a name, an age, a bool.
2. Print all three.
3. Change the age and print again.

```nbs
LET name = "Sam"
LET age = 27
LET active = TRUE
PRINT name
PRINT age
PRINT active
age = 28
PRINT age
```

---

## Exercises

1. What's printed?
```nbs
LET x = 1
x = x + 2
PRINT x
```
2. Write a program that prints `TYPEOF` results for a string and a bool.
3. Convert the string `"123"` to a number, add `1`, print the result.

### Answers
1. `3`
2.
```nbs
PRINT TYPEOF("hi")     # string
PRINT TYPEOF(TRUE)     # bool
```
3.
```nbs
PRINT TO_NUMBER("123") + 1    # 124
```

---

## Checkpoint
- You know the six types. ✅
- `LET` = changeable, `CONST` = fixed. ✅
- You can use `TYPEOF`, `TO_STRING`, `TO_NUMBER`. ✅

Next: **[Lesson 02 — Numbers & Math](02-numbers-and-math.md)**
