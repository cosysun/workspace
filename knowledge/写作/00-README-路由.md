# 写作 Vault 路由

这个目录是我的 Obsidian vault，只存**已发布**文章的定稿。

## 目录约定

```
写作/YYYY/MM/<slug>.md
```

- `YYYY/MM` 按发布月份归档
- 一篇文章 = 一个 .md 文件
- **slug 命名**：`YYYY-MM-DD-<topic-kebab>`（例：`2026-05-14-agent-harness.md`）
- **图全走外链**，无本地附件
- **图床固定**：腾讯云 COS bucket `ai-content-1300152858`（ap-shanghai），路径 `content-factory/<slug>/<filename>.png`
- **发布状态在 frontmatter** `publishing:` block

## Frontmatter 约定

每篇文章顶部用 YAML frontmatter 记录元数据：

```yaml
---
title: "文章标题"
date: 2026-05-14            # 发布日期（不是写作日期）
tags: [写作, 主题1, 主题2]
sources:                     # 灵感来源链接（可选）
  - https://x.com/xxx/status/yyy
publishing:                  # 发布状态（真相源）
  公众号: 已发布（YYYY-MM-DD）
  小红书: 已发布（YYYY-MM-DD）
  X: 已发布（YYYY-MM-DD）
word_count: 1199             # 公众号正文字数
---
```

**publishing 状态枚举**：
- `已发布（YYYY-MM-DD）`
- `草稿（YYYY-MM-DD 已推后台）`
- `计划中`
- `不发布`

## 你（AI）可能被要求做的事

### 1. 找"我之前写过的某主题"
- 用 grep/ripgrep 搜标题和全文
- 例：`rg "claude" knowledge/写作/ --type md`

### 2. 取"我的写作样本"给 humanizer 做 voice calibration
- 按时间倒序取最近 N 篇
- 读正文部分（跳过 frontmatter）
- 命令参考：`ls -t knowledge/写作/**/*.md | head -5`

### 3. 判断某个选题"我是不是写过"
- grep 标题 + 首段，人工确认
- 重复选题提示用户

### 4. 读发布历史做数据回顾
- **frontmatter 的 `publishing:` block 是唯一真相源**
- 扫全部 .md 的这段，能统计每月产量、各平台分布
- 例：`rg -A4 "^publishing:" knowledge/写作/ --type md`

## 与 `content-factory/` 的边界

| 目录 | 职责 | 生命周期 |
|---|---|---|
| `content-factory/briefs/` | 选题 brief | 临时，发布后清理 |
| `content-factory/drafts/<slug>/` | 多版草稿、HTML、备份 | 临时，发布后清理 |
| `content-factory/images/<slug>/` | 图片源文件、HTML 渲染源 | 临时，发布后清理 |
| `knowledge/写作/YYYY/MM/<slug>.md` | **永久归档**（仅 md，图走 COS） | 永久 |

发布完成后跑 `/content-flow` Stage 5.7，会清理 `content-factory/` 下三个工作目录，归档版本只保留在 vault 里。

## 禁区

- **不要往这个目录写中间文件**（草稿、brief、临时图都在 `content-factory/`）
- **不要修改已发布文章的正文**——除非用户明确要求"修订这篇"
- **不要删文件**——归档的东西不动
- **不要把图片附件落到这个目录**——所有图必须先上 COS 拿永久链接

## 文体约定

| 类型 | 说明 | 模板 |
|------|------|------|
| **工具短文** | 开源/新品介绍，2–3 分钟读完：是啥、价值、怎么试 | `content-factory/_templates/tool-short-article.md` |
| 工具教程（长） | 1000 字+，含插件、排错、可选 benchmark | brief 默认字数 1000–1500 |
| 知识思辨 | 走 `ljg-writes` | brief `task_type=知识思辨` |

## 特殊文件

- `00-README-路由.md`（本文件）：约定说明，不是文章
- `00-*.md` 前缀保留给以后的索引、标签页、统计仪表盘

---

> 约定更新于 2026-05-15。以后有新变化请编辑本文件。
