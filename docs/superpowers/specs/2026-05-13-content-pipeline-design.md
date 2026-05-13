# Content Pipeline: 自媒体运营全流程编排

## 概述

一个 Claude Code 编排命令 `/content-pipeline`，串联从选题到发布的 8 步自媒体内容生产流程。采用 Command -> Agent -> Skill 架构模式，半自动化执行，两个人工门禁保证质量。

**目标平台**：微信公众号、小红书、X/Twitter（可配置）
**内容领域**：AI/科技（可配置）
**自动化程度**：半自动（关键节点人工审核）

## 架构

### 编排模式

```
/content-pipeline (Command)
  ├── Step 1: 选题        → Agent: topic-scout
  ├── Step 2: 深度调研     → Agent: researcher
  ├── Step 3: 写作初稿     → Skill: content-writer (新建)
  ├── Step 4: 审校降AI味   → Skill: humanizer + huashu-proofreading
  ├── Gate 1: 人工审核     → 存入 Obsidian, 等待确认
  ├── Step 5: 内容配图     → Skill: baoyu-article-illustrator
  ├── Gate 2: 人工定稿     → 等待确认
  ├── Step 6: 封面生成     → Skill: baoyu-cover-image
  ├── Step 7: 多平台发布   → Agent: publisher
  └── Step 8: 清理        → 删除临时工作区
```

### 组件清单

| 类型 | 名称 | 状态 | 职责 |
|------|------|------|------|
| Command | `/content-pipeline` | 新建 | 主编排入口 |
| Agent | `topic-scout` | 新建 | 多数据源选题 |
| Agent | `researcher` | 新建 | 多维度信息搜索 |
| Skill | `content-writer` | 新建 | 写作初稿 |
| Skill | `humanizer` | 已有 | 降AI味改写(29种模式检测) |
| Skill | `huashu-proofreading` | 已有 | 三遍审校(内容+AI腔+节奏) |
| Skill | `obsidian-markdown` | 已有 | Obsidian格式化 |
| Skill | `obsidian-cli` | 已有 | 操作Obsidian库 |
| Skill | `baoyu-article-illustrator` | 已有 | 文章配图生成 |
| Skill | `baoyu-cover-image` | 已有 | 封面图生成 |
| Skill | `baoyu-markdown-to-html` | 已有 | MD转微信HTML |
| Skill | `baoyu-post-to-wechat` | 已有 | 发布公众号 |
| Skill | `huashu-article-to-x` | 已有 | 长文转X短文 |
| Agent | `publisher` | 新建 | 多平台适配+发布 |

## 目录结构

### 临时工作区（流程结束后删除）

```
workspace/content-pipeline/
  {slug}/
    brief.md                 选题brief
    research.md              调研结果
    draft-v1.md              初稿
    draft-v2.md              审校后版本
    prompts/                 配图prompt记录
    images/                  生成的配图
    cover.png                封面图
```

### Obsidian 持久存储

```
Obsidian Vault/
  自媒体/
    _style/                        个人风格参考库
      voice-samples/               典型代表文章(2-3篇)
        sample-01-评测风格.md
        sample-02-教程风格.md
        sample-03-观点风格.md
      style-guide.md               个人风格指南
    _knowledge_base/               知识库(huashu-info-search 使用)
    {文章标题}/                     每篇文章一个文件夹
      {文章标题}.md                 主文(公众号完整版)
      xhs.md                      小红书适配版
      x.md                        X适配版
      images/                     本地图片副本
      _meta.md                    prompt记录+发布日志
```

### frontmatter 规范

```yaml
---
title: 文章标题
status: draft | review | illustrated | finalized | published
tags: [AI, 工具评测]
platforms:
  wechat: draft | published
  xhs: draft | published
  x: draft | published
created: 2026-05-13
slug: article-slug
cover: images/cover.png
domain: AI/科技
---
```

## 配置

`content-pipeline/config.yml`：

```yaml
domain: AI/科技

obsidian:
  vault: 自媒体
  dir: 自媒体

platforms:
  - wechat
  - xhs
  - x

data_sources:
  - aihot
  - huashu-info-search
  - web-access

style:
  voice_samples_dir: _style/voice-samples/
  style_guide: _style/style-guide.md
  default_sample_type: auto
```

## 流程详细设计

### Step 1: 多数据源选题

**执行者**: Agent `topic-scout`
**preloaded skills**: `aihot`, `huashu-info-search`, `huashu-topic-gen`, `web-access`

1. 调用 `aihot` 获取今日 AI 热点资讯
2. 调用 `huashu-info-search` 搜索近期热门话题(按 config.domain)
3. 调用 `web-access` 抓取指定 RSS/网站最新内容(可选)
4. 汇总数据源，调用 `huashu-topic-gen` 生成 3-4 个选题方案
5. 每个选题包含：标题、核心角度、大纲、工作量评估、优劣分析
6. **AskUser**: 展示选题，用户选择

**输入**: config.yml (domain, data_sources)
**输出**: `{slug}/brief.md`

### Step 2: 多维度信息搜索

**执行者**: Agent `researcher`
**preloaded skills**: `huashu-research`, `web-access`

