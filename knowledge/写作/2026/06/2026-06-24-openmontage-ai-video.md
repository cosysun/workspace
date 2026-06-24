---
title: "$0.15 做出吉卜力风短片：开源 OpenMontage 一夜冲上 GitHub Trending 第一"
author: 大朝
summary: "开源 OpenMontage 把整套视频流程交给 AI 编程助手跑完。12 条产线、52 个工具、500+ 技能，吉卜力风短片成本 $0.15。"
cover: "https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-24-openmontage-ai-video/cover.png"
---

![cover](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-24-openmontage-ai-video/cover.png)

# 别人卖 AI 视频工具，他做了个 AI 视频导演

今早打开 GitHub Trending，第一名是个 calesthio/OpenMontage 的项目。日榜 +3,592 stars，周榜 +9,410。

我点进去看了眼 README 第一句：

> The first open-source, agentic video production system.

下面挂了个 Banana 短片，60 秒皮克斯风，香蕉跟猕猴桃做朋友。最后一行写着「Total cost: $1.33」。

我把它放进了今天的选题。

## 它不是 AI 视频工具，是 AI 视频导演

这两年的 AI 视频，路线两条。Runway、Pika、Kling 这种文生视频，给你一段 5 秒钟。OpusClip 这种长拆短，把你 1 小时播客切成 20 条短视频。两条路都在卖**能力**：更好的画质、更准的剪点。

OpenMontage 没走这条赛道。

它假设你已经有这些能力了。它内置了 14 家视频生成、10 家图片生成、4 家 TTS、3 家音乐/音效 provider。要解决的是再上一层的问题：怎么把这些工具串起来，跑出一支真正能交付的视频。

它的答案是：**不写中央编排器，让你的 AI 编程助手当导演**。

你打开 Claude Code（或者 Cursor、Copilot、Windsurf、Codex），说一句"做一支 60 秒讲量子计算的解释视频"。

Agent 自己去读项目里 12 条 pipeline 的 YAML manifest，挑一条最匹配的。读对应的 stage director skill，一份 markdown，教它怎么干这一阶段的活。调用 52 个 Python 工具，按 7 维评分挑最便宜可用的 provider。自审、checkpoint、跟你确认创意决策。

渲染前再过一遍 ffprobe 验证、抽 4 帧检查黑屏、查音频电平。不通过不让你看。

整套流程加起来 500+ 个 agent skills，都是 markdown 写的指令文件。你能改、能扩、能换 pipeline。

## 三条最反差的产线

12 条 pipeline 挑三条最反差的来讲。

**Documentary Montage**。这条 pipeline 是真的在剪视频，不是动 PPT。那些号称"免费 AI 视频"的工具，多数就是给静图加 Ken Burns 镜头运动。OpenMontage 这条会从 Archive.org、NASA、Wikimedia Commons、Pexels 这些免费档案库做 CLIP 语义检索，把真实动态片段拉进来剪进时间线。你说"做一支讲 1950 年代消费乐观主义的 Adam Curtis 风格档案剪辑"，它真的能去 Archive.org 翻素材。

**Clip Factory**。直接对标 OpusClip。一段长视频进去，一批排好序的短视频出来。OpusClip 月费订阅，Clip Factory 跑在你自己机器上，零订阅。

**Animated Explainer**。零 API key 也能跑的那条路。Piper TTS 做旁白（本地、免费、能听），免费图片库做视觉，Remotion 做合成。一支 45 秒"为什么天空是蓝的"的解释视频，软件成本是 0。

![三条产线对比](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-24-openmontage-ai-video/image-1.png)

## $0.15 一支吉卜力风短片

README 里挂了 6 支真实 demo，每支都标了成本。挑三个：

- **Afternoon in Candyland**：吉卜力风动画。12 张 FLUX 图、多图交叉淡入、镜头平移、粒子叠加、环境配乐。**$0.15**
- **VOID — Neural Interface**：产品广告，只用一把 OpenAI key。4 张 gpt-image-1 图、TTS 旁白、自动配乐、WhisperX 词级字幕。**$0.69**
- **THE LAST BANANA**：60 秒皮克斯风短片。6 个 Kling v3 motion clips、Google Chirp3-HD 旁白、版权音乐、TikTok 词级字幕。**$1.33**

为什么能压到这么低？因为 OpenMontage 的 7 维评分会替你算账：task fit 占 30%、output quality 20%、control 15%、reliability 15%、cost efficiency 10%、latency 5%、continuity 5%。每次选 provider 都按这套权重过，能用 Piper 不用 ElevenLabs，能用 Pexels 不用 Veo。

预算治理也内置好了。单步默认 $0.50 阈值要你审批一次，总预算默认 $10 上限，三种模式可选 observe / warn / cap。不会半夜醒来发现 OpenAI 账单跳了三千刀。

## 链接和一句话警示

GitHub: https://github.com/calesthio/OpenMontage

依赖：Python 3.10+ / FFmpeg / Node.js 18+ / 任一 AI 编程助手。三行命令上手：

```bash
git clone https://github.com/calesthio/OpenMontage.git
cd OpenMontage
make setup
```

打开你的 AI 编程助手，告诉它你想要什么。

最后说一句。License 是 **AGPLv3**，含 Section 13 网络条款。个人用、团队内部用、做实验，完全没问题。但你要把它包成 SaaS 转卖给外部用户，或者嵌进闭源商业产品，会触发"病毒式 copyleft"，必须公开整套修改后的源码。

想做生意的，下载之前先把 LICENSE 完整读一遍。

---

**发布记录**
- 公众号：草稿箱已上 · 2026-06-24 19:47（待手动发表，发表后补 mp.weixin.qq.com URL）
- media_id（草稿）：sXkZiQtFwh6tyZIabgP-Ap6UwoufEF0inJ1Gd-MjBzTCJ2RXKoABMYr9MK5RWw3S
