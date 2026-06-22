---
title: "4.6k 星的 html-anything：从 Markdown 到精美 HTML，只需要点一点"
---

# 4.6k 星的 html-anything：从 Markdown 到 精美 HTML，只需要点一点

Anthropic Claude Code 团队的 Thariq 最近提过：不少内部文档从 Markdown 转向 HTML，因为「人真的会打开看」。但怎么生成呢，今天给大家介绍一个开源项目:
[html-anything](https://github.com/nexu-io/html-anything) 。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-22-html-anything-wechat-workflow/image-4.png)
你在本地写好 Markdown 草稿， 点生成，工具帮你按照模版生成对应精美的HTML。

## 30 秒跑起来

```bash
git clone https://github.com/nexu-io/html-anything
cd html-anything
pnpm install
pnpm -F @html-anything/next dev
```

浏览器打开 `http://localhost:3000`。

![](https://ai-content-1300152858.cos.ap-shanghai.myqcloud.com/writing/2026/05/2026-05-22-html-anything-wechat-workflow/image-1.png)

界面三栏：左编辑、中选模板、右预览。每个 skill 有 `example.html`，不确定效果可先双击样例。我写长文用 `doc-kami-parchment`（暖羊皮纸 editorial）。库里 75 个模板，搜「doc」或 「article」就够。

如果出小红书卡图，直接使用模板：`card-xiaohongshu` ，大家可以试试，这篇先不展开。

---

**发布记录**
- 公众号：已发布 · 2026-05-22（草稿 media_id: sXkZiQtFwh6tyZIabgP-ApxWIvkiEr6Nlva_j-aguSTlg9b3QPneli1cRtCTWHJg）
- 小红书：待发布（COS 图床 `writing/2026/05/2026-05-22-html-anything-wechat-workflow/cards/`）
