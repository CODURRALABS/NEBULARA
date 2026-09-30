# 02 — PRD: Product Requirements Document

Product: **PRIMORDIA — The Living Operating System**
Status: DRAFT v0.1 · Owner: CODURRA Labs & Technologies

---

## 1. Problem Statements

| # | Problem | Who suffers |
|---|---|---|
| P1 | Software is installed and permanent even when useless; maintenance debt compounds | Every computer user |
| P2 | Achieving one goal requires manually stitching 3–10 tools; the stitching is invisible, unrecorded labor | Knowledge workers, developers |
| P3 | AI agents are fragile guests on hostile host OSes: no persistence guarantees, no native security, no ecosystem | Agent builders |
| P4 | Binaries are opaque; users cannot verify what software actually does | Security-conscious users, researchers |
| P5 | Tool ecosystems are curated by marketing and lock-in, not by proven usefulness | Everyone |

## 2. Product Pillars

1. **GROW, DON'T SHIP** — software enters existence through assembly (moment-machines) and earns permanence through use (organisms)
2. **TRANSPARENT BY CONSTRUCTION** — source ⇄ IR ⇄ binary round-trip; decompilation is rendering, not reverse-engineering
3. **GOALS IN, MACHINES OUT** — the primary interface is intent, not procedure
4. **THE BIOSPHERE DECIDES** — fitness = real usage; extinction is normal and healthy

## 3. Target Users

| Persona | Need | Stage introduced |
|---|---|---|
| **The Builder** (early adopter, tinkerer) | A transparent stack they can fully understand and bend | Stage 1–2 |
| **The Automator** | Goals fulfilled without gluing SaaS tools together | Stage 3 |
| **The Researcher** | A living lab for open-ended evolution, prompt genetics, agent ecologies | Stage 4 |
| **The Sovereign User** | Security, anonymity, zero dark binaries on their machine | Stage 4–5 |

## 4. Functional Requirements

### FR-1 Native Language (Nebulara v4)
- FR-1.1: Run `.nbs` source directly (immediate mode, no build step)
- FR-1.2: Support floats (F64), maps/records, closures/first-class functions
- FR-1.3: `META` blocks attach provenance to any definition
- FR-1.4: Compile to bytecode (`.nbsc`) and back: IR round-trip guarantee
- FR-1.5: FFI escape hatch to C during bootstrap era
- FR-1.6: Full v3 backward compatibility (existing programs run unchanged)

### FR-2 Vortex Runtime
- FR-2.1: Capability registry — enumerate/index available functions & tools
- FR-2.2: Goal intake → machine plan → live moment-machine spawn
- FR-2.3: Lifecycle engine: watch, feed, starve, dissolve machines
- FR-2.4: Machine fossil record: every dead machine's lesson is queryable

### FR-3 Eden Biosphere
- FR-3.1: Organism genome format (behavior + params + memory seeds)
- FR-3.2: Fitness telemetry from real usage (retention, success rate, reach)
- FR-3.3: Reproduction: fork + mutation operators (incl. LLM semantic mutation)
- FR-3.4: Extinction pipeline with fossilization
- FR-3.5: Lineage browser: every organism's ancestry viewable

### FR-4 Primordia Shell
- FR-4.1: Intent-first REPL: speak goals in natural language or Nebulara
- FR-4.2: Inspect running moment-machines (what exists, why, feeding on what)
- FR-4.3: Breed/discard organisms manually when desired

### FR-5 Kernel (Stage ≥ 4)
- FR-5.1: Microkernel: memory, capability-guarded scheduling, IPC
- FR-5.2: Every process is a sandboxed organism by default
- FR-5.3: Audit trail at syscall granularity (forensics mode)

## 5. Non-Goals (Explicitly Out)

- Running Windows/Linux applications natively
- Being a general-purpose desktop for gamers/content creation (initially)
- Distributed/multi-machine systems before single-machine excellence
- GUI-first experience (shell-first; GUI arrives late)
- Competing on benchmark speed with mature compilers (yet)

## 6. Success Metrics

| Milestone metric | Target |
|---|---|
| Nebulara v4 test suite pass rate | 100% of spec examples |
| IR round-trip fidelity | ≥ 99% semantic preservation on corpus |
| First self-hosted organ | transpiler rewritten in Nebulara |
| First sustained biosphere run | 50 organisms, ≥ 10 generations, extinctions observed |
| Speciation event | documented emergence of distinct organism populations |
| Self-compilation | Nebulara compiles Nebulara |

## 7. Risks & Countermeasures

| Risk | Countermeasure |
|---|---|
| Kernel trench (years before value) | Staged ladder: each stage ships usable artifacts |
| Evolution layer produces garbage | Metabolism/starvation prunes hard; human veto always available |
| Scope explosion vs "one mind" principle | DECISIONS.md gate: any addition must fit whole-stack comprehension rule |
| Single-builder burnout | Stages sized in weeks-not-months; celebrate stage exits |

## 8. Release Definition

- **v0.1 "Seed"**: Nebulara v4 interpreter + round-trip decompiler demo (Stage 1 exit)
- **v0.2 "Spark"**: Vortex assembles first real machines from a local registry (Stage 3 partial)
- **v0.3 "Pond"**: Eden runs multi-generation biosphere (Stage 4 partial)
- **v1.0 "Primordia"**: boots its own compiled toolchain; self-hosting achieved (Stage 5)
