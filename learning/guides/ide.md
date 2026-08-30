# Guide: IDE & Editor Tips

How to work productively with `.nbs` files in your editor, even without a
dedicated language server plugin.

---

## File type

`.nbs` files are **plain text**. Any editor works. For syntax coloring, either:
- Use the CLI: `neb-cli highlight file.nbs` (prints ANSI-colored).
- Or configure a hand-rolled highlighter (below).

---

## Make the language friendlier (universal tip)

Because Nebulara keywords are **distinctive uppercase words**, you can get
decent highlighting by teaching your editor a simple word-based highlighter:

- **Keywords** (operators/control flow): `LET CONST FUNC! END! IF? ELSEIF?
  ELSE WHILE? FOR! TO STEP RETURN BREAK CONTINUE TRUE FALSE NULL AND OR NOT`
- **Builtins** (callable words): `PRINT LEN TYPEOF TO_STRING TO_NUMBER RANDOM
  TIME TO_UPPER TO_LOWER CHAR_AT SUBSTR TRIM CHAR ORD ABS MIN MAX SQRT POW
  FLOOR CEIL ROUND PUSH POP READ_FILE WRITE_FILE FFI_LOAD FFI_REGISTER FFI_CALL`
- **Comments:** everything after `#`.
- **Strings:** double-quoted.

Most editors (VS Code, Vim, Emacs) can define a simple word list highlighter
with these categories.

---

## Practical editor setup per platform

**VS Code:**
- Create a `*.nbs` file association to a "plaintext" or custom grammar.
- Optionally use the community snippet files to autocomplete `IF?`/`END!`
  structure.

**Vim:**
```vim
:set syntax=none            " or a custom highlighting group
```
Better: add a minimal `ftplugin/nbs.vim` mapping the keyword list above.

**Any** editor: keep the [syntax cheat sheet](../cheat-sheets/syntax.md) open
until the keywords are muscle memory.

---

## Workflow tips

- **Save + run loop:** bind a key to run `nebulara <current-file>` for
  instant feedback. (Probing is faster this way.)
- **Match blocks:** since blocks open with `:` and close with `END!`, enable
  your editor's bracket/block matching where possible, or use consistent
  indentation to visually track nesting.
- **Probe in the REPL** for one-liners; save only confirmed code.

---

## Code navigation

- Functions are `FUNC! name`. Use your editor's outline/search on `FUNC! ` to
  jump between definitions.
- For a structured overview of a whole project, run
  `neb-knowledge build .` to see entities and relationships.

---

## Structure style that helps editors & humans

Prefer this block layout — it makes `END!` matching obvious:
```nbs
FUNC! f(n):
    IF? n > 0:
        RETURN n
    ELSE:
        RETURN 0
    END!
END!
```
Consistent indentation is your best tool for reading (and editing) nested
blocks.
