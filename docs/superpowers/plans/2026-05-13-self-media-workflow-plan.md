# 自媒体内容生产流水线 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `workspace/` 项目内搭建一条自包含的自媒体内容生产流水线 — 5 个 Stage 子命令 + 1 个总编排命令 + 全部依赖 skill 的项目级拷贝 + 配置/模板/图床闭环 — 可一键产出公众号 / X / 小红书三平台稿件并归档到 Obsidian vault。

**Architecture:** Command → Sub-commands → Skills 三层。`/content-flow` 总编排基于 content-factory / vault 的文件存在性推断状态机，按序串起 `/content-pick`、`/content-research`、`/content-write`、`/content-illustrate`、`/content-publish`，在 3 个硬 Gate 用 `AskUserQuestion` 强停。所有 skill 通过 `cp -r` 拷贝到 `.claude/skills/` 做版本固化；目录适配层（`cd content-factory`、`mv` 搬运、`image_map.json` URL 映射）解决三类 skill 默认输出路径不一致的问题。图床走 tencent-cos-skill 实现一次上传三平台共用、vault 永久外链。

**Tech Stack:**
- Claude Code 项目级 commands（`.claude/commands/*.md`）+ skills（`.claude/skills/*/SKILL.md`）
- 26 个 skill：huashu-skills × 8、baoyu-skills × 9、ljg-* × 5、humanizer、tencent-cos-skill、aihot、web-access
- Bash + Markdown 模板 + JSON 映射（`image_map.json`）
- 腾讯云 COS（图床）
- Obsidian vault（永久归档）

**Spec source:** `docs/superpowers/specs/2026-05-13-self-media-workflow-design.md`

**Verification before completion:** Use superpowers:verification-before-completion. 任何 "完成 / 通过" 的声明都必须先跑实际命令并确认输出。

---

## Phase 0：环境准备（13 个 task）

> 目标：把项目骨架、模板、配置、skill、图床都备齐，使后续任何 Stage 命令都能在干净的环境上跑起来。
> 验收：跑完 Phase 0，从 `workspace/` 根能 `ls` 出 §2.2 描述的全部目录与文件，26 个 skill 全部出现在 `.claude/skills/` 下，`tencent-cos-skill setup.sh --check-only` 通过。

### Task 0.1：建工作目录骨架

**Files:**
- Create directories under `workspace/` per spec §2.2

- [ ] **Step 1：跑目录创建**

```bash
cd /Users/andysun/work/ai-workflow/workspace

mkdir -p content-factory/_templates
mkdir -p content-factory/briefs
mkdir -p content-factory/_knowledge_base
mkdir -p content-factory/drafts
mkdir -p content-factory/images
mkdir -p .claude/commands
mkdir -p .claude/skills
mkdir -p .baoyu-skills/baoyu-post-to-wechat
mkdir -p .baoyu-skills/baoyu-post-to-x
mkdir -p knowledge/写作
mkdir -p docs/superpowers/specs
mkdir -p docs/superpowers/plans
```

- [ ] **Step 2：验证目录创建**

Run:
```bash
ls -d content-factory/{_templates,briefs,_knowledge_base,drafts,images} \
      .claude/{commands,skills} \
      .baoyu-skills/{baoyu-post-to-wechat,baoyu-post-to-x} \
      knowledge/写作 \
      docs/superpowers/{specs,plans}
```

Expected：所有 14 条路径均显示，无 `No such file` 报错。

- [ ] **Step 3：Commit**

```bash
git add -A
git commit -m "feat(workflow): scaffold content-factory and config dirs"
```

---

### Task 0.2：写 brief.md 模板

**Files:**
- Create: `content-factory/_templates/brief.md`

- [ ] **Step 1：写模板（内容来自 spec §2.6）**

把以下内容**原样**写入 `content-factory/_templates/brief.md`：

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

- [ ] **Step 2：验证文件存在并包含关键标题**

```bash
test -f content-factory/_templates/brief.md && \
  grep -q "调研摘要（Stage 2 填）" content-factory/_templates/brief.md && \
  echo OK
```

Expected：输出 `OK`。

- [ ] **Step 3：Commit**

```bash
git add content-factory/_templates/brief.md
git commit -m "feat(workflow): add brief.md template"
```

---

### Task 0.3：写 audit-checklist.md 模板

**Files:**
- Create: `content-factory/_templates/audit-checklist.md`

- [ ] **Step 1：写模板（内容来自 spec §2.6）**

把 spec §2.6 的"三遍审校 Checklist"全文（"# 三遍审校 Checklist" 起到 "- [ ] 加粗/斜体不滥用" 止）**原样**写入 `content-factory/_templates/audit-checklist.md`。包括三遍审校的全部 checklist 条目：第一遍内容审校、第二遍风格审校（humanizer + huashu-proofreading）、第三遍细节打磨。

- [ ] **Step 2：验证文件至少包含三遍审校的标题**

```bash
test -f content-factory/_templates/audit-checklist.md && \
  grep -q "第一遍：内容审校" content-factory/_templates/audit-checklist.md && \
  grep -q "第二遍：风格审校" content-factory/_templates/audit-checklist.md && \
  grep -q "第三遍：细节打磨" content-factory/_templates/audit-checklist.md && \
  echo OK
```

Expected：`OK`。

- [ ] **Step 3：Commit**

```bash
git add content-factory/_templates/audit-checklist.md
git commit -m "feat(workflow): add 3-pass audit checklist template"
```

---

### Task 0.4：写 vault 路由文件

**Files:**
- Create: `knowledge/写作/00-README-路由.md`

- [ ] **Step 1：写路由文件（内容来自 spec §2.7）**

把 spec §2.7 的"# 写作 Vault 路由"全文**原样**写入 `knowledge/写作/00-README-路由.md`。包含目录约定、AI 可能被要求做的 4 件事（找过去、取写作样本、判断重复选题、读发布历史）、禁区、特殊文件、变更日期。

- [ ] **Step 2：验证文件存在且含关键章节**

```bash
test -f knowledge/写作/00-README-路由.md && \
  grep -q "目录约定" knowledge/写作/00-README-路由.md && \
  grep -q "禁区" knowledge/写作/00-README-路由.md && \
  echo OK
```

Expected：`OK`。

- [ ] **Step 3：Commit**

```bash
git add knowledge/写作/00-README-路由.md
git commit -m "feat(workflow): add vault routing readme"
```

---

### Task 0.5：写 .env.example

**Files:**
- Create: `.env.example`

- [ ] **Step 1：写环境变量模板（内容来自 spec §2.4）**

把 spec §2.4 的 `.env.example` 全文**原样**写入项目根 `.env.example`。包括 `PROJECT_ROOT`、`VAULT_*`、`CF_*`、`WECHAT_*`、`X_*`、`TENCENT_COS_*`、`AI_IMAGE_BUDGET_PER_ARTICLE`、`AI_PROOFREAD_TARGET` 全部 22 个变量。

- [ ] **Step 2：验证含全部关键变量名**

```bash
for v in PROJECT_ROOT VAULT_ROOT CF_ROOT WECHAT_APPID X_AUTH_TOKEN \
         TENCENT_COS_SECRET_ID TENCENT_COS_BUCKET TENCENT_COS_WRITING_PREFIX \
         AI_IMAGE_BUDGET_PER_ARTICLE AI_PROOFREAD_TARGET; do
  grep -q "^${v}=" .env.example || { echo "missing: $v"; exit 1; }
done
echo OK
```

Expected：`OK`。

- [ ] **Step 3：Commit**

```bash
git add .env.example
git commit -m "feat(workflow): add .env.example with full var list"
```

---

### Task 0.6：补 .gitignore

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1：先看现有内容**

```bash
cat .gitignore
```

预期当前内容：
```
.baoyu-skills/.env
huashu-skills
```

- [ ] **Step 2：追加 4 条规则**

把以下 4 行 append 到 `.gitignore` 末尾（用 Edit 工具或一次写入完整文件，不要用 echo 重定向）：

```
.env
.env.enc
.baoyu-skills/**/EXTEND.md
content-factory/
```

