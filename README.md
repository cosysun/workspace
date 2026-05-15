# ai-workflow / workspace

我的个人内容生产流水线。一个仓库串起选题、调研、写作、配图、跨平台发布、归档六件事，全部跑在 Claude Code 上。

```
选题 → 调研 → 写作 → 配图 → 发布 → 归档
 1     2     3     4     5     5.7
```

入口就一条命令：`/content-flow`。

---

## 这是什么

**对内**：本地写作 + 发布的工作台。一篇文章从想法到出现在公众号草稿箱，全程在终端里跑 `/content-flow`，不开浏览器（除了最后去后台点"发送"）。

**对外**：组合调用 Anthropic Skills + Obsidian vault + 微信公众号 API + 腾讯云 COS 图床的一套自定义编排。

不是产品，不是 SaaS，不是给别人复刻用的。是我自己迭代了几版的工作流，刚好攒齐了 README 写一份。

---

## 它解决什么问题

| 痛点 | 解法 |
|---|---|
| 选题找不准 | `/content-pick` 拉多源热点 + 写作风格匹配，产出 3-4 个候选 |
| 调研太碎 | `/content-research` 一次到位，调研摘要直接落到 brief 文件 |
| 初稿 AI 味重 | 三遍审校（内容 → humanizer → AI 检测率 ≤30%）+ 字数硬闸门 |
| 配图低效 | HTML 截图优先（信息图精确）+ 单张 AI 封面（视觉冲击）+ COS 永久 URL |
| 公众号 API 要白名单 IP | VPS Nginx 反代 + token 鉴权，本机动态 IP 也能推 |
| 已发布文章散在各平台 | Obsidian vault 归档 md，frontmatter 记录 publishing 状态 |
| 中间文件混乱 | `content-factory/` 跟 `knowledge/` 物理隔离，5.7 自动清理 |

---

## 目录结构

```
workspace/
├── .claude/
│   ├── commands/                  # 6 个流水线命令（slash commands）
│   │   ├── content-flow.md        # 总编排，状态机
│   │   ├── content-pick.md        # Stage 1 选题
│   │   ├── content-research.md    # Stage 2 调研
│   │   ├── content-write.md       # Stage 3 写作 + 三遍审校
│   │   ├── content-illustrate.md  # Stage 4 + 4.5 配图 + COS
│   │   └── content-publish.md     # Stage 5 发布 + 归档
│   ├── skills/                    # 31 个外部 skill（baoyu-* / huashu-* / ljg-* / 等）
│   └── settings.json
│
├── content-factory/               # ⚠️ 工作区，所有中间文件，发布后清理
│   ├── _templates/
│   │   ├── brief.md               # brief 模板（含字数闸门）
│   │   └── audit-checklist.md     # 三遍审校 checklist
│   ├── _knowledge_base/           # 长期沉淀的主题资料库
│   ├── briefs/<slug>.md           # 每篇文章的选题 brief
│   ├── drafts/<slug>/             # 多版草稿、HTML、备份
│   └── images/<slug>/             # 图片源文件、HTML 渲染源
│
├── knowledge/                     # ⚠️ Obsidian vault，永久归档，只存定稿
│   ├── .obsidian/
│   └── 写作/
│       ├── 00-README-路由.md      # vault 自身的约定（必读）
│       └── YYYY/MM/<slug>.md      # 一篇文章 = 一个 md（图走 COS 外链）
│
├── scripts/
│   └── wechat-proxy-setup.sh      # VPS 一键起 Nginx 反代（公众号 API 白名单方案）
│
├── docs/                          # 这个仓库自己用到的参考文档
├── CLAUDE.md                      # AI 行为规范（写代码时的护栏）
├── README.md                      # 本文件
├── .env.example                   # 环境变量模板（凭证不进 git）
└── skills-lock.json               # skill 版本锁
```

**两个目录的边界**：`content-factory/` 是工作台，发完就清；`knowledge/` 是档案室，不删不改。`/content-flow` Stage 5.7 自动维护这条边界。

---

## 流水线总览

`/content-flow` 是状态机，按文件存在性自动推断当前位置。中断了直接 `--resume <slug>` 续跑。

