# 04 — ARCHITECTURE: The Five-Layer Design (ARD)

Status: DRAFT v0.1

---

## 1. The Stack

```
┌─────────────────────────────────────────────────────────┐
│ L5  EDEN — THE BIOSPHERE                                │
│     Organisms · genomes · fitness telemetry             │
│     reproduction/mutation · extinction · fossil record  │
├─────────────────────────────────────────────────────────┤
│ L4  VORTEX — ASSEMBLY RUNTIME                           │
│     Capability registry · goal intake                   │
│     moment-machine spawn/feed/dissolve                  │
│     promotion pipeline (machine → organism)             │
├─────────────────────────────────────────────────────────┤
│ L3  INTENT SHELL                                        │
│     goal REPL · machine inspector                       │
│     breeding console                                    │
├─────────────────────────────────────────────────────────┤
│ L2  NEBULARA v4 TOOLCHAIN                               │
│     Lexer → Parser → PRIM-IR ⇄ source projection        │
│     Bytecode compiler · VM (checkpoint/resume)          │
│     provenance store · decompiler renderer              │
├─────────────────────────────────────────────────────────┤
│ L1  PRIMORDIA CORE                                      │
│     Stage 0–3: C++ runtime kernel (hosted)              │
│     memory arenas · capabilities · audit log            │
│     Stage 4+: microkernel proper (bare metal)           │
└─────────────────────────────────────────────────────────┘
```

Rule: each layer may only call the layer directly beneath. No skips.

## 2. Component Map (repo ↔ architecture)

| Repo path | Layer | Contents |
|---|---|---|
| `src/core/` | L1 | arena allocator, capability tokens, audit log, scheduler primitives |
| `src/nebulara/` | L2 | lexer, parser, ir, vm, builtins, provenance |
| `src/vortex/` | L4 | registry, planner interface, lifecycle engine |
| `src/eden/` *(stage 3+)* | L5 | genome format, telemetry, mutators, extinction |
| `lang/` | L2 | spec, conformance tests, examples corpus |
| `archive/` | L5 | fossil record storage format & samples |

## 3. Data Contracts

### 3.1 Capability Token (L1)
```
CapToken {
  id        : u64          // unforgeable, kernel-minted
  grants    : bitset       // FS_READ, FS_WRITE, NET, SPAWN, META_READ ...
  scope     : path/prefix  // e.g. /home/user/project/**
  issued_to : machine-id   // single holder; non-transferable by default
  expiry    : opt(time)
}
```
Every builtin that touches the world requires a CapToken argument.
Machines inherit only capabilities their parent explicitly passes down.

### 3.2 Moment-Machine Manifest (L4)
```
MachineManifest {
  goal_id      : uuid
  cells        : [ CellBinding ]      // capability + entrypoint + budget
  metabolism   : { token_budget, wall_clock_budget, mem_ceiling }
  lineage      : opt(genome-ref)      // set when promoted to organism
  fossils_link : opt(fossil-id)       // lessons from predecessors
}
```

### 3.3 Organism Genome (L5) — sketch, formalized at Stage 3
```
Genome {
  behavior   : Nebulara source or .nbsc ref   // what it does
  params     : Map<String, Value>             // tunable strategy knobs
  memory_seed: initial knowledge/state blob
  meta       { lineage: [parent-ids], generation: u64, birth: time }
}
```

### 3.4 Fossil Record entry (L5)
```
Fossil {
  genome     : final genome
  epitaph    : cause (starved · dissolved · outcompeted · human-veto)
  stats      : lifetime usage, success rate, peak reach
  lessons    : structured diff vs parents ("what changed, what happened")
}
```

## 4. Core Lifecycles

### 4.1 Moment-Machine lifecycle
```
GOAL → PLAN(registry ∩ capabilities) → SPAWN(arena)
  → RUN(feed on metabolism) → { SERVED → DISSOLVE(arena drop + fossil-lite)
                             → RECURRENCE detected → PROMOTE → ORGANISM }
```

### 4.2 Organism lifecycle
```
BORN(promotion or import) → LIVE(serves users, accrues fitness)
  → REPRODUCE(fork+mutate when fitness high)
  → COMPETE(sibling variants share niche)
  → EXTINCT(starve/outcompeted/veto) → FOSSILIZE(lessons extracted)
```

## 5. Key Flows

### Flow A — "goal in, machine out"
1. User types intent in Shell (L3)
2. Vortex (L4) queries Capability Registry, drafts MachineManifest
3. Cells are Nebulara closures or registered native tools (L2/L1)
4. Spawn with metabolism budgets; user watches via `machines` command
5. On dissolve: manifest + outcome appended to machine history

### Flow B — transparency (no dark binaries)
1. Any `.nbsc` encountered → read provenance header (IR version, META)
2. Decompile = load embedded IR → render through source projection
3. Diff rendered source against any prior version instantly

## 6. Determinism & Replay

Evolution demands reproducibility:
- VM execution is deterministic modulo explicit `RANDOM(seed)` and FFI
- Every machine run logs seed + inputs ⇒ full replay possible
- Fossil "lessons" are computed by replaying divergent lineages side-by-side

## 7. Failure & Recovery

- Machine crash → checkpoint resume (VM-level state snapshots)
- Arena leak → hard ceiling kill + fossil marked `epitaph: resource-death`
- Registry corruption → rebuild by re-scanning; organisms unaffected (genomes self-contained)

## 8. What We Deliberately Do NOT Architect Yet

- SMP scheduling (single-threaded correctness first)
- GUI compositor (shell-first doctrine)
- Networking between machines' biospheres (local pond before ocean)
- Bare-metal boot details (deferred until Stage 4 entry review)