注意：`content-factory/` 整目录都是临时产物，发布完会被清理，全部入 ignore。`.env.enc` 防止万一加密版误提交。

- [ ] **Step 3：验证**

```bash
for line in '^\.env$' '^\.env\.enc$' '^\.baoyu-skills/\*\*/EXTEND\.md$' '^content-factory/$'; do
  grep -E "$line" .gitignore || { echo "missing pattern: $line"; exit 1; }
done
echo OK
```

Expected：`OK`。

- [ ] **Step 4：Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .env, EXTEND.md, content-factory"
```

---

### Task 0.7：拷贝 huashu 系列 skill 到 .claude/skills/

**Files:**
- Source: `skills/huashu-skills/<name>/`
- Target: `.claude/skills/<name>/`
- 8 个 skill：huashu-topic-gen, huashu-info-search, huashu-research, huashu-article-edit, huashu-proofreading, huashu-wechat-image, huashu-article-to-x, huashu-video-check

- [ ] **Step 1：跑批量拷贝**

```bash
HUASHU_SKILLS=(
  huashu-topic-gen
  huashu-info-search
  huashu-research
  huashu-article-edit
  huashu-proofreading
  huashu-wechat-image
  huashu-article-to-x
  huashu-video-check
)
for s in "${HUASHU_SKILLS[@]}"; do
  test -d "skills/huashu-skills/$s" || { echo "source missing: $s"; exit 1; }
  cp -r "skills/huashu-skills/$s" ".claude/skills/$s"
done
```

- [ ] **Step 2：验证 8 个 skill 都到位且每个含 SKILL.md**

```bash
for s in "${HUASHU_SKILLS[@]}"; do
  test -f ".claude/skills/$s/SKILL.md" || { echo "broken: $s"; exit 1; }
done
echo "OK: 8 huashu skills copied"
```

Expected：`OK: 8 huashu skills copied`。

- [ ] **Step 3：Commit**

```bash
git add .claude/skills/huashu-*
git commit -m "feat(workflow): copy 8 huashu skills to project-level"
```

---

### Task 0.8：拷贝 baoyu 系列 skill 到 .claude/skills/

**Files:**
- Source: `skills/baoyu-skills/skills/<name>/`
- Target: `.claude/skills/<name>/`
- 9 个 skill：baoyu-url-to-markdown, baoyu-youtube-transcript, baoyu-danger-x-to-markdown, baoyu-format-markdown, baoyu-diagram, baoyu-cover-image, baoyu-markdown-to-html, baoyu-post-to-wechat, baoyu-post-to-x

- [ ] **Step 1：跑批量拷贝**

```bash
BAOYU_SKILLS=(
  baoyu-url-to-markdown
  baoyu-youtube-transcript
  baoyu-danger-x-to-markdown
  baoyu-format-markdown
  baoyu-diagram
  baoyu-cover-image
  baoyu-markdown-to-html
  baoyu-post-to-wechat
  baoyu-post-to-x
)
for s in "${BAOYU_SKILLS[@]}"; do
  test -d "skills/baoyu-skills/skills/$s" || { echo "source missing: $s"; exit 1; }
  cp -r "skills/baoyu-skills/skills/$s" ".claude/skills/$s"
done
```

- [ ] **Step 2：验证**

```bash
for s in "${BAOYU_SKILLS[@]}"; do
  test -f ".claude/skills/$s/SKILL.md" || { echo "broken: $s"; exit 1; }
done
echo "OK: 9 baoyu skills copied"
```

Expected：`OK: 9 baoyu skills copied`。

- [ ] **Step 3：Commit**

```bash
git add .claude/skills/baoyu-*
git commit -m "feat(workflow): copy 9 baoyu skills to project-level"
```

---

### Task 0.9：拷贝 ljg 系列 skill 到 .claude/skills/

**Files:**
- Source: `~/.claude/skills/<name>/`
- Target: `.claude/skills/<name>/`
- 5 个 skill：ljg-writes, ljg-think, ljg-rank, ljg-card, ljg-paper

- [ ] **Step 1：跑批量拷贝（注意 ljg-card 含 node_modules，先排除）**

```bash
LJG_SKILLS=(ljg-writes ljg-think ljg-rank ljg-card ljg-paper)
for s in "${LJG_SKILLS[@]}"; do
  src="$HOME/.claude/skills/$s"
  test -d "$src" || { echo "source missing: $src"; exit 1; }
  rsync -a --exclude 'node_modules' "$src/" ".claude/skills/$s/"
done
```

注：用 `rsync --exclude` 而非 `cp -r` 避免拖进 ljg-card 的 `node_modules/`（会很大）。skill 自带 `package.json`，需要时跑 `npm install` 重建。

- [ ] **Step 2：验证 5 个 skill 都含 SKILL.md，且 ljg-card 不含 node_modules**

```bash
for s in "${LJG_SKILLS[@]}"; do
  test -f ".claude/skills/$s/SKILL.md" || { echo "broken: $s"; exit 1; }
done
test ! -d ".claude/skills/ljg-card/node_modules" || { echo "ljg-card has node_modules!"; exit 1; }
echo "OK: 5 ljg skills copied without node_modules"
```

Expected：`OK: 5 ljg skills copied without node_modules`。

- [ ] **Step 3：在 ljg-card 内重建依赖**

```bash
cd .claude/skills/ljg-card && npm install && cd -
test -d .claude/skills/ljg-card/node_modules && echo "OK ljg-card deps installed"
```

Expected：`OK ljg-card deps installed`。

注意：`node_modules/` 不入 git（已经被根 `.gitignore` 处理或在 ljg-card 自己的 `.gitignore` 里）。

- [ ] **Step 4：Commit（不含 node_modules）**

```bash
echo ".claude/skills/ljg-card/node_modules/" >> .gitignore
git add .gitignore .claude/skills/ljg-*
git commit -m "feat(workflow): copy 5 ljg skills to project-level"
```

---

### Task 0.10：拷贝 humanizer / web-access 到 .claude/skills/

**Files:**
- Source: `skills/humanizer/`、`~/.claude/skills/web-access/`
- Target: `.claude/skills/humanizer/`、`.claude/skills/web-access/`

注意：aihot 和 tencent-cos-skill **已经在** `.claude/skills/` 下（前置已确认），不要重复拷贝。

- [ ] **Step 1：拷贝 humanizer**

```bash
test -d skills/humanizer || { echo "source missing"; exit 1; }
cp -r skills/humanizer .claude/skills/humanizer
```

- [ ] **Step 2：拷贝 web-access**

```bash
test -d "$HOME/.claude/skills/web-access" || { echo "source missing"; exit 1; }
cp -r "$HOME/.claude/skills/web-access" .claude/skills/web-access
```

- [ ] **Step 3：验证 4 个独立 skill 全到位**

```bash
for s in humanizer web-access aihot tencent-cos-skill; do
  test -f ".claude/skills/$s/SKILL.md" || { echo "broken: $s"; exit 1; }
done
echo OK
```

Expected：`OK`。

- [ ] **Step 4：盘点全部 26 个 skill**

```bash
ls .claude/skills/ | wc -l
ls .claude/skills/
```

Expected：`26`（spec §6 Phase 0 第 5 条手写为"27 个"是 typo，按 §2.2 实际目录树为 26 个），列表与 spec §2.2 完全对齐：

```
aihot  baoyu-cover-image  baoyu-danger-x-to-markdown  baoyu-diagram
baoyu-format-markdown  baoyu-markdown-to-html  baoyu-post-to-wechat
baoyu-post-to-x  baoyu-url-to-markdown  baoyu-youtube-transcript
huashu-article-edit  huashu-article-to-x  huashu-info-search
huashu-proofreading  huashu-research  huashu-topic-gen
huashu-video-check  huashu-wechat-image  humanizer  ljg-card
ljg-paper  ljg-rank  ljg-think  ljg-writes  tencent-cos-skill
web-access
```

如果数量不符，回前面 task 检查源路径。

- [ ] **Step 5：Commit**

```bash
git add .claude/skills/humanizer .claude/skills/web-access
git commit -m "feat(workflow): copy humanizer and web-access skills"
```

---

### Task 0.11：写 baoyu 公众号 EXTEND.md

**Files:**
- Create: `.baoyu-skills/baoyu-post-to-wechat/EXTEND.md`
- 注意：被 .gitignore 屏蔽，不入 git

- [ ] **Step 1：先读官方 EXTEND.md 范式**

```bash
find skills/baoyu-skills/skills/baoyu-post-to-wechat -name 'EXTEND*' -o -name 'extend*'
ls skills/baoyu-skills/skills/baoyu-post-to-wechat/
head -60 skills/baoyu-skills/skills/baoyu-post-to-wechat/SKILL.md
```

如果 SKILL.md 引用了 `EXTEND.md` 的 schema，原样照着写；如果只在 README/configs 里描述，抓出来。期望最少需要的字段：`appid`、`secret`、`author`、默认 `theme` / `color`。

- [ ] **Step 2：写 EXTEND.md（按上一步抓到的 schema）**

```markdown
# baoyu-post-to-wechat 项目级配置