| Stage | 命令 | 输入 | 输出 |
|---|---|---|---|
| **1. 选题** | `/content-pick` | （无） | `briefs/<slug>.md`（含 slug、目标读者、字数范围） |
| **2. 调研** | `/content-research <slug>` | brief | brief 末尾追加「调研摘要」段 |
| **3. 写作** | `/content-write <slug>` | brief + 调研 | `drafts/<slug>/{v1-初稿,v2-内容审校,v3-降AI味,final}.md` |
| **4. 配图** | `/content-illustrate <slug>` | final.md | `images/<slug>/{cover,fig01..N}.png` |
| **4.5 上 COS** | 同上 | 本地图 | `drafts/<slug>/final-with-urls.md`（图引用全替换为 COS 永久 URL） |
| **5.1-5.6 发布** | `/content-publish <slug>` | final-with-urls.md | 公众号草稿 / X 已发 / 小红书图片 |
| **5.7 归档+清理** | 同上 | drafts + COS URL | `knowledge/写作/YYYY/MM/<slug>.md`，删 `content-factory/<slug>/*` |

每个 Stage 之间是 **Gate**：用 `AskUserQuestion` 强停，让你确认后才继续。

### 命令契约

```bash
/content-flow                             # 新任务，从 Stage 1 开始
/content-flow --from research --slug X    # 从 Stage 2 重跑
/content-flow --from write --slug X       # 从 Stage 3 重跑
/content-flow --from illustrate --slug X  # 从 Stage 4 重跑
/content-flow --from publish --slug X     # 从 Stage 5 重跑
/content-flow --resume <slug>             # 自动检测断点续跑
/content-flow --cleanup <slug>            # 仅做 5.7 清理
```

---

## 首次设置

按顺序跑这 4 步。之前没跑过的话，第一次约 30 分钟。

### Step 0：前置依赖

```bash
# Bun（所有 .ts skill 的 runtime）
brew install oven-sh/bun/bun

# Chrome（baoyu-post-to-wechat browser 路径用，API 路径不用）
# 已装跳过

# Claude Code
# https://claude.com/claude-code
```

### Step 1：克隆 + 装 skill

```bash
cd ~/work/ai-workflow
# 假设 workspace/ 已存在（这就是本仓库）
cd workspace

# 检查 skill-lock.json 锁定的 skill 是否齐
ls .claude/skills/ | wc -l   # 应该 31

# 部分 skill 需要本地装依赖（一次性）
cd .claude/skills/tencent-cos-skill && bash scripts/setup.sh --check-only
cd ../baoyu-post-to-x/scripts && bun install
```

### Step 2：填凭证（`.env`）

```bash
cp .env.example .env
chmod 600 .env
```

打开 `.env`，按段填：

| 段 | 必填？ | 哪里拿 |
|---|---|---|
| 公众号 API | ✅ | mp.weixin.qq.com → 开发 → 基本配置 |
| X 鉴权 | 仅发 X 时必填 | 浏览器 cookie：`auth_token` / `ct0` / 完整 cookie 串 |
| 腾讯云 COS | ✅ | console.cloud.tencent.com → CAM 子账号（仅 COS 权限） |

**WeChat 还要在 `~/.baoyu-skills/.env` 填一份**（baoyu-post-to-wechat skill 读这个）：

```bash
mkdir -p ~/.baoyu-skills
cat >> ~/.baoyu-skills/.env <<'EOF'
WECHAT_API_BASE=https://wechat-proxy.<你的域名>/wechat
WECHAT_API_TOKEN=<32 位以上随机串>
WECHAT_APP_ID=<同 .env>
WECHAT_APP_SECRET=<同 .env>
EOF
chmod 600 ~/.baoyu-skills/.env
```

注意：**变量名是 `WECHAT_APP_ID`（中间下划线），不是 `WECHAT_APPID`**。skill 不读项目根的 `.env`，只读 `~/.baoyu-skills/.env`。

### Step 3：起 VPS 反代（公众号 API 白名单）

公众号 API 要求把调用方 IP 加到白名单。本地宽带 IP 经常变 → 用 VPS 当固定出口：

