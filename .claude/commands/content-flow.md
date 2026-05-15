---
description: 总编排 — 按状态机串起 5 个 Stage，Gate 处用 AskUserQuestion 强停
argument-hint: [--from <stage>] [--slug <slug>] [--resume <slug>] [--cleanup <slug>]
---

# /content-flow：总编排

## 命令契约

```
/content-flow                             # 新任务，从 Stage 1 开始
/content-flow --from research --slug X    # 从 Stage 2 重跑
/content-flow --from write --slug X       # 从 Stage 3 重跑
/content-flow --from illustrate --slug X  # 从 Stage 4 重跑
/content-flow --from publish --slug X     # 从 Stage 5 重跑
/content-flow --resume <slug>             # 自动检测断点续跑
/content-flow --cleanup <slug>            # 仅做 5.7 清理
```

## 参数解析

1. 解析 `$ARGUMENTS` 拿到 `--from`、`--slug`、`--resume`、`--cleanup`
2. 互斥校验：`--cleanup` 与其他互斥；`--resume` 与 `--from` 互斥
3. 如果是 `--cleanup <slug>`：跳到状态机的"清理"分支

## 状态机（按文件存在性推断当前位置）

```
Step A: content-factory/briefs/<slug>.md 存在？
  否 → 跑 /content-pick（Stage 1）；得到 slug 后继续 Step B
  是 → 继续 Step B

Step B: briefs/<slug>.md 末尾"调研摘要"段非空？
  否 → 跑 /content-research <slug>（Stage 2）；继续 Step C
  是 → 继续 Step C

Step C: drafts/<slug>/final.md 存在 + YAML 只有 title 字段（无 title_candidates）？
  否 → 跑 /content-write <slug>（Stage 3）；继续 Step D
  是 → 继续 Step D

Step D: images/<slug>/cover.png 存在？
  否 → 跑 /content-illustrate <slug> 的 Stage 4 部分；继续 Step E
  是 → 继续 Step E

Step E: drafts/<slug>/final-with-urls.md 存在 + 0 个 ./images/ 引用？
  否 → 跑 /content-illustrate <slug> 的 Stage 4.5 部分；继续 Step F
  是 → 继续 Step F

Step F: knowledge/写作/YYYY/MM/<slug>.md 存在？
  否 → 跑 /content-publish <slug>（Stage 5：5.1-5.6）；继续 Step G
  是 → 继续 Step G

Step G: content-factory/<slug> 三处任一存在？
  是 → 跑 /content-publish <slug> 的 5.7 清理部分
  否 → 完成
```

## --from 行为

`--from` 强制从指定 Stage 起跑，**无视后续 Stage 已有的产物**：
- `--from research`：跳过 Stage 1，从 Stage 2 起跑（**不删** 已有产物，让 stage 命令自己幂等覆盖）
- `--from write`：从 Stage 3 起，会重写 v1/v2/v3/final
- `--from illustrate`：从 Stage 4 起，会重新配图 + 重传 COS（COS 同名 key 会被覆盖）
- `--from publish`：从 Stage 5 起，会重新发布（**注意**：会重发到平台，慎用）

## --resume 行为

完全等价于无参 `/content-flow`，但加上 `--slug <slug>` 限定 —— 让状态机从该 slug 推断断点。

## --cleanup 行为

只跑 Stage 5.7 的清理部分，不发布、不动 vault。用于"已经发了但清理失败"的情况。

## Gate 处的强停

- Gate 1 / 2 / 3 都在各自 Stage 命令内部处理（用 AskUserQuestion）
- 总编排不重复实现 Gate，只调子命令
- 子命令的 AskUserQuestion 返回值通过自然语言传给总编排，总编排基于此决定是否进 Step 下一步

## 错误处理

任意子命令报错：
- 保留所有中间产物
- 把错误原因 + 当前状态机位置告诉用户
- 提示对应的 `--from <stage> --slug <slug>` 重跑命令

## 调度细节

- 不在 stage 之间做并行（huashu-research 内部已并行；外层并行没收益还容易撞配额）
- 每个 stage 之间打一行进度日志：
  ```
  [content-flow] Stage 1 完成 → slug=<slug>，进入 Stage 2
  ```

## 输出

按 stage 命令各自输出汇总；总编排末尾打印一行 vault 路径：

```
[content-flow] 全流程完成。归档：knowledge/写作/2026/05/<slug>.md
```
