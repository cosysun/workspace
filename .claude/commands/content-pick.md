---
description: Stage 1 — 多源选题，产出 3-4 个候选 → 用户点 1 个 → 写入 brief
argument-hint: []
---

# Stage 1：多源选题

## 你的目标

产出 3-4 个高质量选题候选，让用户从中选 1 个，最后落到 `content-factory/briefs/<slug>.md`。

## 步骤

### 1.1 抓多源热点（并行调用，扩大候选池）

并行触发以下两个 skill，各自内存输出，不落盘：

**1.1a `aihot` — AI 资讯热榜**
- 拿当日中文 AI 资讯（精选 + 时间窗）
- 输出关键词 / 标题作为 1.2 的可选方向

**1.1b `github-trending` — GitHub 周榜**
- 默认参数：`--since weekly --limit 10`，不带 `--language`、不带 `--spoken-language`（全语言）
- 公众号「X 星的项目」类工具短文流量稳定，GitHub 周榜是这类选题的核心源
- 拿到的每个 repo 都自带 `repo / total_stars / current_period_stars / description / primary_lang`，已经够用作热度依据，不需要二次确认

### 1.2 多渠道信息搜索（按用户输入主题方向 / 或当日热点）

调用 `huashu-info-search`：
- **调用前先 `cd content-factory`**，让其原生落位到 `_knowledge_base/`
- 输入：本次写作大方向（用户口述 / 或 1.1a aihot 命中的关键词 / 或 1.1b 命中的某个 GitHub repo 名）
- 产出：`content-factory/_knowledge_base/<主题>/<时间戳>-source.md`

### 1.3 生成 3-4 个选题方案

调用 `huashu-topic-gen`：
- 输入：1.1a + 1.1b + 1.2 的素材
- 候选选题至少覆盖 2 个来源（避免清一色 AI 资讯或清一色开源项目）
- 每个选题包含：标题、切入角度、目标读者、预期效果、热度依据（**来源标明**：aihot / github-trending / 用户主题）
- 内存输出

### 1.4（仅思辨型）深度思辨

如果用户偏向"知识思辨"型，再调一遍 `ljg-think` 或 `ljg-rank`，给候选选题一层结构化拆解。

### 🔴 Gate 1：用 AskUserQuestion 强停

展示 3-4 个候选 + 热度依据，让用户：
1. 选 1 个候选（或自填新方向）
2. 确认 task_type：`工具短文` | `工具教程` | `知识思辨`  
   - 开源/GitHub 新品介绍、「X 星的项目」类公众号 → 默认推荐 **工具短文**（模板：`content-factory/_templates/tool-short-article.md`）
   - **用户选中的候选来自 1.1b github-trending → task_type 直接预选 `工具短文`**，无需重复确认（用户仍可手动改）
3. 确认目标平台（多选）：`公众号` | `X` | `小红书`

### 1.5 生成 brief

- 用 `content-factory/_templates/brief.md` 作模板；若 task_type=`工具短文`，改用 `brief-tool-short.md`
- 用 §2.3 的 slug 规则生成 slug：`YYYY-MM-DD-<标题关键词>`，去标点、空格转 `-`、最长 40 字符
- 落盘到 `content-factory/briefs/<slug>.md`，把上面 4 个用户决策填进去

## 状态判定

`content-factory/briefs/<slug>.md` 存在 → Stage 1 完成。

## 失败恢复

- **1.1a / 1.1b 单源失败**：另一源继续走 1.3，并在选题展示时告知用户「本次仅使用 X 源，Y 源调用失败」。**不要静默 fallback**。
- **1.1a + 1.1b 同时失败**：1.3 退化为依赖 1.2 + 用户主题方向；如果 1.2 也没素材，停 Stage 1 并告诉用户具体错在哪几个 skill。
- **1.2 / 1.3 失败**：保留中间产物（`_knowledge_base/` 已落盘），告诉用户具体错在哪个 skill，让用户决定重跑哪一步。**不要静默 fallback**。

## 输出

- `content-factory/briefs/<slug>.md`（含基本信息 + 核心需求填好；调研摘要段留空给 Stage 2）
- 返回 slug 给调用方