```bash
# 在你的 VPS 上跑（不是本机）
scp scripts/wechat-proxy-setup.sh user@your-vps:/tmp/
ssh user@your-vps
sudo bash /tmp/wechat-proxy-setup.sh
# 按提示填：域名 / 邮箱 / token（同 ~/.baoyu-skills/.env 里的 WECHAT_API_TOKEN）
```

脚本干的活：
1. 装 nginx + certbot
2. 两阶段配置：先 HTTP → certbot 拿证书 → 改 HTTPS + 反代 + token 鉴权
3. 反代规则：`https://<你的域名>/wechat/*` → `https://api.weixin.qq.com/*`，必须带 `X-Auth-Token`

跑完拿到 VPS 出口 IP，回公众号后台**「开发 → 基本配置 → IP 白名单」**加进去。

验证整条链路：

```bash
bun -e '
const env = {};
require("fs").readFileSync(require("os").homedir() + "/.baoyu-skills/.env", "utf8")
  .split("\n").filter(l => l && !l.startsWith("#"))
  .forEach(l => { const i = l.indexOf("="); if (i > 0) env[l.slice(0,i).trim()] = l.slice(i+1).trim(); });
const url = `${env.WECHAT_API_BASE}/cgi-bin/token?grant_type=client_credential&appid=${env.WECHAT_APP_ID}&secret=${env.WECHAT_APP_SECRET}`;
const r = await fetch(url, { headers: { "X-Auth-Token": env.WECHAT_API_TOKEN } });
console.log(await r.json());
'
```

返回 `{access_token, expires_in: 7200}` 就是通了。

### Step 4：跑一篇试试

```bash
# 在 Claude Code 里
/content-flow
```

按 Gate 提示往下走。中断了下次 `--resume <slug>` 续跑。

---

## 关键约定

### 文章定稿格式（vault 归档）

```yaml
---
title: "文章标题"
date: 2026-05-14
tags: [写作, 主题1, 主题2]
sources:
  - https://x.com/xxx/status/yyy   # 灵感来源
publishing:
  公众号: 已发布（2026-05-15）
  小红书: 已发布（2026-05-15）
  X: 已发布（2026-05-15）
word_count: 1199
---

# 标题（H1）

正文…
```

`publishing:` block 是发布状态的**唯一真相源**。完整约定见 [`knowledge/写作/00-README-路由.md`](./knowledge/写作/00-README-路由.md)。

### 图片必须走 COS

- bucket：`ai-content-1300152858`（ap-shanghai）
- 路径：`content-factory/<slug>/<filename>.png`
- 永久 HTTPS URL：`https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/<slug>/<filename>.png`
- vault 里的 md **不存图片附件**

Stage 4.5 自动把 `./images/cover.png` 这种本地引用替换成 COS URL。

### 字数闸门

每篇 brief 必填 `公众号预计字数: 1000-1500`（默认）。Stage 3.4.5 验证字数：

- 低于下限 → 退回扩写
- 高于上限 × 1.2（hard cap）→ 退回精简

### AI 检测率目标

`AI_PROOFREAD_TARGET=30`（环境变量），三遍审校后目标 ≤30%。

---

## 常用命令速查

```bash
# 流水线
/content-flow                              # 新任务
/content-flow --resume 2026-05-14-foo      # 续跑
/content-flow --from publish --slug X      # 从某 Stage 重跑
/content-flow --cleanup X                  # 仅清理工作目录

# vault 检索
rg "claude" knowledge/写作/ --type md      # 搜全文
rg -A4 "^publishing:" knowledge/写作/      # 看发布状态
ls -t knowledge/写作/**/*.md | head -5     # 最近 5 篇

# 单步发布（绕过 /content-flow）
bun ~/.claude-internal/skills/baoyu-post-to-wechat/scripts/wechat-api.ts \
  drafts/<slug>/wechat.html \
  --theme default \
  --title "..." \
  --cover images/<slug>/cover.png

# COS 图片上传
node .claude/skills/tencent-cos-skill/scripts/cos_node.mjs upload \
  --file local.png --key content-factory/<slug>/cover.png

# 检查 VPS 反代
curl https://wechat-proxy.<你的域名>/health
```

---

## skill 速查

31 个 skill，按用途分类：

