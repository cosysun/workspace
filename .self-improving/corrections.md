# Corrections Log

> Last 50 explicit corrections. Promote to memory.md after 3x same lesson.

---

## 2026-06-12 · /content-flow caveman 文章

### C1 · Skill resolution should prefer project over global
- **User**: "需要优先使用本项目下的 skill"
- **Context**: 跑 baoyu-post-to-wechat 时直接调用了 `~/.claude-internal/skills/baoyu-post-to-wechat/scripts/wechat-api.ts`，因为该全局版不读 workspace `.env`，直连官方微信 API → IP whitelist 拒绝（错误码 40164）。本项目 `<workspace>/.claude/skills/baoyu-post-to-wechat/scripts/wechat-api.ts` 支持 `WECHAT_API_BASE` 自建代理走 proxy 转发。
- **Lesson**: 调 skill 之前，先检查 `<workspace>/.claude/skills/<name>/` 是否存在；存在则优先用项目版。项目版往往有针对性 patch（代理支持、project `.env` 集成、自定义 hook）。
- **Promoted**: 立即 → memory.md（第一次但严重，影响发布成功）

### C2 · 封面 + 插图默认走 HTML，不走 AI 生图
- **User**: 「封面图，插图都使用 html 方式生成」
- **Context**: Stage 4 计划用 baoyu-image-gen 生成封面，DashScope 欠费 + 无其他 API key fallback。fallback 到 HTML 后效果反而更好：中文字体精确、与正文配图风格统一、零成本。
- **Lesson**: HTML/Chrome headless 是封面 + 插图的**默认**路径，不是 fallback。AI 生图只在 HTML 真表达不出的视觉（写实风格、生成式插画）时才用，且要在 prompts.md 记录用 AI 的具体原因。
- **Promoted**: 立即 → memory.md（用户明确表态 + 实战验证）

### C3 · baoyu-markdown-to-html 默认 default 主题
- **User**: 「baoyu-markdown-skill 默认使用 default 主题」
- **Context**: Stage 5.1 跑 baoyu-markdown-to-html 时，没有 EXTEND.md，且没有跨 skill 检查到 baoyu-post-to-wechat 的默认；我自作主张 generate 了 default/grace/modern 三主题预览。其实用户只要 default。
- **Lesson**: baoyu-markdown-to-html 的全局默认主题是 `default`。除非用户明确要求其他主题或 CLI 传入，不要自动多主题预览，也不要问用户选哪个。
- **Promoted**: 立即 → memory.md
- **Implemented**: `<workspace>/.baoyu-skills/baoyu-markdown-to-html/EXTEND.md` 写 `default_theme: default`；同时 `<workspace>/.baoyu-skills/baoyu-post-to-wechat/EXTEND.md` 也补全（baoyu-markdown-to-html 会跨 skill 读这个）。

### C4 · State files (self-improving, EXTEND.md) belong under workspace, not $HOME
- **User**: 「为啥都讲文件存在跟目录，不跟着项目走呢？」
- **Context**: 紧接 C1（项目 skill 优先于全局）的 `/self-improving` 写入。我立 C1 规则的同时把 `~/self-improving/` 和 `~/.baoyu-skills/<name>/EXTEND.md` 写到了 home —— 自相矛盾。检查 `<workspace>/.baoyu-skills/` 时发现已有 `baoyu-post-to-x` 和 `baoyu-translate` 的 EXTEND.md，证实你早就把这类配置放项目下，是我没看就先动手。
- **Lesson**: 「项目优先」这个原则覆盖**所有持久化文件**：skill 自己、skill 配置（EXTEND.md）、self-improving 记忆。不是只针对 skill 代码本身。新建任何要落盘的状态/配置时，先扫一眼 `<workspace>/` 下有没有同类先例，**有先例就跟先例**；没有也优先放 `<workspace>/`。
- **Correction applied**: `~/self-improving/*` → `<workspace>/.self-improving/`；`~/.baoyu-skills/{baoyu-markdown-to-html,baoyu-post-to-wechat}/EXTEND.md` → `<workspace>/.baoyu-skills/.../EXTEND.md`；home 残留已清。
- **Promoted**: 立即 → memory.md（与 C1 同根，扩展覆盖范围）

---

## 反思 · /content-flow 整体

```
CONTEXT: /content-flow 整篇公众号文章流程
REFLECTION: 三条修正都属于"第一次跑就该正确选用工具/参数"。Skill 选择 + 配图路径 + 主题选择都是默认行为问题，不是流程逻辑问题。
LESSON: 流程开跑前先扫一遍各个 stage 会调用的 skill，确认：(a) 项目版存在 → 用项目版；(b) 配图任务路径决策默认走 HTML；(c) 主题相关 skill 默认 default。把这三条放在 HOT memory，下次跑流程时一开始就读。
```

## 反思 · meta-错误（C4）

```
CONTEXT: /self-improving 写规则的同时违反规则
REFLECTION: 立完一条「项目优先」的 HOT rule，下一刻就把记忆写到 ~/self-improving/。这种 inconsistency 说明：写新规则的那一刻，我没把它当真去检查自己当前正在动的手。
LESSON: 写完一条规则后，立刻问自己「我刚才/正在做的动作，符不符合这条规则？」如果符合 → 推进；如果不符合 → 立刻回退/搬迁，不能等下一次任务被纠错才发现。
```

---

## 2026-06-22 · /content-flow AI 味去除合集文章（4 处连续纠错）

