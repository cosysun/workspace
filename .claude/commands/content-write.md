---
description: Stage 3 — 写作 + 三遍审校 + 标题拟定，AI 味 ≤ 30%
argument-hint: <slug>
---

# Stage 3：写作 + 三遍审校

## 输入

`<slug>` → 读 `content-factory/briefs/<slug>.md`（含调研摘要 + 大纲 + task_type）。

## 字数约束（贯穿全 Stage）

从 brief 读 `公众号预计字数` 字段，解析出 `WORD_MIN` / `WORD_MAX`：

```bash
# 解析示例：字段值 "1000-1500（默认...）" → WORD_MIN=1000, WORD_MAX=1500
RANGE=$(grep '公众号预计字数' content-factory/briefs/<slug>.md | grep -oE '[0-9]+-[0-9]+' | head -1)
WORD_MIN=${RANGE%-*}
WORD_MAX=${RANGE#*-}
# 兜底：解析失败默认 1000-1500
WORD_MIN=${WORD_MIN:-1000}
WORD_MAX=${WORD_MAX:-1500}
WORD_HARD_CAP=$((WORD_MAX * 12 / 10))   # 上限的 +20% 是绝对红线
```

**这两个数后面所有步骤都要用**：3.1 写作时当目标，3.2/3.3 审校时不许涨过 `WORD_HARD_CAP`，3.4.5 强制收口到 [WORD_MIN, WORD_MAX]。

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

**字数目标**：`[WORD_MIN, WORD_MAX]` 字（中文字符数，不含 markdown 标记）。写完后用 `wc -m` 或 `grep -oE '[\x{4e00}-\x{9fff}]' | wc -l` 自查，超出 `WORD_HARD_CAP` 直接重写。

**不要**调 `ljg-writes` —— 文体不匹配，会变成"大朝风格的评测"。

#### 3.1.b 如果 task_type=`知识思辨`

调 `ljg-writes`（输出到 `~/Documents/notes/{时间戳}__write.md`）。**调用前在 prompt 里把字数范围塞进去**：

> "本次写作字数严格控制在 `WORD_MIN`-`WORD_MAX` 字（即使 ljg-writes 默认 1000-1500，也以 brief 为准）。"

**调用前后做适配层搬运**：

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

#### 3.4.a 流畅度审校（先跑，比 Chad Nauseam 5 优先）

按 `audit.md` 「第二遍半：流畅度审校」清单逐条扫 v3，对应 8 个反模式：

1. **倒序叙事**——任务句先抽象目标，具体数字/参数留到"修正后"那句
2. **砍 referent / 抽象比喻**——形容词（"干净"/"清晰"）和比喻（"点头"/"过关"）必须有具体定义或视觉化动作
3. **主宾倒置**——默认主动语序，"主语-动词-宾语"
4. **看似精确的数字**——"8/10" → "80%" 或 "大部分"
5. **砍连接词**——结果/于是/顺着这个思路/不过——这些不是冗余，砍掉读者要回读
6. **主语缺失**——除非前句明确，否则补"我"/"我们"
7. **段落超载**——一段 ≤ 3 句、不塞 3+ 件事；4+ 并列项改 bullet
8. **列表机会未抓**——多 case 并置时 bullet 化让"数得清"，与下文数量呼应

**总原则**：让读者一遍读懂 > 字数压在下限。
写完每段问自己："如果我是第一次读这篇文章的人，读到这里有没有任何一刻需要回读上一句才能理解？" 有就改。
**Brief 写的字数是上限，不是目标——为流畅度可以让字数下限**。

在 `audit.md` 「第二遍半」打勾。

#### 3.4.b Chad Nauseam 5 技巧

Claude 跑 Chad Nauseam 5 技巧：
1. 强开头（第一句让人想读下一句）
2. 句子节奏（长短错落）
3. 多巴胺密度（每 3-5 段一次"原来如此"）
4. 微幽默（1-2 处不做作）
5. 概念把手（类比 / 例子）

#### 3.4.c 标点排版统一

调 `baoyu-format-markdown` 做标点排版统一。

落 `content-factory/drafts/<slug>/final.md`，audit.md 第三遍打勾。

### 3.4.5 字数收口（强制）

写完 final.md 后立刻量字数：

```bash
COUNT=$(grep -oE '[\x{4e00}-\x{9fff}]' content-factory/drafts/<slug>/final.md | wc -l | tr -d ' ')
echo "当前 $COUNT 字 / 目标 $WORD_MIN-$WORD_MAX 字 / 红线 $WORD_HARD_CAP 字"
```

判断分支：

- **$WORD_MIN ≤ COUNT ≤ $WORD_MAX**：通过，进 3.5
- **$WORD_MAX < COUNT ≤ $WORD_HARD_CAP**：软超，可接受，但记一笔到 audit.md
- **COUNT > $WORD_HARD_CAP**：硬超，**必须砍**。调 `huashu-article-edit`，prompt：
  > "当前 N 字，目标 X-Y 字。砍掉重复论证、冗余例子、套话过渡，保留所有事实和原文核心。砍后报字数。"
  砍完覆盖 final.md，再量一次。砍 2 轮还超 → 停下来告诉用户哪几段建议手动删
- **COUNT < $WORD_MIN**：太短，反向：调 `huashu-article-edit` 让它在最薄弱的论证段加例子或具体数字（不要灌水），不许低于 `WORD_MIN`

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
