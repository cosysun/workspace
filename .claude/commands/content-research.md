---
description: Stage 2 — 多维调研，把选题挖到能写出信息密度
argument-hint: <slug>
---

# Stage 2：多维调研

## 输入

参数 `<slug>`（来自 Stage 1）。读 `content-factory/briefs/<slug>.md` 拿主题 / 任务类型 / 目标平台。

## 步骤

### 2.1 主调研

调用 `huashu-research`：
- **调用前 `cd content-factory`**，原生落到 `_knowledge_base/`
- 输入：brief 里的主题
- 产出：`content-factory/_knowledge_base/<主题>/research-<时间戳>.md`（结构化、实时落盘）
- 注意：huashu-research 内部已并行，**不要再外层并行**

### 2.2 网页采集（按需）

如果 brief 列了参考链接，对每个 URL 调 `baoyu-url-to-markdown`，结果落到同一个 `_knowledge_base/<主题>/` 下。

### 2.3 视频 / X 采集（按需）

- YouTube 链接 → `baoyu-youtube-transcript`
- X 推文链接 → `baoyu-danger-x-to-markdown`
- 都落 `_knowledge_base/<主题>/`

### 2.4 论文（涉及时）

如果话题涉及 arxiv / 学术，调 `ljg-paper` 拿结构化解读，落 `_knowledge_base/<主题>/`。

### 2.5 实操（工具教程类）

如果 task_type=`工具教程` 且 brief 勾选"需要实操"，调 `gstack` / `browse` 真用一下工具，截图存到 `content-factory/images/<slug>/`（仅作证据图候选，Stage 4 决定要不要用）。

### 2.6 写调研摘要回 brief

用 Edit 工具把 brief.md 末尾的"调研摘要"段填上：
- 调研发现的关键事实 / 数据
- 文章大纲（3-5 个主章节）
- 标注每个章节将引用的 `_knowledge_base/<主题>/<file>.md`

## 状态判定

`content-factory/briefs/<slug>.md` 末尾包含"调研摘要"段且**段下非空** → Stage 2 完成。

## 失败恢复

任一 skill 失败：保留已落盘的部分（huashu-research 边跑边写，不会丢）。提示用户重跑 `/content-research <slug>` 续跑。

## 输出

- 多个 `_knowledge_base/<主题>/*.md`
- `briefs/<slug>.md` 末尾追加"调研摘要"段
