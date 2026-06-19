---
title: "快速了解 GitHub 项目，试试 Understand-Anything（59k 星）"
---

# 30 秒装上，给陌生代码做一张地图

官网首页有句标语：

> Other tools show you a hairball. We teach you the codebase.
> （别的工具给你一团乱毛线。我们教你看懂这个代码库。）

它说的是 Understand-Anything，一个上线三个月、攒了 5.9 万 star 的开源工具。我自己用了几次，确实和过去那种"画个调用图、把节点全堆出来"的工具不一样。

装一次大概 30 秒，跑一次一杯咖啡的时间。下面把上手路径完整走一遍，顺便把容易踩的坑提前指出来。

## Step 1：30 秒装上

Claude Code 用户最简单，两条命令：

```
/plugin marketplace add Egonex-AI/Understand-Anything
/plugin install understand-anything
```

不是 Claude Code 用户也行，一行 curl 走通：

```bash
curl -fsSL https://raw.githubusercontent.com/Egonex-AI/Understand-Anything/main/install.sh | bash
```

这条脚本会问你装到哪个平台。Codex、Cursor、Gemini CLI、Copilot CLI、KIMI CLI 都装得上。Windows 把 `bash` 那段换成 PowerShell 的 `iwr | iex` 即可。

装完先别急着跑。常见的卡点是装上后输 `/understand` 显示未知命令，绝大多数情况是 IDE 没刷新。把 Claude Code 退出重开，或者运行 `/plugin list` 确认一下，再继续。

## Step 2：跑一次分析

进入要分析的项目目录，敲：

```
/understand --language zh
```

`--language zh` 是 v2.7.3（5 月 19 号上线）的新参数，会让生成的所有摘要、节点描述、导览都用中文。试一下确实顺手——技术词留英文（class、middleware、route 这些），描述句子是中文。

工具内部跑的是一条 7 阶段流水线：扫描文件 → 切批次 → 多 agent 并行分析 → 合并图谱 → 识别架构层 → 生成导览 → 校验输出。Tree-sitter 负责确定性地解析语法树，把"哪个文件有哪些函数、谁调用谁"这种事实层抽出来；LLM 负责语义层，给每个节点写摘要、打标签、归类到架构层。两层分工是关键，否则光靠 LLM 会漂、光靠静态分析又没意义。

中途流程里会停一下，让你确认 `.understandignore` 的内容。这是默认基于你项目里的 `.gitignore` 生成一份初稿，让你回头看一眼有没有错过什么大目录（比如 `tests/`、`migrations/`）。只在这一处停一次，看清这一段再确认就行。

跑完后会在项目根目录写出 `.understand-anything/knowledge-graph.json`。这个文件是核心产物，可以提交到 git。下一个同事拉下来直接打开 dashboard，不用再跑一遍。

## Step 3：打开图，看懂代码

```
/understand-dashboard
```

这条命令会启一个本地 web 服务，浏览器自动打开。

![Understand-Anything 仪表盘 overview](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-15-understand-anything-tutorial/image-1.png)

仪表盘里有三种视图来回切：

- **结构图**：每个文件、函数、类都是节点，import / call / inherit 是边。双击文件节点可以直接看源码（v2.5.0 加的小功能，但很顺手）。
- **业务领域图**：把代码翻译成 domain → flow → step 的水平图。比如一个电商项目跑出来，会显示出"下单流"是从哪个 controller 进来、经过哪几步 service、最终落到哪张表。这个视图给非工程师看也基本能看懂。
- **知识库图谱**：如果你用的是 Karpathy 那种 LLM Wiki 风格的笔记库，跑 `/understand-knowledge` 会得到一张力导向布局的概念图，社区聚类自动分好。

最实用的两个动作：左上角搜索框支持模糊和语义两种模式（直接打"哪些文件处理了登录"也能找到）；选中两个节点后，仪表盘会画出从 A 到 B 的最短引用链。找耦合点、查改动影响都很快。

## 进阶四把斧 + 几个该说的话

主分析命令之外，常用的还有四个：

```
/understand-chat      # 直接对代码库提问
/understand-diff      # 看当前改动会影响哪些下游
/understand-explain   # 单文件深挖
/understand-onboard   # 给新人生成入职指南
```

加上 `/understand --auto-update` 装一个 post-commit hook，每次 commit 自动只分析变更的文件，不用整库重跑。

还有几句话该提前说，免得装上后失望：

- token 消耗不小。一个十万行级别的项目跑一遍，账单按你接的模型估一下，心里有数。
- 超大项目还跑不动。200 万行的库目前会卡住，真要分析这种规模，先 `/understand src/某个子模块` 限定范围。
- 企业代码先评估一下隐私边界。默认调的是云端 LLM，源码会发出去。文档里有接私有部署模型的指引，但需要自己配。

## 一句话收尾

挑一个你最近想读的开源仓库，clone 下来跑一遍 `/understand --language zh`，把生成的 `knowledge-graph.json` 提交回去。下一位 reviewer 不用从 README 翻起，可以直接从图开始。

---

**发布记录**
- 公众号：草稿箱（media_id: sXkZiQtFwh6tyZIabgP-AsU78hYsK7fPDKQlkcyXWM-rRAVEcIedGwoMDulMIOoo） · 2026-06-15 18:49