1. 读取 `brief.md`
2. 制定搜索计划(官方文档 -> 科技媒体 -> 社区讨论 -> 竞品对比)
3. 按优先级多轮搜索，每轮保存中间结果
4. 交叉验证信息可靠性
5. 可靠信息同步保存到 `_knowledge_base/`

**输入**: `{slug}/brief.md`
**输出**: `{slug}/research.md`

### Step 3: 内容写作

**执行者**: Skill `content-writer` (新建)

1. 读取 `brief.md` + `research.md`
2. 读取 `_style/style-guide.md` 了解风格偏好
3. 按选题大纲撰写初稿(3000-5000字)
4. 标注配图位置: `<!-- IMAGE: 描述 -->`
5. 标注数据来源引用

**输入**: `{slug}/brief.md`, `{slug}/research.md`, `_style/style-guide.md`
**输出**: `{slug}/draft-v1.md`

### Step 4: 审校降 AI 味

**执行者**: Skill `humanizer` -> Skill `huashu-proofreading` (串行)

1. 读取 `_style/voice-samples/` 中匹配文章类型的样本
2. **humanizer**(第一轮): 传入 voice sample，按 29 种 AI 模式检测改写
3. **huashu-proofreading**(第二轮三遍):
   - 第一遍: 内容审校(事实核查、逻辑链)
   - 第二遍: 6 大类 AI 腔识别与改写
   - 第三遍: 节奏打磨(句长变化、段落呼吸)

**输入**: `{slug}/draft-v1.md`, `_style/voice-samples/`, `_style/style-guide.md`
**输出**: `{slug}/draft-v2.md`

### Gate 1: 人工审核

1. 调用 `obsidian-markdown` 格式化文章
2. 调用 `obsidian-cli` 存入 Obsidian: `自媒体/{标题}/{标题}.md`
3. 设置 frontmatter `status: review`
4. 提示用户: 在 Obsidian 中审核修改，完成后继续

### Step 5: 内容配图

**执行者**: Skill `baoyu-article-illustrator`

1. 从 Obsidian 读取审核后文章(用户可能已修改)
2. 分析结构，识别配图位置
3. 按 Type x Style x Palette 三维度生成配图提案
4. **AskUser**: 确认配图方案
5. 生成配图 -> 上传图床(ImgBB)获取永久链接
6. 本地副本保存到 Obsidian `images/`
7. 图床链接插入文章

**输入**: Obsidian 中的文章
**输出**: 更新 Obsidian 文章(含图片), `status: illustrated`

### Gate 2: 人工定稿

提示用户: 在 Obsidian 中查看配图效果，确认最终版

### Step 6: 封面生成

**执行者**: Skill `baoyu-cover-image`

1. 读取文章标题和摘要
2. 按 5 维度(类型、色板、渲染、文字、氛围)生成封面提案
3. **AskUser**: 确认封面方案
4. 生成封面 -> 上传图床 + 保存本地
5. 更新 frontmatter `cover: images/cover.png`

**输入**: 文章标题、摘要
**输出**: 封面图片, frontmatter 更新

### Step 7: 多平台适配 + 发布

**执行者**: Agent `publisher`
**preloaded skills**: `baoyu-markdown-to-html`, `baoyu-post-to-wechat`, `huashu-article-to-x`

按 config.platforms 依次处理:

**公众号**:
1. `baoyu-markdown-to-html` 转 WeChat HTML
2. `baoyu-post-to-wechat` 发布

**小红书**(publisher agent 内建能力):
1. 精简为 800-1500 字 + 口语化(agent 自行处理，无独立 skill)
2. 保存 `xhs.md` 到 Obsidian

**X/Twitter**:
1. `huashu-article-to-x` 浓缩为 200-500 字
2. 保存 `x.md` 到 Obsidian

各平台发布后更新 frontmatter 对应平台状态。

**输入**: 定稿文章 + 封面
**输出**: 多平台版本 + 发布状态

### Step 8: 清理中间文件

1. 确认所有文件已保存到 Obsidian
2. prompt 记录写入 `_meta.md`
3. 删除 `workspace/content-pipeline/{slug}/` 工作区
4. 更新 frontmatter `status: published`

## 图片策略

双份存储:
- **Obsidian 本地**: `images/` 目录，用于人工审核 (`![[images/xxx.png]]`)
- **图床链接**: ImgBB 永久链接，写入 markdown 正文 (`![](https://...)`)
- **公众号发布时**: `baoyu-post-to-wechat` 自动上传微信图床

## 个人风格库

位于 `_style/` 目录，审校降AI味时自动参考:

- `voice-samples/`: 2-3 篇典型代表文章，按写作类型分类
- `style-guide.md`: 个人风格规则(用词偏好、禁忌词、节奏特点)
- 审校时根据当前文章类型自动匹配最合适的 voice sample

## 需要新建的组件

1. **Command**: `.claude/commands/content-pipeline.md` -- 主编排命令
2. **Agent**: `.claude/agents/topic-scout.md` -- 选题 Agent
3. **Agent**: `.claude/agents/researcher.md` -- 调研 Agent
4. **Skill**: `.claude/skills/content-writer/SKILL.md` -- 写作 Skill
5. **Agent**: `.claude/agents/publisher.md` -- 发布 Agent
6. **Config**: `content-pipeline/config.yml` -- 配置文件

已有 Skill 直接调用，不需要修改。
