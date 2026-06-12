---
description: Stage 4 — 配图（HTML 截图优先 + 单张 AI 封面） + Stage 4.5 上传 COS 替换路径
argument-hint: <slug>
---

# Stage 4：配图（成本分层） + Stage 4.5：上 COS 替换路径

## 核心约束

```
Tier 1 [零成本] HTML / SVG 精确信息图  ← 文字、流程、步骤、数据优先
Tier 2 [零成本] 现成公共图片 / 本地截图
Tier 3 [零成本] HTML 改稿后复渲染
```

**本流程一律走 HTML 路径**：封面、正文配图、流程图全部用 HTML 渲染后截图，不调任何 AI 生图后端（不调 `baoyu-cover-image`、不调 `baoyu-imagine`、不调 `imagegen`）。预算永远是 0。

## 输入

`<slug>` → 读 `content-factory/drafts/<slug>/final.md` 抓需要配图的位置（标题 / H2 节 / 关键概念 / 流程图位）。

## Stage 4.0 解析目标平台（强制第一步）

从 `content-factory/briefs/<slug>.md` 解析 `目标平台` 字段：

```bash
BRIEF=content-factory/briefs/<slug>.md
PLATFORMS_LINE=$(grep -E '^- 目标平台' "$BRIEF" || grep -E '目标平台' "$BRIEF" | head -1)

case "$PLATFORMS_LINE" in *公众号*) WANT_WECHAT=1 ;; *) WANT_WECHAT=0 ;; esac
case "$PLATFORMS_LINE" in *X*)      WANT_X=1      ;; *) WANT_X=0      ;; esac
case "$PLATFORMS_LINE" in *小红书*) WANT_XHS=1    ;; *) WANT_XHS=0    ;; esac
```

后续 4.1-4.4 按这些旗短路：未勾选公众号也跳 4.1/4.2/4.3 主线，未勾选小红书直接跳 4.4。

## 准备

```bash
mkdir -p content-factory/images/<slug>/cards
touch content-factory/images/<slug>/prompts.md
```

## 步骤

### 4.1 公众号正文配图

先读 `huashu-wechat-image/references/article-image-planning.md`，为正文图做规划，不要按 H2 机械插图。

规划时为每张图写清：
- 位置：放在哪个章节后
- 任务：建立记忆点 / 解释机制 / 降低阅读阻力 / 补充证据 / 节奏休息
- 图型：概念图 / 机制图 / 步骤图 / 数据图 / 截图
- 路径：HTML / SVG / 现成图（**禁止 AI 生图**）
- 风格：内容感知配色，而不是所有科技文都暗色终端

路径选择规则（**全部零成本路径**）：
- **概念 / 氛围图**：HTML + 图形元素（emoji、几何图形、渐变背景）做视觉化，不调 AI。
- **机制 / 架构图**：优先 `baoyu-diagram` 生成 SVG → PNG，或 HTML 截图。
- **步骤 / 清单 / 数据图**：HTML 截图，保证文字准确和可复渲染。
- **真实产品 / 网页界面**：现成图、本地截图或公开图片，确认清晰度和版权。

落地要求：
- 输出到 `content-factory/images/<slug>/image-N.png`
- 每张图的目的、路径、主题、源 HTML/SVG append 到 `prompts.md`
- 生成后至少预览每张正文图，检查文字准确、尺寸、深色模式适配和是否与小红书卡组重复过多

### 4.2 公众号架构图 / 流程图

如果文章有架构 / 流程内容，调 `baoyu-diagram` 生成 SVG → PNG。零成本。落 `images/<slug>/diagram-N.png`。

### 4.3 公众号封面（HTML 渲染）

**禁止调 `baoyu-cover-image` / `baoyu-imagine` / `imagegen` 等 AI 生图后端。**

封面走 HTML 截图路径：

1. 根据 brief 主题 + final.md 风格，写一份独立的 HTML（含内联 CSS 样式），文件落到 `content-factory/images/<slug>/cover.html`
2. 设计要点：
   - 画布尺寸 1200×675（16:9）或 2.35:1（MrBeast 横幅感）
   - 主标题（来自 final.md YAML 的 title 字段）+ 一行副标题 / 钩子
   - 配色与文章主题匹配（参考 4.4 的视觉主题选择思路）
   - 用纯文字 + 几何图形 + emoji + CSS 渐变即可，不用外链图片
3. 用 puppeteer / playwright 之类的工具截图（如已有 `gstack` 截图能力直接用），落到 `content-factory/images/<slug>/cover.png`
4. 把 HTML 源文件路径和设计选择 append 到 `prompts.md`

X 主图复用此 cover.png（仅当 `WANT_X=1` 时会被 5.4.b 用到，否则就是公众号专用封面）。

### 4.4 小红书卡组（仅当 `WANT_XHS=1`）

未勾选小红书时整段跳过，不生成 cards/。

调 `ljg-card`，按需要选模具：
- `-m` 多卡（1080x1440，自动切分） — 主体
- `-b` 大字附件 — 标题 / 金句
- `-i` 信息图 — 数据 / 流程

生成前必须明确小红书卡组策略：

1. 先根据文章内容选择视觉主题，不要默认暗绿终端。可选方向包括：
   - CLI / 工程工具：暗绿终端风
   - AI 产品 / 效率工具：暖纸感或浅色产品风
   - 研究 / 模型 / 数据：克制浅底和数据标签
   - 商业 / 趋势 / 创业：商业简报风
   - 风险 / 安全 / 反思：暗色警示风
   - 创作 / 内容工具：编辑部纸感
2. 默认卡组叙事结构：
   - 封面钩子
   - 痛点共鸣
   - 机制解释 / 对比图
   - 核心能力
   - 快速上手或使用场景
   - 适合谁 + 边界提醒
3. 每组至少有 1 张结构图或对比图，不能只做文字摘要卡。
4. 卡片文案要重写成适合小红书滑读的短句，不要直接把 `final.md` 分页。
5. 生成完成后至少检查首图、机制图、步骤图、最后一图，确认标题、命令和英文没有尴尬断行。

ljg-card 默认输出到 `~/Downloads/`。**调用前后做适配层搬运**：

```bash
MARK=$(mktemp)
touch "$MARK"
# 调 ljg-card
find ~/Downloads -newer "$MARK" -name "*.png" -type f \
  -exec mv {} content-factory/images/<slug>/cards/ \;
rm "$MARK"
```

把小红书卡组的主题选择、卡片结构、源 HTML 或核心 prompt append 到 `content-factory/images/<slug>/prompts.md`，至少包含：

```markdown
## 小红书卡组

- 输出目录：`cards/`
- 数量：<N> 张
- 主题：<主题名>
- 选择理由：<为什么该主题适合这篇内容>
- 配色：背景 <HEX> / 强调色 <HEX>
- 结构：<每张卡一句摘要>
- 源文件：<如有 HTML 预览文件，写相对路径>
```

### 4.5 配图清单核对

跑完 4.1-4.4 后，列一份 `content-factory/images/<slug>/` 下实际产物清单（封面、正文图 N 张、流程图 K 张、卡组若干），与 4.1 规划做对账。缺图直接补，不要进入 4.5（COS）。

### 4.6 Stage 4 摘要

输出一行：

```
Stage 4 完成。配图全 HTML 路径：
  封面     × 1   [零成本]
  正文图   × <N> [零成本]
  流程图   × <K> [零成本]
  小红书卡 × <M> [零成本]
  总成本 = $0
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