> 优先级：项目 EXTEND.md > 用户 EXTEND.md > 默认值
> 凭证从 `${PROJECT_ROOT}/.env` 读，本文件只放非敏感默认值

## 默认账号

- appid: `${WECHAT_APPID}`
- secret: `${WECHAT_SECRET}`
- author: `${WECHAT_AUTHOR}`

## 默认排版

- theme: `${WECHAT_DEFAULT_THEME:-grace}`
- color: `${WECHAT_DEFAULT_COLOR:-blue}`

## 备注

凭证从环境变量读，prompt 里不要直出。
```

如果 baoyu skill 实际接受 YAML 而非 markdown，则改 YAML — 以官方 SKILL.md 描述为准。

- [ ] **Step 3：验证文件存在且不会被 git 跟踪**

```bash
test -f .baoyu-skills/baoyu-post-to-wechat/EXTEND.md && echo OK
git check-ignore .baoyu-skills/baoyu-post-to-wechat/EXTEND.md && echo "ignored OK"
```

Expected：`OK` 和 `ignored OK`。

- [ ] **Step 4：（无 commit，文件已 ignore）**

---

### Task 0.12：写 baoyu X EXTEND.md

**Files:**
- Create: `.baoyu-skills/baoyu-post-to-x/EXTEND.md`

- [ ] **Step 1：先读官方 EXTEND/SKILL 抓 schema**

```bash
ls skills/baoyu-skills/skills/baoyu-post-to-x/
head -80 skills/baoyu-skills/skills/baoyu-post-to-x/SKILL.md
```

抓出 X 凭证字段（auth_token / csrf_token / cookie）。

- [ ] **Step 2：写 EXTEND.md**

```markdown
# baoyu-post-to-x 项目级配置

## 凭证

- auth_token: `${X_AUTH_TOKEN}`
- csrf_token: `${X_CSRF_TOKEN}`
- cookie:     `${X_COOKIE}`
```

- [ ] **Step 3：验证**

```bash
test -f .baoyu-skills/baoyu-post-to-x/EXTEND.md && \
  git check-ignore .baoyu-skills/baoyu-post-to-x/EXTEND.md && \
  echo OK
```

Expected：`OK`。

---

### Task 0.13：腾讯云 COS 开通 + 配置 + 连通验证

**Files:**
- Modify: `.env`（创建本地副本，**不入 git**）

- [ ] **Step 1：（用户操作）在腾讯云控制台完成准备工作**

> 这是用户在浏览器里做的事，AI 不代办。AI 的职责是把这些步骤清晰列出来，然后等用户在 Step 4 填 .env 后接管验证。

1. 登录 cloud.tencent.com，开通 COS 服务
2. 控制台 → 访问管理 → 用户列表 → 新建子用户，权限只勾 `QcloudCOSFullAccess`，记下 SecretId / SecretKey
3. COS 控制台 → 创建桶（建议 ap-shanghai；名字带随机后缀；ACL：公共读、私有写）
4. 可选：开 CDN 加速 + 绑自定义域名（推荐，国内访问快很多）

- [ ] **Step 2：复制 .env.example 为 .env**

```bash
cp .env.example .env
```

`.env` 不入 git，安全。

- [ ] **Step 3：（用户操作）填入凭证**

用户编辑 `.env`，填入：
- `TENCENT_COS_SECRET_ID=`
- `TENCENT_COS_SECRET_KEY=`
- `TENCENT_COS_REGION=ap-shanghai`（按实际填）
- `TENCENT_COS_BUCKET=`（带 appid 后缀的全名）
- `TENCENT_COS_DOMAIN=`（自定义域名留空则用默认 cos 域）
- `TENCENT_COS_WRITING_PREFIX=writing`

- [ ] **Step 4：跑 setup 脚本验证连通**

```bash
cd .claude/skills/tencent-cos-skill
bash scripts/setup.sh --check-only
cd -
```

Expected：脚本输出 "✓ 凭证有效" 或 "✓ bucket 可访问"（具体用词以 setup.sh 实际输出为准；如果脚本报错 "Bucket not found" / "401 unauthorized"，说明 .env 没配对，回 Step 3）。

- [ ] **Step 5：跑一次端到端上传测试**

```bash
echo "ping" > /tmp/cos-ping.txt
# 调用 tencent-cos-skill 上传一个测试文件，路径键 `writing/test/ping.txt`
# 实际命令以 SKILL.md 为准；伪命令：
node .claude/skills/tencent-cos-skill/scripts/cos_node.mjs upload \
  --file /tmp/cos-ping.txt --key "writing/test/ping.txt"
```

Expected：返回一个 https URL（如 `https://<bucket>.cos.<region>.myqcloud.com/writing/test/ping.txt` 或 `https://<custom-domain>/writing/test/ping.txt`）。

```bash
# 用 curl 验证图床公开可读
curl -sf <上一步返回的 URL> && echo "OK: COS public read works"
```

Expected：`OK: COS public read works`，且打印出 `ping`。

- [ ] **Step 6：（可选）加密 .env**

```bash
bash .claude/skills/tencent-cos-skill/scripts/setup.sh --encrypt
ls .env.enc
```

加密后保留 `.env`（运行需要）和 `.env.enc`（备份）。两个都 ignore。

- [ ] **Step 7：清理测试文件**

```bash
rm /tmp/cos-ping.txt
# COS 上 writing/test/ping.txt 留着也行（几乎零成本），洁癖可手动删
```

- [ ] **Step 8：（无 commit，凭证文件均 ignore）**

---

## Phase 1：5 个 Stage 子命令（5 个 task）

> 目标：实现 5 个 `.claude/commands/content-*.md` 子命令，每个负责一个 Stage 的 skill 编排和适配层搬运。
> 每个 Stage 命令实现完用一个真实小任务跑通后再继续下一个。
> 验收：每个命令能独立调用、产出 spec §3 描述的目标产物、状态判定文件存在。

**通用 frontmatter 约定**（每个命令都有）：

```markdown
---
description: Stage N — <一句话描述>
argument-hint: [<参数名>...]
---
```

下面每个任务都用统一模板：先写命令 markdown → 跑 dry test → 跑真实任务 → commit。

---

### Task 1.1：实现 `/content-pick`（Stage 1 选题）

**Files:**
- Create: `.claude/commands/content-pick.md`
- Reads: `content-factory/_templates/brief.md`、`.claude/skills/aihot/`、`.claude/skills/huashu-info-search/`、`.claude/skills/huashu-topic-gen/`、`.claude/skills/ljg-think/`、`.claude/skills/ljg-rank/`
- Writes: `content-factory/briefs/<slug>.md`

- [ ] **Step 1：写命令文件**

写 `.claude/commands/content-pick.md`，内容：

````markdown
---
description: Stage 1 — 多源选题，产出 3-4 个候选 → 用户点 1 个 → 写入 brief
argument-hint: []
---

# Stage 1：多源选题

## 你的目标

产出 3-4 个高质量选题候选，让用户从中选 1 个，最后落到 `content-factory/briefs/<slug>.md`。

## 步骤

### 1.1 抓 AI 圈当日热点

