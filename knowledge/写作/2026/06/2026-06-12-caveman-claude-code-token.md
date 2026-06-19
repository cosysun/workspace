---
slug: 2026-06-12-caveman-claude-code-token
status: final
title: "71.6k star 的 caveman：说是让你省 75% 的 token，真的吗？"
author: "大朝"
summary: "GitHub 上一个 71.6k star 的 caveman 插件，作者是 19 岁荷兰大一学生。它说能让 Claude 输出 token 砍 65-75%——这个数字听起来很猛，但拆开看其实只省了你账单的 3-10%。隐藏金矿在另一个功能上。"
cover: "https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-12-caveman-claude-code-token/cover.png"
---

# 71.6k star 的 caveman：说是让你省 75% 的 token，真的吗？

![71.6k star 的 caveman：石板隐喻封面](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-12-caveman-claude-code-token/cover.png)

打开 GitHub 看到 caveman 这个名字，我以为是某个考古应用。

点进去才发现，它是一个 Claude Code 插件。一行介绍写着：「why use many token when few token do trick」——语法是错的，意思你能看懂：何必用那么多 token，几个就够了。

这个项目现在 71.6k star，4k fork。作者 Julius Brussee，19 岁，荷兰莱顿大学大一学生，专业是数据科学和 AI。他自己说这个项目是「随手写的 joke」，结果三天涨了 4.1k 星。他之前精心打磨的几个项目，反而没什么人看。

这件事本身就值得琢磨一下。但今天不展开，先聊聊这个工具到底是什么、能不能用、值不值得装。

## 一、它到底是什么

caveman 是一个 skill，套在 Claude Code、Cursor、Codex、Gemini 这类 AI 编程工具上。装上之后，你输入 `/caveman`，AI 从下一句开始就用「野人体」回话。

什么叫野人体，看个例子。

你问：「为什么我的 React 组件会重复渲染？」

普通模式 Claude 会给你一段（69 token）：

> 你的 React 组件之所以会重复渲染，很可能是因为你在每次渲染时都创建了一个新的对象引用。当你将一个内联对象作为 prop 传递时，React 的浅比较会把它视为不同的对象，从而触发重新渲染。建议你使用 useMemo 来缓存这个对象。

caveman 模式（19 token）：

> 每次 render 都新建对象引用。内联 object prop = 新引用 = 重渲染。用 useMemo 包一下。

同样的诊断，同样的修复方案。少了 72% 的 token。

技术词没动，代码没动。死的全是废话。

## 二、四档强度，按需选用

caveman 提供四个等级，从轻到重：

- **lite**：去掉 filler 词（really、just、basically），保留完整句子
- **full**（默认）：分片化，去冠词，短词替长词，例如 "fix" 替代 "implement a solution for"
- **ultra**：电报体 + 缩写 + 箭头因果，比如 `inline obj prop → re-render → useMemo`
- **wenyan**：文言文，进一步压缩

`/caveman` 之后空格跟级别就能切换：`/caveman ultra`。

除了主命令，作者还顺手做了三个配套，是真的好用：

- `/caveman-commit`：写 Conventional Commits 风格的 commit message，subject 不超过 50 字符
- `/caveman-review`：单行 PR review 评论，比如 `L42: 🔴 bug: user null. Add guard.`
- `/caveman-stats`：看你这个 session 用了多少 token、累计省了多少、自动换算成美元

安装一行命令搞定（macOS / Linux / WSL）：

```bash
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash
```

依赖 Node ≥ 18，30 秒装完。

## 三、那个「省 65%」的数字，要拆开看

repo 首页大大写着「~75% output reduction」。点进 README 往下翻，benchmark 表里写的是另一个数字。

10 个真实 prompt 测下来，平均削减 65%，区间是 22% 到 87%。75% 是其中表现最好的几个 case 拼出的头条数字，65% 才是均值。

这一点我挺认可作者的诚实。把营销数字和真实平均值放在同一张表，让你自己看。

但更关键的事情，README 说得没那么显眼：**caveman 只压输出 token**。

输出 token 是 AI 写给你看的那部分内容。在一个完整的编程 session 里，token 消耗大概分四块：

- 输入 token：你的问题 + AI 读的代码文件
- 推理 token：AI 内部思考的过程
- 工具调用 token：grep、ls、cat 这些命令的开销
- 输出 token：最后吐给你的回答

