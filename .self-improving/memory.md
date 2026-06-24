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

### 段落是否注水的 4 个判断（写完每段必问）

1. **讲读者要的事实/操作/判断，还是讲我？**「这周翻了一遍」「挨个过 README」「剔了 N 个」「剩 8 个能直接装」——全是我的工作过程，对读者零价值，砍。
2. **是否有引导词？**「下面」「今天先不展开」「接下来看」「表格先扫一眼，再看后面」——元叙述，读者跟着章节自然能读到下一段，不需要被引导，砍。
3. **钩子是真实痛点还是戏剧场景？**「老板拍稿子说」「同事吐槽」「客户退稿」——脑补场景剧，砍。换成痛点的**具体表现**（"词大、句长、什么都对，但读起来不像人写的"）。
4. **来源叙事是否抢了主角？**用户给 URL 是要素材**不是**要源头介绍。「这周 XX 发了一条 X / 2.9 万 views / 帖子只给链接没分类」全砍。来源放末尾「完整链接」区即可。

### 标题禁用词（生成候选时直接过滤）

- **套路词**：神级、杀手锏、必看、真的好用、就靠这、秒杀、狠了、太狠、值得装、拯救、救你、解药、压到 X% 以下、3 分钟搞清、挨个翻了、周榜被偷家
- **戏剧化开场**：老板说 / 老板再说 / 老板拍稿 / 同事 / 客户退稿 / 被骂 / 被退稿
- **叹号问号噱头**：句末叹号、反问号当钩子
- **结构**：痛点 + 解决方案型，前半给**具体动作/损失**（不是"AI 味重"这种空话），后半给**节制的提议**（不是"狠了/真的好用"）。
