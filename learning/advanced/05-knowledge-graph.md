# Advanced 05 — Knowledge Graph & AI-native Features

One of Nebulara's differentiators is its **AI-native** design. The
`neb-knowledge` tool extracts and tracks **entities and relations** from
programs — a knowledge graph that AI agents and tooling can reason over.

---

## What it is

A knowledge graph is a set of:
- **Entities** — named things (functions, variables, builtins, concepts).
- **Relations** — connections between entities (function `X` calls function
  `Y`, variable `V` is of type `T`).

`neb-knowledge` builds this graph from Nebulara source, giving you a machine-
readable map of a codebase — not just its text, but its structure.

---

## Running it

```bash
neb-knowledge
```

The tool seeds known entities (like the `PRINT` builtin — "print to stdout")
and analyzes source to add functions/variables and their relationships.

---

## Why it matters (the "AI-native" pitch)

Traditional tooling indexes text. A knowledge graph captures **semantics**:
- An AI agent can answer "which functions call `save()`?" from the graph.
- Entities carry descriptions and importance, letting reasoning systems focus
  where it matters.
- It's designed for agent-assisted development — the language ships its own
  semantic index rather than relying on an external LSP.

This is the seed of the larger **PRIMORDIA** vision (a knowledge-rich runtime),
and the language positioning as "AI-native."

---

## Related native tooling

- `neb-semantic` — a **semantic analyzer**: scope-based type checking,
  undefined-variable detection, builtin arity checks. `neb-pipeline --check`
  surfaces these without running.
- `neb-codegen` — native x86/x64 instruction encoding (the "compile to machine
  code" frontier).
- The **META/provenance** direction (in v4 spec): code carrying structured
  metadata (`author`, `intent`, `risk`) that survives compilation — the basis
  for "no dark binaries."

---

## Honest scope note

As of the shipped binaries, the knowledge graph and semantic analyzer are
standalone tools with limited scope. They demonstrate the **concept** the
language is built around. The v4 spec (see `SPEC.md` and the PRIMORDIA project)
expands these into full provenance, round-trip decompilation, and an evolving
organism ecosystem. In the current release, treat them as early, illustrative
AI-native infrastructure rather than complete production features.
