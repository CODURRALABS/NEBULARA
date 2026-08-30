# Advanced 06 — FFI: Calling C

Nebulara's **Foreign Function Interface** lets Nebulara call functions in C
libraries (DLLs on Windows, shared objects on Linux/mac). This is the escape
hatch that gives Nebulara access to the entire C ecosystem.

---

## The three FFI builtins

```nbs
FFI_LOAD(name, path)                              # load a C library under a name
FFI_REGISTER(lib, symbol, returnType, argCount)   # declare a function
FFI_CALL(lib, symbol, args...)                    # call the function
```

Flow:
1. **Load** a library and give it an internal `name`.
2. **Register** the C function you want: its library name, symbol name, return
   type code, and argument count.
3. **Call** it, passing args.

---

## Example (Windows, msvcrt)

```nbs
FFI_LOAD("msvcrt", "msvcrt.dll")
FFI_REGISTER("msvcrt", "abs", 1, 1)   # return=int(1), 1 argument
PRINT FFI_CALL("msvcrt", "abs", -42)  # 42
```

- `FFI_LOAD("msvcrt", "msvcrt.dll")` — load the C runtime.
- `FFI_REGISTER("msvcrt", "abs", 1, 1)` — the `1` is an FFI return-type code
  (int), and `1` is the number of args.
- `FFI_CALL(...)` invokes it.

---

## Return type codes

The FFI layer distinguishes C signatures. In the demo code, types include:
`VOID, INT, FLOAT, DOUBLE, STRING, POINTER`. The integer you pass to
`FFI_REGISTER` selects the return type. **These codes and the argument mapping
are platform/ABI-specific** — check `Compiler/nbs-bootstrap.c` (the `NbsFFIType`
enum) for the exact values on your platform before relying on them.

---

## On Linux / macOS

The mechanism is the same but libraries are `.so` / `.dylib` files, and the
loader uses `dlopen`. Paths and symbol names differ.

---

## When you'd use FFI

- Call a performant C library (math, crypto, image processing).
- Talk to OS APIs not exposed by Nebulara builtins.
- Reuse battle-tested C code instead of reimplementing it.

---

## Gotchas

- **Verify each step.** Loading/registering errors print to stderr; incorrect
  codes silently produce 0 or wrong results.
- **Types must match.** Passing the wrong argument count or type is undefined
  behavior (no safety net). Match the C signature exactly.
- **Platform-specific.** The return-code enum differs by build. Read the source
  before writing production FFI code.
- **Check the standalone tool.** `neb-ffi.exe <lib> <symbol> [args...]` is a
  quick way to test whether a symbol is callable before you bother wiring it
  into a script.