---
title: "狂揽22.6K星!!! 再见网页脚本, AI Agent也能用你的浏览器干活了"
---

大家好, 今天看一个很适合 AI Agent 的开源项目: OpenCLI。

做网页自动化, 最烦的往往不是写代码。

是登录态。是 Cookie。是页面一改, 选择器就废。你刚写好的脚本, 第二天页面多了个弹窗, 它就开始装死。

更别说交给 AI Agent。它看着网页猜按钮, 一步步点, 像个刚学会上网的实习生。简单页面还行, 流程一长, 很容易翻车。

OpenCLI 想换个打法。

它把网站、浏览器会话、Electron 应用和本地工具, 统一变成 CLI。人能敲命令, Agent 也能调命令。

![OpenCLI 工作方式](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-25-opencli-agent-cli/image-1.png)

#### 什么是 OpenCLI

OpenCLI 的口号很直: Make any website into CLI。

它不是传统爬虫, 也不是录一串点击动作然后祈祷页面别变。更像是给网页套了一层命令行外壳。

看 HackerNews 热榜:

```bash
opencli hackernews top --limit 5
```

看 B 站热门:

```bash
opencli bilibili hot --limit 5
```

这些命令背后, 有些走公开 API, 有些走真实浏览器。需要登录的网站, 就借用你已经登录的 Chrome。

这个设计对 Agent 很友好。Agent 不必每次重新理解页面, 也不必猜哪个按钮能点。能变成命令的操作, 就直接走命令。

举个很小的场景。你想让 Agent 每天整理几个网站的热门内容, 传统做法是给每个网站写一套脚本, 还要处理登录、分页、反爬和字段变化。OpenCLI 的思路是先把这些操作收成命令, Agent 每天调用命令拿结果。它不用关心页面今天按钮换没换位置, 也不用每次重新看一遍网页结构。

#### 开源成就

GitHub 页面显示, OpenCLI 目前约 22.6K stars、2.3K forks。

npm 包版本是 1.8.0, 要求 Node.js >= 20。最近的 v1.8.0 更新里, 项目新增了 `weread-official` 官方 API adapter, 扩展 LinkedIn、Twitter、Reddit、知乎等站点能力, 还加了 12306、Suno、闲鱼 inbox。

它不是只写了个漂亮 README。项目还在密集加站点、修浏览器桥接、补下载和兼容性问题。

#### 核心功能

**第一, 现成站点命令。**

官方 adapter 索引里能看到 100+ 站点和命令。小红书、B 站、知乎、Twitter/X、Reddit、HackerNews、LinkedIn、YouTube、NotebookLM、ChatGPT、Claude、Gemini, 都在里面。

这就像给一堆网站装了命令行入口。

**第二, 让 Agent 使用你的浏览器。**

装好 `opencli-browser` skill 后, AI Agent 可以用真实 Chrome 做事: 打开网页、读取 DOM、点击按钮、填写表单、提取内容、查看网络请求。

重点是登录态。

很多网站难搞, 不是因为页面复杂, 而是登录、会员权限、个人主页、风控这些东西绕不开。OpenCLI 的思路是: 既然你浏览器里已经登录了, 那就让 Agent 在这个浏览器上下文里干活。

**第三, 写新 adapter。**

如果一个站点还没覆盖, 可以用 `opencli browser` 和 `opencli-adapter-author` 做侦察、找接口、解字段, 最后用 `opencli browser verify` 验证。

一次临时操作, 如果以后还会用, 就沉淀成 adapter。下次不用让 Agent 重新摸页面。

**第四, 统一本地 CLI。**

OpenCLI 还能把 `gh`、`docker`、`wrangler`、`ntn`、`wx`、`tg` 这些本地工具统一挂到 `opencli` 下。

对 Agent 来说, 它看到的是一个入口, 不用记一堆工具各自怎么调。对人来说, 也少记几个命令。

![OpenCLI 快速上手](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-25-opencli-agent-cli/image-2.png)

#### 快速上手

先看 Node 版本:

```bash
node --version
```

安装:

```bash
npm install -g @jackwener/opencli
```

浏览器能力需要 OpenCLI 的 Browser Bridge 扩展。装完后跑:

```bash
opencli doctor
```

再看命令列表:

```bash
opencli list
```

如果要给 AI Agent 用, 安装 skill:

```bash
npx skills add jackwener/opencli
```

然后你用自然语言告诉 Agent 要做什么, 它内部会调用 `opencli browser`。

#### 适合谁

如果你只是偶尔打开网页看看, OpenCLI 可能有点重。

但如果你经常做内容整理、网页数据采集、运营后台查询、自动化脚本, 它就很香。

它最适合的不是一次性的「帮我点一下」。而是把常用网页操作变成稳定命令, 让人和 Agent 都能复用。

#### 也别神化

OpenCLI 很酷, 但不是魔法。

它依赖浏览器扩展和本地 daemon。需要登录的网站, 你的账号状态也要正常。网站页面一变, adapter 可能要维护。让 Agent 操作登录态浏览器, 权限边界也要想清楚。

所以它更像一个 Agent 工具底座。

以前网页是给人点的。OpenCLI 试着把网页变成命令, 让 Agent 可以更稳定地调用。

开源地址: https://github.com/jackwener/opencli

---

**发布记录**
- 公众号草稿（已弃用，modern 主题）：media_id `sXkZiQtFwh6tyZIabgP-AhJGYidfWfzJTP1Ny22ZPcz3R8l0O5qcJ1ZEAK5Dl6De` · 2026-05-25 21:50
- 公众号草稿（当前，simple-green 主题）：media_id `sXkZiQtFwh6tyZIabgP-AqVlYquF5AZixlqH-mgYj5kixej5u0NfkDQ_CPiHML3E` · 2026-05-25 21:52
