---
title: "Claude Code 不让你写 Markdown 了：100 行之后，该换 HTML"
date: 2026-05-20
tags: [写作, AI, Claude-Code, HTML, 内容创作]
sources:
  - https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html
publishing:
  公众号: 草稿已入库（media_id: sXkZiQtFwh6tyZIabgP-AgRfHUfjjeO8as60Uo6pAD1qj9TvK-vfQNOkSz6lZm3T）· 2026-05-20
  X: 浏览器已填稿，待手动点发布 · 2026-05-20
  小红书: 7 张卡组（cover-big + card-1~5 + compare，待手动上传）· 2026-05-20
word_count: 1014
---

# Claude Code 为什么开始输出 HTML？

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-20-claude-code-html-output/cover.png)

5 月 20 日，Claude Code 团队的 Thariq Shihipar 发了篇短文：《Using Claude Code: The unreasonable effectiveness of HTML》。核心就一句：交付物 increasingly 不用 Markdown，改用 HTML。

我第一反应：HTML？不是前端的事吗？读完才发现，写公众号、做选题、出简报的人，也沾边。

## 100 行 Markdown，你其实也没读完

Thariq 提了个很具体的数：Markdown 一过百行，他自己就读不下去，同事更不会碰。

这我信。我自己也这样：让 AI 写选题 brief、写调研笔记，文件越长越像「已经做完了」的心理安慰——其实根本没读完。三四千字全堆在 `#` 和列表里，视觉上是一堵墙。扫两眼关 tab，再跟 Claude 说「总结成 5 条」——可读性外包给第二轮对话，还丢细节。

HTML 可以上标签页、分区、severity 着色的 diff、SVG 流程图。官方举过 PR review 的例子：把 diff 嵌进页面，按严重程度标色，读者只展开关心的模块。不是更炫，是**结构替你分担阅读成本**。

还有一点很多人忽略：Thariq 说团队 increasingly **不亲手改**这些文件，而是当 spec 给下一轮 Claude 会话用。Markdown「方便手写编辑」这条优势，在 agent 工作流里正在变弱。

## Markdown vs HTML：一张表说清楚

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-20-claude-code-html-output/image-1.png)

| 维度 | Markdown | HTML |
|------|----------|------|
| 信息密度 | 列表 + ASCII 图凑合 | 表格、CSS、SVG |
| 长文扫读 | 容易变墙 | 可分区、可折叠 |
| 分享 | 常要附件 | 浏览器直接开 |
| 交互 | 几乎没有 | 滑块调参、复制回 prompt |
| 上下文 | 单文件 | Claude Code 可读代码库、git、MCP |

有人概括得更狠：**Markdown 是报告，HTML 是界面。** 报告读一遍就扔；界面是接着改、接着讨论的工作台。

## 内容创作者：三个能立刻抄的 Prompt

你不一定写代码，但「AI 产出一份能打开、能转发、能二次编辑的页面」这个需求通用。

**选题对比板**  
「我要写 Claude Code HTML 这篇，先给 4 个完全不同的切入角度，做成 HTML 单页四宫格，每格写标题、读者、优缺点。」比 md 列表更适合丢给朋友问「你选哪个」。

**文章结构预览**  
长文前先出 HTML：章节、每段要点、预计字数、引用链接。浏览器里调顺序，再让 AI 填正文。公众号 1500 字，常能少改两遍结构。

**可分享简报**  
调研、数据、结论合成一页 HTML。合作者不用装 Obsidian，也不用翻五个 md。你发公众号前，也可以先出一页「结构预览」给合伙人提意见，比甩 md 附件体面。

Claude Code 里说一句 `make an HTML artifact` 即可。官方模板画廊：https://thariqs.github.io/html-effectiveness/ ，GitHub 上还有 PR 解读、实现计划等示例仓库。

**小红书怎么蹭？**  
同一套思路，把「四宫格选题」或「文章结构」压成一张长图之前，先在 HTML 里排好——标题层级、重点句加粗、对比表，导出截图时不会乱。省的是在备忘录里改十遍 bullet。

## Claude Code 独有的一层：上下文

这事在 Claude.ai 网页里也能做 HTML artifact，但 Thariq 强调 **Claude Code 能吃的上下文更多**：整个代码库、git 历史、MCP 接 Slack/Linear、Chrome 里的页面。写这篇官方文时，他就是让 Claude 扫自己生成过的 HTML 文件，分类后画进文章里的示意图。

对创作者来说，等价操作是：让 Claude Code 读你 `knowledge/` 里过往文章、读 brief 和调研文件夹，再生成「带内部链接的 HTML 大纲」——不是从零编，而是站在你的素材堆上排版。

## 什么时候别换？

README、changelog、GitHub 评论、一次性短备忘，继续 md。  
要进 Git、要 diff、要 CI 渲染的文档，也别强行 HTML。  
终稿只发公众号、且你已有 markdown→HTML 的排版 skill（比如微信兼容主题），**中间产物**仍建议 HTML：好读、好改、好分享；定稿再转，不冲突。

社区也有反对声：HTML 单文件 token 更肥、版本管理不如 md。Thariq 的回应本质是场景选择——**反复阅读、多人协作、要带图带表**的输出，才值得换容器。

## 收尾

Claude Code 押 HTML，不是因为 Markdown 落后，而是很多 AI 输出已不再是「看一遍的笔记」，而是**要反复打开、要给人看、要继续改的文件**。  
值得偷师的不是 HTML 语法，是换容器。下次让 AI 写大纲，加一句：「做成我能直接在浏览器打开的 HTML 页面。」

---

**发布记录**
- 公众号：草稿箱已发布/待发（https://mp.weixin.qq.com → 内容管理 → 草稿箱）· 2026-05-20 17:05
- X：已发布（正文 + 配图手动完成）· 2026-05-20
- 小红书：已上传（ljg-dense 5 张：cover-big + 01–04；备选 huashu-design 4 张）· 2026-05-20
