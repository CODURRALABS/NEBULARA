# Chapter 1 — What Is Nebulara?

> Book: *Nebulara From Zero* · Part I — Foundations

Before you write a single line, it helps to understand *what* you're about to
use and *why* it exists. This chapter is about the big picture. Don't worry if
some of it isn't fully clear yet — it will be by Chapter 14.

---

## A programming language, in plain words

A programming language is a way of giving a computer exact instructions. You
write text; the computer reads it and does what it says. Nebulara is one such
language. You write a **program** in a file ending in `.nbs`, and a tool called
an **interpreter** runs it.

```
your program (words)  ──►  interpreter  ──►  results
```

---

## What makes Nebulara different

Nebulara describes itself as an **AI-native universal programming language**.
Three ideas in that phrase:

1. **AI-native** — it's designed to be reasoned about by automation and AI
   tooling, not just humans. It ships features like a *knowledge graph* that
   maps the structure of code.

2. **Universal** — one language can run as a native program, or be turned into
   JavaScript or Python, or call C libraries directly. You write once and reach
   many runtimes.

3. **A language** — at its core, it's a simple, readable language with English
   keywords like `LET`, `FUNC!`, and `PRINT`.

You won't use all of that today. The point is context: Nebulara is built to be
both human-friendly *and* machine-friendly.

---

## The readable style

Nebulara keywords are **uppercase words** — that's intentional and a bit rare:

```nbs
PRINT "Hello"     # prints Hello
```

```nbs
LET x = 10        # remember the number 10 as x
```

Some keywords carry a small symbol:
- `IF?` — ends with a **question mark** (it asks a question).
- `FUNC!` / `END!` — end with an **exclamation mark** (they are commands).

You'll internalize this style quickly. It makes keywords pop out of your code,
so a person (or an AI) can scan it.

---

## How a program runs (briefly)

Under the hood your `.nbs` file goes through four stages (you'll meet these in
the advanced book):

```
text  ─►  tokens  ─►  a tree  ─►  bytecode  ─►  output
```

Don't memorize this. Just know: the computer doesn't read your file "as English"
— it breaks it into pieces, understands the structure, and follows the
instructions. The interpreter does all of this automatically when you run a file.

---

## Getting the interpreter

You need one executable. There are a few ways to get it:

- **Pre-built binary** — the repo's `Compiler/nebulara.exe` (Windows) is the
  newest and best match to the current source.
- **Build from source** — if you have `gcc`:
  ```
  gcc -static -O2 Compiler/nbs-bootstrap.c -o nebulara -lm
  ```
- **Package via npm / pip** — `npm install -g nebulara`, or the Python
  `nebulara` package, each hint an interpreter.

> **Which binary matters.** This repo ships a couple of interpreter builds that
> differ slightly. We recommend the **newest** one (`Compiler/nebulara.exe` on
> Windows). Throughout this book, "run nebulara on a file" means use your
> interpreter the same way on every example; the examples are verified against
> the current build.

---

## Before you continue

Type this into a file named `first.nbs`:

```nbs
PRINT "Hello, Nebulara!"
```

Run it:
```bash
nebulara first.nbs
```

You should see:
```
Hello, Nebulara!
```

That's the whole loop you'll use all book long: **write, save, run, read the
output.**

---

## Chapter takeaways

- A language is a way to give the computer exact instructions.
- Nebulara is readable (uppercase keywords) and AI-native/universal.
- You write `.nbs` files and run them with an interpreter.
- The interpreter has four internal stages; you don't need them yet.

**Next:** [Chapter 2 — Your First Program](02-first-program.md)