调用 `aihot` skill：
- 拿当日中文 AI 资讯热榜
- 内存输出，不落盘

### 1.2 多渠道信息搜索（按用户输入主题方向 / 或当日热点）

调用 `huashu-info-search`：
- **调用前先 `cd content-factory`**，让其原生落位到 `_knowledge_base/`
- 输入：本次写作大方向（用户口述 / 或上一步 aihot 命中的关键词）
- 产出：`content-factory/_knowledge_base/<主题>/<时间戳>-source.md`

### 1.3 生成 3-4 个选题方案

调用 `huashu-topic-gen`：
- 输入：1.1 + 1.2 的素材
- 每个选题包含：标题、切入角度、目标读者、预期效果、热度依据
- 内存输出

### 1.4（仅思辨型）深度思辨

如果用户偏向"知识思辨"型，再调一遍 `ljg-think` 或 `ljg-rank`，给候选选题一层结构化拆解。

### 🔴 Gate 1：用 AskUserQuestion 强停

展示 3-4 个候选 + 热度依据，让用户：
1. 选 1 个候选（或自填新方向）
2. 确认 task_type：`工具教程` | `知识思辨`
3. 确认目标平台（多选）：`公众号` | `X` | `小红书`

### 1.5 生成 brief

- 用 `content-factory/_templates/brief.md` 作模板
- 用 §2.3 的 slug 规则生成 slug：`YYYY-MM-DD-<标题关键词>`，去标点、空格转 `-`、最长 40 字符
- 落盘到 `content-factory/briefs/<slug>.md`，把上面 4 个用户决策填进去

## 状态判定

`content-factory/briefs/<slug>.md` 存在 → Stage 1 完成。

## 失败恢复

任意 skill 失败：保留中间产物（`_knowledge_base/` 已落盘），告诉用户具体错在哪个 skill，让用户决定重跑哪一步。**不要静默 fallback**。

## 输出

- `content-factory/briefs/<slug>.md`（含基本信息 + 核心需求填好；调研摘要段留空给 Stage 2）
- 返回 slug 给调用方
````

- [ ] **Step 2：人工 dry test（不实际 invoke skill）**

读一遍 `content-pick.md`，对照 spec §3 Stage 1 表格，确认：
- 4 个子步骤都覆盖
- Gate 1 有
- slug 规则有
- 状态判定符合 spec §4.2

- [ ] **Step 3：跑真实任务**

```
/content-pick
```

跑出一个 brief。验证：

```bash
ls content-factory/briefs/  # 至少 1 个 .md
ls content-factory/_knowledge_base/  # 至少 1 个主题目录
```

Expected：两条都有产物。

- [ ] **Step 4：Commit**

```bash
git add .claude/commands/content-pick.md
git commit -m "feat(workflow): implement /content-pick (stage 1)"
```

---

### Task 1.2：实现 `/content-research <slug>`（Stage 2 调研）

**Files:**
- Create: `.claude/commands/content-research.md`
- Reads: `content-factory/briefs/<slug>.md`
- Writes: `content-factory/_knowledge_base/<主题>/research-*.md`、追加 brief 末尾"调研摘要"段

- [ ] **Step 1：写命令文件**

写 `.claude/commands/content-research.md`，内容：

````markdown
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
````

- [ ] **Step 2：跑真实任务**

```
/content-research <Task 1.1 产出的 slug>
```

- [ ] **Step 3：验证**

```bash
ls content-factory/_knowledge_base/  # 应该比 Stage 1 后多了文件
grep -A 5 "调研摘要" content-factory/briefs/<slug>.md  # 摘要段有内容
```

Expected：摘要段下方有真实大纲。

- [ ] **Step 4：Commit**

```bash
git add .claude/commands/content-research.md
git commit -m "feat(workflow): implement /content-research (stage 2)"
```

---

### Task 1.3：实现 `/content-write <slug>`（Stage 3 写作 + 三遍审校）

**Files:**
- Create: `.claude/commands/content-write.md`
- Reads: `content-factory/briefs/<slug>.md`、`knowledge/写作/**/*.md`（取 voice samples）
- Writes:
  - `content-factory/drafts/<slug>/drainage.md`
  - `content-factory/drafts/<slug>/v1-初稿.md`
  - `content-factory/drafts/<slug>/v2-内容审校.md`
  - `content-factory/drafts/<slug>/v3-降AI味.md`
  - `content-factory/drafts/<slug>/final.md`
  - `content-factory/drafts/<slug>/audit.md`

- [ ] **Step 1：写命令文件（注意这个最长，分 6 个子阶段）**

写 `.claude/commands/content-write.md`：

````markdown
---
description: Stage 3 — 写作 + 三遍审校 + 标题拟定，AI 味 ≤ 30%
argument-hint: <slug>
---

# Stage 3：写作 + 三遍审校

## 输入

`<slug>` → 读 `content-factory/briefs/<slug>.md`（含调研摘要 + 大纲 + task_type）。

## 准备工作

```bash
mkdir -p content-factory/drafts/<slug>
cp content-factory/_templates/audit-checklist.md content-factory/drafts/<slug>/audit.md
```

## 步骤

### 3.0 创意排水（5-10 分钟）

让 Claude 把"最套路的想法"写一遍 ~300 字，加 `[drainage]` 标签存到 `content-factory/drafts/<slug>/drainage.md`。**这份不用，只是把套路冲掉**。后续写正稿时主动避开。

### 3.1 初稿 v1 — 按 task_type 分流

#### 3.1.a 如果 task_type=`工具教程`

Claude 直接按 brief 大纲写说明文，落 `content-factory/drafts/<slug>/v1-初稿.md`。

**不要**调 `ljg-writes` —— 文体不匹配，会变成"大朝风格的评测"。

#### 3.1.b 如果 task_type=`知识思辨`

调 `ljg-writes`（输出到 `~/Documents/notes/{时间戳}__write.md`）。**调用前后做适配层搬运**：

```bash
# 调用前打时间标记
MARK=$(mktemp)
touch "$MARK"

# 调 ljg-writes 跑

# 调用后搬运
find ~/Documents/notes -newer "$MARK" -name "*.md" -type f \
  -exec mv {} content-factory/drafts/<slug>/v1-初稿.md \;
rm "$MARK"

# 兜底：必须存在
test -f content-factory/drafts/<slug>/v1-初稿.md || {
  echo "Adapter failed: ljg-writes 没产出 .md 或落盘到了别处"; exit 1;
}
```

### 3.2 内容审校 → v2

调 `huashu-article-edit`：
- 输入 `v1-初稿.md`
- 走"事实 / 逻辑 / 结构"一遍
- 落 `content-factory/drafts/<slug>/v2-内容审校.md`
- 同时在 `audit.md` 第一遍 checklist 打勾（事实准确性 / 逻辑清晰性 / 结构合理性 / 真实性）

### 3.3 风格审校 → v3（双重保险）

#### 3.3.a Voice sample 准备

```bash
# 取最近 5 篇 vault 文章正文做 voice sample
ls -t knowledge/写作/**/*.md 2>/dev/null | grep -v "00-README-路由" | head -5 \
  > /tmp/voice-samples.list
```

如果列表为空（vault 里还没文章），用 humanizer 默认 PERSONALITY 配置。

#### 3.3.b humanizer 跑一遍

调 `humanizer`：
- 输入 `v2-内容审校.md`
- voice samples 来自上一步列表（每篇取正文部分，跳过末尾"发布记录"段）
- 关注 10+ 模式：em dash 滥用、rule of three、-ing 伪深度、promotional language、负向并列、被动语态、套话词等

#### 3.3.c huashu-proofreading 跑一遍

调 `huashu-proofreading`：
- 6 大 AI 腔识别：套话 / AI 句式 / 书面词 / 列表癖 / 对比狂 / 完美总结
- 目标 AI 检测率 ≤ `${AI_PROOFREAD_TARGET:-30}`
- 输出：标注过的报告 + 改写建议

应用两轮的修改 → 落 `content-factory/drafts/<slug>/v3-降AI味.md`，audit.md 第二遍打勾。

### 3.4 细节打磨 → final

