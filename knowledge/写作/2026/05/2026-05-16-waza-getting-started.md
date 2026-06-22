---
title: "4.8k star 的 Waza：把工程师的 8 个习惯装进 Claude Code"
date: 2026-05-16
tags: [写作, AI, claude-code, skill, waza, 工具教程]
sources:
  - https://github.com/tw93/waza
  - https://twitter.com/HiTw93
publishing:
  公众号: 已发布（2026-05-16，手动后台）
  X: 待发布
  小红书: 已发布（2026-05-16，手动）
word_count: 1132
slug: 2026-05-16-waza-getting-started
---

# 4.8k star 的 Waza：把工程师的 8 个习惯装进 Claude Code

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-16-waza-getting-started/cover.png)

打开 GitHub 看了一眼，[tw93/Waza](https://github.com/tw93/waza) 已经 4.8k star，五月初刚发了 V3.23.0。一个月前还是 4.3k——增速并不夸张，但稳。

它做的事情其实很小：把工程师写代码时该有的 8 个习惯，写成 8 个 Slash 指令塞进 Claude Code。仅此而已。

我喜欢它的原因也是这个。市面上的 Skill 集合越做越大，恨不得装一百个；Waza 反着来，作者 @HiTw93 自己说："Less is more，只设目标和约束，不规定细节，让模型升级红利自然流入。"翻译一下就是：Skill 不替你写代码，它只在合适的时机提醒 Claude 该怎么思考。

## 30 秒装上

老教程让你 git clone 再拷贝 .claude 目录，已经过时了。现在 README 主推这条：

```bash
npx skills add tw93/Waza -a claude-code -g -y
```

加了 `-g` 是全局安装，所有项目都能用。装完进任意项目打 Claude Code，输入 `/` 看到 `/think` 在列表里就成了。如果你的 Claude Code 启用了 Plugin Marketplace，也能直接 `/plugin marketplace add tw93/Waza`。Codex 用户把 `-a claude-code` 换成 `-a codex` 就行。

## 8 个 Skill，分两组记

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-16-waza-getting-started/image-1.png)

按使用频率，我把它们分成"写代码三件套"和"辅助五件套"。

### 写代码三件套：核心环路

**`/think` — 动手前先想清楚**

任何稍微复杂点的需求，先 `/think`。它会强制 Claude 把需求拆成输入输出、列出技术方案、评估风险、给替代选项。本质上是把"精确需求描述"这件事固化下来。AI 写错代码，十次有八次是需求没说清。

**`/hunt` — 根因未明不动代码**

遇到 bug 不要直接说"你帮我改一下"，先 `/hunt`。这个 Skill 给 Claude 的指令很硬：定位到具体哪个文件哪一行、为什么这么写之前，**禁止修改代码**。它替你拦住了 AI 最爱犯的毛病：先来一句"我试试改这里看行不行"，然后改了三个地方，原 bug 没解决又引入两个新的。

**`/check` — 收工前的最后一关**

写完一段功能，准备提交前调一次。它会过一遍代码风格、边界条件、异常处理、安全风险、测试覆盖。README 里高亮的"自动修安全问题"和"对抗性测试"两条最实用。

这三个串起来就是一个完整的编码闭环：想清楚 → 写 → 检查。光这三个就能把日常代码质量稳住。

### 辅助五件套：按需召唤

- **`/design`**：做前端原型时用，避免那种一眼能看出"AI 模板"的样子。产品经理、运营也能直接用，快速产出可运行的 HTML/CSS/JS 原型。
- **`/read`**：把网页或 PDF 转成干净的 Markdown，准备资料时省事。
- **`/write`**：把一段你写的或 AI 写的文字过一遍，去掉"AI 腔"。
- **`/learn`**：研究新工具或新框架时跑一遍，按"收集 → 消化 → 大纲 → 填充 → 打磨 → 自审"六步走。
- **`/health`**：给项目的 CLAUDE.md 和规则做体检，找出过时或冲突的条目。

## 三个工作流，把 Skill 串起来

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-16-waza-getting-started/image-2.png)

单独用每个 Skill 已经够好用，但 Waza 真正的味道是把它们串成工作流：

**新功能**：`/think`（方案）→`/design`（如果有前端）→ 写代码 → `/check`（自检）→`/write`（更文档）

**修 Bug**：`/hunt`（找根因）→ 改代码 → `/check`（验证没引入新问题）

**周维护**：每周一次 `/health`，外加 `/learn` 跟进生态

我自己用下来，这三条流程比"凭感觉用 Claude"省下来的返工时间不少。

## 进阶：把工作流写进 CLAUDE.md

Skill 是触发式的，你想起来才会调。下一步是把工作流写进项目根目录的 `CLAUDE.md`，比如这样写一条规则：

> 修复 bug 必须先调 `/hunt` 给出根因报告，根因未确认前不允许修改任何文件。

写完 Claude 自己就会按规则跑，不用你每次手动喊。这一步从"调技能"过到"自动跑"，是 Waza 真正变好用的开始。

## 5 个常踩的坑

1. **装完没反应**：路径不对。检查 `~/.claude/skills/` 里有没有 Waza 目录，没有就重跑 `npx skills add`。
2. **Claude 输出没深度**：跳过 `/think` 直接让它写。先 `/think` 三十秒，能省三十分钟返工。
3. **`/check` 漏掉项目特有规范**：CLAUDE.md 里没写。把团队规范、技术栈约束、命名习惯先补全。
4. **调试鬼打墙**：AI 不查根因瞎试。`/hunt` 强制要求它给证据，不接受"我猜可能是因为"。
5. **初期觉得慢**：先想再写在小项目上确实费事。但项目一上规模，这点开销立刻回本。

---

8 个 Skill，4.8k star，背后是 @HiTw93 把"工程师该有的肌肉记忆"一条条剥出来再写进 AI 的工作。装上花 30 秒，养成习惯花一周。如果你已经在用 Claude Code 但总觉得"怎么写出来的代码差点意思"，缺的多半就是这 8 个习惯。

---

## 发布记录

| 平台 | 状态 | 链接 / 备注 |
|------|------|-------------|
| 公众号 | ✅ 已发布（2026-05-16） | 主题：simple；手动后台贴的（脚本路径因公众号 IP 白名单走 VPS 反代未配通）。永久链接待回填 |
| X | ⏳ 待发布 | 短版正文：`content-factory/drafts/2026-05-16-waza-getting-started/x-post.md`（258 字） |
| 小红书 | ✅ 已发布（2026-05-16） | 卡组 7 张：`content-factory/images/2026-05-16-waza-getting-started/cards/waza-card-{1..7}.png`。永久链接待回填 |

发布后请回填本表格的"链接/备注"列。