| 类型 | skill |
|---|---|
| **选题/调研** | `aihot`, `huashu-info-search`, `huashu-research`, `huashu-topic-gen`, `web-access` |
| **抓取/转换** | `baoyu-url-to-markdown`, `baoyu-danger-x-to-markdown`, `baoyu-youtube-transcript`, `defuddle` |
| **写作/审校** | `ljg-writes`, `huashu-article-edit`, `huashu-proofreading`, `humanizer`, `baoyu-format-markdown` |
| **配图** | `huashu-wechat-image`, `baoyu-cover-image`, `baoyu-diagram` |
| **发布** | `baoyu-post-to-wechat`, `baoyu-post-to-x`, `huashu-article-to-x` |
| **归档** | `obsidian-cli`, `obsidian-bases`, `obsidian-markdown` |
| **图床** | `tencent-cos-skill` |
| **HTML/排版** | `baoyu-markdown-to-html`, `ljg-card`, `ljg-paper`, `json-canvas` |
| **思考工具** | `ljg-think`, `ljg-rank` |
| **质检** | `huashu-video-check` |

来源锁定在 `skills-lock.json`。

---

## 故障排查

| 症状 | 原因 | 解法 |
|---|---|---|
| `Missing WECHAT_APP_ID` | 变量写到了 `workspace/.env` 而不是 `~/.baoyu-skills/.env` | 迁移到正确位置，注意是 `APP_ID` 不是 `APPID` |
| `errcode: 40164`（IP not in whitelist） | VPS 出口 IP 没加到公众号白名单 | mp.weixin.qq.com → 开发 → 基本配置 |
| `errcode: 40013`（invalid appid） | AppID 错 | 重核 |
| `errcode: 40125`（invalid appsecret） | AppSecret 错或过期 | 后台重置 |
| nginx `no "ssl_certificate" defined` | 证书还没拿到就配了 443 server | 删 `/etc/nginx/sites-enabled/wechat-proxy.conf` 重跑 setup.sh |
| `--cover https://...` 报 image not found | wechat-api.ts 把 URL 当本地路径 | 用本地路径 `images/<slug>/cover.png`（脚本自己上传） |
| Stage 3 字数超 1.5x 上限 | brief 没填字数 / 模型放飞 | brief 加 `公众号预计字数: 1000-1500`，重跑 `--from write` |
| Stage 4.5 跑完还有 `./images/` 引用 | COS 上传失败或没替换全 | 检查 `tencent-cos-skill` 凭证；手动 grep 漏掉的引用 |

---

## 这个仓库的边界

✅ **会进 git**：`.claude/`、`scripts/`、`docs/`、`CLAUDE.md`、`README.md`、`.env.example`、`skills-lock.json`、`knowledge/写作/00-README-路由.md`

❌ **不进 git**（见 `.gitignore`）：`content-factory/`、`.env`、`.env.enc`、`huashu-skills/`、`/skills/`、各 skill 的 `node_modules/`、`.baoyu-skills/**/EXTEND.md`、`.playwright-mcp/`、`.DS_Store`

🤔 **knowledge/ 进不进 git？** 看你 —— 我自己进。它就是 Obsidian vault，丢失成本太高。

---

## 历史 / 未来

**已经验证过的全流程**：
- 2026-05-14《Agent 不是模型：你做的是 AI 时代的操作系统》—— 公众号 + 小红书双平台发布

**还没集成进 `/content-flow` 的**：
- X 长贴串（`huashu-article-to-x` 已就位，未编排）
- 视频脚本流水线（`huashu-video-check` 现在只用作"标题封面"质检）
- 多账号公众号（`baoyu-post-to-wechat` 支持 `--account`，没串到 `/content-flow`）

**已知设计债**：
- skill 数量过多（31 个），有些没在用，应该 prune 一遍 `skills-lock.json`
- `content-factory/_knowledge_base/` 还是手动维护，没 RAG
- 没有"已发布文章"的统计面板，只有零散的 `rg` 命令

---

## 协议

私有仓库，自用。引用了一些公开 skill（`baoyu-*` / `huashu-*` / `ljg-*` / `obsidian-*` / `defuddle` / `web-access` 等），各 skill 协议见各自的 SKILL.md。

VPS 反代脚本 `scripts/wechat-proxy-setup.sh` 通用，可独立使用。