Claude 跑 Chad Nauseam 5 技巧：
1. 强开头（第一句让人想读下一句）
2. 句子节奏（长短错落）
3. 多巴胺密度（每 3-5 段一次"原来如此"）
4. 微幽默（1-2 处不做作）
5. 概念把手（类比 / 例子）

再调 `baoyu-format-markdown` 做标点排版统一。

落 `content-factory/drafts/<slug>/final.md`，audit.md 第三遍打勾。

### 3.5 三轮标题拟定

- **第一轮**（爆款）：5 个候选，用金钱数字 / 暴力隐喻 / 死亡替代 / 捷径效率 / 异常悬念元素
- **第二轮**（自然）：3 个候选，无套路 + 符合作者风格
- **第三轮**（组合）：2 个候选，自然为基础 + 注入 1-2 个爆款要素

把 10 个候选写到 `final.md` 顶部 YAML 块的暂存区：

```yaml
---
title_candidates:
  - "候选 1"
  - "..."
  - "候选 10"
---
```

### 🔴 Gate 2：AskUserQuestion

展示 10 个标题候选（编号），让用户：
1. 选 1 个（或自写）
2. 提示：打开 `content-factory/drafts/<slug>/final.md` 在 Obsidian 里直接改正文（如需）
3. 等用户回复"final 确认"

用户确认后，**用 Edit 工具**把 final.md 顶部 YAML 改成：

```yaml
---
title: "<选中的标题>"
---
```

（移除整个 `title_candidates:` 列表，只留 `title:` 一个字段）

## 状态判定

`content-factory/drafts/<slug>/final.md` 存在 + 顶部 YAML 只有 `title:` 一个字段 → Stage 3 完成。

## 失败恢复

任意子阶段失败：保留对应版本（v1/v2/v3）。用户可 `/content-flow --from write --slug <slug>` 整 stage 重跑，或用 `/content-write <slug> --from-step 3.3` 之类（v1/v2 已经在硬盘上，跳过即可）。

## 输出

- `drafts/<slug>/{drainage,v1-初稿,v2-内容审校,v3-降AI味,final,audit}.md`
- final.md 顶部 YAML 含 `title:` 单字段
````

- [ ] **Step 2：跑真实任务**

```
/content-write <slug>
```

- [ ] **Step 3：验证**

```bash
ls content-factory/drafts/<slug>/
# 期望：drainage.md, v1-初稿.md, v2-内容审校.md, v3-降AI味.md, final.md, audit.md
head -5 content-factory/drafts/<slug>/final.md
# 期望：YAML 块只有 title: 字段
```

Expected：6 个文件齐全；final.md 顶部 YAML 只有 `title:` 一行字段。

- [ ] **Step 4：Commit**

```bash
git add .claude/commands/content-write.md
git commit -m "feat(workflow): implement /content-write (stage 3)"
```

---

### Task 1.4：实现 `/content-illustrate <slug>`（Stage 4 + 4.5 配图 + 上 COS）

**Files:**
- Create: `.claude/commands/content-illustrate.md`
- Reads: `content-factory/drafts/<slug>/final.md`、`.env`
- Writes:
  - `content-factory/images/<slug>/cover.png`
  - `content-factory/images/<slug>/<其他配图>.png`
  - `content-factory/images/<slug>/cards/<卡组>.png`
  - `content-factory/images/<slug>/prompts.md`
  - `content-factory/images/<slug>/image_map.json`
  - `content-factory/drafts/<slug>/final-with-urls.md`

- [ ] **Step 1：写命令文件**

写 `.claude/commands/content-illustrate.md`：

````markdown
---
description: Stage 4 — 配图（HTML 截图优先 + 单张 AI 封面） + Stage 4.5 上传 COS 替换路径
argument-hint: <slug>
---

# Stage 4：配图（成本分层） + Stage 4.5：上 COS 替换路径

## 核心约束

```
Tier 1 [零成本] HTML 截图       ← 默认优先
Tier 2 [零成本] 现成公共图片
Tier 3 [零成本] HTML 改稿后复渲染
Tier 4 [高成本] AI 生图          ← 每篇文章最多 ${AI_IMAGE_BUDGET_PER_ARTICLE:-1} 张
```

## 输入

`<slug>` → 读 `content-factory/drafts/<slug>/final.md` 抓需要配图的位置（标题 / H2 节 / 关键概念 / 流程图位）。

## 准备

```bash
mkdir -p content-factory/images/<slug>/cards
touch content-factory/images/<slug>/prompts.md
```

## 步骤

### 4.1 公众号正文配图

调 `huashu-wechat-image`：**强制走 HTML 截图路径**（skill 双路径里选零成本路径）。AI 生图选项**显式禁用**。
- 落到 `content-factory/images/<slug>/image-N.png`
- 每张图的 prompt / HTML 模板 append 到 `prompts.md`

### 4.2 公众号架构图 / 流程图

如果文章有架构 / 流程内容，调 `baoyu-diagram` 生成 SVG → PNG。零成本。落 `images/<slug>/diagram-N.png`。

### 4.3 公众号封面（唯一允许 AI 生图位）

调 `baoyu-cover-image`：
- AI 生图，默认 1 张
- 落 `content-factory/images/<slug>/cover.png`
- prompt 留底到 `prompts.md`

X 主图复用此 cover。

### 4.4 小红书卡组（如目标平台含小红书）

调 `ljg-card`，按需要选模具：
- `-m` 多卡（1080x1440，自动切分） — 主体
- `-b` 大字附件 — 标题 / 金句
- `-i` 信息图 — 数据 / 流程

ljg-card 默认输出到 `~/Downloads/`。**调用前后做适配层搬运**：

```bash
MARK=$(mktemp)
touch "$MARK"
# 调 ljg-card
find ~/Downloads -newer "$MARK" -name "*.png" -type f \
  -exec mv {} content-factory/images/<slug>/cards/ \;
rm "$MARK"
```

### 4.5 成本预算检查

数 AI 生图张数：
```bash
AI_COUNT=1  # 通常只有 cover 一张
BUDGET=${AI_IMAGE_BUDGET_PER_ARTICLE:-1}
if [ "$AI_COUNT" -gt "$BUDGET" ]; then
  # 用 AskUserQuestion 让用户确认超额
fi
```

### 4.6 Stage 4 摘要

输出一行：

```
Stage 4 完成。配图成本：
  HTML 截图 × <N>  [零成本]
  现成图   × <M>   [零成本]
  AI 生图  × <K>   [~$<K * 0.04>]
  总成本 ≈ $<K * 0.04>
```

---

## Stage 4.5：上 COS + 路径替换

> 这一步**自动执行**，无 Gate。

### 4.5.1 扫 final.md 抓被引用的图

用正则扫 `content-factory/drafts/<slug>/final.md` 里的 `![...](./images/...)`，得到"被实际引用"的图清单。**未被引用的候选图不上传**，节省成本。

注意：`final.md` 里的图引用此时仍是本地相对路径（`./images/cover.png`、`./images/cards/card-1.png`）。

### 4.5.2 调 tencent-cos-skill 上传

对清单每张图：
```
tencent-cos-skill upload \
  --file content-factory/images/<slug>/<file> \
  --key ${TENCENT_COS_WRITING_PREFIX:-writing}/<YYYY>/<MM>/<slug>/<file>
```

- `<YYYY>/<MM>` 取**今天**的年月（按发布时间归档；即使现在还没发布，按"开始处理"时间也合理）
- 收集每张图返回的公开 URL

### 4.5.3 写 image_map.json

```json
{
  "./images/cover.png": "https://<COS_DOMAIN>/writing/2026/05/<slug>/cover.png",
  "./images/cards/card-1.png": "https://<COS_DOMAIN>/writing/2026/05/<slug>/cards/card-1.png"
}
```

落到 `content-factory/images/<slug>/image_map.json`。

### 4.5.4 生成 final-with-urls.md

把 `final.md` 里所有本地图路径按 image_map.json 替换为 COS URL，落到 `content-factory/drafts/<slug>/final-with-urls.md`。

**别覆盖 `final.md`** —— 保留本地图路径版本作为备份和重跑依赖。

### 4.5.5 验证替换

