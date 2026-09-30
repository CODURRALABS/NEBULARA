# 07 — ROADMAP: The Bootstrap Ladder (Stage 0 → 5)

Status: DRAFT v0.1 · Each stage has hard exit criteria. No stage-skipping.

---

## STAGE 0 — Foundation *(current)*

**Goal:** docs, repo skeleton, toolchain proven.

Deliverables:
- [x] Full documentation set (`docs/`)
- [x] Folder structure
- [x] `build.bat` / `Makefile` compiling an empty core binary with `-Wall -Wextra -Werror`
- [ ] Test runner running zero tests successfully (yes, that's a deliverable)
- [ ] CI-able one-command build+test on Windows first, POSIX second

**Exit:** `scripts/build.bat && scripts/test.bat` green from clean clone.
**Size:** days.

---

## STAGE 1 — Nebulara v4 Interpreter in C++ ⭐ *we are heading here*

**Goal:** v4 language fully working, round-trip decompiler demo.

Order of attack:
1. Lexer (all tokens incl. Float literals, META blocks)
2. Parser → AST → PRIM-IR generation
3. IR text serializer + source projector (**decompiler v0 — milestone moment**)
4. Register bytecode compiler + VM (arithmetic, control flow, functions)
5. Value model completion: Float, Map, Closures
6. Builtins parity with v3 + new v4 builtins
7. `.nbsc` format v2 writer/reader (embedded IR section)
8. Conformance suite: port all SPEC.md examples into `lang/tests/`

**Exit criteria:**
- Every example in `docs/06-LANG-SPEC-v4.md` runs verbatim
- Round-trip holds on full corpus (automated check)
- `neb run`, `neb repl`, `neb decompile file.nbsc` commands work
- Performance budgets in TRD §2.5 met

**Size:** the big one — weeks of focused work. Ship sub-milestones weekly.

---

## STAGE 2 — First Self-Hosted Organs

**Goal:** prove the ladder works by climbing one rung.

Deliverables:
- JS transpiler rewritten **in Nebulara** (tree-walking over own AST maps)
- CLI/REPL rewritten in Nebulara
- Capability gating added to file/network builtins (TRD §4)
- Vortex skeleton: capability registry + manual machine manifest execution

**Exit:** `neb transpile` implemented in .nbs passes same conformance corpus as C++ version; a hand-written manifest spawns a 3-cell machine that completes a real task.

**Size:** weeks.

---

## STAGE 3 — The TempleOS Moment (self-compilation)

**Goal:** Nebulara compiles Nebulara.

Deliverables:
- Finish what `void 1/nebulara/Compiler/compiler.nbs` started: full self-hosted compiler
- Bytecode emitted by self-hosted compiler verified identical-semantics vs C++ output
- Checkpoint/resume VM ops (Vortex durable machines need them)
- Moment-machine lifecycle engine complete (spawn/feed/starve/dissolve/promote)

**Exit:** entire lang toolchain builds and tests green when compiled BY ITSELF;
C++ reduced to runtime floor (allocator + emitter).
A recurring goal-machine survives process restart via checkpoint resume.

**Size:** weeks–months. The summit of Phase A.

---

## STAGE 4 — Eden Biosphere + Systems Teeth

**Goal:** evolution goes live.

Deliverables:
- Genome format + telemetry + mutators (incl. LLM semantic mutation behind opt-in flag)
- First sustained pond: ≥50 organisms, real extinctions, fossil record populated
- Lineage browser CLI
- Nebulara systems subset dialect (explicit ints sizes, pointers-in-blocks) spec'd
- Microkernel design freeze: memory + capabilities + scheduling on hosted kernel-abstraction layer

**Exit:** multi-generation biosphere documented incl. at least one speciation-like divergence; kernel design review passed against "one-mind" rule.

**Size:** months, but each piece demos alone.

---

## STAGE 5 — Primordia Proper

**Goal:** boot the thing.

Deliverables:
- UEFI bootloader stub + hardware bring-up (the only eternal non-Nebulara code)
- Microkernel on metal running Nebulara organisms as native processes
- Shell boots on Primordia; biosphere persists across reboots
- Self-hosting endgame: OS compiles its own toolchain ON ITSELF

**Exit:** `v1.0 "Primordia"` per PRD §8.

**Size:** the long war. Entered only after Stage 4 review.

---

## Standing Rules Across All Stages

1. Every stage ends with a demo you can show a stranger in 5 minutes
2. Docs update in the same commit as behavior change
3. Any feature that breaks "one mind can hold the stack" needs DECISIONS.md entry + justification
4. When stuck >3 days: shrink scope, don't push through
