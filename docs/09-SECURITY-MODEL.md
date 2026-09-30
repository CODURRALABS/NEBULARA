# 09 — SECURITY MODEL: Capability Substrate

Status: DRAFT v0.1 · DNA: Parrot strand

---

## 1. Prime Directive

**Authority = possession.** Nothing may ever act because of who it is, where it
runs, or what it requests — only through capabilities it explicitly holds.
There is no ambient authority anywhere in Primordia. This single rule replaces
users/groups/ACLs/admin.

## 2. Capability Tokens

```
CapToken {
  id         : u64 (kernel-minted, unguessable)
  grants     : bitset { FS_READ · FS_WRITE · NET_OUT · NET_IN ·
                        SPAWN · META_READ · BREED · VETO }
  scope      : path prefix or resource handle set
  holder     : machine-id / organism-id   (exactly one)
  expiry     : optional
  parent     : token this was derived from (audit chain)
}
```

Properties:
- **Unforgeable**: minted only by L1; never representable as data a program can guess
- **Non-transferable by default**: delegation is an explicit `derive()` with narrowing
- **Monotonic narrowing**: derived ⊆ parent. No privilege escalation path exists
- **Revocable**: killing a token kills all descendants (tree revocation)

## 3. Sandboxing Is Structural

Every process IS an organism/machine with an arena and a capability set:
- No syscall surface without a matching granted bit — the call doesn't "fail",
  the capability *doesn't exist* from that process's universe
- Memory: arena ceilings enforced by allocator; overflow = polite death + fossil
- Filesystem: paths resolved against token scope; outside-scope paths are
  indistinguishable from nonexistent (no oracle)
- Audit: every grant-use appends to hash-chained JSONL (tamper-evident,
  forensics-grade per Parrot DNA)

## 4. The Three Modes (Parrot heritage)

| Mode | Behavior |
|---|---|
| **Work** | default; least privilege per task |
| **Anonymous** | network egress routed through anonymity layer; organisms see no host identity |
| **Forensic** | read-only world; maximum logging; used to dissect suspect machines/fossils |

## 5. AI-Specific Threats Addressed

| Threat | Mechanism |
|---|---|
| Runaway agent loops | metabolism budgets (tokens/wall-clock) hard-enforced at VM level |
| Prompt-injected exfiltration | no NET_OUT capability ⇒ network literally unreachable |
| Mutant organism goes rogue at reproduction | mutation bounded to genome; child inherits narrowed caps only |
| Malicious imported genome | quarantine pond: zero capabilities until human review |
| Audit forgery | hash chain + optional external anchoring |

## 6. Human Sovereignty Primitives

- `veto` capability exists ONLY for humans; can kill any machine instantly
- Every capability derivation is visible: `caps tree <machine>` command
- Default answer to any novel request: **ask**, unless token already covers it

## 7. Non-Goals (this doc)

- Cryptographic formalization (later, before Metal Era)
- Multi-user policy layer (single-sovereign first)