```bash
# 不应该再有 ./images/ 引用
grep -c '!\[.*\](\./images/' content-factory/drafts/<slug>/final-with-urls.md
# 应该输出 0
```

如果不是 0，说明 image_map.json 漏了某张图，停下来报错给用户。

## 状态判定

- `content-factory/images/<slug>/cover.png` 存在 → Stage 4 完成
- `content-factory/drafts/<slug>/final-with-urls.md` 存在 + 0 个本地 ./images/ 引用 → Stage 4.5 完成

## 失败恢复

- 不满意某张图：让用户告诉哪张，重跑对应 skill 即可，不需要全 stage 重跑
- COS 上传失败：检查 .env 凭证；image_map.json 已落盘的部分保留，重跑会续传
- final-with-urls.md 已存在但 final.md 又改过：删 final-with-urls.md 重跑 4.5

## 输出

- `images/<slug>/{cover.png, image-*.png, cards/, prompts.md, image_map.json}`
- `drafts/<slug>/final-with-urls.md`
- COS 上 `writing/YYYY/MM/<slug>/` 全套图（永久）
````

- [ ] **Step 2：跑真实任务**

```
/content-illustrate <slug>
```

- [ ] **Step 3：验证**

```bash
test -f content-factory/images/<slug>/cover.png
test -f content-factory/images/<slug>/image_map.json
test -f content-factory/drafts/<slug>/final-with-urls.md
# 验证 final-with-urls.md 没有本地图引用
LOCAL_REFS=$(grep -c '!\[.*\](\./images/' content-factory/drafts/<slug>/final-with-urls.md || true)
[ "$LOCAL_REFS" = "0" ] && echo OK
```

Expected：4 行验证全部 OK。

随便挑一个 image_map.json 里的 URL 用 `curl -sI` 验证 200 OK。

- [ ] **Step 4：Commit**

```bash
git add .claude/commands/content-illustrate.md
git commit -m "feat(workflow): implement /content-illustrate (stages 4 + 4.5)"
```

---

### Task 1.5：实现 `/content-publish <slug>`（Stage 5 发布 + 归档 + 清理）

**Files:**
- Create: `.claude/commands/content-publish.md`
- Reads: `content-factory/drafts/<slug>/final-with-urls.md`、`content-factory/images/<slug>/`
- Writes:
  - `content-factory/drafts/<slug>/x-post.md`
  - `knowledge/写作/YYYY/MM/<slug>.md`（永久）
  - 删除 `content-factory/{briefs,drafts,images}/<slug>{,/}`（清理）

- [ ] **Step 1：写命令文件**

写 `.claude/commands/content-publish.md`：

````markdown
---
description: Stage 5 — 排版预览 + 跨平台改写 + 发布 + 归档 vault + 清理
argument-hint: <slug>
---

# Stage 5：发布 + 归档 + 清理

## 输入

`<slug>` → 读 `content-factory/drafts/<slug>/final-with-urls.md`（图引用已经是 COS URL）。

## 步骤

### 5.1 排版预览

调 `baoyu-markdown-to-html`：
- 输入 `final-with-urls.md`
- 输出多主题 HTML 到 `content-factory/drafts/<slug>/preview/`
- 自动用浏览器打开（gstack 或 open 命令）让用户预览

### 5.2 标题 / 封面 QA

调 `huashu-video-check`（虽叫 video，能力是 MrBeast 公式的"标题 + 封面承接性评估"）：
- 输入：`final-with-urls.md` 的 title + cover URL
- 输出：评分 + 优化建议

### 5.3 跨平台改写

#### 5.3.a X 短版

调 `huashu-article-to-x`：
- 输入 `final-with-urls.md`
- 压成 200-500 字 X 版本（金句 / 数据 / 价值主张）
- 落 `content-factory/drafts/<slug>/x-post.md`
- 配图（如有）继续用 COS URL

#### 5.3.b 小红书

已有 `content-factory/images/<slug>/cards/` 卡组 + 一句话文案模板，**不需要改写**。

### 🔴 Gate 3：AskUserQuestion 发布预览

展示给用户：
- baoyu-markdown-to-html 预览 HTML 路径（用户在浏览器里看）
- 选中的标题
- 封面 COS URL
- huashu-video-check 评分 + 建议
- X 短版预览

选项：`发布` / `返回修改`。

如选"返回修改"：不发布，用户决定重跑哪个上游 stage。

### 5.4 发布到各平台（顺序：公众号 → X → 小红书）

#### 5.4.a 公众号

调 `baoyu-post-to-wechat`：
- 输入 `final-with-urls.md`
- 通道：API 优先，CDP 备份
- baoyu **内部**会下载 COS 图再上传到公众号永久素材库（mmbiz.qpic.cn）—— 这是微信硬要求，不是我们的事
- 收集返回值：`wechat_url` + `wechat_published_at`

#### 5.4.b X

调 `baoyu-post-to-x`：
- 输入 `x-post.md`
- baoyu 内部会下载 COS 图再上传到 X media
- 收集：`x_url` + `x_published_at`

#### 5.4.c 小红书（手动）

编排打开 `content-factory/images/<slug>/cards/` 目录 + 一句话文案：
```bash
open content-factory/images/<slug>/cards/
echo "=== 一句话文案 ==="
# 一句话文案：从 final-with-urls.md 摘第一段做引子
```

提示用户：**手动**打开小红书客户端上传卡组 + 文案 → 用户回复"小红书已发"和发布时间。

收集：`xhs_card_count`（数 cards/ 下 png）+ `xhs_published_at`（用户提供）。

### 5.5 收集发布 URL

把 5.4 的所有返回值放进内存对象：

```js
{
  wechat: { url, published_at },
  x: { url, published_at },
  xhs: { card_count, published_at }  // 没 url
}
```

**部分发布也接受**：哪些平台目标没勾的，留空；哪些发布失败的，跳过那条记录但继续后面。

### 5.6 搬进 vault

```bash
TODAY=$(date +%Y-%m-%d)
YYYY=$(date +%Y); MM=$(date +%m)
mkdir -p knowledge/写作/${YYYY}/${MM}/

cp content-factory/drafts/<slug>/final-with-urls.md \
   knowledge/写作/${YYYY}/${MM}/<slug>.md
```

然后用 Edit 工具在 vault 文件末尾追加"发布记录"段（**不要用 echo >>**，要用 Edit 工具规范追加）：

```markdown

---

**发布记录**
- 公众号：<wechat_url> · <YYYY-MM-DD HH:MM>
- X：<x_url> · <YYYY-MM-DD HH:MM>
- 小红书：<N> 张卡组 · <YYYY-MM-DD HH:MM>
```

只列**实际发布成功**的平台，没发的不写空行。

### 5.7 清理 content-factory/<slug>

**重要：黑名单保护**

```bash
# 清理脚本中的路径必须经过黑名单检查
SLUG="<slug>"
DELETE_PATHS=(
  "content-factory/briefs/${SLUG}.md"
  "content-factory/drafts/${SLUG}"
  "content-factory/images/${SLUG}"
)
for p in "${DELETE_PATHS[@]}"; do
  # 黑名单：禁止任何含 'knowledge' 的路径
  case "$p" in
    *knowledge*) echo "REFUSE: $p"; exit 1 ;;
    /*)          echo "REFUSE: absolute path $p"; exit 1 ;;
  esac
  # 必须以 content-factory/ 开头
  case "$p" in
    content-factory/*) ;;
    *) echo "REFUSE: not under content-factory: $p"; exit 1 ;;
  esac
  rm -rf "$p"
done

# _knowledge_base 保留 —— 跨文章资产
# COS 上 writing/YYYY/MM/<slug>/ 保留 —— vault 依赖

echo "Cleanup OK"
```

### 状态判定

- `knowledge/写作/YYYY/MM/<slug>.md` 存在
- `content-factory/briefs/<slug>.md` 不存在
- `content-factory/drafts/<slug>` 不存在
- `content-factory/images/<slug>` 不存在
- `content-factory/_knowledge_base/` 仍存在（不删）

→ 全流程完成。

## 失败恢复

