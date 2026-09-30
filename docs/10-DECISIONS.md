# 10 — DECISIONS: Architecture Decision Records

Format: each ADR = context → decision → consequences. Append-only.
The "one-mind" rule (07-ROADMAP §Standing Rules) is enforced here.

---

## ADR-0001 — Project name: PRIMORDIA
- **Context:** needed a name for the living OS; candidates included Vortex (taken for runtime layer), Eden (biosphere layer).
- **Decision:** PRIMORDIA — the primordial soup from which software life emerges. Layer names keep their meanings: Nebulara (language), Vortex (assembly runtime), Eden (biosphere).
- **Consequences:** repo/folder naming fixed; docs updated.

## ADR-0002 — Bootstrap host language: C++17
- **Context:** Stage 0–1 needs a host. Candidates: C (matches existing nbs-bootstrap.c muscle memory, zero ceremony) vs C++17 (maps/strings/closures free while Nebulara lacks them) vs Rust/Zig (safety/modernity but new toolchains and slower iteration for a single builder).
- **Decision:** C++17, written with C-subset discipline where possible; MinGW-w64 on Windows first.
- **Consequences:** fastest path to Stage 1; C++ dependency is scheduled for extinction via the bootstrap ladder (ADR-0005 mapping rule). Revisit only if borrow-checker-class bugs appear in VM core.

## ADR-0003 — Microkernel over monolithic
- **Context:** kernel architecture at Stage 4+.
- **Decision:** microkernel. Memory + capabilities + scheduling in kernel; everything else (drivers, shells, biosphere) = sandboxed organisms.
- **Consequences:** aligns structurally with capability security; IPC performance becomes the eternal engineering concern.

## ADR-0004 — IR-as-truth / decompiler-first
- **Context:** "no dark binaries" promise needs an enforcement mechanism.
- **Decision:** PRIM-IR is normative; source is a projection. `.nbsc` embeds IR mandatorily; decompiler = renderer. Round-trip contract normative (LANG-SPEC §6).
- **Consequences:** binaries ~2× larger (acceptable); compiler and decompiler share one codebase by construction; format versioning discipline required forever.

## ADR-0005 — Zero external dependencies in core
- **Context:** supply-chain risk vs convenience.
- **Decision:** C++ standard library only until self-hosting; after that, Nebulara stdlib only. No Boost/vcpkg/npm deps in `src/core` or `src/nebulara`.
- **Consequences:** some wheels reinvented (hash maps exist in C++ anyway); builds reproducible anywhere with a compiler.

## ADR-0006 — Fitness = real usage telemetry, never ratings
- **Context:** Eden needs a selection pressure that resists gaming/marketing.
- **Decision:** fitness computed from measured retention, task success rate, reach across ponds. No stars, no downloads-count vanity, no curator list.
- **Consequences:** requires privacy-respecting local telemetry aggregation (opt-in sharing only); speciation more likely than in popularity-ranked stores.

## ADR-0007 — Register bytecode over stack bytecode
- **Context:** v3 used stack ops; provenance-friendly decoding and checkpoint/resume favor registers.
- **Decision:** register-based PRIM bytecode for v4.
- **Consequences:** slight interpreter complexity; much easier snapshotting (registers are finite state); better fit for future JIT.

## ADR-0008 — Determinism default, randomness injected
- **Context:** evolution experiments must replay exactly.
- **Decision:** VM is deterministic; all nondeterminism enters via explicit seeded RANDOM or FFI boundary, both logged per-run.
- **Consequences:** full run replay possible; debugging evolution becomes science, not archaeology.

---
*(append new ADRs below; never rewrite old ones)*
