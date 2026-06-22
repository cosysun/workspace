---
title: "强烈推荐 24.9K 星 Harness 开源框架：LangChain 的 Deep Agents"
date: 2026-06-21
tags: [写作, AI, agent, langchain, deep-agents, harness, 工具短文]
sources:
  - https://github.com/langchain-ai/deepagents
  - https://docs.langchain.com/deepagents
publishing:
  公众号: 草稿（2026-06-21 已推后台）
  X: 不发布
  小红书: 不发布
word_count: 601
slug: 2026-06-21-deep-agents-langchain
---

# 强烈推荐 24.9K 星 Harness 开源框架：LangChain 的 Deep Agents

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/2026-06-21-deep-agents-langchain/cover.png)

## 圈里忽然不再聊模型了

这两周 X 上的氛围变了，比起聊 GPT-5.5 又上了几个点，大家更爱聊「Harness」。起因是 LangChain 自家的 deepagents-cli 在 Terminal Bench 2.0 上跑了两次，第一次 52.8 分，榜外 30；第二次 66.5 分，Top 5。

两次用的是同一个模型，GPT-5.2-Codex。连权重都没动。

中间换的只有四样东西：强调验证流程的 system prompt、四层 middleware、推理预算策略、一组环境探索工具。

反直觉的一点：把推理预算全程拉满到 xhigh，分数反而掉到 53.9，比 baseline 还低；真正起作用的是「推理三明治」—— 高、低、再高的节奏。Harness 比模型更难，难在这种地方。

## 给 LLM 套一副好马鞍

Harness 是 LLM 外面那层操作系统：决定模型看到什么、能用哪些工具、结果怎么存、对话怎么续。Anthropic 在 2026 年那份《Agentic Coding Trends》报告里写过同一件事：「Harness 一个变量就能让 benchmark 摆动 5 个以上百分点」。

Vercel 反过来也证过一遍：把 15 个专用工具砍成一个通用 bash，成功率从 80% 干到 100%，提速 3.5 倍，token 还省了 37%。

Deep Agents 是 LangChain 把这套思路产品化的开源框架。GitHub 24.9k 星，MIT 协议，三天前刚发版 0.6.11。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/content-factory/2026-06-21-deep-agents-langchain/image-1.png)

## 它把 LangChain 切成了三块

之前喊过「LangChain 太重」的人，可能要重看一眼。

LangGraph 是引擎，管图执行和状态机；LangChain 是仪表盘和方向盘，提供 agent loop 和轻量的 `create_agent`；Deep Agents 是整车，把规划、虚拟文件系统、子 Agent 委派、上下文管理这几件最常见的事都装好了。

要全套就用 Deep Agents，要轻量就停在 `create_agent`，想拧自己的图就下沉到 LangGraph。官方文档里写得直白。

## 30 秒上手

装好它：

```bash
pip install deepagents
# 或 uv add deepagents
```

5 行代码起一个能搜网、能写文件、能派子 Agent 的研究员：

```python
from deepagents import create_deep_agent

agent = create_deep_agent(
    model="openai:gpt-5.5",
    tools=[my_search_tool],
    system_prompt="你是研究助手。",
)
result = agent.invoke({"messages": "调研 LangGraph 然后写个总结"})
```

`create_deep_agent()` 不传参也能跑，会用一组默认配置启动，内置 `write_todos`、`read_file`、`write_file`、子 Agent 委派几把工具。跑起来你看到的是一份 todo 清单慢慢勾掉，工具调用一条条 stream 出来，跟在 Claude Code 里盯它干活一样。

任务展开后，单条工具返回超过 20k token，框架会自动落到虚拟文件系统，主上下文只留摘要和路径。过去半年大家在喊的「Context Rot」，靠这个机制躲过去。

## 链接

仓库：https://github.com/langchain-ai/deepagents · 文档：https://docs.langchain.com/deepagents · LangChain 官方认证大使 @zhanghaili0610 在做配套的《Deep Agents 实战》开源教程，覆盖 VFS、任务规划、子 Agent 委派、Skills 复用四块。

---

**发布记录**
- 公众号：草稿已推后台（media_id: `sXkZiQtFwh6tyZIabgP-ApqEHObl9_sUQptOm1baph5oarjqzNHSC0L18OzLG54J`）· 2026-06-21 20:00