- Gate 3 选"返回修改"：不发布、不归档、不清理
- 5.4 部分平台失败：发布记录只列成功的；**清理延后**到 `/content-flow --cleanup <slug>` 全部 OK 时再做（避免清理掉再发的依赖）
- 5.6 vault 写失败：`content-factory/<slug>` 全部保留，不清理
- 5.7 清理失败：用户可 `/content-flow --cleanup <slug>` 单独跑

## 输出

- `knowledge/写作/YYYY/MM/<slug>.md`（永久产物，含发布记录段）
- `content-factory/<slug>` 三处全清理
````

- [ ] **Step 2：跑真实任务**

```
/content-publish <slug>
```

> ⚠️ 这一步会真的把内容发布到公众号 / X 上。第一次跑前先确认 brief 里的目标平台只勾你能容忍当 demo 的平台，或者用测试账号。

- [ ] **Step 3：验证**

```bash
YYYY=$(date +%Y); MM=$(date +%m)
test -f "knowledge/写作/${YYYY}/${MM}/<slug>.md"
grep -q "发布记录" "knowledge/写作/${YYYY}/${MM}/<slug>.md"
test ! -f content-factory/briefs/<slug>.md
test ! -d content-factory/drafts/<slug>
test ! -d content-factory/images/<slug>
test -d content-factory/_knowledge_base  # 保留
```

Expected：6 条全 OK。

- [ ] **Step 4：Commit**

```bash
git add .claude/commands/content-publish.md
git commit -m "feat(workflow): implement /content-publish (stage 5)"
```

---

## Phase 2：总编排命令（1 个 task）

### Task 2.1：实现 `/content-flow`（总编排 + 状态机）

**Files:**
- Create: `.claude/commands/content-flow.md`
- Reads: `content-factory/`、`knowledge/写作/`（推断状态）
- Calls: `/content-pick`、`/content-research`、`/content-write`、`/content-illustrate`、`/content-publish`

- [ ] **Step 1：写命令文件**

写 `.claude/commands/content-flow.md`：

````markdown
---
description: 总编排 — 按状态机串起 5 个 Stage，Gate 处用 AskUserQuestion 强停
argument-hint: [--from <stage>] [--slug <slug>] [--resume <slug>] [--cleanup <slug>]
---

# /content-flow：总编排

## 命令契约

```
/content-flow                             # 新任务，从 Stage 1 开始
/content-flow --from research --slug X    # 从 Stage 2 重跑
/content-flow --from write --slug X       # 从 Stage 3 重跑
/content-flow --from illustrate --slug X  # 从 Stage 4 重跑
/content-flow --from publish --slug X     # 从 Stage 5 重跑
/content-flow --resume <slug>             # 自动检测断点续跑
/content-flow --cleanup <slug>            # 仅做 5.7 清理
```

## 参数解析

1. 解析 `$ARGUMENTS` 拿到 `--from`、`--slug`、`--resume`、`--cleanup`
2. 互斥校验：`--cleanup` 与其他互斥；`--resume` 与 `--from` 互斥
3. 如果是 `--cleanup <slug>`：跳到状态机的"清理"分支

## 状态机（按文件存在性推断当前位置）

```
Step A: content-factory/briefs/<slug>.md 存在？
  否 → 跑 /content-pick（Stage 1）；得到 slug 后继续 Step B
  是 → 继续 Step B

Step B: briefs/<slug>.md 末尾"调研摘要"段非空？
  否 → 跑 /content-research <slug>（Stage 2）；继续 Step C
  是 → 继续 Step C

Step C: drafts/<slug>/final.md 存在 + YAML 只有 title 字段（无 title_candidates）？
  否 → 跑 /content-write <slug>（Stage 3）；继续 Step D
  是 → 继续 Step D

Step D: images/<slug>/cover.png 存在？
  否 → 跑 /content-illustrate <slug> 的 Stage 4 部分；继续 Step E
  是 → 继续 Step E

Step E: drafts/<slug>/final-with-urls.md 存在 + 0 个 ./images/ 引用？
  否 → 跑 /content-illustrate <slug> 的 Stage 4.5 部分；继续 Step F
  是 → 继续 Step F

Step F: knowledge/写作/YYYY/MM/<slug>.md 存在？
  否 → 跑 /content-publish <slug>（Stage 5：5.1-5.6）；继续 Step G
  是 → 继续 Step G

Step G: content-factory/<slug> 三处任一存在？
  是 → 跑 /content-publish <slug> 的 5.7 清理部分
  否 → 完成
```

## --from 行为

`--from` 强制从指定 Stage 起跑，**无视后续 Stage 已有的产物**：
- `--from research`：跳过 Stage 1，从 Stage 2 起跑（**不删** 已有产物，让 stage 命令自己幂等覆盖）
- `--from write`：从 Stage 3 起，会重写 v1/v2/v3/final
- `--from illustrate`：从 Stage 4 起，会重新配图 + 重传 COS（COS 同名 key 会被覆盖）
- `--from publish`：从 Stage 5 起，会重新发布（**注意**：会重发到平台，慎用）

## --resume 行为

完全等价于无参 `/content-flow`，但加上 `--slug <slug>` 限定 —— 让状态机从该 slug 推断断点。

## --cleanup 行为

只跑 Stage 5.7 的清理部分，不发布、不动 vault。用于"已经发了但清理失败"的情况。

## Gate 处的强停

- Gate 1 / 2 / 3 都在各自 Stage 命令内部处理（用 AskUserQuestion）
- 总编排不重复实现 Gate，只调子命令
- 子命令的 AskUserQuestion 返回值通过自然语言传给总编排，总编排基于此决定是否进 Step 下一步

## 错误处理

任意子命令报错：
- 保留所有中间产物
- 把错误原因 + 当前状态机位置告诉用户
- 提示对应的 `--from <stage> --slug <slug>` 重跑命令

## 调度细节

- 不在 stage 之间做并行（huashu-research 内部已并行；外层并行没收益还容易撞配额）
- 每个 stage 之间打一行进度日志：
  ```
  [content-flow] Stage 1 完成 → slug=<slug>，进入 Stage 2
  ```

## 输出

按 stage 命令各自输出汇总；总编排末尾打印一行 vault 路径：

```
[content-flow] 全流程完成。归档：knowledge/写作/2026/05/<slug>.md
```
````

- [ ] **Step 2：自检 — 对照 spec §4.2 状态机图**

读一遍 content-flow.md，按 spec §4.2 逐个箭头对，确认 Step A-G 与图中 7 个判断节点一一对应（briefs / 调研摘要段 / final.md+title / cover.png / final-with-urls.md / vault .md / cleanup）。

- [ ] **Step 3：跑真实端到端任务**

挑一个简单选题（比如"今天 AI 圈一句话评价"），全程顺着 `/content-flow` 跑：
```
/content-flow
```

- [ ] **Step 4：跑 --resume 测试**

故意中途 Ctrl-C 打断（比如在 Stage 3 humanizer 跑完后），再：
```
/content-flow --resume <slug>
```

应该从 Stage 3 的 v3 之后续上，不重跑 v1/v2。

- [ ] **Step 5：跑 --cleanup 测试**

发布完后人为再造一个孤儿（`mkdir content-factory/drafts/test-orphan`），跑：
```
/content-flow --cleanup test-orphan
```

> 注意：这条会失败，因为 cleanup 要求 vault 里有对应 .md。这是预期行为 — 验证黑名单保护：cleanup 不会无脑删。

实际有效的 cleanup 测试是发布完整流程的一篇用 `--cleanup` 跑一遍，确认 idempotent（已经清干净再跑一次也不报错）。

- [ ] **Step 6：Commit**

```bash
git add .claude/commands/content-flow.md
git commit -m "feat(workflow): implement /content-flow orchestrator"
```

---

## Phase 3：试水 3 篇（3 个验收 task）

> 这是验收，不是开发。每篇文章必须真发出去（公众号 / X 任一平台），用真实运行验证整条流水线。
> 验收标准（每篇都要满足）：
> 1. 总成本 ≤ $2（含 token + AI 生图）
> 2. AI 检测率 ≤ 30%（huashu-proofreading 自检报告）
> 3. vault 最终文件正文干净 + 图外链可显示 + 发布记录段齐全
> 4. content-factory/<slug>/ 发布后被清理干净
> 5. 没有任何中间产物泄漏到 ~/Documents/notes/ 或 ~/Downloads/

