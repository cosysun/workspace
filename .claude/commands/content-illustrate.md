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
