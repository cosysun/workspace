---
title: "1.3K star 的 baoyu-design 又升级：这次让你轻松用 AI 生产视频"
---

![1.3K star 的 baoyu-design 又升级：这次让你轻松用 AI 生产视频](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-17-baoyu-design-animation-skill/cover.png)

## 一个值得拆开看的更新

宝玉前几天发了一条更新，看的人不多，我觉得值得拆开讲讲。

baoyu-design 这个 skill 之前已经能在本地用 AI 生成 HTML 设计稿、可交互原型、甚至 slide deck（PPT），还能把 PPT 导出成可编辑的 PPTX。能做的事情已经很多了，但有一个出口一直没接上：动画视频。

之前 Claude Design 网页版可以用提示词生成动画，但你只能在网页上看，下不下来。也有人折腾过录屏插件，效果一般，过程也麻烦。这次更新做了一件直白的事——把 mp4 出口接上了。一段 timeline 动画现在可以直接渲染成真实的 .mp4（或 .webm / .gif）文件。

出口接上之后，AI 写动画就是一件能在本地跑、能反复调、能交付出去的事了。

## 它到底是什么

baoyu-design 不是"AI 视频工具"，跟 Sora 那一类东西不是一回事——它不让模型从文本生成画面，而是让模型写代码画动画。

它的本质是把 Anthropic 的 Claude Design（claude.ai/design 背后那套设计 skill）重新打包成一个本地可跑的 Agent Skill。装好之后，你在 Cursor、Claude Code、Codex 之类的本地 agent 里说一句"做个产品介绍动画"，agent 就用它写出 HTML 动画并直接导出成 mp4。安装一行命令：

```bash
npx skills add JimLiu/baoyu-design
```

仓库（JimLiu/baoyu-design，MIT，1.3K star 出头）里面除了 skill 文档，还附带了两个本地 CLI——`gen-pptx` 和这次新加的 `gen-video`。两个 CLI 思路一样：让无头浏览器把页面渲染好，再把渲染结果转成目标格式。

## 动画引擎的关键设计

要做到"每一帧都精确"，先看它的动画引擎。

宝玉用了一个很好的比喻：传统动画像看电影，你必须从头看到第 30 分钟才知道那时候画面长什么样；这套引擎更像一本特殊的书——翻到任意一页，画面都是完整的、确定的。

技术上这叫声明式动画。你不去命令"在第 5 秒把这个框移到右边"，而是描述"在任意时刻 t，这个框应该在哪里"。每一帧画面都由所在时间坐标决定，像一个函数 f(t)：传入一个时间，引擎直接算出那一瞬间屏幕上每个元素的位置、透明度、大小，不需要从头播放，也不需要记住之前发生了什么。

这套设计带来三个能力。第一，拖动播放条到任意位置可以——f(t) 随时能算。第二，反复调试同一帧可以——同一个 t 永远产出同一帧，画面是确定的。第三，**导出成视频也可以，而且方式很巧妙**。

![命令式 vs 声明式动画](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-17-baoyu-design-animation-skill/image-1.png)

## 定格动画式的拍摄

直觉上，把浏览器里的动画变成 mp4，录个屏不就行了？

不行。录屏是实时的，机器一卡就掉帧；播放条、黑色背景、圆角阴影这些"播放器外壳"会一起被录进去；同一段动画跑两次拿到的不是同一个东西。

baoyu-design 用的是定格动画的思路。启动一个无头 Chromium，加载动画页面，通过引擎预留的时间轴控制接口设定时间。每设定一个时间点，等浏览器把画面真正渲染完成，截一张图，通过管道直接喂给 ffmpeg 编码。一段 95 秒、30fps 的动画，就是 2850 次"摆好时间，拍照"的循环。慢，但每一帧都是精确的。

那个时间轴接口在 `window.__animStage` 上，暴露 `setTime`、`setPlaying`、`duration` 三个方法；帧数据通过 ffmpeg 的 `image2pipe` 流式喂入，编码成 H.264。

里面有两个值得讲的细节。

**双 rAF 等待**——设定时间后，工具会等两帧 `requestAnimationFrame` 再截图。原因是修改时间只改了 React 状态，浏览器还需要一到两帧才能把新画面真正画到屏幕上。等少了，截到的是上一帧的残影。这种细节不写进代码注释根本没人会注意到。但少了它，长动画就会糊。

**2x DPR 渲染**——截图按 2 倍设备像素比渲染，实际按 3840×2160 出图，最后由 ffmpeg 用 lanczos 算法缩回 1080p。原理跟高分辨率印刷一样：先在更大的画布上精细绘制，再高质量缩小，文字边缘和细线明显更清晰。多花的算力换来的是真清晰，不是花拳绣腿。

![定格动画式的逐帧拍摄 pipeline](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/06/2026-06-17-baoyu-design-animation-skill/image-2.png)

## 什么时候用它

最小调用就一个 JSON 配置：

```json
{ "width": 1920, "height": 1080, "filename": "demo" }
```

剩下的都从 Stage 自己读——时长、bridge、capture 模式都自动接上。

但这套工具不是万能的。三个明确的边界：

第一，只能录有时间线的动画。喂给它一个静态网页或者没有 timeline bridge 的页面，每一帧截下来都一样，导出来是个动不了的 mp4。它不是通用的"网页转视频"工具。

第二，慢。每一帧都是真实的浏览器截图，95 秒 30fps 跑下来几分钟到十几分钟很正常。比录屏慢得多，但你拿到的是同一段动画跑十次都长一样的视频。

第三，依赖重。要 Node、要 Playwright、要 Chromium、要 ffmpeg，CLI 还是 source ship，首次跑要 build 一次。

跟 Manim 不一样，Manim 是 Python 的数学动画库，吃数学/物理可视化；跟 Remotion 也不一样，Remotion 是给前端工程师手动搭项目的视频框架。baoyu-design 的位置很清楚：让 AI 写动画 + 一键导出，省的是工程搭建和手动 K 帧的时间。

如果你需要做产品演示、教程动画、概念解释这类东西，又不想为了一个 30 秒的动画去搭一整个 Remotion 项目，这是个值得收的工具。

---

**发布记录**
- 公众号：草稿已建，media_id `sXkZiQtFwh6tyZIabgP-AuQtsBwc0anNa8XutR44qAXHPzOIKRoJwGHX7hJo-V1I` · 2026-06-17 14:30

