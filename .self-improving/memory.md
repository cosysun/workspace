# Memory (HOT)

> Always loaded. ≤100 lines. Confirmed preferences and hard rules only.

## Skill resolution

- **Project skills first.** Always check `<workspace>/.claude/skills/<name>/` before falling back to `~/.claude-internal/skills/<name>/`. Project skills can have project-specific patches (e.g. `WECHAT_API_BASE` proxy support, project `.env` loading) that the global version lacks. Only fall back to global if project version is missing.
- When running a skill's underlying script directly (bash), prefer the project path: `bun /Users/andysun/work/ai-workflow/workspace/.claude/skills/<name>/scripts/<file>.ts`.
- **Persisted state and skill EXTEND configs follow the same rule — keep them in `<workspace>/`, not `$HOME/`.** Locations:
  - self-improving memory: `<workspace>/.self-improving/` (NOT `~/self-improving/`)
  - baoyu skill defaults: `<workspace>/.baoyu-skills/<skill-name>/EXTEND.md` (NOT `~/.baoyu-skills/...`)
  - Project-level EXTEND already exists for baoyu-post-to-x and baoyu-translate; mirror that pattern when adding new ones.

## Image generation (content-flow / 公众号 / 配图)

- **Default to HTML for cover and inline figures.** Use Chrome headless to render: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --disable-gpu --hide-scrollbars --window-size=WxH --screenshot=out.png "file://$PWD/source.html"`.
- Reasons: zero cost, text precision (中文不被 AI 模型乱画), style consistency between cover and inline images, fully diffable / re-renderable.
- Cover dims: 1080×460 (2.35:1, 公众号主图)。Inline figures: 1200×720 默认。
- AI image gen (baoyu-image-gen / DashScope / Seedream / etc.) only when HTML genuinely cannot express the visual — e.g. photo-realistic mood shots, generative illustration. Document the reason in `prompts.md`.

## baoyu-markdown-to-html

- **Default theme: `default`.** Don't ask the user, don't fall back to grace/modern unless explicitly requested or specified in EXTEND.md / CLI.

## Workspace conventions

- Workspace root: `/Users/andysun/work/ai-workflow/workspace`
- COS creds + WeChat proxy live in `<workspace>/.env`; load with `set -a; source .env; set +a` before invoking scripts that need them.
- Vault target: `knowledge/写作/YYYY/MM/<slug>.md` with appended 「发布记录」 block.

## Writing voice (公众号)

- 1500-2000 字 default for tutorial-style posts. Hard cap: WORD_MAX × 1.2.
- 不冒充亲测 unless explicitly verified — brief 字段 "需要真实实操测试" 决定。
- Cite arXiv / paper IDs only after verifying via WebSearch. If ID looks future-dated or returns no results, **drop it** rather than repeat the source's claim.
