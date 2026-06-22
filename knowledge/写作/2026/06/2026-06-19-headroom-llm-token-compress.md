---
title: "GitHub 周榜第 8：headroom 把 LLM 输入砍掉 9 成，回答还更准了"
date: 2026-06-19
tags: [写作, AI, llm, token, headroom, 工具短文]
sources:
  - https://github.com/chopratejas/headroom
  - https://headroom-docs.vercel.app/docs
publishing:
  公众号: 草稿（2026-06-19 已推后台）
  X: 不发布
  小红书: 不发布
word_count: 655
slug: 2026-06-19-headroom-llm-token-compress
---

![cover](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-19-headroom-llm-token-compress/cover.png)

## 副产物正在打爆你的账单

每天在 Claude Code、Cursor 里跑 agent，最容易把账单和耐心同时打爆的，是它读进上下文的那堆「副产物」：一段 grep 输出、几页 npm install 日志、一坨 RAG 检索拼盘，全部按 Token 计费。模型最后只回一两行有用的，副产物可能要它先读上万 Token。

我让 Claude Code 在仓库里搜「认证相关代码」，结果返回 100 条匹配，1.8 万 Token；它真正用上的也就两三个文件名。剩下 99% 是花钱买你的耐心。

模型越强，这堆「陪跑」越显眼。

## 一道在 LLM 之前的工序

刚冲到 GitHub Trending 周榜第 8 的 [headroom](https://github.com/chopratejas/headroom) 给这事修了一道工序：**在数据进 LLM 之前先压一遍**。

仓库 5.5 个月做到 3.6 万 stars，光最近一周就涨 1 万。它跟 Compresr 那种把文本送云端的「压缩 API」不是一个东西，跟 RTK 那种只改 CLI 输出的 wrapper 也不一样。headroom 跑在你机器上，覆盖工具输出、日志、文件、RAG chunks、对话历史全部上下文。

![三场景压缩前后对比](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-19-headroom-llm-token-compress/image-1.png)

## 它到底怎么省的

### 同样的回答，少花 60–95% Token

工作流程是这样：内容进来，先看是 JSON、是代码、还是散文，路由给三种不同的压缩器。同时把请求前缀对齐，让 Anthropic、OpenAI 那边的 KV cache 真的命中，这步是省钱的额外杠杆。

更反直觉的一点是**可逆**：原文还在你本地，模型读压缩版觉得不够用，可以调一个 `headroom_retrieve` 工具把原文取回来。所以「压坏了模型读不懂」这种顾虑在 headroom 这里被改成「先省着读，要细看再展开」。

官方在真实负载上测的省 Token 数据：

| 场景 | 压前 → 压后 | 省 |
|---|---|---:|
| Code search（100 条结果） | 17,765 → 1,408 | 92% |
| SRE 事故排查 | 65,694 → 5,118 | 92% |
| GitHub issue 分诊 | 54,174 → 14,761 | 73% |

回答质量不掉：GSM8K 数学题 0.870 → 0.870 完全不变，TruthfulQA 反而升 0.03。

输入压完，输出还能再砍。Opus 一类模型，输出比输入贵 5 倍。

打开 `HEADROOM_OUTPUT_SHAPER=1`，它会在 system prompt 末尾偷偷追一句「别复述上下文」，并在工具回包之后把模型的 thinking effort 调低，新问题不动。官方测得能再省约 31.7% 输出 Token。

如果你同时在用 Claude Code 和 Codex，它顺手还做了一件事：两个 agent 共享一个 memory store。Claude 之前查过的代码片段，Codex 接着用的时候不再重新读一遍。

## 30 秒上手

```bash
pip install "headroom-ai[all]"     # 或 npm install headroom-ai
headroom wrap claude               # 也支持 codex / cursor / aider / copilot
```

这一行等于把 `ANTHROPIC_BASE_URL` 指到本地 8787 端口，原来怎么用 Claude Code 还怎么用，不改一行业务代码。

跑一阵任务，看自己省了多少：

```bash
headroom perf
```

输出是一张分类表：哪种内容被压了多少、累计节省多少 Token。

## 链接

仓库：[github.com/chopratejas/headroom](https://github.com/chopratejas/headroom) · 文档：[headroom-docs.vercel.app](https://headroom-docs.vercel.app/docs)
