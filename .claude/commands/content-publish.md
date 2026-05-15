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
