---
title: "3.1k 星的 Webwright：微软把浏览器 agent 塞进你的终端"
date: 2026-05-28
tags: [写作, AI, browser-agent, webwright, microsoft, 工具短文]
sources:
  - https://github.com/microsoft/Webwright
  - https://www.microsoft.com/en-us/research/articles/webwright-a-terminal-is-all-you-need-for-web-agents/
publishing:
  公众号: 草稿（2026-05-28 重推，media_id: sXkZiQtFwh6tyZIabgP-AgmW6F3lewvaOf8MhHOj9D44YbN7Tj4r1v2e41-EAlbA）
  小红书: 卡组已生成（2026-05-28，6 张，待手动上传）
word_count: 395
slug: 2026-05-28-microsoft-webwright
---

# 3.1k 星的 Webwright：微软把浏览器 agent 塞进你的终端

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-28-microsoft-webwright/cover.png)

很多网页 agent 还在干同一件事：盯着当前页面，预测**下一个**点击或输入，循环几十上百轮。

浏览器 session 就是全部状态，断了就得重来。模型越强，这种「微操 harness」越像瓶颈。

微软刚开源的 [Webwright](https://github.com/microsoft/Webwright)（注意：不是 Playwright 测试框架那个 Playwright，名字像、角色不同）换了个思路：**给模型一个终端**，浏览器随时能开能关，真正留下来的是工作区里的 Python 脚本和截图日志。

GitHub 短短几天时间就已经有 3.1k star。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-28-microsoft-webwright/image-1.png)


## 它到底在解决什么

一句话：**网页操作变成可复用的代码。**

传统做法里，状态活在浏览器里。Webwright 把状态挪到**本地工作区**——代码、轨迹、截图。

模型写代码，执行，看结果，改代码，再跑；像工程师写 RPA，而不是每步问「点哪」。

我把它理解成两件事叠在一起：

1. **复杂流程用代码压缩**：选日期、填多列表单、翻页抓取，写成循环和函数，一次生成，后面改参数就能复用；不必为每个日期重新预测十几轮点击。
2. **调试方式像写脚本**：出错了就加截图、加 log、改选择器，而不是在对话里反复描述「再点左边那个按钮」。

核心循环就四步：prompt → 写脚本 → 执行 → 按需看图修复。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-28-microsoft-webwright/image-2.png)

## 30 秒装上

```bash
git clone https://github.com/microsoft/Webwright
cd Webwright
pip install -e .
playwright install chromium
```

要独立跑一条任务（需自备 api key）：

```bash
export OPENAI_API_KEY=sk-...
python -m webwright.run.cli \
  -c base.yaml -c model_openai.yaml \
  -t "在 Google Flights 查 2026-08-15 西雅图到纽约的航班" \
  --start-url https://www.google.com/flights \
  --task-id demo \
  -o outputs/default
```

跑完在 `outputs/` 里能看到轨迹和截图。

## 拓展资料

项目页：[microsoft.github.io/Webwright](https://microsoft.github.io/Webwright/) · 
研究博客：[Webwright: A Terminal Is All You Need For Web Agents](https://www.microsoft.com/en-us/research/articles/webwright-a-terminal-is-all-you-need-for-web-agents/)

---

**发布记录**
- 公众号：草稿已推 · 2026-05-28（media_id: sXkZiQtFwh6tyZIabgP-AgmW6F3lewvaOf8MhHOj9D44YbN7Tj4r1v2e41-EAlbA）
- 公众号（旧稿可删）：sXkZiQtFwh6tyZIabgP-Amq2bst2Mt0YYxodkE66tWiAfUkcguLhchwiP5Vl9G2U
- 小红书：6 张卡组已生成 · COS `writing/2026/05/2026-05-28-microsoft-webwright/cards/` · 待手动上传
