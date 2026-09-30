# 05 — RESEARCH: Foundations, Prior Art & Open Problems

Status: DRAFT v0.1

---

## 1. Direct Ancestry (the four DNA strands)

### 1.1 TempleOS (Terry Davis, 2005–2016)
- **What it proved:** one person can write a complete OS with own kernel, own
  JIT-compiled language (HolyC), own graphics — and that *immediacy* (type code,
  it runs now, ring-0 everywhere) creates a fundamentally different feel.
- **What we keep:** single-mind comprehensibility; JIT immediacy; the whole-OS-as-
  personal-cathedral spirit.
- **What we change:** no ring-0-for-everything (capability security instead);
  sustainable engineering practices; multi-user future.
- Key texts: templeos.org docs; interviews archived widely.

### 1.2 Arch Linux (Levente Polyak et al., philosophy since 2002)
- **What it proves:** users will build their own system if the core is honest
  ("simple" = understandable, not "easy").
- **What we keep:** minimal eternal core; user assembly of their world; rolling
  truth over frozen releases.
- **What we change:** Arch assembles from packages (static artifacts);
  Primordia assembles from living capabilities.

### 1.3 Parrot Security OS
- **What it keeps proving:** security/anonymity/forensics must be defaults, not add-ons.
- **What we keep:** sandbox-everything posture; forensic audit trails; anonymity modes.
- **What we change:** Parrot secures Linux's ambient-authority model with afterthoughts;
  Primordia's capability model makes confinement structural (see 09-SECURITY-MODEL).

### 1.4 Digital life: Tierra (Tom Ray, 1991) & Avida (Adami, Ofria, 1990s→)
- **What they proved:** self-replicating programs under mutation + competition
  produce genuine ecology: parasites, symbiosis, speciation — in RAM, unattended.
- **What died:** the field stalled because organisms were dumb (no semantic depth)
  and fitness landscapes were toy.
- **What changes in EDEN:** LLM-brained organisms (semantic mutation operators),
  metabolism priced in *real* resources, fitness = real human usage. The two
  historical blockers are exactly what 2020s tech removes.

## 2. Self-Hosting Precedent (bootstrap ladder legitimacy)

| System | Bootstrap path |
|---|---|
| C (Unix) | B → early C in B → self-hosted C |
| Rust | OCaml-written compiler → Rust self-hosting (~2011) |
| Go | C-written gc → Go rewrite (2014, plan9asm era ended) |
| PyPy | Python-defined interpreter on RPython |
| Nebulara | C bootstrap (`nbs-bootstrap.c`) + partial self-host (`compiler.nbs`) ← **we are here** |

Lesson: the ladder always ends with the host language reduced to a thin runtime
floor. Plan for which parts stay "floor" longest: allocator, machine-code emitter,
boot stubs.

## 3. Capability-Based Systems (security substrate)

| System | Idea worth stealing |
|---|---|
| KeyKOS / EROS / Coyotos | persistence + capabilities; every authority is an object reference |
| seL4 | formally verified microkernel; proofs are possible for small kernels |
| Fuchsia/Zircon | modern capability microkernel shipping at consumer scale |
| Cap'n Proto / object-capability literature | unforgeable references > ACLs |

Design consequence: PRIMORDIA tokens (04-ARCHITECTURE §3.1) follow the
object-capability rule: **authority = possession**; no ambient authority;
delegation = intentional transfer.

## 4. Adjacent Modern Movements (watch, don't copy)

- **Agent frameworks (OpenHands, Hermes, OpenHuman…)**: all guests on host OSes;
  none own persistence/security primitives → validates the gap PRIMORDIA fills.
- **Durable execution engines (Temporal, Cloudflare Durable Objects)**: prove
  checkpoint/resume demand; we need it at VM level, not service level.
- **Unikernels & Mirages**: library-OS thinking useful for Stage 5 boot path.
- **Personal knowledge tools**: prove demand for memory, but remain documents;
  our memory is behavioral (genomes), not notes.

## 5. Open Problems PRIMORDIA Will Confront

1. **Prompt genetics** — what is a sound mutation operator over natural-language
   behavior? Semantic crossover? Embedding-space perturbation? Unknown; EDEN runs
   are the experiment.
2. **Composition semantics** — when do two capabilities "fit"? Need a practical
   type theory for real-world functions (effects, preconditions).
3. **Open-endedness** — why does evolution generate endless novelty while gradient
   descent plateaus? POET/OMNI literature suggests environment-coupling; EDEN's
   user-coupled fitness is a live hypothesis test.
4. **Round-trip fidelity metric** — defining "semantically identical program"
   rigorously enough to measure 99% (proposal: CFG-isomorphism + value-trace
   equivalence on corpus inputs).
5. **Machine lifecycle law** — formal criteria for promote/split/dissolve decisions.

## 6. Reading List (short)

- Ray, T. — *An Approach to the Synthesis of Life* (Tierra)
- Levy, S. — *Hackers* (TempleOS-era ethos context)
- Miller, M. — *Robust Composition* (object-capabilities thesis)
- Warren, H. — seL4 papers series
- Stanley & Lehman — *Why Greatness Cannot Be Planned* (open-endedness)
- Davis, T. — templeos.org docs (divine intellect notwithstanding)

## 7. Research Outputs PRIMORDIA Could Seed

- First decompiler-first language spec (round-trip contract as normative)
- Prompt-genetics empirical results from biosphere runs
- Capability-model for agent ecosystems (post-artifact computing security)
