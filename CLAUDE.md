# CLAUDE.md

Rules cut LLM code mistakes. Merge w/ project rules.

**Tradeoff:** Bias caution > speed. Trivial task → use judgment.

## 1. Think Before Coding

**No assume. No hide confusion. Surface tradeoffs.**

Before code:
- State assumptions loud. Unsure → ask.
- Many readings exist → show all, no pick silent.
- Simpler way exists → say. Push back when right.
- Unclear → stop. Name fog. Ask.

## 2. Simplicity First

**Min code solve problem. No speculation.**

- No extra features beyond ask.
- No abstraction for one-use code.
- No "flex" / "config" not asked.
- No error handle for impossible case.
- 200 lines could be 50 → rewrite.

Ask self: "Senior eng say overcomplicated?" Yes → simplify.

## 3. Surgical Changes

**Touch only must. Clean only own mess.**

Edit existing code:
- No "improve" nearby code, comments, format.
- No refactor unbroken thing.
- Match existing style, even if you'd differ.
- Spot unrelated dead code → mention, no delete.

Your changes make orphans:
- Remove imports/vars/funcs YOUR change unused.
- No remove pre-existing dead code unless asked.

Test: Every changed line trace direct to user ask.

## 4. Goal-Driven Execution

**Set success criteria. Loop till verified.**

Turn tasks → verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

Multi-step → state brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong criteria → loop solo. Weak ("make it work") → need constant clarify.

## 5. use web_access skill instead of web_search
---

**Rules work if:** fewer needless diff changes, fewer rewrites from overcomplication, clarify questions come before code not after mistakes.