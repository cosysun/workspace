# 自媒体内容生产流水线 — 设计文档

> **版本**：v1.0  
> **创建日期**：2026-05-13  
> **定位**：AI 工具/教程为主 + 知识思辨型内容，覆盖公众号 / X / 小红书三个平台  
> **架构范式**：Command → Sub-commands → Skills（参考 `claude-code-best-practice/orchestration-workflow`）

---

## 目录

1. [总体架构](#1-总体架构)
2. [目录结构与项目自包含](#2-目录结构与项目自包含)
3. [五个 Stage 的 Skill 编排](#3-五个-stage-的-skill-编排)
4. [总编排命令 `/content-flow`](#4-总编排命令-content-flow)
5. [失败恢复、成本控制、安全](#5-失败恢复成本控制安全)
6. [实施清单](#6-实施清单)
7. [附录：skill 选型依据](#7-附录skill-选型依据)

---

## 1. 总体架构

### 1.1 设计原则

1. **分阶段编排**：5 个独立子命令（Stage 1-5），可独立跑、失败可重跑、中间可恢复
2. **3 个硬 Gate**：只在真正决定质量的节点人工确认——选题、final 稿+标题、发布预览
3. **content-factory 是垃圾场**：所有临时产物在此，发布完整体清理
4. **vault 是圣殿**：只放 `.md` 定稿，图走外链，零附件
5. **成本优先**：HTML 截图 > 现成图 > AI 生图（仅封面等关键位）
6. **项目自包含**：skill / 配置 / 命令 / 数据全装项目内，不污染全局 `~/.claude/` 和 `~/.config/`
7. **skill 选型按能力，不按来源**：huashu 管中段工序、baoyu 管发布出口、ljg 管思辨支线和小红书卡组

### 1.2 流程全景

```
┌────────────────────────────────────────────────────────┐
│  /content-flow （总编排命令，按序调 5 个 stage）          │
│  Gate 之间用 AskUserQuestion 硬停，等确认才继续           │
└──────────────┬─────────────────────────────────────────┘
               │
  ┌────────┬───┴────┬────────┬─────────┐
  ▼        ▼        ▼        ▼         ▼
Stage 1  Stage 2  Stage 3  Stage 4   Stage 5
选题     调研      写作      配图       发布
                +审校+降AI味
  │        │        │        │         │
  └── content-factory/ 所有临时产物 ────┘
                   │
                   ▼
             3 个硬 Gate：
             Gate 1：选题确认（从候选中点 1 个）
             Gate 2：final 稿 + 标题确认
             Gate 3：全套配图 + 排版预览 → 发布
                   │
                   ▼
          vault/写作/YYYY/MM/<slug>.md
          （唯一永久产物，图全外链）
```

### 1.3 skill 全局分工

| skill 来源 | 职责 | 典型 skill |
|---|---|---|
| **huashu-skills** | 内容工厂中段主力（选题/调研/编辑/审校/配图） | huashu-topic-gen, huashu-research, huashu-article-edit, huashu-proofreading, huashu-wechat-image, huashu-article-to-x, huashu-video-check |
| **baoyu-skills** | 发布出口 + 采集工具 + 排版预览 | baoyu-post-to-wechat, baoyu-post-to-x, baoyu-url-to-markdown, baoyu-youtube-transcript, baoyu-danger-x-to-markdown, baoyu-markdown-to-html, baoyu-cover-image, baoyu-diagram, baoyu-format-markdown |
| **ljg-skills** | 知识思辨支线 + 小红书卡组 | ljg-think, ljg-rank, ljg-writes, ljg-paper, ljg-card |
| **humanizer** | AI 腔去除（主力）带 voice calibration | humanizer |
| **tencent-cos-skill** | 图床（跨平台统一图片 URL + vault 永久显示） | tencent-cos-skill |
| **aihot** | AI 圈当日热点 | aihot |
| **web-access** | Layer 0 基础联网能力（所有需要搜索的 skill 默认底层依赖） | web-access |

---

## 2. 目录结构与项目自包含

### 2.1 项目根

**项目根 = `workspace/`**，所有东西收拢在这个目录下，不碰用户全局配置。

### 2.2 完整目录树

```
workspace/                                 # 项目根（$PROJECT_ROOT）
│
├── .env.example                           # 环境变量模板（入 git）
├── .env                                   # 实际配置（.gitignore）
├── .gitignore
│
├── .claude/                               # Claude Code 项目级配置
│   ├── commands/                          # 5 个 stage 命令 + 1 个总编排
│   │   ├── content-flow.md
│   │   ├── content-pick.md
│   │   ├── content-research.md
│   │   ├── content-write.md
│   │   ├── content-illustrate.md
│   │   └── content-publish.md
│   ├── skills/                            # 项目级 skill（从各仓库 cp 进来）
│   │   ├── aihot/
│   │   ├── web-access/
│   │   ├── humanizer/
│   │   ├── huashu-topic-gen/
│   │   ├── huashu-info-search/
│   │   ├── huashu-research/
│   │   ├── huashu-article-edit/
│   │   ├── huashu-proofreading/
│   │   ├── huashu-wechat-image/
│   │   ├── huashu-article-to-x/
│   │   ├── huashu-video-check/
│   │   ├── ljg-writes/
│   │   ├── ljg-think/
│   │   ├── ljg-rank/
│   │   ├── ljg-card/
│   │   ├── ljg-paper/
│   │   ├── baoyu-url-to-markdown/
│   │   ├── baoyu-youtube-transcript/
│   │   ├── baoyu-danger-x-to-markdown/
│   │   ├── baoyu-format-markdown/
│   │   ├── baoyu-diagram/
│   │   ├── baoyu-cover-image/
│   │   ├── baoyu-markdown-to-html/
│   │   ├── baoyu-post-to-wechat/
│   │   ├── baoyu-post-to-x/
│   │   └── tencent-cos-skill/             # 图床（COS 对象存储）
│   └── settings.local.json                # 项目 env 注入 + 权限
│
├── .baoyu-skills/                         # baoyu 项目级配置（EXTEND.md 走这里）
│   ├── baoyu-post-to-wechat/EXTEND.md
│   └── baoyu-post-to-x/EXTEND.md
│
├── content-factory/                       # 临时工作区（发布完清理）
│   ├── _templates/
│   │   ├── brief.md                       # 选题 brief 模板
│   │   └── audit-checklist.md             # 三遍审校 checklist
│   ├── briefs/
│   │   └── <slug>.md
│   ├── _knowledge_base/                   # 跨文章调研沉淀（保留，不删）
│   │   └── <主题>/YYYY-MM-DD-source.md
│   ├── drafts/
│   │   └── <slug>/
│   │       ├── v1-初稿.md
│   │       ├── v2-内容审校.md
│   │       ├── v3-降AI味.md
│   │       ├── final.md                   # 图引用为本地路径
│   │       ├── final-with-urls.md         # 图引用替换为外链
│   │       └── audit.md                   # 审校 checklist 打勾记录
│   └── images/
│       └── <slug>/                       # 本地候选图（Stage 4 产出）；发布后清 local，COS 上永久保留
│           ├── cover.png
│           ├── image-1.png
│           ├── image-N.png
│           ├── cards/                     # ljg-card 输出的小红书卡组
│           ├── image_map.json             # Stage 4.5 产出：本地路径 → COS URL 映射
│           └── prompts.md                 # 配图 prompt 留底
│
├── docs/
│   └── superpowers/specs/
│       └── 2026-05-13-self-media-workflow-design.md   # 本文档
│
└── knowledge/                             # Obsidian vault
    └── 写作/
        ├── 00-README-路由.md              # vault 路由说明（给 AI + 给你）
        └── YYYY/MM/
            └── <slug>.md                  # ← 唯一永久产物
```

### 2.3 slug 规则

**格式**：`YYYY-MM-DD-<标题或关键词>`

- 中文、英文都可
- 文件名安全化：去除标点、替换空格为 `-`、最长 40 字符
- 示例：
  - `2026-05-13-claude-skills-入门`
  - `2026-05-13-我用-cursor-写了一周`
  - `2026-05-13-AI-Agent-调度原理`

### 2.4 配置：`.env.example`

```bash
# ==== 项目根 ====
# 其他路径基于这个
PROJECT_ROOT="/Users/andysun/work/ai-workflow/workspace"

# ==== Obsidian vault ====
VAULT_ROOT="${PROJECT_ROOT}/knowledge"
VAULT_WRITING_DIR="${VAULT_ROOT}/写作"

# ==== content-factory 工作区 ====
CF_ROOT="${PROJECT_ROOT}/content-factory"
CF_TEMPLATES="${CF_ROOT}/_templates"
CF_BRIEFS="${CF_ROOT}/briefs"
CF_KNOWLEDGE_BASE="${CF_ROOT}/_knowledge_base"
CF_DRAFTS="${CF_ROOT}/drafts"
CF_IMAGES="${CF_ROOT}/images"

# ==== 公众号（走 baoyu-post-to-wechat）====
WECHAT_APPID=
WECHAT_SECRET=
WECHAT_DEFAULT_THEME=grace
WECHAT_DEFAULT_COLOR=blue
WECHAT_AUTHOR=

# ==== X ====
X_AUTH_TOKEN=
X_CSRF_TOKEN=
X_COOKIE=

# ==== 腾讯云 COS（图床）====
# 推荐：用子账号密钥（scope 限 COS-only）；可选用 skill 自带的 encrypt-env 把 .env 加密为 .env.enc
TENCENT_COS_SECRET_ID=
TENCENT_COS_SECRET_KEY=
TENCENT_COS_REGION=ap-shanghai
TENCENT_COS_BUCKET=
TENCENT_COS_DOMAIN=                         # 自定义域名（推荐 CDN）；留空用默认 cos 域名
TENCENT_COS_WRITING_PREFIX=writing          # 图片在 bucket 内的前缀：<bucket>/writing/YYYY/MM/<slug>/...

# ==== 成本控制 ====
AI_IMAGE_BUDGET_PER_ARTICLE=1   # 每篇文章 AI 生图张数上限

# ==== AI 味目标 ====
AI_PROOFREAD_TARGET=30          # 目标 AI 检测率 ≤30%
```

**配置分发规则**：
- baoyu 系列的 `EXTEND.md` **强制走项目级**（`.baoyu-skills/<skill>/EXTEND.md`）——baoyu 的查找优先级里"Project 级"排第一，天然支持
- ljg 系列的 `~/Documents/notes/` 输出目录**通过编排命令的"适配层"拦截**（不改 skill 本体），跑完立刻 mv 进 `content-factory/drafts/<slug>/`
- huashu 系列的 `_knowledge_base/` 相对路径**通过 `cd content-factory` 再调用**让它落位到工作区

### 2.5 skill 引入方式

**决定：A 方案——把 skill 拷贝到 `.claude/skills/`**

| 方式 | 选择 | 理由 |
|---|---|---|
| A. cp 到项目内 | ✅ **采用** | 版本稳定 > 追新；内容工厂不应被 skill 上游变更打断 |
| B. symlink 到源仓库 | ❌ | 仓库移动/重命名就崩 |
| C. git submodule | ❌ | 操作门槛高 |

**升级协议**：发现某 skill 有功能更新且值得跟进时，手动 `cp -r <源>/skills/<name>/ .claude/skills/<name>/` 并提交一次 commit 记录版本变化。

### 2.6 两个模板

#### `content-factory/_templates/brief.md`

```markdown
# 写作 Brief

## 基本信息
- slug：
- 主题：
- 目标读者：
- 任务类型：[工具教程 | 知识思辨]
- 目标平台：[公众号 | X | 小红书]   （多选）
- 公众号预计字数：

## 核心需求
### 文章目的：
### 必须包含：
-

### 必须排除：
-

### 是否需要真实实操测试：[ ] 是  [ ] 否

### 参考资料：
-

---

## 调研摘要（Stage 2 填）
（Stage 2 结束后在这里写一段调研精华 + 大纲）
```

#### `content-factory/_templates/audit-checklist.md`

```markdown
# 三遍审校 Checklist

文章 slug：
起始版本：v1  →  v2（内容） →  v3（风格/降AI味） →  final（细节）

## 第一遍：内容审校（v1 → v2）

### 事实准确性
- [ ] 数据/百分比/时间准确
- [ ] 产品名/公司名/人名正确
- [ ] 技术术语使用正确
- [ ] 所有外链有效
- [ ] 引用来源标注清楚

### 逻辑清晰性
- [ ] 前后论述无矛盾
- [ ] 推理过程合理
- [ ] 论据支撑观点

### 结构合理性
- [ ] 开头引入自然
- [ ] 各部分过渡流畅
- [ ] 没有跑题
- [ ] 结尾有收束

### 真实性
- [ ] 所有案例真实可验证
- [ ] 无编造数据

## 第二遍：风格审校（v2 → v3）—— humanizer + huashu-proofreading 跑

### 删套话
- [ ] "在当今时代" / "在...大背景下"
- [ ] "综上所述" / "总而言之"
- [ ] "值得注意的是" / "需要强调的是"
- [ ] "随着...的发展"

### 拆 AI 句式
- [ ] "不仅...而且..." 堆叠
- [ ] "一方面...另一方面..."
- [ ] "既...又..."
- [ ] "不是...而是..." 连续 3 次以上

### 换书面词为口语
- [ ] "显著提升" → 具体数字
- [ ] "充分利用" → "用好"
- [ ] "进行操作" → 直接动词（点击/输入）
- [ ] "实现功能" → "做到"

### 去列表癖
- [ ] "首先/其次/最后" 过度使用
- [ ] 能散文说清的不列表
- [ ] 小标题不密集（非每 200 字一个）

### 去 -ing 伪深度（humanizer 重点）
- [ ] highlighting/underscoring/emphasizing/symbolizing/reflecting 过度使用

### 去 em dash 滥用（humanizer 重点）
- [ ] 每段 em dash 不超过 1 个

## 第三遍：细节打磨（v3 → final）

### 强开头
- [ ] 第一句让人想读下一句
- [ ] 不铺垫、不背景、不"自古以来"

### 句子节奏
- [ ] 长短错落（不全长或全短）
- [ ] 同一种句式全文最多一次

### 多巴胺密度
- [ ] 每 3-5 段读者有一次"原来如此"

### 微幽默
- [ ] 有 1-2 处微幽默（不做作）

### 概念把手
- [ ] 复杂概念有类比或具体例子

### 格式
- [ ] 标点规范
- [ ] 无错字
- [ ] 加粗/斜体不滥用
```

### 2.7 vault 路由说明 `knowledge/写作/00-README-路由.md`

```markdown
# 写作 Vault 路由

这个目录是我的 Obsidian vault，只存**已发布**文章的定稿。

## 目录约定

```
写作/YYYY/MM/<slug>.md
```

- `YYYY/MM` 按发布月份归档
- 一篇文章 = 一个 .md 文件
- **图全走外链**，无本地附件
- 发布记录在文末段落：公众号/X/小红书 URL + 时间

## 你（AI）可能被要求做的事

### 1. 找"我之前写过的某主题"
- 用 grep/ripgrep 搜标题和全文
- 例：`rg "claude" knowledge/写作/ --type md`

### 2. 取"我的写作样本"给 humanizer 做 voice calibration
- 按时间倒序取最近 N 篇
- 读正文部分（跳过末尾"发布记录"段）
- 命令参考：`ls -t knowledge/写作/**/*.md | head -5`

### 3. 判断某个选题"我是不是写过"
- grep 标题 + 首段，人工确认
- 重复选题提示用户

### 4. 读发布历史做数据回顾
- 文末"发布记录"段落的链接和时间是唯一真相源
- 扫全部 .md 的这段，能统计每月产量、各平台分布

## 禁区

- **不要往这个目录写中间文件**（草稿、brief、_knowledge_base 都在 `content-factory/`）
- **不要修改已发布文章的正文**——除非用户明确要求"修订这篇"
- **不要删文件**——归档的东西不动

## 特殊文件

- `00-README-路由.md`（本文件）：约定说明，不是文章
- `00-*.md` 前缀保留给以后的索引、标签页、统计仪表盘

---

> 约定更新于 2026-05-13。以后有新变化请编辑本文件。
```

---

## 3. 五个 Stage 的 Skill 编排

### Stage 1：多源选题 — `/content-pick`

**目标**：产出 3-4 个候选选题 → 你点 1 个 → 生成 brief。

| 子步骤 | skill | 输出 |
|---|---|---|
| 1.1 抓 AI 圈当日热点 | `aihot` | 内存 |
| 1.2 多渠道信息搜索 | `huashu-info-search`（底层走 `web-access`） | `content-factory/_knowledge_base/<主题>/` |
| 1.3 生成 3-4 个选题方案（含切入角度、目标读者、预期效果、热度依据） | `huashu-topic-gen` | 内存 |
| 1.4（仅思辨型选题）深度思辨 | `ljg-think` 或 `ljg-rank` | 内存 |

**🔴 Gate 1**：`AskUserQuestion` 列出候选 + 热度依据 → 你选 1 个 + 确认 `task_type` + 目标平台多选 → 编排用 brief 模板生成 `content-factory/briefs/<slug>.md`。

**状态判定（从 content-factory 文件判断进度，不单设状态文件）**：
- `briefs/<slug>.md` 存在 → Stage 1 完成

---

### Stage 2：多维调研 — `/content-research <slug>`

**目标**：把选题挖到能写出信息密度。

| 子步骤 | skill | 输出 |
|---|---|---|
| 2.1 主调研（结构化、实时落盘） | `huashu-research` | `content-factory/_knowledge_base/<主题>/research-*.md` |
| 2.2 网页采集 | `baoyu-url-to-markdown` | 同上 |
| 2.3 视频/X 采集（按需） | `baoyu-youtube-transcript`、`baoyu-danger-x-to-markdown` | 同上 |
| 2.4 论文（涉及时） | `ljg-paper` | 同上 |
| 2.5 实操（工具教程类） | `gstack` 或 `browse` 真用一下，截图 | `content-factory/images/<slug>/`（仅作为证据图候选） |

**中间交付**：编排把调研摘要 + 大纲写到 `briefs/<slug>.md` 末尾的"调研摘要"段落。

**无硬 Gate**——中间产物在 Obsidian 里翻即可，你想再补调研就 `/content-flow --from research --slug <slug>` 重跑。

**状态判定**：`briefs/<slug>.md` 末尾存在"调研摘要"段落 → Stage 2 完成

---

### Stage 3：写作 + 三遍审校 — `/content-write <slug>`

**目标**：从大纲到 final 稿，AI 味 ≤ `AI_PROOFREAD_TARGET`（默认 30%）。

#### 3.0 创意排水（5-10 分钟）

先跑一次"排水草稿"：让 Claude 把**最套路的想法**全写一遍（约 300 字），标 `[drainage]` 存 `drafts/<slug>/drainage.md` 不用。真正写初稿时避开这些套路。

#### 3.1 初稿 v1

**按 `task_type` 分流**：

- `工具教程` → Claude 直接按大纲写，落 `drafts/<slug>/v1-初稿.md`
- `知识思辨` → `ljg-writes`（输出到 `~/Documents/notes/*.md`），编排跑完立刻：
  ```bash
  mv ~/Documents/notes/{时间戳}__write.md drafts/<slug>/v1-初稿.md
  ```

#### 3.2 内容审校 → v2

- `huashu-article-edit` 走"事实/逻辑/结构"一遍
- 产出 `drafts/<slug>/v2-内容审校.md`
- 同时在 `drafts/<slug>/audit.md` 的第一遍 checklist 打勾

#### 3.3 风格审校（降 AI 味）→ v3

**双重保险**：

- **humanizer**（带 voice sample）：
  - Voice sample 来源：`knowledge/写作/` 按时间倒序取最近 5 篇的正文（跳过末尾"发布记录"段落）
  - 如果 vault 里还没有文章，用 humanizer 默认 PERSONALITY 配置
  - 覆盖 10+ AI 模式：em dash 滥用、rule of three、-ing 伪深度、promotional language 等
- **huashu-proofreading** 第二遍：
  - 6 大 AI 腔识别：套话/AI 句式/书面词/列表癖/对比狂/完美总结
  - 目标 AI 检测率 ≤ 30%

落盘 `drafts/<slug>/v3-降AI味.md`，audit.md 第二遍打勾。

#### 3.4 细节打磨 → final

- Claude 跑 Chad Nauseam 5 技巧：强开头、句子节奏、多巴胺密度、微幽默、概念把手
- `baoyu-format-markdown` 做标点排版统一
- 落盘 `drafts/<slug>/final.md`，audit.md 第三遍打勾

#### 3.5 三轮标题拟定

- **第一轮**：爆款 7 要素（金钱数字/暴力隐喻/死亡替代/捷径效率/异常悬念）→ 5 个候选
- **第二轮**：自然风格（无套路，符合作者风格）→ 3 个候选
- **第三轮**：组合优化（自然风格为基础 + 注入 1-2 个爆款要素）→ 2 个候选
- 10 个候选写入 `final.md` 顶部 YAML 块暂存区

#### 🔴 Gate 2：`AskUserQuestion`

1. 列 10 个标题候选，你选 1 个（或自写）
2. 编排把选定标题写回 `final.md` 顶部：移除 YAML 暂存区里的 10 个候选，只保留 `title: <选中>` 字段
3. 提示你打开 `drafts/<slug>/final.md` 在 Obsidian 里直接改正文
4. 等你回复"final 确认"或"需要重写 Stage 3.X"继续

**状态判定**：`drafts/<slug>/final.md` 存在且 YAML 头只有一个 `title:` 字段（标题候选区已清理） → Stage 3 完成

---

### Stage 4：配图 — `/content-illustrate <slug>`

**核心约束**：成本分层，AI 生图是最后手段。

```
Tier 1 [零成本] HTML 截图           ← 默认优先
Tier 2 [零成本] 现成公共图片         ← 次选
Tier 3 [零成本] HTML 改稿后复渲染
Tier 4 [高成本] AI 生图              ← 每篇文章最多 $AI_IMAGE_BUDGET_PER_ARTICLE 张
```

**按平台分工**：

| 平台 | skill | 默认路径 | AI 生图位 |
|---|---|---|---|
| **公众号正文配图** | `huashu-wechat-image` | **强制走 HTML 截图路径**（双路径中选零成本） | ❌ 不允许 |
| **公众号架构/流程图** | `baoyu-diagram` | SVG，零成本 | ❌ 不允许 |
| **公众号封面** | `baoyu-cover-image` | AI 生图 | ✅ 唯一允许位（1 张） |
| **小红书卡组** | `ljg-card -m`（多卡）+ `ljg-card -b`（大字附件）+ `ljg-card -i`（信息图） | 全 HTML 截图 | ❌ 不允许 |
| **X 主图** | 复用公众号封面 | — | — |
| **统一图床** | `tencent-cos-skill`（在 Stage 4.5 统一上传） | 生成跨平台通用 URL | — |

**输出位置**：全部落 `content-factory/images/<slug>/`，含 `prompts.md` 留底所有 prompt。

**ljg-card 适配层**：它默认输出到 `~/Downloads/`，编排跑完立刻：
```bash
mv ~/Downloads/{刚生成的 PNG} content-factory/images/<slug>/cards/
```

**图引用**：Stage 4 结束时 `final.md` 里的图还是本地路径（`./images/cover.png` 等）。

**成本报告**：Stage 4 结束输出一行摘要：
```
Stage 4 完成。配图成本：
  HTML 截图 × 6  [零成本]
  现成图 × 2    [零成本]
  AI 生图 × 1   [~$0.04]
  总成本 ≈ $0.04
```

**无硬 Gate**——不满意某张图让编排重跑对应 skill。

**状态判定**：`content-factory/images/<slug>/cover.png` 存在 → Stage 4 完成

---

### Stage 4.5：上传到 COS 图床 — `/content-illustrate` 末尾自动执行

**目标**：把所有图一次性上到腾讯云 COS，获得跨平台通用 URL，再把 `final.md` 里的本地图路径替换成 COS URL。

为什么这一步独立于发布：
- 一次上传，三平台（公众号/X/小红书）共用同一批 URL
- vault 最终只存 .md，图引用走 COS → vault 100% 纯净
- 国内 CDN 加速，Obsidian 打开也快

**执行步骤**：

1. 从 `final.md` 扫描所有 `![](./images/xxx.png)` 或 `![](./images/cards/xxx.png)` 的图片引用，得到"被实际引用"的图清单（未被引用的候选图不上传）
2. 对清单中每张图，调 `tencent-cos-skill` 上传：
   ```
   tencent-cos-skill upload \
     --file content-factory/images/<slug>/<file> \
     --key ${TENCENT_COS_WRITING_PREFIX}/YYYY/MM/<slug>/<file>
   ```
3. 收集每张图返回的公共 URL（或 `https://${TENCENT_COS_DOMAIN}/<key>`），写入 `content-factory/images/<slug>/image_map.json`：
   ```json
   {
     "./images/cover.png": "https://img.yourdomain.com/writing/2026/05/claude-skills/cover.png",
     "./images/cards/card-1.png": "https://img.yourdomain.com/writing/2026/05/claude-skills/cards/card-1.png"
   }
   ```
4. 用 `image_map.json` 做路径替换，生成 `drafts/<slug>/final-with-urls.md`

**状态判定**：`drafts/<slug>/final-with-urls.md` 存在 → Stage 4.5 完成

**成本**：
- COS 存储 ~¥0.12/GB/月，一年几百篇文章 ≈ 几块钱
- CDN 流量个人号级别几乎忽略
- 首次部署要开腾讯云账号 + 建子账号密钥 + 建桶（一次性）

**安全**：
- `tencent-cos-skill` 内置 `encrypt-env` 支持 `.env.enc` 加密存储密钥
- 桶 ACL 推荐设为"公共读、私有写"——外人能访问图片但不能修改

---

### Stage 5：发布 + 归档 + 清理 — `/content-publish <slug>`

#### 5.1 排版预览

`baoyu-markdown-to-html` 把 `final-with-urls.md` 转成多主题 HTML 放本地 → 浏览器打开预览（预览里的图走 COS URL，直接显示）。

#### 5.2 标题/封面 QA

`huashu-video-check`——名字虽是 video，能力是"标题+封面承接性评估"（MrBeast 公式），对公众号同样适用。输出评分 + 优化建议。

#### 5.3 跨平台改写

- `huashu-article-to-x` 把 3000-5000 字长文压成 200-500 字 X 版本（金句/数据/价值主张），落 `drafts/<slug>/x-post.md`（X 正文里如需配图也用 COS URL）
- 小红书已有 `ljg-card` 卡组 + 一句话文案模板，不需要改写

#### 🔴 Gate 3：`AskUserQuestion`

展示：
- `baoyu-markdown-to-html` 的预览 HTML 路径（你点开看）
- 选中的标题
- 封面图（COS URL）
- `huashu-video-check` 评分和建议
- X 短版预览

选项：`发布` / `返回修改`。

#### 5.4 发布到各平台

**顺序**：公众号 → X → 小红书

- **公众号**：`baoyu-post-to-wechat` 走 `final-with-urls.md`
  - API 通道优先，Chrome CDP 备份
  - 图的 COS URL 被 baoyu 读到后会自动下载并上传到公众号永久素材库（微信要求图必须托管在 mmbiz.qpic.cn 域下，无法跳过）——这个动作**内部发生**，我们不需要关心微信那边的 URL
  - 返回文章 URL
- **X**：`baoyu-post-to-x` 走 `drafts/<slug>/x-post.md`
  - 图的 COS URL 被 baoyu 读到后会自动下载并上传到 X media
  - 返回推文 URL
- **小红书**：编排打开 `content-factory/images/<slug>/cards/` 目录 + 一句话文案 → **手动上传**（小红书客户端） → 你上传完跟编排回复"小红书已发"

#### 5.5 收集发布 URL 并生成定稿

编排从 Stage 5.4 返回值收集：
- 公众号文章 URL + 发布时间
- X 推文 URL + 发布时间
- 小红书卡片数量 + 你提供的发布时间

**不做任何图路径替换**——`final-with-urls.md` 里的图引用已经是 COS URL（永久、跨平台、Obsidian 可渲染）。

#### 5.6 搬进 vault

```bash
# 按今天日期建归档目录
mkdir -p knowledge/写作/YYYY/MM/
cp drafts/<slug>/final-with-urls.md knowledge/写作/YYYY/MM/<slug>.md

# 在文件末尾追加"发布记录"段落
cat >> knowledge/写作/YYYY/MM/<slug>.md <<EOF

---

**发布记录**
- 公众号：<微信文章 URL> · YYYY-MM-DD HH:MM
- X：<X 推文 URL> · YYYY-MM-DD HH:MM
- 小红书：N 张卡组 · YYYY-MM-DD HH:MM
EOF
```

**vault 内文件举例**：

```markdown
# Claude Skills 入门：让 Claude 学会任何技能

正文内容...

![](https://img.yourdomain.com/writing/2026/05/claude-skills/cover.png)

更多正文...

---

**发布记录**
- 公众号：https://mp.weixin.qq.com/s/xxx · 2026-05-13 10:30
- X：https://x.com/xxx/status/xxx · 2026-05-13 11:00
- 小红书：6 张卡组 · 2026-05-13 12:00
```

#### 5.7 清理

```bash
rm -rf content-factory/briefs/<slug>.md
rm -rf content-factory/drafts/<slug>/       # v1, v2, v3, final, final-with-urls, audit, drainage, x-post 全清
rm -rf content-factory/images/<slug>/       # 本地候选图、卡组 PNG、image_map.json 全清
# content-factory/_knowledge_base/<主题>/ 保留 —— 跨文章资产
# 腾讯云 COS 上 writing/YYYY/MM/<slug>/ 保留 —— vault .md 依赖它们显示，切勿删除
```

**关键约束**：清理脚本**必须不能动 COS**。COS 上的图是 vault 的后备数据源，删了 vault 里的 .md 就成"图挂了的文档"。

**状态判定**：`knowledge/写作/YYYY/MM/<slug>.md` 存在 + `content-factory/briefs/<slug>.md` 不存在 → Stage 5 完成，全流程结束

---

## 4. 总编排命令 `/content-flow`

### 4.1 命令契约

```
/content-flow                             # 新任务：从 Stage 1 开始
/content-flow --from research --slug X    # 从 Stage 2 重跑
/content-flow --from write --slug X       # 从 Stage 3 重跑
/content-flow --from illustrate --slug X  # 从 Stage 4 重跑
/content-flow --from publish --slug X     # 从 Stage 5 重跑
/content-flow --resume <slug>             # 自动检测断点并续跑
/content-flow --cleanup <slug>            # 仅做清理（发布已完成但清理失败时）
```

### 4.2 状态机

编排不维护单独的状态文件，**从 content-factory / vault 的文件存在性推断状态**：

```
[开始]
  │
  ▼
content-factory/briefs/<slug>.md 存在？ ─ 否 ──→ 跑 Stage 1
  │ 是
  ▼
briefs/<slug>.md 含"调研摘要"段？ ─ 否 ──→ 跑 Stage 2
  │ 是
  ▼
drafts/<slug>/final.md 有 title？ ─ 否 ──→ 跑 Stage 3
  │ 是
  ▼
images/<slug>/cover.png 存在？ ─ 否 ──→ 跑 Stage 4
  │ 是
  ▼
drafts/<slug>/final-with-urls.md 存在？ ─ 否 ──→ 跑 Stage 4.5（上传 COS + 替换路径）
  │ 是
  ▼
knowledge/写作/YYYY/MM/<slug>.md 存在？ ─ 否 ──→ 跑 Stage 5
  │ 是
  ▼
content-factory/briefs/<slug>.md 存在？ ─ 是 ──→ 只跑 5.7 清理
  │ 否
  ▼
[全流程完成]
```

### 4.3 目录适配层

每个 skill 调用前后的"搬运"逻辑，由 Stage 命令统一封装：

| skill | 它会写到哪 | 编排搬到哪 |
|---|---|---|
| `huashu-research` / `huashu-info-search` / `huashu-video-check` | `_knowledge_base/`（相对当前工作目录） | **调用前 `cd content-factory`**，原生落位到 `content-factory/_knowledge_base/` |
| `ljg-writes` / `ljg-think` / `ljg-plain` | `~/Documents/notes/` | 调用前记时间戳 `T0=$(date +%s)`，调用后：`find ~/Documents/notes -newer <mark_file> -name "*.md" -exec mv {} content-factory/drafts/<slug>/v1-初稿.md \;` |
| `ljg-card` | `~/Downloads/` | 同上思路，`find ~/Downloads -newer <mark> -name "*.png" -exec mv {} content-factory/images/<slug>/cards/ \;` |
| `tencent-cos-skill` | COS（远端） | 返回 URL，编排汇总到 `image_map.json` |
| `baoyu-post-to-wechat` | 公众号 API | 返回文章 URL（图片上传是 baoyu 内部动作） |
| `baoyu-post-to-x` | X API | 返回推文 URL |

### 4.4 人机交互总量

一次完整流程你的介入总数：
- **Gate 1**（选题）：1 次 `AskUserQuestion` + 点选
- **Gate 2**（final + 标题）：1 次 + 可能在 Obsidian 里手改 final.md
- **Gate 3**（发布预览）：1 次确认
- **小红书手动上传**：1 次"已发"回复

**合计 4 次人工交互**。其他 stage 之间中间产物你想看就翻 `content-factory/drafts/<slug>/`，不会强行要你介入。

---

## 5. 失败恢复、成本控制、安全

### 5.1 失败恢复

每个 Stage 都是**幂等**的，重跑同一个 stage 不会弄脏上次结果。

| 场景 | 恢复方式 |
|---|---|
| 网络中断（调研/发布中途） | `/content-flow --resume <slug>` 自动续跑 |
| 某 skill 报错 | 编排捕获异常 → 提示+保留中间产物 → 你手动修或换 skill |
| 发布部分成功（公众号发了，X 没发） | 发布记录段落只记已成功平台；清理延后，直到全部 OK 或 `--cleanup` |
| Gate 2 后反悔 | `/content-flow --from write --slug <slug>` 重走 Stage 3 |
| Gate 3 后反悔 | 尚未发布，`/content-flow --from illustrate --slug <slug>` 重做配图 |

### 5.2 成本控制

**AI 生图预算**：
- 每篇 `AI_IMAGE_BUDGET_PER_ARTICLE`（默认 1 张，即封面）
- Stage 4 结束输出成本摘要
- 如果超预算，编排主动用 `AskUserQuestion` 让你确认超额

**token 成本**：
- huashu-research 内部已并行，编排**不再外层并行**（避免双重并发）
- 其他 stage 顺序执行
- 每个 stage 完成后 context 落盘，总编排只需读摘要

**典型一篇文章总成本估算**：
- API 调用 token：~$0.3-1.5（各 skill LLM 调用）
- AI 生图：~$0.04（封面 1 张）
- **合计 ~$0.5-2**

### 5.3 安全

| 风险 | 防护措施 |
|---|---|
| 清理误删 vault | 清理脚本路径写死黑名单，任何含 `knowledge/` 的路径禁止 `rm -rf` |
| 清理误删 COS 图 | 清理脚本**不调用** `tencent-cos-skill` 的任何删除 action；COS 桶 ACL 设为"公共读、私有写"防止外部误改 |
| 发布前最后反悔 | Gate 3 预览失败/发布失败不触发归档和清理 |
| 小红书误发 | 不自动发小红书，等你确认回复 |
| 凭证泄露 | `.env` 入 `.gitignore`；baoyu EXTEND.md 也入 gitignore；COS 用**子账号密钥**（scope 限 COS-only），推荐用 `tencent-cos-skill` 自带 `encrypt-env` 把 .env 加密为 .env.enc；commit 前 scan 敏感词 |
| skill 异常 | 每个 skill 调用包在 try-catch 里，失败保留中间产物不静默 |

---

## 6. 实施清单

### Phase 0：准备（30 分钟）

```bash
# 1. 建工作目录
mkdir -p workspace/content-factory/{_templates,briefs,_knowledge_base,drafts,images}
mkdir -p workspace/.claude/{commands,skills}
mkdir -p workspace/.baoyu-skills
mkdir -p workspace/knowledge/写作
mkdir -p workspace/docs/superpowers/specs

# 2. 写两个模板（内容见 §2.6）
#    content-factory/_templates/brief.md
#    content-factory/_templates/audit-checklist.md

# 3. 写 vault 路由文件（内容见 §2.7）
#    knowledge/写作/00-README-路由.md

# 4. 写 .env.example 和 .gitignore
#    .env.example 内容见 §2.4
#    .gitignore 加入：.env, .baoyu-skills/**/EXTEND.md

# 5. cp skill 到 .claude/skills/
#    27 个 skill 见 §2.2

# 6. 配置 baoyu 凭证（项目级 EXTEND.md）
#    .baoyu-skills/baoyu-post-to-wechat/EXTEND.md
#    .baoyu-skills/baoyu-post-to-x/EXTEND.md

# 7. 配置腾讯云 COS（图床）
#    - 登录腾讯云，开通 COS 服务
#    - 创建子账号，分配 COS-only 权限，生成 SecretId/SecretKey
#    - 创建 bucket（建议：名称带随机后缀；地域 ap-shanghai 或就近；ACL: 公共读私有写）
#    - 可选：开 CDN 加速、绑自定义域名
#    - 填入 .env 的 TENCENT_COS_* 变量
#    - 跑 `tencent-cos-skill setup.sh --check-only` 验证连通
#    - 推荐：`tencent-cos-skill encrypt-env` 把 .env 加密成 .env.enc

# 8. 公众号后台配 IP 白名单（首次）
#    登录 mp.weixin.qq.com → 设置与开发 → 基本配置 → IP 白名单
#    加入 curl ifconfig.me 得到的 IP
```

### Phase 1：写 5 个 Stage 子命令

按顺序实现，每个实现完立刻用一个真实任务跑通：

1. `.claude/commands/content-pick.md` — Stage 1
2. `.claude/commands/content-research.md` — Stage 2
3. `.claude/commands/content-write.md` — Stage 3
4. `.claude/commands/content-illustrate.md` — Stage 4
5. `.claude/commands/content-publish.md` — Stage 5

**每个命令的骨架**：
```markdown
---
description: Stage N - <作用>
argument-hint: [--slug <slug>]
---

# Stage N: <作用>

读取：content-factory/<上一阶段产物>

调用 skill：<列表>

适配层：<搬运动作>

输出：content-factory/<产物>

下一步：Gate N（如适用）或 Stage N+1
```

### Phase 2：写总编排命令

6. `.claude/commands/content-flow.md`
   - 状态机检测（§4.2）
   - `--from / --resume / --cleanup` 参数
   - 逐个调 Stage 命令
   - 在 Gate 处暂停 `AskUserQuestion`

### Phase 3：联调 + 试水 3 篇

| 试水文章 | 目的 |
|---|---|
| 第 1 篇：纯工具教程 | 验证 `task_type=工具教程` 支线走通 |
| 第 2 篇：知识思辨型 | 验证 `task_type=知识思辨` + ljg-writes + 适配层 |
| 第 3 篇：综合 | 验证成本控制、humanizer voice sample 复用、跨平台改写 |

试水验收标准：
- 每篇成本 ≤ $2
- AI 检测率 ≤ 30%（`huashu-proofreading` 自检）
- vault 最终文件正文干净、图外链可显示、发布记录齐全
- content-factory/<slug>/ 发布后被清理干净

### Phase 4：调优

观察 3 篇试水数据调整：
- 每次 `huashu-wechat-image` / `huashu-xhs-image` 你选的风格，沉淀成未来的"配图指引"模板
- `huashu-proofreading` 的 6 大 AI 腔中哪几类高频出现在你的写作里，在 `audit-checklist.md` 里加重点提示
- 如果某 skill 效果不理想，回来修订 §3 的 skill 选型

---

## 7. 附录：skill 选型依据

### 7.1 为什么这样选（关键决策）

| 决策 | 理由 |
|---|---|
| **发公众号走 baoyu-post-to-wechat 而非 md2wechat** | baoyu 有 API + CDP 双通道、内置 md→html、多账号、外链自动转底部引用、4 主题×13 色方案，功能覆盖更广 |
| **保留 baoyu-markdown-to-html** | baoyu-post-to-wechat 内置的 md→html 是为发布快转做的；baoyu-markdown-to-html 是独立排版工具，能多主题预览调整。两个分工：一个管美观，一个管发出去 |
| **huashu-proofreading + humanizer 双保险降 AI 味** | huashu-proofreading 是结构化三遍审校（6 大 AI 腔），humanizer 基于 Wikipedia "Signs of AI writing"（10+ 模式 + voice calibration）。前者是流程+语义，后者是语言学+可校准，互补 |
| **不用 ljg-plain 做降 AI 味** | ljg-plain 是"说人话给 12 岁听"，会重写内容结构，可能失真；humanizer 只换 AI 套话不动信息 |
| **小红书用 ljg-card 而不是 huashu-xhs-image** | 你的需求是"小红书靠卡片承载内容，不写长文"；ljg-card 是 HTML 截图（零成本），7 种模具（长图/信息图/多卡/视觉笔记/漫画/白板/大字）；huashu-xhs-image 默认走 Gemini AI 生图（成本高）、1 种工作流 |
| **图床用 tencent-cos-skill 而不是 huashu-image-upload** | huashu-image-upload 硬编码作者本地路径（`/Users/alchain/...`）+ 外部 ImgBB 账号，在我们项目里跑不起来；tencent-cos-skill 自带完整 SDK、env 变量配置、子账号密钥支持、加密存储，**且一次上传三平台共用**，vault 通过 COS URL 永久可读、CDN 国内访问快 |
| **初稿分流 task_type** | 工具教程是说明文，强用 ljg-writes 会变成"大朝风格的评测"，跟 AI 工具号人设错位；知识思辨才是 ljg-writes 的主场 |
| **web-access 作为 Layer 0** | 所有需要搜索的 skill 都底层依赖 web-access，比自带 web_fetch 更强 |
| **huashu 系列是中段主力** | 21 个 skill 为自媒体内容工厂量身定做，选题→调研→编辑→审校→配图→图床→跨平台改写，一条龙都是工业品 |

### 7.2 skill 全景选型表

| Stage | 选用 skill | 候选未选 | 不选的原因 |
|---|---|---|---|
| 1.1 | aihot | - | - |
| 1.2 | huashu-info-search | 单独 web-access | huashu 自带信源策略+知识库存档 |
| 1.3 | huashu-topic-gen | 手写 | 该 skill 专为此设计 |
| 1.4 | ljg-think / ljg-rank | office-hours | 后者话术风不匹配 |
| 2.1 | huashu-research | web-access + 并行 agent | huashu-research 内部已并行且结构化落盘 |
| 2.2-2.4 | baoyu-url-to-markdown / youtube-transcript / x-to-markdown / ljg-paper | - | - |
| 3.1 | Claude 直写（工具类）/ ljg-writes（思辨类） | 统一用一个 | 文体不匹配 |
| 3.2 | huashu-article-edit | - | - |
| 3.3 | humanizer + huashu-proofreading | ljg-plain | ljg-plain 会失真 |
| 3.4 | baoyu-format-markdown | - | - |
| 4.公众号 | huashu-wechat-image（强制 HTML 路径） | baoyu-article-illustrator | 后者无图床闭环 |
| 4.公众号封面 | baoyu-cover-image | huashu-wechat-image AI 路径 | 封面专门化工具更精 |
| 4.小红书 | ljg-card -m/-b/-i | huashu-xhs-image | 后者默认 AI 生图贵 |
| 4.图示 | baoyu-diagram | - | - |
| 4.5.图床 | tencent-cos-skill | huashu-image-upload | 后者硬编码他人路径，接不了 |
| 5.排版预览 | baoyu-markdown-to-html | baoyu-post-to-wechat 内置 | 分工：前者管预览 |
| 5.标题 QA | huashu-video-check | 手写 | 该 skill 的 MrBeast 公式通用 |
| 5.跨平台 | huashu-article-to-x | - | - |
| 5.发公众号 | baoyu-post-to-wechat | md2wechat | baoyu 功能更广 |
| 5.发 X | baoyu-post-to-x | - | - |
| 5.发小红书 | 手动 | - | 无可靠 API |

---

## 变更记录

| 版本 | 日期 | 变化 |
|---|---|---|
| v1.0 | 2026-05-13 | 初版 |
| v1.1 | 2026-05-13 | 接入 tencent-cos-skill 做图床；新增 Stage 4.5 上传 COS 环节；Stage 5 发布源改用 `final-with-urls.md`，移除之前的"URL 流回 & 图路径替换"步骤（现已在 4.5 完成）；vault 依赖 COS URL 长期可读；移除 huashu-image-upload（硬编码他人路径不可用） |
