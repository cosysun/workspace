# Corrections Log

> Last 50 explicit corrections. Promote to memory.md after 3x same lesson.

---

## 2026-06-12 · /content-flow caveman 文章

### C1 · Skill resolution should prefer project over global
- **User**: "需要优先使用本项目下的 skill"
- **Context**: 跑 baoyu-post-to-wechat 时直接调用了 `~/.claude-internal/skills/baoyu-post-to-wechat/scripts/wechat-api.ts`，因为该全局版不读 workspace `.env`，直连官方微信 API → IP whitelist 拒绝（错误码 40164）。本项目 `<workspace>/.claude/skills/baoyu-post-to-wechat/scripts/wechat-api.ts` 支持 `WECHAT_API_BASE` 自建代理走 proxy 转发。
- **Lesson**: 调 skill 之前，先检查 `<workspace>/.claude/skills/<name>/` 是否存在；存在则优先用项目版。项目版往往有针对性 patch（代理支持、project `.env` 集成、自定义 hook）。
- **Promoted**: 立即 → memory.md（第一次但严重，影响发布成功）

### C2 · 封面 + 插图默认走 HTML，不走 AI 生图
- **User**: 「封面图，插图都使用 html 方式生成」
- **Context**: Stage 4 计划用 baoyu-image-gen 生成封面，DashScope 欠费 + 无其他 API key fallback。fallback 到 HTML 后效果反而更好：中文字体精确、与正文配图风格统一、零成本。
- **Lesson**: HTML/Chrome headless 是封面 + 插图的**默认**路径，不是 fallback。AI 生图只在 HTML 真表达不出的视觉（写实风格、生成式插画）时才用，且要在 prompts.md 记录用 AI 的具体原因。
- **Promoted**: 立即 → memory.md（用户明确表态 + 实战验证）

### C3 · baoyu-markdown-to-html 默认 default 主题
- **User**: 「baoyu-markdown-skill 默认使用 default 主题」
- **Context**: Stage 5.1 跑 baoyu-markdown-to-html 时，没有 EXTEND.md，且没有跨 skill 检查到 baoyu-post-to-wechat 的默认；我自作主张 generate 了 default/grace/modern 三主题预览。其实用户只要 default。
- **Lesson**: baoyu-markdown-to-html 的全局默认主题是 `default`。除非用户明确要求其他主题或 CLI 传入，不要自动多主题预览，也不要问用户选哪个。
- **Promoted**: 立即 → memory.md
- **Implemented**: `<workspace>/.baoyu-skills/baoyu-markdown-to-html/EXTEND.md` 写 `default_theme: default`；同时 `<workspace>/.baoyu-skills/baoyu-post-to-wechat/EXTEND.md` 也补全（baoyu-markdown-to-html 会跨 skill 读这个）。

### C4 · State files (self-improving, EXTEND.md) belong under workspace, not $HOME
- **User**: 「为啥都讲文件存在跟目录，不跟着项目走呢？」
- **Context**: 紧接 C1（项目 skill 优先于全局）的 `/self-improving` 写入。我立 C1 规则的同时把 `~/self-improving/` 和 `~/.baoyu-skills/<name>/EXTEND.md` 写到了 home —— 自相矛盾。检查 `<workspace>/.baoyu-skills/` 时发现已有 `baoyu-post-to-x` 和 `baoyu-translate` 的 EXTEND.md，证实你早就把这类配置放项目下，是我没看就先动手。
- **Lesson**: 「项目优先」这个原则覆盖**所有持久化文件**：skill 自己、skill 配置（EXTEND.md）、self-improving 记忆。不是只针对 skill 代码本身。新建任何要落盘的状态/配置时，先扫一眼 `<workspace>/` 下有没有同类先例，**有先例就跟先例**；没有也优先放 `<workspace>/`。
- **Correction applied**: `~/self-improving/*` → `<workspace>/.self-improving/`；`~/.baoyu-skills/{baoyu-markdown-to-html,baoyu-post-to-wechat}/EXTEND.md` → `<workspace>/.baoyu-skills/.../EXTEND.md`；home 残留已清。
- **Promoted**: 立即 → memory.md（与 C1 同根，扩展覆盖范围）

---

## 反思 · /content-flow 整体

```
CONTEXT: /content-flow 整篇公众号文章流程
REFLECTION: 三条修正都属于"第一次跑就该正确选用工具/参数"。Skill 选择 + 配图路径 + 主题选择都是默认行为问题，不是流程逻辑问题。
LESSON: 流程开跑前先扫一遍各个 stage 会调用的 skill，确认：(a) 项目版存在 → 用项目版；(b) 配图任务路径决策默认走 HTML；(c) 主题相关 skill 默认 default。把这三条放在 HOT memory，下次跑流程时一开始就读。
```

## 反思 · meta-错误（C4）

```
CONTEXT: /self-improving 写规则的同时违反规则
REFLECTION: 立完一条「项目优先」的 HOT rule，下一刻就把记忆写到 ~/self-improving/。这种 inconsistency 说明：写新规则的那一刻，我没把它当真去检查自己当前正在动的手。
LESSON: 写完一条规则后，立刻问自己「我刚才/正在做的动作，符不符合这条规则？」如果符合 → 推进；如果不符合 → 立刻回退/搬迁，不能等下一次任务被纠错才发现。
```
