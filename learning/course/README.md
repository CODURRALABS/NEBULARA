# Nebulara — Full Course

A structured, learn-by-doing course. Work through the lessons **in order** —
each builds on the last. Every example is a real, runnable `.nbs` file.

**Prerequisites:** none. If you can type code and run a command, you're ready.

---

## The course map

| # | Lesson | You learn |
|---|--------|-----------|
| 00 | [Setup & Hello World](00-setup-and-hello.md) | Install, run your first program |
| 01 | [Values & Variables](01-values-and-variables.md) | Types, `LET`/`CONST`, `PRINT`, `TYPEOF` |
| 02 | [Numbers & Math](02-numbers-and-math.md) | arithmetic, integer division, math builtins |
| 03 | [Strings](03-strings.md) | concatenation, all string functions |
| 04 | [Arrays](04-arrays.md) | literals, indexing, mutation, `PUSH`/`POP`/`LEN` |
| 05 | [Conditionals](05-conditionals.md) | `IF?`/`ELSEIF?`/`ELSE`, logical words |
| 06 | [Loops](06-loops.md) | `WHILE?`, `FOR!`, `BREAK`, `CONTINUE` |
| 07 | [Functions](07-functions.md) | `FUNC!`, parameters, `RETURN`, scope |
| 08 | [Exceptions](08-exceptions.md) | `TRY`/`CATCH`/`THROW`/`FINALLY` |
| 09 | [Files & System](09-files-and-system.md) | `READ_FILE`, `WRITE_FILE`, `TIME`, FFI |
| 10 | [Standard Library & Modules](10-stdlib-and-modules.md) | `std/`, `USE`, recommended modules |
| 11 | [Putting It Together](11-project.md) | Build a small real program end to end |

---

## How each lesson is structured
- **Concept** — what you're learning and why.
- **Code** — runnable example(s).
- **Try it** — modify the code yourself.
- **Exercises** — small problems (answers at the end of each lesson).
- **Checkpoint** — you have completed this if you can answer the questions.

---

## Running examples
Save any code block as `lesson.nbs`, then from the repo root:
```bash
nebulara lesson.nbs
# or
neb-cli run lesson.nbs
```

Every example in this course passes through `nebulara` (the verified
interpreter). If you use the `neb` wrapper instead, the same commands work.

Go ahead — start with **[Lesson 00: Setup & Hello World](00-setup-and-hello.md)**.
