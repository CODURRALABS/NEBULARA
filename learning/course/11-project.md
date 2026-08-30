# Lesson 11 — Putting It Together

You've learned the whole core language. Now let's build a real, useful program
end to end — a **number-guessing game** with files, functions, loops, and
conditionals. This lesson ties everything together.

---

## The goal

A game where the computer picks a number 0–99, the player guesses, and the
program says "too low" / "too high" until the player gets it. On win, it logs
the result to a file and shows how many guesses it took.

---

## Step 1 — the core loop

Since the shipped binary doesn't expose `ARGUMENT()` (see Lesson 09), let's
make the game read its guess from small input files — which also gives you a
hands-on file workflow:

```nbs
# guess comes from guess.txt
LET guess = TO_NUMBER(TRIM(READ_FILE("guess.txt")))
LET target = RANDOM()        # 0..99
LET tries = 1

WHILE? guess != target:
    IF? guess < target:
        PRINT "Too low!"
    ELSE:
        PRINT "Too high!"
    END!
    PRINT "Try again (edit guess.txt, rerun): "
    guess = TO_NUMBER(TRIM(READ_FILE("guess.txt")))
    tries = tries + 1
END!

PRINT "You got it in " + tries + " tries!"
```

Create `guess.txt` containing a number. Run `nebulara game.nbs`, edit
`guess.txt` with a new guess, rerun, and keep going until you match `target`.
This demonstrates args-style input via files plus loops and conditionals.

> Alternatively, hard-code a guess for a one-shot demo:
> `LET guess = 50` and run — the loop still shows you the hint logic.

---

## Step 2 — wrap it in a function

Cleaner: put the game logic in a function.

```nbs
FUNC! play(guess):
    RETURN TRUE
END!
```

Actually, let's make the whole game a function that takes the guess and returns
a hint:

```nbs
FUNC! hint(guess, target):
    IF? guess < target:
        RETURN "Too low!"
    END!
    IF? guess > target:
        RETURN "Too high!"
    END!
    RETURN "Correct!"
END!

LET target = RANDOM()
LET g = TO_NUMBER(TRIM(READ_FILE("guess.txt")))
PRINT hint(g, target)
```

---

## Step 3 — log results to a file

Let's persist the outcome so repeat runs accumulate a history:

```nbs
FUNC! log_result(tries, outcome):
    LET prev = READ_FILE("game.log")
    IF? prev == NULL:
        prev = ""
    END!
    WRITE_FILE("game.log", prev + "tries=" + tries + " outcome=" + outcome + "\n")
END!
```

---

## Step 4 — the full program

```nbs
# guessing game that guesses against a fixed target per run,
# then appends the result to game.log

FUNC! hint(guess, target):
    IF? guess < target:
        RETURN "Too low!"
    END!
    IF? guess > target:
        RETURN "Too high!"
    END!
    RETURN "Correct!"
END!

FUNC! log_result(tries, outcome):
    LET prev = READ_FILE("game.log")
    IF? prev == NULL:
        prev = ""
    END!
    WRITE_FILE("game.log", prev + "tries=" + tries + " outcome=" + outcome + "\n")
END!

LET target = RANDOM()
LET g = TO_NUMBER(TRIM(READ_FILE("guess.txt")))

LET result = hint(g, target)
PRINT result

IF? result == "Correct!":
    log_result(1, "win")
ELSE:
    log_result(1, "miss")
END!
```

Run it a few times:
```bash
nebulara game.nbs 10
nebulara game.nbs 50
cat game.log
```

---

## Step 5 — make it genuinely playable: read input via file

Since this build doesn't have an interactive `READ` line, here's a robust
pattern: put your guess in an input file, run, and check the hint.

`guess.txt`:
```
73
```

```nbs
LET target = 60          # fixed target for a demo
LET g = TO_NUMBER(TRIM(READ_FILE("guess.txt")))
PRINT hint(g, target)
```
Change the value in `guess.txt` and re-run — instant "too high/too low".

For a *truly* interactive REPL experience, use `neb-cli repl` (see the
[REPL guide](../guides/repl.md)).

---

## Review — what you used

- `RANDOM()` — Lesson 02 (math)
- `LET`, `CONST` — Lesson 01 (variables)
- `IF?`/`ELSEIF?`/`ELSE` — Lesson 05 (conditionals)
- `WHILE?` — Lesson 06 (loops)
- `FUNC!`/`RETURN` — Lesson 07 (functions)
- `READ_FILE`/`WRITE_FILE` — Lesson 09 (files)
- `TO_NUMBER`, `TRIM` — Lessons 01 & 03 (conversion/strings)
- file-based input for the "guess" — Lessons 09–10 (system/files)

You've now written a program that combines everything the course taught. 🎉

---

## Your turn — final project

Build a **word counter**:
1. Read a text file (or use `README.md`).
2. Count the words (split on spaces / newlines).
3. Print the total.
4. Log the count to `count.log` with a timestamp (`TIME()`).

**Hint:** iterate the string, count spaces + newlines, add 1. Or read line by
line into an array if your build supports it.

---

## Checkpoint — you made it

You can now:
- Run `.nbs` files and understand every layer of a program ✅
- Use all core types, control flow, functions, and exceptions ✅
- Read/write files and interact with the system ✅
- Use and read the standard library ✅
- Combine everything into a working program ✅

**Next steps:** branch out:
- [The Handbook](../handbook/README.md) — complete reference when you need it.
- [The Cookbook](../cookbook/README.md) — task-based recipes.
- [Advanced Guides](../advanced/README.md) — the engine under the hood.
- [The E-Books](../ebook/README.md) — long-form reads of the same material
  (*From Zero* for beginners, *Beyond the Bases* for advanced).

Congratulations, Nebulara developer.
