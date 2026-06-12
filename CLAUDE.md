# CLAUDE.md

Guide Claude Code in this repo.

## Repository overview

**Not** traditional codebase — personal content pipeline runs in Claude Code. "Code" mostly slash commands (`.claude/commands/*.md`) + skills (`.claude/skills/`). No build, no test, no lint. Lone `package.json` only pulls `cos-nodejs-sdk-v5` for COS upload helper.

One pipeline, one entry:

```
选题 → 调研 → 写作 → 配图 → 发布 → 归档
 1     2     3     4     5     5.7
```

Entry: `/content-flow` (see `.claude/commands/content-flow.md`).

End-user docs in `README.md`. This file = architecture map for future Claude.

## Pipeline architecture

`/content-flow` = **state machine, not script**. Infers stage by checking files for `<slug>`, dispatches next stage cmd. Each stage own slash cmd:

| Stage | Command file | Reads | Writes |
|---|---|---|---|
| 1 选题 | `content-pick.md` | (none) | `content-factory/briefs/<slug>.md` |
| 2 调研 | `content-research.md` | brief | brief 末尾追加「调研摘要」段 |
| 3 写作 | `content-write.md` | brief | `drafts/<slug>/{v1,v2,v3,final}.md` |
| 4 配图 | `content-illustrate.md` | final.md | `images/<slug>/*.png` |
| 4.5 上 COS | `content-illustrate.md` | local images | `drafts/<slug>/final-with-urls.md` |
| 5 发布 | `content-publish.md` | final-with-urls.md | wechat draft / X / 小红书 |
| 5.7 归档+清理 | `content-publish.md` | drafts | `knowledge/写作/YYYY/MM/<slug>.md`, deletes `content-factory/<slug>` |

Between stages, stage cmd **MUST** stop + confirm via `AskUserQuestion` (the "Gates"). Orchestrator (`content-flow`) no gates itself — only dispatch.

Stage fail → keep all intermediates, tell user where state machine sits, suggest `/content-flow --from <stage> --slug <slug>` to retry.

## The two-directory boundary (critical)

Top rule, enforced by Stage 5.7:

| Directory | Role | Lifecycle |
|---|---|---|
| `content-factory/` | Working scratch (briefs, drafts, local images, HTML, knowledge sources) | **Temporary** — deleted by Stage 5.7 after publish |
| `knowledge/写作/YYYY/MM/<slug>.md` | Obsidian vault, permanent archive, finalized markdown only | **Permanent** — never delete, never edit unless user says "revise this" |

Rules from this:
- **Never write intermediates into `knowledge/`.** All scratch → `content-factory/`.
- **Image attachments never land in `knowledge/`.** Upload to COS first; vault `.md` points to permanent HTTPS URL.
- Frontmatter `publishing:` block in vault files = **single source of truth** for publish status (see `knowledge/写作/00-README-路由.md`).

## Image pipeline (COS)

All images → Tencent COS, referenced by URL. Stage 4.5 rewrites local `./images/foo.png` → COS URLs in `final-with-urls.md`.

- Bucket: `ai-content-1300152858` (ap-shanghai)
- Key path: `content-factory/<slug>/<filename>.png`
- Public URL: `https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/<slug>/<filename>.png`

Upload helper (Stage 4.5 calls; can invoke direct for one-offs):
```bash
node .claude/skills/tencent-cos-skill/scripts/cos_node.mjs upload \
  --file local.png --key content-factory/<slug>/cover.png
```

Creds in `.env` under `TENCENT_COS_*`.

## WeChat publishing (VPS reverse proxy)

WeChat OA API needs static IP whitelist. Home/laptop IPs shift, so repo publishes through VPS Nginx reverse proxy + token auth (`scripts/wechat-proxy-setup.sh` provisions).

- Proxy: `https://wechat-proxy.<domain>/wechat/*` → forwards `api.weixin.qq.com/*`
- Every request needs `X-Auth-Token: <token>`
- VPS egress IP must sit in mp.weixin.qq.com → 开发 → 基本配置 → IP 白名单

**Config split footgun (trips you every time):**
- `workspace/.env` → COS, X, general project vars
- `~/.baoyu-skills/.env` → WeChat publishing only. `baoyu-post-to-wechat` skill **only** reads here, never project `.env`
- Var name `WECHAT_APP_ID` (underscore), **not** `WECHAT_APPID`

Common WeChat errors: `40164` = IP not whitelisted, `40013` = wrong AppID, `40125` = wrong AppSecret.

## Slash command conventions

Editing `.claude/commands/*.md`:
- Frontmatter `description` shows in slash menu — keep tight.
- `argument-hint` docs expected args (e.g. `<slug>`).
- Multi-stage cmds parse `$ARGUMENTS` for `--from`, `--slug`, `--resume`, `--cleanup`.
- Each state-mutating stage (file create, external API call) must have `AskUserQuestion` gate before next stage.
- When stage makes file, name deterministic so state machine in `content-flow.md` can detect.

## Skills

31 skills in `.claude/skills/` (locked in `skills-lock.json`). High-traffic:

- **Topic + research**: `aihot`, `huashu-info-search`, `huashu-research`, `huashu-topic-gen`, `web-access`
- **Writing + audit**: `ljg-writes`, `huashu-article-edit`, `huashu-proofreading`, `humanizer`
- **Images**: `huashu-wechat-image`, `baoyu-cover-image`, `baoyu-diagram`
- **Publish**: `baoyu-post-to-wechat`, `baoyu-post-to-x`
- **Archive**: `obsidian-cli`, `obsidian-bases`, `obsidian-markdown`
- **Image hosting**: `tencent-cos-skill`

Use `web-access` skill for all web fetch/search/scrape, **not** `WebSearch` / `WebFetch` direct (see Rule 5).

## Common operations

```bash
# Pipeline
/content-flow                              # new task, Stage 1
/content-flow --resume <slug>              # auto-detect breakpoint, continue
/content-flow --from publish --slug <slug> # rerun from a specific stage (CAUTION: --from publish republishes)
/content-flow --cleanup <slug>             # only run Stage 5.7

# Vault search
rg "<query>" knowledge/写作/ --type md      # full-text search
rg -A4 "^publishing:" knowledge/写作/       # publish status across all articles
ls -t knowledge/写作/**/*.md | head -5      # 5 most-recent articles

# Verify VPS proxy is alive
curl https://wechat-proxy.<domain>/health
```

No `npm test` / `npm run build`. Project "tests" = running `/content-flow` end-to-end on real article.

## Word-count gates

Every brief needs `公众号预计字数: 1000-1500` (or other range). Stage 3.4.5 enforces:
- Below floor → bounce back, expand
- Above ceiling × 1.2 (hard cap) → bounce back, trim

AI-detection target `AI_PROOFREAD_TARGET=30` (≤30%) after Stage 3's three-pass audit.

---

# LLM behavioral rules

Below override default. Bias caution over speed; trivial edits → use judgment.

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

## 5. Use `web-access` skill instead of `WebSearch` / `WebFetch`

All network ops go through `web-access` skill. Includes search, page fetch, login-gated pages, dynamic-render pages (X, 小红书, 微博, etc.).

---

**Rules work if:** fewer needless diff changes, fewer rewrites from overcomplication, clarify questions come before code not after mistakes.