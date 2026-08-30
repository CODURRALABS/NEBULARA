# Chapter 13 — The Knowledge Graph

> Book: *Beyond the Bases* · Part IV — Inside the Engine

The **knowledge graph** is Nebulara's AI-native centerpiece: a machine-readable
map of a codebase — its entities and their relationships — designed to be
queried by AI and tooling, not just read by humans.

---

## What it is

`neb-knowledge` parses a project into a **graph of entities and relationships**:

```bash
neb-knowledge build .
```

Instead of just text, it produces structured knowledge:
- **Entities** — functions, variables, types, modules.
- **Relationships** — calls, defines, uses, contains.
- Nodes and edges a tool or an LLM can query.

Think of it as a searchable index of your program's *meaningful structure*,
not its syntax.

---

## The knowledge node (concept)

The C implementation models reusable **knowledge nodes**: typed chunks that can
be linked. A function `sum` becomes a node with attributes (parameters, return
type) and an edge "called by" linking to its callers. The
`nbs_knowledge_build.c` iterator walks `Node`s and builds the graph.

---

## Why "AI-native" matters here

Humans read code top-to-bottom and keep context in their heads. A knowledge
graph externalizes that context so automation can:

- **Answer questions** — "what calls `sum`?" is a graph query, not a grep.
- **Understand intent** — structure over tokens.
- **Support AI tooling** — an LLM gets the actual structure, reducing
  guesswork from reading raw text.

The gaps between *what the docs promise* (full semantic graph + mapping) and
*what runs* (the builder walks nodes) are honest places to verify against the
binary — as everywhere in Nebulara.

---

## How it connects to the rest

- The **parser** produces the AST; the knowledge builder turns that AST into
  *nodes and links*.
- The **semantic analyzer** types those nodes.
- The result is a graph you can reason over — bridging "code" and "machine
  understanding."

This is what makes Nebulara's pitch "designed for AI" concrete: the structure
is a first-class output, not an afterthought.

---

## Practical use

- **Automated documentation** — generate descriptions of functions/modules
  from the graph.
- **Impact analysis** — find everything that depends on a change.
- **AI assistance** — give a model the graph instead of a wall of source.

Use `neb-knowledge build .` in your repo and explore the structure it emits to
see your program as a graph.

---

## Honest scope note

As with other advanced tools, the roadmap is richer than the current binary.
The core value — parse structure into queryable entities/relationships — is
there; the planned deeper semantic mapping may lag. Probe with your build
(Chapter 14).

---

## Summary

- Knowledge graph = entities + relationships, machine-readable.
- `neb-knowledge build .` parses a project into it.
- Enables question-answering, impact analysis, and AI assistance.
- It's the AI-native reason for Nebulara's design.
- Verify depth of the feature against your build.

**Next:** [Chapter 14 — v4 Features & Doc Drift](14-roadmap.md)