### C5 · 别替用户解释来源叙事（"X 帖子背景、谁发的、多少 views"）
- **User**: "为啥要说 X 里周彭根，以及那这么珍贵的文字解释一些 X 帖子背景，我给你这个 X 链接只是想让你按照帖子内容来写"
- **Context**: 写文章开头时写了「这周彭根辉发了一条 X，2.9 万次浏览，把 GitHub 上去 AI 味的前 10 个项目一次性扒出来。但帖子只给了链接，没给分类。」整整 3 句话给一条 X 帖子做来源溯源。
- **Lesson**: 用户给的 URL 是**素材**，不是**主角**。开头出现「这周 XX 发了 / 浏览量 / 但帖子怎样」之类对源帖子的描述就是错的，读者不关心源头是谁、有多火、漏了什么——他们只关心你从中拎出来的结论。来源放末尾「完整链接」区当出处即可，不写进正文叙事。
- **Promoted**: 立即 → memory.md（写作类一票否决错误）

### C6 · 开头从读者痛点出发，不写工作流程庸俗化场景
- **User**: "为啥要写老板拍稿子说 很庸俗的场景，从用户痛点出发"
- **Context**: 开头用了「老板拍着稿子说『这股 AI 味儿能不能去掉』，是中文创作者最近最高频的反馈。」这是公众号烂俗钩子模板——虚构办公室冲突场景代替真实痛点。
- **Lesson**: 开头钩子的来源应该是**痛点本身**，不是脑补的场景剧。读者打开文章前心里已经在想"AI 味"了，直接讲它的具体表现（"词大、句长、什么都对、但读起来不像人写的"）就够。「老板说」「同事吐槽」「客户退稿」这种戏剧化开场都是注水。
- **Promoted**: 立即 → memory.md

### C7 · 砍掉自己的工作过程叙述（"挨个翻了一遍、剔了 N 个、剩 X 个"）
- **User**: "为啥在开头写这段话把停更超过一年、生态绑死老模型的两个先剔了，剩下 8 个在 6 个月内都有更新，对用户而言是没有价值的，开头要冲用户痛点出发来穿针引线"
- **Context**: 开头第二段写了「把停更超过一年、生态绑死老模型的两个先剔了，剩下 8 个在 6 个月内都有更新，能直接装。」这是在介绍**我的调研过程**，读者不关心。
- **Lesson**: 调研工作量是我的内部事务，不应该出现在正文。「我挨个翻了一遍」「过了 README」「剔了 N 个」「star 都核对了」全是自我表扬，对读者零价值。读者只需要拿到**结论**：8 个最值得装、按场景分四档。你怎么得到这个结论的，他们不在乎。
- **Promoted**: 立即 → memory.md

### C8 · 砍掉元叙述（"下面/今天/接下来要做什么"）
- **User**: "这段感觉也是废话：下面三个是起点，第四个 writing-agent 是给已经有完整写作流的人，今天先不展开"
- **Context**: 在表格之后写了「下面三个是起点，第四个 writing-agent 是给已经有完整写作流的人，今天先不展开」。这是元叙述——告诉读者接下来要看什么、不看什么。
- **Lesson**: 元叙述（"下面"/"今天先不展开"/"接下来我们看"/"先扫一眼，再看后面"）是 AI 文章最大特征之一。读者跟着标题和章节自然就知道接下来看什么，不需要被引导。**写完一段问自己：这句话有没有讲一个具体事实/判断/操作？没有就砍**。
- **Promoted**: 立即 → memory.md

### C9 · 标题候选不要套公众号"神级/杀手锏/必看/挨个翻了"等套路词
- **User**: "这些标题真的太垃圾了"
- **Context**: 生成 10 个标题候选清单时几乎全是「老板再说 AI 味重？」「神级开源项目」「3 个真的好用」「一行命令杀死 AI 味」「挨个翻了一遍」「GitHub 周榜被偷家」等套路。
- **Lesson**: 标题禁用词清单：「神级」「杀手锏」「必看」「挨个翻了」「真的好用」「就靠这」「秒杀」「狠了」「太狠」「3 分钟搞清」「值得装」「太垃圾」「拯救」「救你」。叹号/问号当噱头也不行。**痛点 + 解决方案**类型的标题做法：前半段说一个**具体动作/损失**（不是"AI 味重"这种空话），后半段给一个**节制的提议**（不是"狠了/必看/真的好用"）。

---

## 反思 · 写作流程整体（C5-C9）

```
CONTEXT: /content-flow Stage 3 写作 + Stage 3.5 标题
REFLECTION: 5 处连续纠错都属于同一类问题——把自我表达/工作过程/场景剧/套路话术当成内容。一个 800 字的小文章里，可以被砍的"AI 味段落"远不止过滤词层面的词换词，更多在**结构层**：哪些段落本身就不该存在。
LESSON: 写完每一段，先问自己：
1. 这段在讲读者要的事实/操作/判断，还是在讲我（这周翻了什么、剔了什么、接下来要做什么）？
2. 这段有没有"下面"/"接下来"/"先扫一眼"这种引导词？有就大概率是元叙述。
3. 这段的钩子是真实痛点（具体损失、具体感受）还是脑补的戏剧化场景（老板/同事/客户的虚构发言）？
4. 标题里有没有"神级/狠了/真的/挨个翻了/必看"这种套路词？

任何一项没通过 → 这段或这个标题直接砍/重写，不要试图微调。
```

