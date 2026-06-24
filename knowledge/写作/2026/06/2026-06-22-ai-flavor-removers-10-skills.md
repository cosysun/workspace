---
title: "别再抱怨文章 AI 味重，GitHub 上去 AI 味的 TOP 级项目都在这"
date: 2026-06-22
tags: [写作, AI, 去AI味, skill, github, 工具短文]
sources:
  - https://github.com/blader/humanizer
  - https://github.com/op7418/Humanizer-zh
  - https://github.com/hardikpandya/stop-slop
  - https://github.com/Leonxlnx/taste-skill
  - https://github.com/MrGeDiao/shuorenhua
  - https://github.com/alchaincyf/nuwa-skill
  - https://github.com/dongbeixiaohuo/writing-agent
  - https://github.com/OUBIGFA/De-AI-Prompt-Enhancer-Writer-Booster-SKILL
publishing:
  公众号: 草稿（2026-06-22 已推后台，media_id: sXkZiQtFwh6tyZIabgP-At8eEdgD4KVm-shaKQvjyo-DLIGZx3w_rRUwJevHjEwU）
  X: 不发布
  小红书: 已发布（2026-06-22 20:13，7 张卡组）
word_count: 783
slug: 2026-06-22-ai-flavor-removers-10-skills
---

![cover](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-22-ai-flavor-removers-10-skills/cover.png)

模型写得越来越流利，"AI 味"也越来越显眼：词大、句长、什么都对，但读起来不像人写的。

GitHub 上专门解决这件事的开源项目，下面这 8 个最值得装——按场景分四档，分别给英文创作者、中文创作者、写 prompt 的人用。

## 8 个项目其实是四种东西

| 场景 | 项目 | Stars | 一句话定位 |
|---|---|---|---|
| 英文创作 | [blader/humanizer](https://github.com/blader/humanizer) | 25.5k | Wikipedia「Signs of AI writing」指南落地，33 种模式 |
| 英文创作 | [hardikpandya/stop-slop](https://github.com/hardikpandya/stop-slop) | 11.8k | 一个 skill 文件，专砍 AI tells，轻量 |
| 英文创作 | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | 48.7k | 不去味，从源头给 AI"品味" |
| 中文创作 | [op7418/Humanizer-zh](https://github.com/op7418/Humanizer-zh) | 11.2k | humanizer 官方汉化 + 融合 stop-slop |
| 中文创作 | [MrGeDiao/shuorenhua](https://github.com/MrGeDiao/shuorenhua) | 485 | 一句原则：先保信息，再谈风格 |
| 中文创作 | [alchaincyf/nuwa-skill](https://github.com/alchaincyf/nuwa-skill) | 25.3k | 不是去味，是蒸馏一个真人的认知系统 |
| 中文创作 | [dongbeixiaohuo/writing-agent](https://github.com/dongbeixiaohuo/writing-agent) | 280 | 全栈写作系统，选题到发布一条龙 |
| Prompt 工程 | [OUBIGFA/De-AI-Prompt-Enhancer](https://github.com/OUBIGFA/De-AI-Prompt-Enhancer-Writer-Booster-SKILL) | 452 | 提示词层面解决，让 AI 一开始就别油 |

![8 个项目按场景分四档](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-22-ai-flavor-removers-10-skills/image-1.png)

英文创作者三选一基本不用想，按 star 和文档完整度选。

## 中文场景三选一

**op7418/Humanizer-zh —— 最稳的入门选择**

汉化自 25.5k 的 blader/humanizer，又把 hardikpandya/stop-slop 的规则塞进去。24 种中文 AI 写作模式，四类：内容（-ing 肤浅分析、模糊归因）、语言语法（系动词回避、否定排比、三段式）、风格（破折号、粗体、刻意换词）、格式（标题大小写、表情符号）。

安装一行命令搞定：

```bash
npx skills add https://github.com/op7418/Humanizer-zh.git
```

适合刚开始想压 AI 味、还没自己理出规则的人。不用想，丢进去用。

**MrGeDiao/shuorenhua —— 最有方法论**

只有 485 star，但这是 8 个里方法论最清晰的一个。一句原则：先保信息，再谈风格。

它把改写场景拆成 4 档：chat（聊天，轻力度）、status（技术同步，中力度）、docs（文档，中力度但二次回读更保守）、public-writing（公开发文，重力度）。再往细里分还有 README、release note、forum post、issue reply 四个 Scene Pack。按发布目的决定改法，不是换语气。

配套 73 个 benchmark 案例 + 19 个真实样本评测，这是 8 个项目里唯一有量化数据的。适合已经有具体发布场景、需要按场景调力度的人。

**alchaincyf/nuwa-skill —— 完全不在这赛道**

25.3k star，但它根本不在"去 AI 味"这个框架里。它的主张是：你不该让 AI 写"无个性的对的文字"，应该让 AI 用某个真实人的认知操作系统说话。

输入一个名字（乔布斯、芒格、马斯克、Naval），它自动完成调研、提炼、验证，提取五层：怎么说话、怎么想、怎么判断、什么不做、知道局限。蒸馏完直接调用：「以芒格的视角分析这个投资决策」「费曼会怎么解释量子计算」。

适合看完前两个还觉得没解决到根上的人。

## 我自己怎么排这三个

如果今天重新选，路径会是这样：先装 Humanizer-zh 入门，写一段时间养出规则感；然后切到 shuorenhua，按发布场景分力度；最后用 nuwa-skill 蒸馏一个自己想要的写作人格。

---

**发布记录**
- 公众号：草稿已推送 · 2026-06-22 20:11 · media_id `sXkZiQtFwh6tyZIabgP-At8eEdgD4KVm-shaKQvjyo-DLIGZx3w_rRUwJevHjEwU`
- 小红书：7 张卡组 · 2026-06-22 20:13
