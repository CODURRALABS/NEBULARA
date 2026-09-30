# 11 — FAQ: Hard Questions, Straight Answers

**Q: Isn't this just Linux with extra steps?**
No. No Linux kernel, no GNU userland, no POSIX assumptions at the core. It's a
new kernel + new language + new ecosystem model that HAPPENS to be developed on
Windows/POSIX machines during the hosted era.

**Q: Terry Davis built a temple for God; what's your excuse?**
The TempleOS lesson we keep is *comprehensibility and immediacy*, the lesson we
leave is isolation. PRIMORDIA aims to be the OS one mind can hold — without
requiring divine intervention to stay sane.

**Q: Won't evolved software be terrible?**
Most mutations will be. That's the point: most die. Evolution runs on mountains
of failure. The biosphere prunes harder than any app review board ever will.

**Q: What stops a mutated organism from being malware?**
Capability inheritance: children get narrowed tokens only. Imported genomes go
to a quarantine pond with zero capabilities. And every organism is decompilable
by construction — there is nowhere to hide behavior.

**Q: Why write ANOTHER language instead of using Rust/Zig/Lua?**
Because Primordia needs provenance in the type system, round-trip IR as law, and
a stack small enough for self-hosting by one person. Existing languages treat
these as non-goals. Nebulara already exists with partial self-hosting — it's
cheaper to grow it than to bend an ecosystem language.

**Q: LLMs are required for Eden mutation — doesn't that break determinism?**
Mutations happen at reproduction events only and are logged like everything else
(ADR-0008). Runs replay exactly; mutation sources are part of the record.

**Q: When can I boot it?**
Stage 5. If you're asking "when can I USE something?" — Stage 1's interpreter
and decompiler demo arrive first, Stage 2's shell right after. The ladder ships
value at every rung (07-ROADMAP rule #1).

**Q: Single builder — realistic?**
TempleOS was one man. Nebulara already exists. The ladder exists precisely so
no single stage exceeds solo capacity. The risk isn't ability; it's scope
discipline — which DECISIONS.md and the standing rules exist to enforce.

**Q: Why "no dark binaries" — who cares?**
Anyone who has ever run software they couldn't inspect. On Primordia the
question "what does this program actually do?" is always answerable in seconds.
Security researchers call this the end-state; here it's the floor.

**Q: What if Vortex assembles a harmful machine from harmless parts?**
Composition is gated: each cell binding requires capabilities covering its
effects; the manifest is human-visible before spawn (`--yes` culture is banned).
The dangerous union of safe parts must present its union for approval.
