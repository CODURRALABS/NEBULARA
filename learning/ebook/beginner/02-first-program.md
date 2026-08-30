# Chapter 2 — Your First Program

> Book: *Nebulara From Zero* · Part I — Foundations

You've already run a one-line program. Now let's understand what you were doing,
and meet the workhorse command of the language: `PRINT`.

---

## The anatomy of a program

A `.nbs` file is just a list of **statements**, one per line, executed in order
from top to bottom.

```nbs
PRINT "one"
PRINT "two"
PRINT "three"
```
Output:
```
one
two
three
```

The computer reads line 1, does it, reads line 2, does it, and so on. Order
matters.

---

## Comments: talking to humans

A line starting with `#` is a **comment**. The computer ignores it; people read
it. Use comments to explain *why* your code does something (not *what* — the
code shows that).

```nbs
# Greet the user
PRINT "Hello"
```

You can put a comment at the end of a line too:
```nbs
PRINT 42        # print a number
```

---

## `PRINT` — showing output

`PRINT` is how a program talks back to you. It shows a value on the screen,
followed by a new line.

You can print:
- text (strings): `PRINT "hi"`
- numbers: `PRINT 42`
- the results of calculations: `PRINT 10 + 5`
- variables (Chapter 4): `PRINT x`

```nbs
PRINT "Hello"
PRINT 123
PRINT 10 + 20
```
```
Hello
123
30
```

Note that `PRINT 10 + 20` prints `30` — the computer computes the sum first,
then prints it. A program can *work* on values and then show the result. That's
the essence of computing: values in, results out.

---

## Empty lines and blank prints

You can print an empty line with `PRINT ""` — useful for spacing output.

```nbs
PRINT "A"
PRINT ""
PRINT "B"
```
```
A

B
```

---

## Common mistakes (and fixes)

**I forgot the quotes.**
```nbs
PRINT hello        # BAD - thinks "hello" is a variable name
```
Fix: quote strings — `PRINT "hello"` — unless `hello` really is a variable.

**I used single quotes.**
```nbs
PRINT 'hello'      # BAD - Nebulara strings use double quotes
```
Fix: `PRINT "hello"`.

**I typed a keyword wrong.**
```nbs
Print "hello"      # BAD - keywords are uppercase
```
Fix: `PRINT "hello"`.

---

## A tiny program we can build on

```nbs
# A simple greeting machine
PRINT "What is your name?"
# (in the next chapters you'll store answers in variables)
PRINT "Nice to meet you!"
```

---

## Try it

1. Print your own name.
2. Print three numbers: 7, 8, and `7 + 8`.
3. Add a comment explaining what your program does.
4. Print two blank lines between two words.

---

## Chapter takeaways

- A program is statements run top to bottom.
- `#` makes a comment (ignored by the computer).
- `PRINT` shows a value + newline.
- The computer computes expressions before printing.
- Strings need double quotes.

**Next:** [Chapter 3 — Values and Types](03-values-and-types.md)