输出在里面通常占 5% 到 15%。也就是说，caveman 把这一块砍掉 65%，对应到总账单大概是省 3% 到 10%。

不是 65%，不是 75%。是 3% 到 10%。

如果你看到「装了 caveman 一个月省一半账单」那种说法，多半是个例放大，或者计算口径不一样。诚实的预期是每月省个几美元，外加一个明显清爽的对话。

![省 65% token 这个数字要拆开看：README 头条 75% / 实测均值 65% / 折算到总账单 3-10%](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-12-caveman-claude-code-token/image-1.png)

作者本人的总结很准：「让嘴变小，不让脑子变小。」（原文：Caveman make mouth smaller, not brain smaller）

## 四、隐藏金矿是 /caveman-compress

讲完局限，反过来说一个 README 没怎么强调、但我觉得才是真值得装的功能：`/caveman-compress`。

它做的事很简单：把一个 markdown 文件用野人体重写一遍，代码块、URL、文件路径原样保留，只压人话部分。

听起来平平无奇，看一下数字：

| 文件 | 原大小 | 压缩后 | 节省 |
|---|---|---|---|
| CLAUDE.md（偏好设置） | 706 token | 285 token | 60% |
| 项目笔记 | 1145 | 535 | 53% |
| CLAUDE.md（项目级） | 1122 | 636 | 43% |
| todo 清单 | 627 | 388 | 38% |
| 含代码的混合文档 | 888 | 560 | 37% |

为什么这个功能比主功能更值钱？

因为它是**复利**的。

主功能压输出 token——一次对话省一次。`/caveman-compress` 压的是 CLAUDE.md 这种每次开 session Claude 都会读一遍的常驻文件。压一次，接下来每个 session 都受益。

举个数：假设你的 CLAUDE.md 是 1000 token，一个月开 50 个新 session，那是 50000 token 的重复开销。压成一半，每月永久省 25000 token。

这个功能解释了 71.6k star 里很大一部分。表面看是个 meme 工具，里头藏着一笔工程账。

## 五、什么时候开，什么时候关

不是所有场景都适合 caveman。

适合开的场景：

- **日常 debug**：粘报错、问哪里出问题，一行回答最舒服
- **写 commit 和 PR review**：caveman 的简洁体反而比啰嗦的 AI 回复更像资深工程师写的
- **重复性命令操作**：知道自己要什么，只想要确认和最小步骤

不适合开的场景：

- **学新框架**：你需要 AI 给你讲 why，caveman 把 why 顺便砍掉了
- **架构讨论**：长链条推理需要展开，野人体读起来累
- **写文档**：交付物本身要给人看，得是完整句子

合理的用法是把它当模式，不是当宗教。`/caveman ultra` 进，`stop caveman` 出。

还有一个小坑。装上之后，插件会通过 SessionStart hook 自动激活，开新 session 就生效——没有「装但默认安静」的选项。

社区有人因为这个不爽，提了 PR #448 加 `defaultMode: "manual"`。还没合，介意的可以等，或者先改本地配置兜一下。

## 装得最像 dumb 的工具

作者还顺手做了一个姊妹项目叫 caveman-code，是个独立的 CLI agent。它把压缩做到了输入 prompt、工具调用、文件读取去重、最终输出四层一起压，README 说比 Codex CLI 省 1.93 倍的 token。这个比较激进，普通用户用 caveman skill 就够了。

回到 caveman 本身。

名字像玩笑，README 像玩笑，tagline 也像玩笑。但 benchmark 表诚实，局限写在第二屏没藏，复利节省那部分是真工程账。这种把局限摊开、把含金量埋深的工具，不多。

仓库地址：github.com/JuliusBrussee/caveman。MIT 协议，能直接 fork 来玩。

最后插一句。19 岁的 Julius 已经开了几家小公司，每个项目都认真打磨。caveman 这个反而是他最不正经的一个，结果是涨星最快的一个。

七万颗星里有相当一部分，是这个反差换来的。

---

**发布记录**
- 公众号：草稿箱（media_id `sXkZiQtFwh6tyZIabgP-An2d8Intr81P7KgtZaIURmcDT7bajUREo3ub6lJJjttF`）· 2026-06-12 15:50