### Task 3.1：试水第 1 篇 — 工具教程类

**Goal:** 验证 `task_type=工具教程` 支线（Claude 直写、不走 ljg-writes）走通。

- [ ] **Step 1：选题**

跑 `/content-flow`，在 Gate 1 选一个**纯工具教程**话题：例如 "Claude Code 的 hooks 怎么用"、"Cursor Composer 实战 30 分钟"。task_type 设 `工具教程`。

- [ ] **Step 2：全流程跑通**

让流水线一路跑到底，发布到至少 1 个平台（公众号或 X，先选发布失败成本低的）。

- [ ] **Step 3：5 项验收**

```bash
# 1. 成本：让 Stage 4 末尾的成本摘要 + 大概估算 token
# （token 部分手动估算或看 dashboard）

# 2. AI 检测率：看 audit.md 第二遍打勾 + huashu-proofreading 报告

# 3. vault
YYYY=$(date +%Y); MM=$(date +%m)
SLUG=<slug>
test -f "knowledge/写作/${YYYY}/${MM}/${SLUG}.md"
grep -q "发布记录" "knowledge/写作/${YYYY}/${MM}/${SLUG}.md"
# 抽样 1 个图 URL 用 curl -sI 验证 200

# 4. content-factory 清理
test ! -e content-factory/briefs/${SLUG}.md
test ! -e content-factory/drafts/${SLUG}
test ! -e content-factory/images/${SLUG}

# 5. 中间目录无泄漏
ls ~/Documents/notes/ 2>/dev/null | grep -i "${SLUG}" && echo "LEAK" || echo "no leak in notes"
ls ~/Downloads/ 2>/dev/null | grep -i "${SLUG}" && echo "LEAK" || echo "no leak in downloads"
```

5 项全 OK。如有失败：
- 找出根因（哪个 stage / 哪个 skill / 哪个适配层）
- 写到 `docs/superpowers/plans/2026-05-13-self-media-workflow-tuning-notes.md`（暂时放问题列表，不在本 plan 内修）
- task **不** 标 completed 直到 5 项全过

- [ ] **Step 4：commit 验收报告**

把 5 项验证结果 + 实际成本 + 链接写到一个 `docs/superpowers/plans/试水-1-工具教程.md` 简短报告里。

```bash
git add docs/superpowers/plans/试水-1-工具教程.md
git commit -m "test(workflow): trial article 1 (tool tutorial) verified"
```

---

### Task 3.2：试水第 2 篇 — 知识思辨类

**Goal:** 验证 `task_type=知识思辨` 支线（走 ljg-writes + 适配层从 ~/Documents/notes/ 搬运）。

- [ ] **Step 1：选题**

跑 `/content-flow`，Gate 1 选一个**知识思辨**话题：例如 "为什么大模型记不住事"、"AI 时代的 '信息差套利' 还成立吗"。task_type 设 `知识思辨`。

- [ ] **Step 2：全流程跑通**

特别盯：
- ljg-writes 在 `~/Documents/notes/` 落了 .md 没？
- 适配层 `find -newer` `mv` 是不是把它拿到了 `drafts/<slug>/v1-初稿.md`？
- 跑完后 `~/Documents/notes/` 里**不应该**有刚生成的那个时间戳文件

- [ ] **Step 3：5 项验收（同 Task 3.1）**

特别强调：**Step 5 中间目录无泄漏**——这一篇是适配层的核心验证。如果 `~/Documents/notes/` 里有遗漏，说明适配层 bug，**回 Task 1.3 修 content-write.md**。

- [ ] **Step 4：commit 验收报告**

```bash
git add docs/superpowers/plans/试水-2-知识思辨.md
git commit -m "test(workflow): trial article 2 (deep think) verified"
```

---

### Task 3.3：试水第 3 篇 — 综合（含小红书）

**Goal:** 验证成本控制、humanizer voice sample 复用、跨平台改写、ljg-card 适配层。

- [ ] **Step 1：选题**

跑 `/content-flow`，目标平台 **3 个全勾**（公众号 + X + 小红书）。task_type 任选。

注意：这一篇 vault 里已经有 Task 3.1 + 3.2 两篇文章，humanizer 取最近 5 篇 voice sample 时**会取到这两篇**。这是预期行为，正是 voice 校准的目的。

- [ ] **Step 2：全流程跑通**

特别盯：
- humanizer 是否真的读了 vault 里的两篇做 calibration（看 humanizer 输出 / 日志）
- ljg-card 在 `~/Downloads/` 落 png 没？适配层搬到 `images/<slug>/cards/` 没？`~/Downloads/` 里没有遗漏？
- 小红书发布走手动通道：编排是否打开了 cards 目录 + 显示一句话文案？等"小红书已发"用户回复？

- [ ] **Step 3：5 项验收 + 第 6 项**

5 项同上。第 6 项额外：**vault 文件的"发布记录"段同时含三个平台**（公众号 url、X url、小红书 N 张卡组）。

```bash
# 第 6 项
SLUG=<slug>
YYYY=$(date +%Y); MM=$(date +%m)
file="knowledge/写作/${YYYY}/${MM}/${SLUG}.md"
for platform in "公众号" "X" "小红书"; do
  grep -q "${platform}：" "$file" || { echo "missing: $platform"; exit 1; }
done
echo "OK: 3 platforms in archive"
```

- [ ] **Step 4：commit 验收报告**

```bash
git add docs/superpowers/plans/试水-3-综合.md
git commit -m "test(workflow): trial article 3 (omni-platform) verified"
```

---

## Phase 4（可选）：调优

> 不在本 plan 强制范围内。3 篇试水跑完后用 `/learn` 收拢观察到的模式，作为下次迭代输入。
> 看文档 §6 Phase 4 即可，不细拆 task。

---

## 自检：Spec 覆盖核对

| Spec 章节 | 对应 Task |
|---|---|
| §1 总体架构 | 全 Phase（实施动机） |
| §2.1 项目根 | 0.1 |
| §2.2 完整目录树 | 0.1 + 0.7-0.10（skill 拷贝） |
| §2.3 slug 规则 | 1.1（content-pick 实现） |
| §2.4 .env.example | 0.5 |
| §2.5 skill 引入方式 | 0.7 / 0.8 / 0.9 / 0.10 |
| §2.6 brief.md / audit-checklist.md | 0.2 / 0.3 |
| §2.7 vault 路由 | 0.4 |
| §3.Stage 1 选题 | 1.1 |
| §3.Stage 2 调研 | 1.2 |
| §3.Stage 3 写作 + 三遍审校 | 1.3 |
| §3.Stage 4 配图 | 1.4 (前半) |
| §3.Stage 4.5 上 COS | 1.4 (后半) |
| §3.Stage 5 发布 + 归档 + 清理 | 1.5 |
| §4 总编排 + 状态机 + 适配层 + 人机交互 | 2.1 |
| §5 失败恢复 | 1.1-1.5 + 2.1 (各自的"失败恢复"段) |
| §5 成本控制 | 1.4 (Stage 4.5 摘要) + 3.1-3.3 (验收) |
| §5 安全（黑名单 / 凭证） | 0.6 (.gitignore) + 0.11-0.13 (EXTEND/COS) + 1.5 (5.7 清理黑名单) |
| §6 Phase 0-4 实施清单 | Phase 0-3（与 spec 一致） |
| §7 skill 选型依据 | 0.7-0.10（按选型表拷贝对应 skill） |

无 spec 章节遗漏。

---

## 执行交接

**Plan 完成，已保存：`docs/superpowers/plans/2026-05-13-self-media-workflow-plan.md`**

两种执行方式：

1. **Subagent-Driven（推荐）** — 每个 task 派一个 fresh subagent，task 之间我做 review，迭代快
2. **Inline 执行** — 在当前 session 用 superpowers:executing-plans 批量跑，checkpoint 处暂停 review

哪种？
