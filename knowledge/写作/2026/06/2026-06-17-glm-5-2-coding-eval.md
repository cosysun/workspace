---
title: "智谱 GLM-5.2 实测：1/18 的输入价、追平 Opus 的短任务能力，但藏着三个坑"
---

![cover](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-17-glm-5-2-coding-eval/cover.png)

今早 9 点 11 分，智谱把 GLM-5.2 开源扔了出来。MIT 协议、1M 上下文、Coding 全球可用模型第一。

API 价格：输入 6 元/百万 token、输出 18 元/百万 token。Claude Opus 4.8 同位置是输入 ¥105、输出 ¥525——**1/18 到 1/30 的差距**。

我把官方榜单、第三方实测、开发者反馈翻了一遍，给你一个不站队的看法：值得切，但不能闭眼全换。

## 30 秒看完：你该不该换

| 你的场景                    | 建议                          |
| ----------------------- | --------------------------- |
| 预算敏感，每月 Claude 账单超 ¥200 | ✅ 闭眼切 GLM Coding Plan，¥49 起 |
| 大型重构、整库分析、长文档阅读         | ✅ 1M 上下文真实可用                |
| 隐私敏感、要本地部署              | ✅ MIT 权重、商用免费、华为昇腾 Day 0 适配 |
| 数学、推理、考试题               | ✅ AIME 2026 拿 99.2%，反超 Opus |
| deadline 紧、复杂工程一气呵成     | ❌ Opus 4.8 还是稳一些            |
| 实时交互、对响应速度敏感            | ❌ 5.2 比 Opus 慢三成            |
| 多模态需求                   | ❌ 5.2 暂时不支持                 |

我自己的用法是双引擎：80% 日常任务用 5.2，关键复杂任务、deadline 紧的时候切回 Opus。对照 Claude Code Max 的 $200/月，GLM Coding Plan Pro ¥149 一档，差价就是一台中端手机。

## 它到底有多强：三句话讲完

短任务追平 Opus。FrontierSWE 拿 74.4 分，Opus 4.8 是 75.1，差 0.7 个百分点。Terminal Bench 2.1 拿 81 分，Opus 是 85，差 4 分。这两个是衡量 AI Agent 能不能完成具体编程任务的硬榜单。

长任务还差一倍。SWE-Marathon 测的是连续数小时甚至数天的超长工程项目，5.2 拿 13 分、Opus 拿 26 分。这是当前最大的短板。承担一个完整项目从头到尾，5.2 中途跑偏的概率比 Opus 高得多。

数学反而反超。AIME 2026 数学竞赛题 99.2 分，Opus 95.7。GPQA-Diamond 91.2 vs 93.6 还差一点，但量化金融、算法题、教育类场景已经能用。

![四项 Coding 关键 Benchmark 对比](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-17-glm-5-2-coding-eval/image-1.png)

## 它到底有多便宜：算给你看

API 单价对比：

| 模型              | 输入 / 1M token  | 输出 / 1M token   |
| --------------- | -------------- | --------------- |
| Claude Opus 4.8 | $15            | $75             |
| GPT-5.5         | 与 Opus 接近      | 与 Opus 接近       |
| **GLM-5.2**     | **$0.83 ≈ ¥6** | **$2.50 ≈ ¥18** |
| DeepSeek V4 Pro | $0.27          | $0.40           |

套餐这边，Claude Code Pro 是 $20/月（约 ¥145），Max 是 $200/月（约 ¥1450）。GLM Coding Plan 三档分别是 Lite ¥49（5h 80 次 prompt）、Pro ¥149（5h 400 次）、Max ¥469（5h 1600 次）。最便宜那档 ¥49，一杯星巴克的钱。

![API 价格对比，每百万 token](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-17-glm-5-2-coding-eval/image-2.png)

## 怎么用上：三条路径任选

**路径一：API 直连**。注册 BigModel 拿 API key，请求格式与 OpenAI 兼容，把 base\_url 换成 `https://open.bigmodel.cn/api/paas/v4/`、model 填 `glm-5.2` 就行。新用户送 250 万免费 token，做完测试再决定要不要付费。

**路径二：Claude Code / Cursor 接入**。智谱官方出了 ZCode CLI（zcode.z.ai），装好、配 API key 就能用，体验和 Claude Code 几乎一致。也可以走 OpenRouter，把 base\_url 改成 OpenRouter 即可，原有工作流几乎不动。

**路径三：本地部署**。HuggingFace 下权重（zai-org/GLM-5.2），vLLM v0.23+ 或 SGLang v0.5.13+ 都已支持。隐私敏感场景，或者手里有华为昇腾、寒武纪这类国产卡的，Day 0 就能跑起来。

## 三个槽点：用过才知道

慢。三方实测里，同一个跨文件重构任务，Opus 4.8 用 33 分钟，GLM-5.2 用 45 分钟，比 DeepSeek 此前最慢的记录还慢。发布初期服务器拥堵更明显——非紧急任务能接受，盯着屏幕等结果会很难受。

额度消耗快。Lite 套餐 5 小时 80 次 prompt 看着多，但复杂任务一次能吃 10+ 次（拆解、规划、执行、验证一轮下来）。高峰期还按 3 倍扣，5 小时 80 次实际只够 1-2 个像样的任务。日常重度使用，建议跳过 Lite 直接上 Pro 的 400 次配额。

指令遵循欠稳。这个最磨人。5.2 偶尔会用默认设定覆盖你的明确要求。比如让它"不要新增依赖"，它有时还是会装包；多个否定约束并列时，第一次输出可能直接为空。解决办法是把约束写得更紧，用 markdown 列表而不是自然语段，或者干脆把约束塞进 system prompt。

## 我的判断

国产逆袭、Claude 已死那套话术我不打算讲。它就是个便宜、够用的副驾，前提是你接受它有点慢、有点拗。

但 1/18 的输入价、1/30 的输出价、套餐差好几倍——这个性价比足够我把 80% 的日常 Coding 切过去。剩下 20% 留给 Opus，等关键时刻、deadline 紧、客户在催那种任务再用。

值得动手试一下。新用户 250 万 token 免费额度，先把你最近的真实任务丢进去跑一轮，比看十篇评测都直接。比如挑一个最近卡住的重构任务，让它先出方案再写代码——能不能用，跑一次就有体感。

***

参考链接：

* 官方公众号：<https://mp.weixin.qq.com/s/hrZcV05ZSIKvd1dzSqDNDQ>
* HuggingFace：<https://huggingface.co/zai-org/GLM-5.2>
* BigModel 文档：<https://docs.bigmodel.cn/cn/guide/models/text/glm-5.2>
* ZCode CLI：<https://zcode.z.ai/cn>

---

**发布记录**
- 公众号：草稿箱（media_id `sXkZiQtFwh6tyZIabgP-AkNHIVs_M8bsgUxFlip53VKAzOqCiHq6yRWvvx7HkrlU`） · 2026-06-17 16:50
