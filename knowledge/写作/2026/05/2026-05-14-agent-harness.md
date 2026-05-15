---
title: "Agent 不是模型：你做的是 AI 时代的操作系统"
date: 2026-05-14
tags: [写作, AI, agent-harness, 操作系统类比]
sources:
  - https://x.com/akshay_pachaar/status/2041146899319971922
publishing:
  公众号: 已发布（2026-05-15）
  小红书: 已发布（2026-05-15）
word_count: 1199
---

# Agent 不是模型：你做的是 AI 时代的操作系统

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/2026-05-14-agent-harness/cover.png)

LangChain 在 TerminalBench 2.0 上做了一次很安静的实验：在模型保持不变的情况下，只在模型外面做了一圈工程化优化。整个效果大幅提升，基准测试从排名三十名外，冲到第五。

之前一直认为「agent=模型」的认知被打破了，大家注意力转移到了模型外面那一圈真正干活的工程化实现——编排循环、工具、内存、上下文管理、状态、错误恢复、安全闸门，这就是：**harness engineering** 。

LangChain 的 Vivek Trivedy 给过一句很硬的话：「If you're not the model, you're the harness.」。 这里 agent 的等式应该是：agent = model + harness。

## 给它一个正确的坐标

Beren Millidge 在2023 年那篇《Scaffolded LLMs as Natural Language Computers》给了一个与操作系统的对照，非常有意思：

- LLM 是 CPU——没 RAM、没磁盘、没 I/O，是所有逻辑推理的核心
- context window 是 RAM——快，但小，且每次掉电，资源宝贵，需要极致利用
- 外部数据库是磁盘存储——大，但慢
- 工具是设备驱动——CPU 通过它才能碰外部世界
- harness 是操作系统——把上面四件事拼成一台能干活的机器

文中有一句话：「我们重新发明了一遍冯·诺依曼架构。」让我们更清楚的了解到整个 AI 工程框架。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/2026-05-14-agent-harness/fig01-isomorphism.png)

这一下，agent 和 harness 也就分清楚了。**Agent 是用户看见的智能行为**，目标驱动、会用工具、会自我纠错。**Harness 是产生这个行为的机器**。说「我做了一个 agent」，意思是「我做了一个 harness，把它接到了一个模型上」。

三层嵌套也就清楚了：
1. **prompt 工程**管模型每一步看到什么；
2. **context 工程**管模型每一步能看什么；
3. **harness 工程**把这两件包进来，再加上工具、状态、验证、恢复。
前两层是后一层的子集。

## 操作系统至少要管的三件事

CPU 跑得再快，没有 OS 就只是一块发热的硅。harness 也一样。它至少要把下面这三件事接住。

**编排循环**。Anthropic 自己管它叫「dumb loop」——一个组装prompt、调模型、解析输出、跑工具、把结果塞回去、再循环的傻循环，代码底层的表现就是个 while，这里推荐大家去看看[learn-claude-code](https://github.com/shareAI-lab/learn-claude-code.git)。

**上下文管理**。这一块最容易翻车。Chroma 的研究和 Stanford 那篇「Lost in the Middle」给了一个很难看的事实：关键内容掉到上下文中段，模型表现往往掉三成以上。哪怕是百万级窗口，靠中间的指令照样被忽略。
所以 harness 要做的一个非常重要的事情就是在有限的空间内，装更多的信息，本质上是 OS 早就做过的：摘要压缩（compaction）、隐藏旧工具输出（observation masking）、按需懒加载（just-in-time retrieval）。换个名字而已，对应的是分页、换出、Demand Paging。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/2026-05-14-agent-harness/fig02-context-mgmt.png)

**验证回路**。Claude Code 的作者 Boris Cherny 给过一句利落话：给模型一种检查自己工作的方式，质量提升两到三倍。为什么这么大？算一下错误复利就知道。一个十步任务，每步 99% 正确，端到端剩 90.4%；二十步剩 81.8%。没有验证回路，agent 步数一长就崩， 这就是为啥 long running agent会非常难。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/2026-05-14-agent-harness/fig03-error-compound.png)

## 好的操作系统会越变越薄

到这里有个反直觉的转弯。如果 harness 是操作系统，按照大家的直觉，它应该越做越厚——更多组件、更多策略、更多 fallback。但现实恰恰相反。

主要是因为：新一代模型越来越强

Manus 在六个月里重写了五次，每一次都在**删** harness 的复杂度：复杂的工具定义被合并成一句 shell，「管理 agent」被替换成结构化 handoff。Vercel 砍掉 v0 上 80% 的工具，效果反而更好。Anthropic 主动从 Claude Code 的 harness 里删掉显式的 planning 步骤。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/2026-05-14-agent-harness/fig04-subtraction.png)

Anthropic 自己有个检验标准，叫 future-proofing test：模型升级后，harness 不需要变厚，就说明设计对了。

这件事其实有过先例。Linux 内核每年删的代码不比加的少。能删，是因为底层硬件抽象在变好；harness 的底层抽象就是模型，模型变强了，harness 就该退后。一个好的操作系统是脚手架，楼盖到一定高度，脚手架要拆。拆不掉的脚手架不是脚手架，是债。
