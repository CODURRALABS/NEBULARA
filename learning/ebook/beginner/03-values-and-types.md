# Chapter 3 — Values and Types

> Book: *Nebulara From Zero* · Part I — Foundations

Everything a program handles is a **value**. Nebulara has a handful of value
**types**, and it's worth getting comfortable with them because everything else
builds on this.

---

## What is a type?

A type describes *what kind of thing* a value is and what you can do with it.
You can't meaningfully multiply `"hello"` by a number, but you can add two
numbers. The type tells the language (and you) what's allowed.

Nebulara's main types:

| Type | Example | What it is |
|------|---------|------------|
| Int | `42`, `-7`, `0` | a whole number |
| String | `"hello"`, `""` | text in double quotes |
| Bool | `TRUE`, `FALSE` | true or false |
| Null | `NULL` | "no value" |
| Array | `[1, 2, 3]` | an ordered list |

(Functions are values too, but they get their own chapter.)

---

## Int — whole numbers

An int is a 64-bit signed whole number — that's a huge range of positive and
negative values.

```nbs
PRINT 42
PRINT -7
PRINT 0
```

There's **no float** (decimal) type in the core interpreter. `3.14` isn't
supported yet. Numbers are integers. (Floats are on the roadmap in the v4 spec,
but not in the base runs you'll do here.)

---

## String — text

A string is a sequence of characters inside **double quotes**.

```nbs
PRINT "hello"
PRINT "the quick brown fox"
PRINT ""          # an empty string
```

---

## Bool — true or false

A bool has exactly two values: `TRUE` or `FALSE`. You'll use them with
decisions (Chapter 8).

```nbs
PRINT TRUE
PRINT FALSE
```

When printed, they show as lowercase:
```
true
false
```
In your *source code* you type them uppercase: `TRUE`, `FALSE`.

---

## Null — no value

`NULL` means "no value" or "nothing here". It's often what a function returns
when there's nothing to give you. For example, reading a file that doesn't
exist (Chapter 12) gives you `NULL`. You'll check for it.

---

## Asking a value what it is: `TYPEOF`

Nebulara has a builtin `TYPEOF` that tells you a value's type as a string:

```nbs
PRINT TYPEOF(42)          # int
PRINT TYPEOF("hi")        # string
PRINT TYPEOF(TRUE)        # bool
PRINT TYPEOF(NULL)        # null
PRINT TYPEOF([1, 2, 3])   # array
```

`TYPEOF` is one of your best debugging friends: "what exactly do I have here?"

---

## Converting between types

Two useful builtins:

- `TO_STRING(x)` — turn a value into its string form.
- `TO_NUMBER(s)` — turn a string that looks like a number into an int.

```nbs
PRINT TO_STRING(42)         # the string "42"
PRINT TO_NUMBER("99") + 1   # 100   (converted, then added)
PRINT TO_NUMBER("abc")      # 0     (couldn't parse)
```

Notice `TO_NUMBER("abc")` returns `0`, not an error. This is Nebulara's style:
functions return a **sentinel** (`0`, `NULL`, `FALSE`) when they can't do the
job, and *you* check for it (Chapter 11).

---

## Strings and numbers in one line

When you combine a string with a number using `+`, Nebulara converts the number
to a string automatically:

```nbs
PRINT "I have " + 5 + " apples"     # I have 5 apples
```

This is really handy for building readable output.

---

## Try it

1. Print the `TYPEOF` of: an int, a string, a bool, null, an array.
2. Convert `"123"` to a number and add `100` to it.
3. Build the message `"Score: "` joined with the number `42`.

---

## Chapter takeaways

- Values have types: Int, String, Bool, Null, Array.
- Ints are whole numbers; there's no float in the base interpreter.
- Strings use double quotes; bools are `TRUE`/`FALSE` printed as `true`/`false`.
- `TYPEOF` tells you a value's type.
- `TO_STRING` / `TO_NUMBER` convert; `+` auto-converts numbers in strings.
- Functions return `0` / `NULL` / `FALSE` when they can't do something.

**Next:** [Chapter 4 — Variables](04-variables.md)
