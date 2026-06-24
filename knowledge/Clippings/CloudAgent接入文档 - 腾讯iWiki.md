---
title: "CloudAgent接入文档 - 腾讯iWiki"
source: "https://iwiki.woa.com/p/4019644114?from=recent_view"
author:
published:
created: 2026-06-18
description:
tags:
  - "clippings"
---
全部正式员工可见

\## 目录

\- \[1. 概述\](#1-概述)

\- \[2. 核心概念\](#2-核心概念)

\- \[3. 认证与通用格式\](#3-认证与通用格式)

\- \[4. 快速开始\](#4-快速开始)

\- \[5. 控制面 API — Runtime 管理\](#5-控制面-api--runtime-管理)

\- \[6. 控制面 API — Session 管理\](#6-控制面-api--session-管理)

\- \[7. 控制面 API — Checkpoint 快照管理\](#7-控制面-api--checkpoint-快照管理)

\- \[8. 控制面 API — Version 版本管理\](#8-控制面-api--version-版本管理)

\- \[9. 控制面 API — Artifact Release 产物发布\](#9-控制面-api--artifact-release-产物发布)

\- \[10. 数据面 — ACP 协议\](#10-数据面--acp-协议)

\- \[11. Webhook 事件回调\](#11-webhook-事件回调)

\- \[12. Agent Manifest 配置\](#12-agent-manifest-配置)

\- \[附录：错误码汇总\](#附录错误码汇总)

\---

\## 1. 概述

\### 什么是 CloudAgent？

CloudAgent（内部代号 AgentOS）是一个\*\*云端 AI Agent 运行平台\*\*，为开发者提供完整的 Agent 生命周期管理能力：

\- \*\*创建和管理 Agent 运行环境 (Runtime)\*\*：每个 Runtime 是一个独立的云端沙箱实例，包含完整的文件系统和终端环境

\- \*\*与 Agent 进行实时对话\*\*：通过 ACP 协议发送指令，接收 Agent 的流式输出和工具调用结果

\- \*\*管理版本和快照\*\*：创建 Checkpoint 和 Version，支持随时回滚到历史状态

\- \*\*发布部署产物\*\*：将 Agent 在沙箱中构建的 Web 应用或静态资源发布到公网

\### 架构概览

CloudAgent 采用\*\*控制面与数据面分离\*\*的架构：

\`\`\`

\`\`\`

| 层级 | 组件 | 职责 | 接入方式 |

|------|------|------|----------|

| \*\*控制面\*\* | AgentOS API | Runtime / Session / Version / 发布管理 | REST API |

| \*\*数据面\*\* | Box Service | Agent 对话、流式输出、工具调用 | ACP 协议 (HTTP + SSE) |

| \*\*数据面\*\* | E2B Sandbox | 文件系统操作、终端命令执行 | E2B SDK |

\---

\## 2. 核心概念

\### Runtime

Runtime 是 CloudAgent 的核心资源，代表一个\*\*独立的 Agent 运行环境\*\*。每个 Runtime 包含：

\- 一个云端沙箱实例（完整的 Linux 文件系统和终端）

\- Agent 的配置信息（Manifest）

\- 一个或多个 Session（对话会话）

创建 Runtime 时会\*\*自动创建一个初始 Session\*\*。

\*\*状态枚举\*\*：

| 状态 | 说明 |

|------|------|

| \`\` | 创建中（沙箱初始化） |

| \`\` | 运行中（可正常使用） |

| \`\` | 即将停止 |

| \`\` | 已停止 |

| \`\` | 创建失败 |

\### Session

Session 代表一个\*\*对话会话\*\*。一个 Runtime 下可以有多个 Session，每个 Session 维护独立的对话历史和 Agent 上下文。

\### Checkpoint 与 Version

\- \*\*Checkpoint（快照）\*\*：沙箱环境在某一时刻的完整备份，支持恢复

\- \*\*Version（版本）\*\*：基于 Checkpoint 创建的命名版本，便于管理和回滚

\### Agent Manifest

Manifest 是 Agent 的声明式配置文件（JSON），定义 Agent 的身份、能力、工作空间和运行环境。详见 \[第 12 节\](#12-agent-manifest-配置)。

\---

\## 3. 认证与通用格式

\### 认证方式

控制面 API 使用 \*\*API Key\*\* 认证。请先前往 \[https://www.codebuddy.cn/profile/keys\](https://www.codebuddy.cn/profile/keys) 创建 API 密钥，然后在请求头中携带：

\`\`\`

\`\`\`

支持的扩展认证头（多租户场景）：

| 请求头 | 说明 |

|--------|------|

| \`\` | 用户 ID |

| \`\` | 来源应用名 |

| \`\` | 租户 ID |

\### 统一响应格式

所有控制面 API 响应使用统一的 JSON 外壳：

\*\*成功\*\*：

\`\`\`json

\`\`\`

\*\*错误\*\*：

\`\`\`json

\`\`\`

\### 分页参数

列表类接口支持统一分页参数：

| 参数 | 类型 | 默认 | 说明 |

|------|------|------|------|

| \`\` | integer | 1 | 页码（从 1 开始） |

| \`\` | integer | 20 | 每页数量（最大 100） |

分页响应格式：

\`\`\`json

\`\`\`

\---

\## 4. 快速开始

\### 接入流程总览

\`\`\`

\`\`\`

\### 步骤 1：创建 Runtime

注意：请求需要带上请求头 X-Source-App，传入 sourceApp 类型，如不传，默认为 default-app

\`\`\`bash

\`\`\`

\*\*响应\*\*：

\`\`\`json

\`\`\`

\### 步骤 2：等待 Runtime 就绪

轮询 \`\`，直到 \`\` 变为 \`\`。

\### 步骤 3-6：通过 ACP 协议与 Agent 交互

获取 \`\` 和 \`\` 后，按照 \[第 10 节 ACP 协议\](#10-数据面--acp-协议) 建立连接并对话。

\### 典型应用场景

\*\*场景 1：自定义 AI 编程助手\*\*

1\. 创建 Runtime，配置 \`\` 和 \`\` → 2. ACP 发送编码任务 → 3. Agent 自动编写代码并执行 → 4. 创建 Version 保存成果

\*\*场景 2：CI/CD 中的 AI 代码审查\*\*

1\. API 创建 Runtime 并拉取代码 → 2. 发送审查 Prompt → 3. 获取结果 → 4. 删除 Runtime 释放资源

\*\*场景 3：构建并发布 Web 应用\*\*

1\. 创建 Runtime → 2. ACP 指导 Agent 开发 → 3. Artifact Release API 发布到公网 → 4. 获取域名

\---

\## 5. 控制面 API — Runtime 管理

\> \*\*Base URL\*\*: \`\`

\### POST /runtimes — 创建 Runtime

注意：请求需要带上请求头 X-Source-App，传入 sourceApp 类型，如不传，默认为 default-app

\*\*请求体\*\*：

\`\`\`json

\`\`\`

| 字段 | 类型 | 必需 | 说明 |

|------|------|------|------|

| \`\` | string | ✅ | Runtime 名称 |

| \`\` | string | ❌ | \`\`（默认）或 \`\` |

| \`\` | string | ❌ | 沙箱模板 ID |

| \`\` | object | ❌ | 沙箱规格（cpu, memory） |

| \`\` | object | ❌ | Agent 配置（详见 \[第 12 节\](#12-agent-manifest-配置)），如果传值，id、name、manifestVersion 几个是必填字段。 |

| \`\` | object | ❌ | 自定义元数据（key-value） |

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### GET /runtimes — 列出 Runtime

注意：请求需要带上请求头 X-Source-App，传入 sourceApp 类型，如不传，默认为 default-app，default-app 类型的 runtime，该接口无法直接查询出来。

分页查询当前用户的 Runtime 列表。支持 \`\` 过滤，如 \`\`。

\### GET /runtimes/{runtimeId} — 获取 Runtime 详情

响应格式同创建 Runtime。

\### POST /runtimes/{runtimeId}/update — 更新 Runtime

\*\*请求体\*\*：

\`\`\`json

\`\`\`

所有字段可选，仅更新提供的字段。

\*\*响应\*\* \`\`：响应格式同创建 Runtime（返回更新后的完整 Runtime 对象）。

\### POST /runtimes/{runtimeId}/delete — 删除 Runtime

软删除，删除后无法恢复。

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### POST /runtimes/{runtimeId}/fork — Fork Runtime

从现有 Runtime 复制创建新的 Runtime 和 Session。

\- \`\` Runtime：任意用户可 Fork

\- \`\` Runtime：仅同 \`\` 可 Fork

\*\*请求体\*\*：

\`\`\`json

\`\`\`

\*\*响应\*\* \`\`：响应格式同创建 Runtime（返回新 Runtime 的完整信息）。

\### GET /runtimes/by-domain — 通过域名查询 Runtime

通过发布域名反查 Runtime 信息。无需 owner 权限。

\*\*查询参数\*\*：\`\`（必填）

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\---

\## 6. 控制面 API — Session 管理

\### POST /runtimes/{runtimeId}/sessions — 创建 Session

\*\*请求体\*\*：

\`\`\`json

\`\`\`

| 字段 | 类型 | 必需 | 说明 |

|------|------|------|------|

| \`\` | string | ✅ | 会话 ID |

| \`\` | string | ❌ | 会话名称 |

| \`\` | object | ❌ | Agent 配置（与 Runtime 级别配置合并），如果传值，\`\`、\`\`、\`\` 是必填字段。\`\` 数组用于传递敏感信息（如 \`\`），这些值不会写入沙箱文件，而是通过环境变量/metadata 注入沙箱。 |

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### GET /runtimes/{runtimeId}/sessions — 列出 Session

支持 \`\` 过滤：\`\`, \`\`, \`\`。

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### GET /runtimes/{runtimeId}/sessions/{sessionId} — 获取 Session 详情

\*\*响应\*\* \`\`：响应格式同创建 Session。

\### POST /runtimes/{runtimeId}/sessions/{sessionId}/update — 更新 Session

\*\*请求体\*\*：

\`\`\`json

\`\`\`

所有字段可选，仅更新提供的字段。

\*\*响应\*\* \`\`：响应格式同创建 Session（返回更新后的完整 Session 对象）。

\### POST /runtimes/{runtimeId}/sessions/{sessionId}/delete — 删除 Session

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\---

\## 7. 控制面 API — Checkpoint 快照管理

\### POST /runtimes/{runtimeId}/checkpoints — 创建 Checkpoint

\`\`\`json

\`\`\`

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\*\*Checkpoint 类型\*\*：

| 类型 | 说明 |

|------|------|

| \`\` | Session 开始时自动创建 |

| \`\` | 手动创建 |

| \`\` | 创建 Version 时自动创建 |

| \`\` | 发布部署前自动备份 |

\### GET /runtimes/{runtimeId}/checkpoints — 列出 Checkpoint

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### GET /runtimes/{runtimeId}/checkpoints/{checkpointId} — 获取详情

\*\*响应\*\* \`\`：响应格式同创建 Checkpoint。

\### POST /runtimes/{runtimeId}/checkpoints/{checkpointId}/update — 更新描述

\*\*请求体\*\*：

\`\`\`json

\`\`\`

\*\*响应\*\* \`\`：响应格式同创建 Checkpoint（返回更新后的完整 Checkpoint 对象）。

\### POST /runtimes/{runtimeId}/checkpoints/{checkpointId}/delete — 删除

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### POST /runtimes/{runtimeId}/checkpoints/{checkpointId}/restore — 恢复

从快照恢复 Agent 运行环境。可选传入 \`\` 记录恢复原因。

\*\*响应\*\*：

\`\`\`json

\`\`\`

\---

\## 8. 控制面 API — Version 版本管理

Version 是\*\*带名称的 Checkpoint\*\*，便于管理和回滚。

\### POST /runtimes/{runtimeId}/versions — 创建 Version

基于当前 Checkpoint 创建命名版本。

\`\`\`json

\`\`\`

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### GET /runtimes/{runtimeId}/versions — 列出 Version

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### GET /runtimes/{runtimeId}/versions/{versionId} — 获取详情

\*\*响应\*\* \`\`：响应格式同创建 Version。

\### POST /runtimes/{runtimeId}/versions/{versionId}/update — 更新描述

\*\*请求体\*\*：

\`\`\`json

\`\`\`

\*\*响应\*\* \`\`：响应格式同创建 Version（返回更新后的完整 Version 对象）。

\### POST /runtimes/{runtimeId}/versions/{versionId}/delete — 删除

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### POST /runtimes/{runtimeId}/versions/{versionId}/restore — 恢复到版本

\*\*响应\*\*：

\`\`\`json

\`\`\`

\---

\## 9. 控制面 API — Artifact Release 产物发布

\### 注意

\- web 发布目前仅支持cs沙箱，AGS沙箱暂不支持

\### 前置准备

\#### 1、web发布前须添加自启动项，可参考一下配置

vim /workspace/.cloudstudio

\`\`\`

\`\`\`

将 Runtime 中构建的应用发布到公网。

\### POST /artifact-releases — 创建发布

\`\`\`json

\`\`\`

| 字段 | 类型 | 必需 | 说明 |

|------|------|------|------|

| \`\` | integer (int64) | ✅ | 关联的 Runtime ID |

| \`\` | string | ❌ | \`\`（默认）或 \`\` |

| \`\` | object | ❌ | 发布配置 |

| \`\` | object | ❌ | 环境变量和密钥 |

\*\*Web 类型 releaseConfig\*\*：

| 字段 | 类型 | 必需 | 说明 |

|------|------|------|------|

| \`\` | integer | ✅ | 应用端口（1-65535） |

| \`\` | integer | ❌ | 副本数（默认 1） |

| \`\` | integer | ❌ | 过期时间秒（默认 86400） |

| \`\` | object | ❌ | 健康探针 |

| \`\` | string | ❌ | 应用名（可用于域名） |

| \`\` | boolean | ❌ | 使用 appName 作为域名前缀 |

\*\*Static 类型 releaseConfig\*\*：

| 字段 | 类型 | 必需 | 说明 |

|------|------|------|------|

| \`\` | string | ❌ | 源路径（默认 \`\`） |

| \`\` | string | ❌ | 指定文件名（空则上传整个目录） |

| \`\` | string | ❌ | CDN 入口文件（如 \`\`） |

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\### GET /artifact-releases — 列出发布记录

查询参数：\`\`（必填）、\`\`（可选）、\`\`、\`\`。

\### POST /artifact-releases/{releaseId}/cancel — 取消发布

\*\*响应\*\* \`\`：

\`\`\`json

\`\`\`

\---

\## 10. 数据面 — ACP 协议

ACP (Agent Client Protocol) 用于与 Agent 进行\*\*实时对话\*\*。基于 \*\*JSON-RPC 2.0\*\*，通过 \*\*HTTP + SSE\*\* 传输。

\### 10.1 获取 ACP 连接信息

创建或查询 Runtime 后，从响应中提取：

\`\`\`json

\`\`\`

\- \`\`：ACP 端点地址

\- \`\`：Bearer Token（用于 ACP 请求认证）

\- \`\`：Token 过期时间（Unix 秒）

\### 10.2 通信模型

ACP 使用\*\*双 SSE 流\*\*模型：

\`\`\`

\`\`\`

\*\*关键原则\*\*：

\- \*\*GET SSE\*\*：接收 \`\` 通知和非 prompt 请求的响应

\- \*\*POST\*\*：对 \`\` 返回独立 SSE 流；其他请求返回 \`\`，响应通过 GET SSE 推送

\- \*\*Connection ID\*\*：所有消息通过 \`\` 头关联到同一连接

\### 10.3 HTTP 端点

\#### GET /acp — 建立 SSE 连接

\*\*请求头\*\*：

| 头部 | 必需 | 说明 |

|------|------|------|

| \`\` | ✅ | 必须包含 \`\` |

| \`\` | ✅ | \`\` |

| \`\` | ❌ | 重连时携带 |

| \`\` | ❌ | 断点续传偏移量 |

\*\*成功响应\*\* \`\`：

\`\`\`

\`\`\`

连接建立后：首先发送 2KB padding 注释 → 每 15 秒心跳 \`\` → 收到消息时推送 SSE event。

\#### POST /acp — 发送消息

\*\*请求头\*\*：

| 头部 | 必需 | 说明 |

|------|------|------|

| \`\` | ✅ | 从 GET 响应获取的连接 ID |

| \`\` | ✅ | \`\` |

| \`\` | ✅ | 同时包含 \`\` 和 \`\` |

| \`\` | ✅ | \`\` |

\*\*请求体\*\*：

\`\`\`json

\`\`\`

\*\*响应行为\*\*：

| 请求类型 | HTTP 响应 | 说明 |

|----------|-----------|------|

| \`\` | \`\` + SSE 流 | prompt 响应通过此 SSE 流返回 |

| 其他请求 | \`\` | 响应通过 GET SSE 推送 |

| 通知（无 id） | \`\` | 无响应体 |

\#### DELETE /acp — 关闭连接

携带 \`\` 头，返回 \`\`。

\### 10.4 SSE 事件格式

\`\`\`

\`\`\`

| 字段 | 说明 |

|------|------|

| \`\` | 消息偏移量（用于断点续传） |

| \`\` | 固定为 \`\` |

| \`\` | JSON-RPC 2.0 消息（单行 JSON） |

心跳：\`\`

\### 10.5 JSON-RPC 方法

\#### initialize — 协议握手

建立连接后\*\*必须首先发送\*\*。

\*\*请求\*\*：

\`\`\`json

\`\`\`

\*\*响应\*\*（通过 GET SSE）：

\`\`\`json

\`\`\`

\#### session/new — 创建新会话

\`\`\`json

\`\`\`

| 参数 | 类型 | 必需 | 说明 |

|------|------|------|------|

| \`\` | string | ✅ | 工作目录（绝对路径） |

| \`\` | array | ✅ | MCP 服务器配置（可为空数组） |

\*\*响应\*\*：

\`\`\`json

\`\`\`

\#### session/load — 加载已有会话

\`\`\`json

\`\`\`

\*\*时序\*\*：服务端先通过 GET SSE 推送所有历史 \`\` → 推送完毕后返回 \`\` 响应。

\#### session/prompt — 发送用户消息

\*\*响应通过 POST SSE 流返回\*\*。执行期间，Agent 通过 GET SSE 持续推送 \`\` 通知。

\`\`\`json

\`\`\`

\*\*ContentBlock 类型\*\*：

| type | 说明 | 关键字段 |

|------|------|----------|

| \`\` | 文本 | \`\` |

| \`\` | 图片（base64） | \`\`, \`\` |

| \`\` | 音频（base64） | \`\`, \`\` |

| \`\` | 资源链接 | \`\`, \`\` |

\*\*响应\*\*（通过 POST SSE）：

\`\`\`json

\`\`\`

\*\*StopReason\*\*：\`\`（正常完成）、\`\`、\`\`、\`\`、\`\`

\#### session/cancel — 取消执行

通知（无 id，无响应）：

\`\`\`json

\`\`\`

\#### session/set\_mode — 切换权限模式

\`\`\`json

\`\`\`

\*\*响应\*\*：\`\` (空对象)

\*\*可用模式\*\*：

| modeId | 说明 |

|--------|------|

| \`\` | 标准模式，Agent 执行文件写入、命令执行等操作前需要用户确认 |

| \`\` | 自动接受文件编辑操作，但执行终端命令仍需用户确认 |

| \`\` | 自动批准所有操作（YOLO 模式），无需任何确认 |

| \`\` | 规划模式，Agent 仅生成执行计划而不实际执行操作 |

\> \*\*提示\*\*：可用模式列表也会在 \`\` 响应的 \`\` 中返回。

\### 10.6 session/update 通知类型

Agent 执行期间通过 GET SSE 推送：

\#### agent\_message\_chunk — Agent 文本输出

\`\`\`json

\`\`\`

\#### agent\_thought\_chunk — Agent 思考过程

\`\`\`json

\`\`\`

\#### tool\_call — 工具调用开始

\`\`\`json

\`\`\`

| 字段 | 说明 |

|------|------|

| \`\` | 工具调用唯一 ID |

| \`\` | 可读标题 |

| \`\` | \`\`, \`\`, \`\`, \`\`, \`\`, \`\`, \`\`, \`\` |

| \`\` | \`\`, \`\`, \`\`, \`\` |

| \`\` | 工具输入参数 |

\#### tool\_call\_update — 工具调用更新

\`\`\`json

\`\`\`

\#### plan — Agent 执行计划

\`\`\`json

\`\`\`

\#### user\_message\_chunk — 用户消息回显

\`\`\`json

\`\`\`

\### 10.7 SSE 重连机制

支持 \*\*5 分钟内\*\*的快速重连，无需重新初始化。

1\. SSE 断开后，客户端携带原 \`\` 和 \`\` 重新 \`\`

2\. 服务端从 \`\` 开始推送后续消息

\`\`\`

\`\`\`

\> 超过 5 分钟需重新建立连接并执行完整初始化流程。

\### 10.8 完整交互时序

\*\*新会话\*\*：

\`\`\`

\`\`\`

\*\*恢复会话\*\*：

\`\`\`

\`\`\`

\---

\## 11. Webhook 事件回调

如需接收 Agent 执行过程中的事件通知，可在 Manifest 中配置 Webhook URL。

\### 支持的事件类型

| 事件 | 说明 | Session 状态 |

|------|------|-------------|

| \`\` | 工具执行前 | Working |

| \`\` | 工具成功执行后 | Working |

| \`\` | 工具执行失败 | Failed |

| \`\` | 用户提交消息 | Working |

| \`\` | 会话开始 | Working |

| \`\` | 会话结束 | Completed |

| \`\` | Agent 停止 | Completed |

| \`\` | 子 Agent 开始 | Working |

| \`\` | 子 Agent 停止 | Working |

| \`\` | 权限请求 / 超时提醒 | Pending |

| \`\` | 权限请求 | Pending |

| \`\` | 用户取消 | Completed |

\### 消息格式

\`\`\`json

\`\`\`

\### 请求头

| 头部 | 说明 |

|------|------|

| \`\` | \`\` |

| \`\` | Runtime ID |

| \`\` | Unix 时间戳（秒） |

| \`\` | HMAC-SHA256 签名 |

\### 签名验证

算法：\`\`

\`\`\`python

\`\`\`

\### 重试机制

\- 失败消息持久化到本地文件

\- 指数退避：1s → 2s → 4s → 8s → 16s

\- 最大重试 5 次，超时 30 秒

\---

\## 12. Agent Manifest 配置

Manifest 是 Agent 的声明式配置，在创建 Runtime 或 Session 时通过 \`\` 字段传入。

\### 最小配置

\`\`\`json

\`\`\`

\### 完整配置示例

\`\`\`json

\`\`\`

\### 配置项说明

\#### 基础配置

| 字段 | 类型 | 必需 | 说明 |

|------|------|------|------|

| \`\` | string | ✅ | Agent 唯一标识符 |

| \`\` | string | ✅ | Agent 显示名称 |

| \`\` | string | ✅ | Manifest 版本（当前 \`\`） |

| \`\` | string | ❌ | 系统提示词（与 \`\` 互斥） |

| \`\` | string | ❌ | 系统提示词文件 URL |

\#### 能力配置

| 字段 | 类型 | 说明 |

|------|------|------|

| \`\` | Rule\[\] | 行为规则文件列表 |

| \`\` | Skill\[\] | 预定义技能（\`\`, \`\` 等） |

| \`\` | Plugin\[\] | 扩展插件 |

| \`\` | MCPConfig\[\] | MCP 服务配置 |

| \`\` | Subagent\[\] | 可调用的子 Agent |

\#### 工作空间配置

| 字段 | 类型 | 必需 | 说明 |

|------|------|------|------|

| \`\` | string | ✅ | 工作空间名（映射到 \`\`） |

| \`\` | string | ❌ | Git 仓库 URL |

| \`\` | string | ❌ | 源码包 URL |

| \`\` | string | ❌ | Git 分支 / 标签 / Commit SHA |

| \`\` | string | ❌ | 初始化 Shell 命令 |

| \`\` | string | ❌ | CodeBuddy 初始化命令 |

\#### 环境配置

| 字段 | 类型 | 说明 |

|------|------|------|

| \`\` | Secret\[\] | 敏感信息（通过安全通道注入，不写入沙箱文件） |

| \`\` | EnvVar\[\] | 环境变量（写入 manifest 并同步到运行环境） |

\> \*\*安全提示\*\*：\`\` 支持 \`\` 引用环境变量，避免硬编码密钥。系统会自动注入 \`\` 环境变量。

\---

\## 附录：错误码汇总

\### 控制面 HTTP 状态码与错误码

| HTTP 状态码 | 错误码 | 说明 |

|-------------|--------|------|

| 400 | 10001 | 请求参数错误 |

| 403 | 10085 | 权限不足 |

| 404 | 10084 | 资源不存在 |

| 409 | 10002 | 资源冲突 |

| 500 | 10000 | 服务器内部错误 |

\### ACP HTTP 状态码

| 状态码 | 说明 |

|--------|------|

| 200 | 成功（GET SSE / POST prompt SSE / DELETE） |

| 202 | 消息已接受，响应通过 GET SSE 推送 |

| 400 | 缺少必需头部 |

| 404 | 连接不存在 |

| 406 | Accept 头不满足要求 |

| 409 | 并发 prompt 冲突 |

| 415 | Content-Type 不支持 |

| 503 | 达到最大连接数 |

\### ACP JSON-RPC 错误码

| 错误码 | 说明 |

|--------|------|

| -32000 | 通用服务器错误 |

| -32001 | 连接不存在 |

| -32602 | Session 不存在 |

\---

\## 注意事项

1\. \*\*Token 过期\*\*：ACP Link 的 Token 有过期时间，过期后需重新调用 \`\` 获取

2\. \*\*并发限制\*\*：同一 Session 同一时间只能有一个 \`\` 在执行

3\. \*\*Webhook 配置\*\*：如需接收 Agent 事件回调，在 Manifest 中配置 Webhook URL 和 Secret

4\. \*\*SSE 重连窗口\*\*：ACP SSE 断开后 5 分钟内可快速重连，超时需完整重新初始化

\---

\## FAQ

\### Q1: 创建 Runtime 报错 \`\`

\*\*错误示例\*\*：

\`\`\`json

\`\`\`

\*\*原因\*\*：Agent 运行需要 \`\` 来调用 LLM 服务，但 Manifest 中未提供该密钥。

\*\*解决方法\*\*：

1\. 前往 \[https://www.codebuddy.cn/profile/keys\](https://www.codebuddy.cn/profile/keys) 创建一个 API Key

2\. 在创建 Runtime 时，将其放入 Manifest 的 \`\` 中：

\`\`\`json

\`\`\`

\### Q2: 如何创建 Runtime 沙箱模板？没有看到相关 API

沙箱模板的制作流程如下：

1\. \*\*先创建一个普通 Runtime\*\*，获得其沙箱 ID（\`\`）

2\. \*\*通过 ACP 连接沙箱 指挥 Agent 安装所需环境\*\*（如安装依赖、配置工具链等）

3\. \*\*将该沙箱 ID 作为模板\*\*：后续创建新 Runtime 时，在 \`\` 中传入该沙箱 ID，新 Runtime 会基于此模板创建，自带已安装好的环境

\`\`\`json

\`\`\`

\> \*\*提示\*\*：如果需要对模板进行预热（加速后续创建速度），请联系我们提供沙箱 ID，由平台侧进行预热配置。

\### Q3: 如何切换 Agent 使用的模型？

创建 Runtime 并通过 ACP 协议完成 \`\` 和 \`\` 后，可以通过 \`\` 方法切换模型。

可用的模型列表在 \`\` 响应的 \`\` 中返回。选择目标 \`\` 后发送：

\`\`\`json

\`\`\`

切换成功返回 \`\`。该方法可以在 Session 空闲或执行中随时调用。

\### Q4: 内网沙箱和外网沙箱如何创建？分别有什么访问限制？

沙箱类型由登录身份自动决定：通过内网（iOA）登录的用户创建 Runtime 时自动分配内网沙箱，通过公网登录的用户自动分配外网沙箱，无法手动指定。

两者的网络访问能力不同：

| 类型 | 部署环境 | 网络能力 |

|------|----------|----------|

| 内网沙箱 | Dev 环境 | 可访问内网（Dev 网络、内部 API 等）及公司安全策略允许的外网 |

| 外网沙箱 | 云 IDC | 仅可访问外网 |

\### Q5: Runtime 的生命周期是怎样的？什么时候会休眠？如何唤醒？

Runtime 沙箱具有自动管理的生命周期，状态流转如下：

\`\`\`

\`\`\`

\*\*各阶段说明：\*\*

| 阶段 | 行为 |

|------|------|

| \*\*首次运行\*\* | 创建 Runtime 后，沙箱保持运行状态最长 \*\*2 小时\*\* |

| \*\*自动休眠\*\* | 首次运行窗口结束后，若超过 \*\*10 分钟\*\*无任何数据面访问，沙箱自动进入休眠状态（释放计算资源，磁盘数据保留） |

| \*\*自动唤醒\*\* | 沙箱休眠后，任何对数据面接口的请求（如 ACP 协议调用、文件操作等）都会\*\*自动唤醒\*\*沙箱，无需手动干预 |

| \*\*数据持久化\*\* | 休眠和唤醒过程中，沙箱内的文件系统数据\*\*不会丢失\*\* |

\> \*\*注意\*\*：

\> - 控制面接口（如 \`\`）\*\*不会\*\*触发自动唤醒，仅数据面接口会触发。

\> - 自动唤醒可能需要数秒启动时间，首次请求的响应延迟会略高。

\> - 如需长时间保持沙箱运行，建议定期发送心跳请求（如周期性调用 ACP 接口）以避免休眠。

\### Q6: API Key 支持团队版/企业版吗？企业版是否支持海外模型？

支持。推荐通过\*\*内领方式下单旗舰版\*\*获取 API Key）。但官方不支持海外模型，如需要使用，只能通过配置自定义模型方法解决

\### Q7：创建 Runtime 报错，调用沙箱接口失败

如出现类似报错信息，可以检查下请求体中的 agentManifest 结构中是否包含必填字段：agentManifest 下的字段 id、name、manifestVersion 是必填字段。

\`\`\`

\`\`\`

\### Q8: 如何进入沙箱

\#### CS沙箱

\*\*region\*\* 从 runtime接口响应 data.links.sandboxLink.dataPlaneEndpoint 中解析获取

!\[Clipboard\_Screenshot\_1776254943.png\](/tencent/api/attachments/s3/url?attachmentid=43732604)

\#### AGS沙箱（灰度中）

https://doc.weixin.qq.com/doc/w3\_AScASQa7AL0CN8cTuKlAhQiWwhy1m?scode=AJEAIQdfAAoQspN2gTAScASQa7AL0

\### Q9: Workspace 私有仓库如何设置 GIT 凭据

workspace repository 私有仓库如何设置 GIT 凭据，以下示例以 cnb.cool 为参考，其他平台请按字段替换值。

\`\`\`

\`\`\`

\### Q10: 如何自定义业务模型

在用户级目录下创建下面文件：

\`\`\`

\`\`\`

配置内容如下：

\`\`\`

\`\`\`

重启/新建服务后即可看到新增的模型。

完整文档可以参考：https://www.codebuddy.cn/docs/cli/models

\### Q11: 是否有sdk可以使用

\#### go sdk

https://git.woa.com/cloudstudio/sandbox/golang-e2b-sdk

\#### js sdk

https://e2b.dev/docs/sdk-reference/js-sdk/v2.14.1/sandbox

\#### py sdk

https://e2b.dev/docs/sdk-reference/python-sdk/v2.14.1/exceptions

\### Q12: 沙箱环境说明

\#### 公网沙箱集群

使用微信/手机号登录的用户api-key，沙箱将会创建在公网（无法访问司内资源）

\#### 司内沙箱集群

使用ioa登录的用户api-key，沙箱将会创建在devcloud集群，可访问工蜂、cnb等内网资源，但是与idc网络隔离

\#### IDC沙箱集群

创建runtime接口携带有 \*\*X-Sandbox-Cluster-Id=ags-prod-idc\*\* 时，沙箱会创建在idc集群，但是与devcloud网络隔离

## 目录

- [1\. 概述](#1-%E6%A6%82%E8%BF%B0)
- [2\. 核心概念](#2-%E6%A0%B8%E5%BF%83%E6%A6%82%E5%BF%B5)
- [3\. 认证与通用格式](#3-%E8%AE%A4%E8%AF%81%E4%B8%8E%E9%80%9A%E7%94%A8%E6%A0%BC%E5%BC%8F)
- [4\. 快速开始](#4-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
- [5\. 控制面 API — Runtime 管理](#5-%E6%8E%A7%E5%88%B6%E9%9D%A2-api--runtime-%E7%AE%A1%E7%90%86)
- [6\. 控制面 API — Session 管理](#6-%E6%8E%A7%E5%88%B6%E9%9D%A2-api--session-%E7%AE%A1%E7%90%86)
- [7\. 控制面 API — Checkpoint 快照管理](#7-%E6%8E%A7%E5%88%B6%E9%9D%A2-api--checkpoint-%E5%BF%AB%E7%85%A7%E7%AE%A1%E7%90%86)
- [8\. 控制面 API — Version 版本管理](#8-%E6%8E%A7%E5%88%B6%E9%9D%A2-api--version-%E7%89%88%E6%9C%AC%E7%AE%A1%E7%90%86)
- [9\. 控制面 API — Artifact Release 产物发布](#9-%E6%8E%A7%E5%88%B6%E9%9D%A2-api--artifact-release-%E4%BA%A7%E7%89%A9%E5%8F%91%E5%B8%83)
- [10\. 数据面 — ACP 协议](#10-%E6%95%B0%E6%8D%AE%E9%9D%A2--acp-%E5%8D%8F%E8%AE%AE)
- [11\. Webhook 事件回调](#11-webhook-%E4%BA%8B%E4%BB%B6%E5%9B%9E%E8%B0%83)
- [12\. Agent Manifest 配置](#12-agent-manifest-%E9%85%8D%E7%BD%AE)
- [附录：错误码汇总](#%E9%99%84%E5%BD%95%E9%94%99%E8%AF%AF%E7%A0%81%E6%B1%87%E6%80%BB)

---

## 1\. 概述

### 什么是 CloudAgent？

CloudAgent（内部代号 AgentOS）是一个 **云端 AI Agent 运行平台** ，为开发者提供完整的 Agent 生命周期管理能力：

- **创建和管理 Agent 运行环境 (Runtime)** ：每个 Runtime 是一个独立的云端沙箱实例，包含完整的文件系统和终端环境
- **与 Agent 进行实时对话** ：通过 ACP 协议发送指令，接收 Agent 的流式输出和工具调用结果
- **管理版本和快照** ：创建 Checkpoint 和 Version，支持随时回滚到历史状态
- **发布部署产物** ：将 Agent 在沙箱中构建的 Web 应用或静态资源发布到公网

### 架构概览

CloudAgent 采用 **控制面与数据面分离** 的架构：

```javascript
┌─────────────────────────────────────────────────────────────┐

│                       你的应用 (Client)                      │

└────────┬──────────────────┬──────────────────┬──────────────┘

         │ REST API          │ ACP (SSE)        │ E2B SDK

         │ (管理操作)         │ (Agent 对话)     │ (文件/终端)

         ▼                  ▼                  ▼

┌─────────────────┐  ┌─────────────┐  ┌──────────────────┐

│    AgentOS      │  │ Box Service │  │   E2B Sandbox    │

│   (控制面)       │  │  (数据面)    │  │   (数据面)        │

│                 │  │  端口 65222  │  │                  │

│ • Runtime 管理   │  │ • ACP 协议   │  │ • 文件系统        │

│ • Session 管理   │  │ • 流式输出   │  │ • 终端命令        │

│ • 版本管理       │  │ • Tool 调用  │  │ • 进程管理        │

│ • 发布管理       │  │ • Webhook   │  │                  │

└─────────────────┘  └─────────────┘  └──────────────────┘
```

| 层级 | 组件 | 职责 | 接入方式 |
| --- | --- | --- | --- |
| **控制面** | AgentOS API | Runtime Session Version / 发布管理 | REST API |
| **数据面** | Box Service | Agent 对话、流式输出、工具调用 | ACP 协议 (HTTP + SSE) |
| **数据面** | E2B Sandbox | 文件系统操作、终端命令执行 | E2B SDK |

---

## 2\. 核心概念

### Runtime

Runtime 是 CloudAgent 的核心资源，代表一个 **独立的 Agent 运行环境** 。每个 Runtime 包含：

- 一个云端沙箱实例（完整的 Linux 文件系统和终端）
- Agent 的配置信息（Manifest）
- 一个或多个 Session（对话会话）

创建 Runtime 时会 **自动创建一个初始 Session** 。

**状态枚举** ：

| 状态 | 说明 |
| --- | --- |
| `CREATING` | 创建中（沙箱初始化） |
| `RUNNING` | 运行中（可正常使用） |
| `PRE-STOPPED` | 即将停止 |
| `STOPPED` | 已停止 |
| `FAILED` | 创建失败 |

### Session

Session 代表一个 **对话会话** 。一个 Runtime 下可以有多个 Session，每个 Session 维护独立的对话历史和 Agent 上下文。

### Checkpoint 与 Version

- **Checkpoint（快照）** ：沙箱环境在某一时刻的完整备份，支持恢复
- **Version（版本）** ：基于 Checkpoint 创建的命名版本，便于管理和回滚

### Agent Manifest

Manifest 是 Agent 的声明式配置文件（JSON），定义 Agent 的身份、能力、工作空间和运行环境。详见 [第 12 节](#12-agent-manifest-%E9%85%8D%E7%BD%AE) 。

---

## 3\. 认证与通用格式

### 认证方式

控制面 API 使用 **API Key** 认证。请先前往 [https://www.codebuddy.cn/profile/keys](https://www.codebuddy.cn/profile/keys) 创建 API 密钥，然后在请求头中携带：

```javascript
x-api-key: <YOUR_API_KEY>
```

支持的扩展认证头（多租户场景）：

| 请求头 | 说明 |
| --- | --- |
| `X-User-Id` | 用户 ID |
| `X-Source-App` | 来源应用名 |
| `X-Source-Tenant-Id` | 租户 ID |

### 统一响应格式

所有控制面 API 响应使用统一的 JSON 外壳：

**成功** ：

```json
{

  "code": 0,

  "msg": "OK",

  "requestId": "550e8400-e29b-41d4-a716-446655440000",

  "data": { /* 业务数据 */ }

}
```

**错误** ：

```json
{

  "code": 10001,

  "msg": "invalid runtime ID",

  "requestId": "550e8400-e29b-41d4-a716-446655440000"

}
```

### 分页参数

列表类接口支持统一分页参数：

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `page` | integer | 1 | 页码（从 1 开始） |
| `pageSize` | integer | 20 | 每页数量（最大 100） |

分页响应格式：

```json
{

  "items": [...],

  "pagination": {

    "page": 1,

    "pageSize": 20,

    "total": 100,

    "totalPages": 5

  }

}
```

---

## 4\. 快速开始

### 接入流程总览

```javascript
1. 创建 Runtime          →  获得 runtimeId 和 ACP 连接信息

2. 等待 Runtime 就绪      →  轮询状态直到 RUNNING

3. 建立 ACP 连接         →  GET /acp 获取 SSE 通知流

4. 初始化 ACP 协议       →  POST /acp 发送 initialize

5. 创建/加载 Session     →  POST /acp 发送 session/new

6. 发送 Prompt 并接收流   →  POST /acp 发送 session/prompt，通过 SSE 接收输出

7. （可选）管理版本       →  通过 REST API 创建 Checkpoint / Version

8. （可选）发布部署       →  通过 REST API 发布 Web 应用或静态资源
```

### 步骤 1：创建 Runtime

注意：请求需要带上请求头 X-Source-App，传入 sourceApp 类型，如不传，默认为 default-app

```bash
curl -X POST "https://www.codebuddy.cn/v2/agentos/runtimes" \ 

  -H "x-api-key: <YOUR_API_KEY>" \ 

  -H "X-Source-App: <YOUR_SOURCE_APP>" \ 

  -H "Content-Type: application/json" \ 

  -d '{

    "runtimeName": "my-first-agent",

    "agentManifest": {

      "id": "my-agent",

      "name": "My Agent",

      "manifestVersion": "1.0",

      "system_prompt": "You are a helpful coding assistant."

    }

  }'
```

**响应** ：

```json
{

  "code": 0,

  "msg": "OK",

  "requestId": "550e8400-e29b-41d4-a716-446655440000",

  "data": {

    "id": 1234567890123456789,

    "runtimeName": "my-first-agent",

    "status": "CREATING",

    "links": {

      "acpLink": {

        "url": "https://8080-sandbox123.example.com/acp",

        "token": "eyJhbGciOiJIUzI1NiIs...",

        "tokenExpiresAt": 1738051200

      }

    },

    "sessions": [

      { "sessionId": "1234567890123456789", "sessionStatus": "ACTIVE" }

    ]

  }

}
```

### 步骤 2：等待 Runtime 就绪

轮询 `GET https://www.codebuddy.cn/v2/agentos/runtimes/{runtimeId}` ，直到 `status` 变为 `RUNNING` 。

### 步骤 3-6：通过 ACP 协议与 Agent 交互

获取 `acpLink.url` 和 `acpLink.token` 后，按照 [第 10 节 ACP 协议](#10-%E6%95%B0%E6%8D%AE%E9%9D%A2--acp-%E5%8D%8F%E8%AE%AE) 建立连接并对话。

### 典型应用场景

**场景 1：自定义 AI 编程助手**

1. 创建 Runtime，配置 `system_prompt` 和 `workspaces` → 2. ACP 发送编码任务 → 3. Agent 自动编写代码并执行 → 4. 创建 Version 保存成果

**场景 2：CI/CD 中的 AI 代码审查**

1. API 创建 Runtime 并拉取代码 → 2. 发送审查 Prompt → 3. 获取结果 → 4. 删除 Runtime 释放资源

**场景 3：构建并发布 Web 应用**

1. 创建 Runtime → 2. ACP 指导 Agent 开发 → 3. Artifact Release API 发布到公网 → 4. 获取域名

---

## 5\. 控制面 API — Runtime 管理

> **Base URL**: `https://www.codebuddy.cn/v2/agentos`

### POST /runtimes — 创建 Runtime

注意：请求需要带上请求头 X-Source-App，传入 sourceApp 类型，如不传，默认为 default-app

**请求体** ：

```json
{

  "runtimeName": "my-project",

  "visibility": "PRIVATE",

  "sandboxTemplateId": "template-123",

  "sandboxSpec": { "cpu": "2", "memory": "4Gi" },

  "agentManifest": {

    "id": "my-agent",

    "name": "My Agent",

    "manifestVersion": "1.0",

    "system_prompt": "You are a helpful assistant."

  },

  "metadata": { "source_tenant": "tenant-001" }

}
```

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `runtimeName` | string | ✅ | Runtime 名称 |
| `visibility` | string | ❌ | `PRIVATE` （默认）或 `PUBLIC` |
| `sandboxTemplateId` | string | ❌ | 沙箱模板 ID |
| `sandboxSpec` | object | ❌ | 沙箱规格（cpu, memory） |
| `agentManifest` | object | ❌ | Agent 配置（详见 [第 12 节](#12-agent-manifest-%E9%85%8D%E7%BD%AE) ），如果传值，id、name、manifestVersion 几个是必填字段。 |
| `metadata` | object | ❌ | 自定义元数据（key-value） |

**响应** `201` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "id": 1234567890123456789,

    "runtimeName": "my-project",

    "status": "CREATING",

    "links": {

      "acpLink": {

        "url": "https://8080-sandbox123.example.com/acp",

        "token": "eyJhbGciOiJIUzI1NiIs...",

        "tokenExpiresAt": 1738051200

      },

      "sandboxLink": {

        "endpoint": "https://baseurl.com/agentos/links/runtimes/123",

        "sandboxId": "sandbox-123"

      }

    },

    "sessions": [

      { "sessionId": "1234567890123456789", "sessionStatus": "ACTIVE" }

    ],

    "createdAt": "2026-01-23T10:00:00Z",

    "updatedAt": "2026-01-23T10:00:00Z"

  }

}
```

### GET /runtimes — 列出 Runtime

注意：请求需要带上请求头 X-Source-App，传入 sourceApp 类型，如不传，默认为 default-app，default-app 类型的 runtime，该接口无法直接查询出来。

分页查询当前用户的 Runtime 列表。支持 `metadata.*` 过滤，如 `?metadata.source_tenant=tenant-001` 。

### GET /runtimes/{runtimeId} — 获取 Runtime 详情

响应格式同创建 Runtime。

### POST /runtimes/{runtimeId}/update — 更新 Runtime

**请求体** ：

```json
{

  "runtimeName": "updated-name",

  "visibility": "PUBLIC",

  "metadata": { "source_tenant": "tenant-002" }

}
```

所有字段可选，仅更新提供的字段。

**响应** `200` ：响应格式同创建 Runtime（返回更新后的完整 Runtime 对象）。

### POST /runtimes/{runtimeId}/delete — 删除 Runtime

软删除，删除后无法恢复。

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "code": "SUCCESS",

    "message": "Agent deleted successfully",

    "details": "Agent with ID 1234567890123456789 has been soft deleted",

    "runtimeId": 1234567890123456789

  }

}
```

### POST /runtimes/{runtimeId}/fork — Fork Runtime

从现有 Runtime 复制创建新的 Runtime 和 Session。

- `PUBLIC` Runtime：任意用户可 Fork
- `PRIVATE` Runtime：仅同 `source_app` 可 Fork

**请求体** ：

```json
{

  "runtimeName": "forked-project",

  "metadata": { "forked_from": "original-id" },

  "agentManifest": {

    "id": "my-agent",

    "name": "My Agent",

    "manifestVersion": "1.0",

    "secrets": [{ "key": "API_KEY", "value": "new-key" }]

  }

}
```

**响应** `201` ：响应格式同创建 Runtime（返回新 Runtime 的完整信息）。

### GET /runtimes/by-domain — 通过域名查询 Runtime

通过发布域名反查 Runtime 信息。无需 owner 权限。

**查询参数** ： `domain` （必填）

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "sandboxID": "sandbox-xxx",

    "appID": "app-xxx",

    "domain": "abc.example.com",

    "runtimeID": "123456"

  }

}
```

---

## 6\. 控制面 API — Session 管理

### POST /runtimes/{runtimeId}/sessions — 创建 Session

**请求体** ：

```json
{

  "sessionId": "my-session-001",

  "sessionName": "Feature development",

  "agentManifest": {

    "id": "my-agent",

    "name": "My Agent",

    "manifestVersion": "1.0",

    "system_prompt": "Focus on React development.",

    "secrets": [

      { "key": "CODEBUDDY_API_KEY", "value": "ck_xxx..." }

    ]

  }

}
```

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `sessionId` | string | ✅ | 会话 ID |
| `sessionName` | string | ❌ | 会话名称 |
| `agentManifest` | object | ❌ | Agent 配置（与 Runtime 级别配置合并），如果传值， `id` 、 `name` 、 `manifestVersion` 是必填字段。 `secrets` 数组用于传递敏感信息（如 `CODEBUDDY_API_KEY` ），这些值不会写入沙箱文件，而是通过环境变量/metadata 注入沙箱。 |

**响应** `201` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "runtimeId": 1234567890123456789,

    "sessionId": "my-session-001",

    "sessionName": "Feature development",

    "sessionStatus": "ACTIVE",

    "lastActivityAt": "2026-01-23T10:00:00Z",

    "createdAt": "2026-01-23T10:00:00Z",

    "updatedAt": "2026-01-23T10:00:00Z"

  }

}
```

### GET /runtimes/{runtimeId}/sessions — 列出 Session

支持 `session_status` 过滤： `ACTIVE`, `IDLE`, `TERMINATED` 。

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "items": [

      {

        "sessionId": "my-session-001",

        "sessionName": "Feature development",

        "sessionStatus": "ACTIVE",

        "createdAt": "2026-01-23T10:00:00Z",

        "updatedAt": "2026-01-23T10:00:00Z"

      }

    ],

    "pagination": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 }

  }

}
```

### GET /runtimes/{runtimeId}/sessions/{sessionId} — 获取 Session 详情

**响应** `200` ：响应格式同创建 Session。

### POST /runtimes/{runtimeId}/sessions/{sessionId}/update — 更新 Session

**请求体** ：

```json
{

  "sessionName": "Updated session name",

  "agentManifest": {

    "id": "my-agent",

    "name": "My Agent",

    "manifestVersion": "1.0",

    "system_prompt": "Updated prompt."

  }

}
```

所有字段可选，仅更新提供的字段。

**响应** `200` ：响应格式同创建 Session（返回更新后的完整 Session 对象）。

### POST /runtimes/{runtimeId}/sessions/{sessionId}/delete — 删除 Session

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "code": "SUCCESS",

    "message": "Session deleted successfully",

    "details": "Session my-session-001 of Runtime 1234567890123456789 has been soft deleted",

    "runtimeId": 1234567890123456789,

    "sessionId": "my-session-001"

  }

}
```

---

## 7\. 控制面 API — Checkpoint 快照管理

### POST /runtimes/{runtimeId}/checkpoints — 创建 Checkpoint

```json
{ "description": "完成功能开发" }
```

**响应** `201` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "runtimeId": 1234567890123456789,

    "checkpointId": 1,

    "checkpointType": "MANUAL_CHECKPOINT",

    "description": "完成功能开发",

    "status": "AVAILABLE",

    "createdAt": "2026-01-23T14:00:00Z"

  }

}
```

**Checkpoint 类型** ：

| 类型 | 说明 |
| --- | --- |
| `SESSION_START` | Session 开始时自动创建 |
| `MANUAL_CHECKPOINT` | 手动创建 |
| `MANUAL_VERSION` | 创建 Version 时自动创建 |
| `BACKUP` | 发布部署前自动备份 |

### GET /runtimes/{runtimeId}/checkpoints — 列出 Checkpoint

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "items": [

      {

        "runtimeId": 1234567890123456789,

        "checkpointId": 1,

        "checkpointType": "MANUAL_CHECKPOINT",

        "description": "完成功能开发",

        "status": "AVAILABLE",

        "createdAt": "2026-01-23T14:00:00Z"

      }

    ],

    "pagination": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 }

  }

}
```

### GET /runtimes/{runtimeId}/checkpoints/{checkpointId} — 获取详情

**响应** `200` ：响应格式同创建 Checkpoint。

### POST /runtimes/{runtimeId}/checkpoints/{checkpointId}/update — 更新描述

**请求体** ：

```json
{ "description": "更新后的描述" }
```

**响应** `200` ：响应格式同创建 Checkpoint（返回更新后的完整 Checkpoint 对象）。

### POST /runtimes/{runtimeId}/checkpoints/{checkpointId}/delete — 删除

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "code": "SUCCESS",

    "message": "Checkpoint deleted successfully",

    "details": "Checkpoint 1 of Agent 1234567890123456789 has been soft deleted",

    "runtimeId": 1234567890123456789,

    "checkpointId": 1

  }

}
```

### POST /runtimes/{runtimeId}/checkpoints/{checkpointId}/restore — 恢复

从快照恢复 Agent 运行环境。可选传入 `description` 记录恢复原因。

**响应** ：

```json
{

  "data": {

    "code": "SUCCESS",

    "runtimeId": 1234567890123456789,

    "targetCheckpointId": 5,

    "targetVersionId": 3,

    "restoredAt": "2026-01-23T15:30:00Z"

  }

}
```

---

## 8\. 控制面 API — Version 版本管理

Version 是 **带名称的 Checkpoint** ，便于管理和回滚。

### POST /runtimes/{runtimeId}/versions — 创建 Version

基于当前 Checkpoint 创建命名版本。

```json
{ "description": "v1.0.0 - Initial release" }
```

**响应** `201` ：

```json
{

  "data": {

    "runtimeId": 1234567890123456789,

    "versionId": 1,

    "checkpointId": 3,

    "description": "v1.0.0 - Initial release",

    "status": "AVAILABLE",

    "createdAt": "2026-01-23T14:00:00Z"

  }

}
```

### GET /runtimes/{runtimeId}/versions — 列出 Version

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "items": [

      {

        "runtimeId": 1234567890123456789,

        "versionId": 1,

        "checkpointId": 3,

        "description": "v1.0.0 - Initial release",

        "status": "AVAILABLE",

        "createdAt": "2026-01-23T14:00:00Z",

        "updatedAt": "2026-01-23T14:00:00Z"

      }

    ],

    "pagination": { "page": 1, "pageSize": 20, "total": 1, "totalPages": 1 }

  }

}
```

### GET /runtimes/{runtimeId}/versions/{versionId} — 获取详情

**响应** `200` ：响应格式同创建 Version。

### POST /runtimes/{runtimeId}/versions/{versionId}/update — 更新描述

**请求体** ：

```json
{ "description": "v1.0.1 - Bug fix" }
```

**响应** `200` ：响应格式同创建 Version（返回更新后的完整 Version 对象）。

### POST /runtimes/{runtimeId}/versions/{versionId}/delete — 删除

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "code": "SUCCESS",

    "message": "Version deleted successfully",

    "details": "Version 1 of Agent 1234567890123456789 has been soft deleted",

    "runtimeId": 1234567890123456789,

    "versionId": 1

  }

}
```

### POST /runtimes/{runtimeId}/versions/{versionId}/restore — 恢复到版本

**响应** ：

```json
{

  "data": {

    "code": "SUCCESS",

    "runtimeId": 1234567890123456789,

    "targetCheckpointId": 8,

    "targetVersionId": 5,

    "restoredAt": "2026-01-23T15:30:00Z"

  }

}
```

---

## 9\. 控制面 API — Artifact Release 产物发布

### 注意

- web 发布目前仅支持cs沙箱，AGS沙箱暂不支持

### 前置准备

#### 1、web发布前须添加自启动项，可参考一下配置

vim /workspace/.cloudstudio

```javascript
[[app]]

name = "backend"

cmd = "cd backend && npm audit fix && npm install --production=false && npm run dev"

autoRun = true

port = 5173
```

将 Runtime 中构建的应用发布到公网。

### POST /artifact-releases — 创建发布

```json
{

  "runtimeId": 1234567890123456789,

  "artifactType": "web",

  "releaseConfig": {

    "port": 8080,

    "replicas": 1,

    "expire": 86400,

    "probe": {

      "type": "HTTPGet",

      "httpGet": { "Port": 8080, "Path": "/health" },

      "initialDelaySeconds": 10,

      "periodSeconds": 30

    }

  },

  "envMetadata": { "env": { "NODE_ENV": "production" } }

}
```

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `runtimeId` | integer (int64) | ✅ | 关联的 Runtime ID |
| `artifactType` | string | ❌ | `web` （默认）或 `static` |
| `releaseConfig` | object | ❌ | 发布配置 |
| `envMetadata` | object | ❌ | 环境变量和密钥 |

**Web 类型 releaseConfig** ：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `port` | integer | ✅ | 应用端口（1-65535） |
| `replicas` | integer | ❌ | 副本数（默认 1） |
| `expire` | integer | ❌ | 过期时间秒（默认 86400） |
| `probe` | object | ❌ | 健康探针 |
| `appName` | string | ❌ | 应用名（可用于域名） |
| `useAppNameAsDomain` | boolean | ❌ | 使用 appName 作为域名前缀 |

**Static 类型 releaseConfig** ：

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `sourcePath` | string | ❌ | 源路径（默认 `/workspace/artifacts` ） |
| `fileName` | string | ❌ | 指定文件名（空则上传整个目录） |
| `index` | string | ❌ | CDN 入口文件（如 `index.html` ） |

**响应** `201` ：

```json
{

  "data": {

    "releaseId": 1234567890123456789,

    "runtimeId": 1234567890123456789,

    "artifactType": "web",

    "status": "AVAILABLE",

    "releaseUrl": "https://example.com/app",

    "domains": {

      "friendlyDomains": ["app.friendly.com"],

      "uuidDomains": ["abc123.uuid.com"]

    },

    "createdAt": "2026-01-24T14:00:00Z"

  }

}
```

### GET /artifact-releases — 列出发布记录

查询参数： `runtimeId` （必填）、 `artifactType` （可选）、 `page` 、 `pageSize` 。

### POST /artifact-releases/{releaseId}/cancel — 取消发布

**响应** `200` ：

```json
{

  "code": 0, "msg": "OK", "requestId": "...",

  "data": {

    "code": "SUCCESS",

    "message": "Artifact release cancelled successfully",

    "details": "Artifact release 123 has been cancelled",

    "releaseId": 1234567890123456789

  }

}
```

---

## 10\. 数据面 — ACP 协议

ACP (Agent Client Protocol) 用于与 Agent 进行 **实时对话** 。基于 **JSON-RPC 2.0** ，通过 **HTTP + SSE** 传输。

### 10.1 获取 ACP 连接信息

创建或查询 Runtime 后，从响应中提取：

```json
{

  "links": {

    "acpLink": {

      "url": "https://8080-sandbox123.example.com/acp",

      "token": "eyJhbGciOiJIUzI1NiIs...",

      "tokenExpiresAt": 1738051200

    }

  }

}
```

- `url` ：ACP 端点地址
- `token` ：Bearer Token（用于 ACP 请求认证）
- `tokenExpiresAt` ：Token 过期时间（Unix 秒）

### 10.2 通信模型

ACP 使用 **双 SSE 流** 模型：

```javascript
Client                              Server

  │                                    │

  │── GET /acp ────────────────────►   │  ① 建立通知流（SSE 长连接）

  │◄── Acp-Connection-Id: <uuid> ──   │

  │                                    │

  │── POST /acp ───────────────────►   │  ② 发送 JSON-RPC 请求

  │◄── 202 / SSE 响应 ────────────    │

  │                                    │

  │◄── SSE: session/update ────────   │  ③ 通过 GET SSE 推送实时通知

  │                                    │

  │── DELETE /acp ─────────────────►   │  ④ 关闭连接

  │◄── 200 ────────────────────────   │
```

**关键原则** ：

- **GET SSE** ：接收 `session/update` 通知和非 prompt 请求的响应
- **POST** ：对 `session/prompt` 返回独立 SSE 流；其他请求返回 `202` ，响应通过 GET SSE 推送
- **Connection ID** ：所有消息通过 `Acp-Connection-Id` 头关联到同一连接

### 10.3 HTTP 端点

#### GET /acp — 建立 SSE 连接

**请求头** ：

| 头部 | 必需 | 说明 |
| --- | --- | --- |
| `Accept` | ✅ | 必须包含 `text/event-stream` |
| `Authorization` | ✅ | `Bearer <token>` |
| `Acp-Connection-Id` | ❌ | 重连时携带 |
| `Last-Event-ID` | ❌ | 断点续传偏移量 |

**成功响应** `200` ：

```javascript
Content-Type: text/event-stream

Cache-Control: no-cache, no-transform

Connection: keep-alive

Acp-Connection-Id: <uuid>
```

连接建立后：首先发送 2KB padding 注释 → 每 15 秒心跳 `: heartbeat` → 收到消息时推送 SSE event。

#### POST /acp — 发送消息

**请求头** ：

| 头部 | 必需 | 说明 |
| --- | --- | --- |
| `Acp-Connection-Id` | ✅ | 从 GET 响应获取的连接 ID |
| `Content-Type` | ✅ | `application/json` |
| `Accept` | ✅ | 同时包含 `application/json` 和 `text/event-stream` |
| `Authorization` | ✅ | `Bearer <token>` |

**请求体** ：

```json
{

  "jsonrpc": "2.0",

  "method": "initialize",

  "id": "1",

  "params": {

    "protocolVersion": 1,

    "clientCapabilities": {

      "fs": { "readTextFile": true, "writeTextFile": true },

      "terminal": true

    }

  }

}
```

**响应行为** ：

| 请求类型 | HTTP 响应 | 说明 |
| --- | --- | --- |
| `session/prompt` | `200` + SSE 流 | prompt 响应通过此 SSE 流返回 |
| 其他请求 | `202 Accepted` | 响应通过 GET SSE 推送 |
| 通知（无 id） | `202 Accepted` | 无响应体 |

#### DELETE /acp — 关闭连接

携带 `Acp-Connection-Id` 头，返回 `200` 。

### 10.4 SSE 事件格式

```javascript
id: <offset>

event: message

data: <JSON-RPC message>
```

| 字段 | 说明 |
| --- | --- |
| `id` | 消息偏移量（用于断点续传） |
| `event` | 固定为 `message` |
| `data` | JSON-RPC 2.0 消息（单行 JSON） |

心跳：`: heartbeat`

### 10.5 JSON-RPC 方法

#### initialize — 协议握手

建立连接后 **必须首先发送** 。

**请求** ：

```json
{

  "jsonrpc": "2.0", "method": "initialize", "id": "1",

  "params": {

    "protocolVersion": 1,

    "clientCapabilities": {

      "fs": { "readTextFile": true, "writeTextFile": true },

      "terminal": true

    }

  }

}
```

**响应** （通过 GET SSE）：

```json
{

  "jsonrpc": "2.0", "id": "1",

  "result": {

    "protocolVersion": 1,

    "agentCapabilities": { "loadSession": true },

    "agentInfo": { "name": "codebuddy-code", "version": "1.0.0" }

  }

}
```

#### session/new — 创建新会话

```json
{

  "jsonrpc": "2.0", "method": "session/new", "id": "2",

  "params": { "cwd": "/workspace", "mcpServers": [] }

}
```

| 参数 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `cwd` | string | ✅ | 工作目录（绝对路径） |
| `mcpServers` | array | ✅ | MCP 服务器配置（可为空数组） |

**响应** ：

```json
{

  "result": {

    "sessionId": "550e8400-e29b-41d4-a716-446655440000",

    "modes": {

      "availableModes": [

        { "id": "default", "name": "Default" },

        { "id": "bypassPermissions", "name": "YOLO" }

      ],

      "currentModeId": "default"

    },

    "models": {

      "availableModels": [

        { "modelId": "claude-opus-4", "name": "Claude Opus 4" }

      ],

      "currentModelId": "claude-opus-4"

    }

  }

}
```

#### session/load — 加载已有会话

```json
{

  "jsonrpc": "2.0", "method": "session/load", "id": "3",

  "params": {

    "sessionId": "550e8400-e29b-41d4-a716-446655440000",

    "cwd": "/workspace",

    "mcpServers": []

  }

}
```

**时序** ：服务端先通过 GET SSE 推送所有历史 `session/update` → 推送完毕后返回 `session/load` 响应。

#### session/prompt — 发送用户消息

**响应通过 POST SSE 流返回** 。执行期间，Agent 通过 GET SSE 持续推送 `session/update` 通知。

```json
{

  "jsonrpc": "2.0", "method": "session/prompt", "id": "4",

  "params": {

    "sessionId": "550e8400-e29b-41d4-a716-446655440000",

    "prompt": [

      { "type": "text", "text": "帮我创建一个 React 项目" }

    ]

  }

}
```

**ContentBlock 类型** ：

| type | 说明 | 关键字段 |
| --- | --- | --- |
| `text` | 文本 | `text` |
| `image` | 图片（base64） | `data`, `mimeType` |
| `audio` | 音频（base64） | `data`, `mimeType` |
| `resource_link` | 资源链接 | `uri`, `name` |

**响应** （通过 POST SSE）：

```json
{ "jsonrpc": "2.0", "id": "4", "result": { "stopReason": "end_turn" } }
```

**StopReason** ： `end_turn` （正常完成）、 `max_tokens` 、 `max_turn_requests` 、 `refusal` 、 `cancelled`

#### session/cancel — 取消执行

通知（无 id，无响应）：

```json
{ "jsonrpc": "2.0", "method": "session/cancel", "params": { "sessionId": "..." } }
```

#### session/set\_mode — 切换权限模式

```json
{

  "jsonrpc": "2.0", "method": "session/set_mode", "id": "5",

  "params": { "sessionId": "...", "modeId": "plan" }

}
```

**响应** ： `{}` (空对象)

**可用模式** ：

| modeId | 说明 |
| --- | --- |
| `default` | 标准模式，Agent 执行文件写入、命令执行等操作前需要用户确认 |
| `acceptEdits` | 自动接受文件编辑操作，但执行终端命令仍需用户确认 |
| `bypassPermissions` | 自动批准所有操作（YOLO 模式），无需任何确认 |
| `plan` | 规划模式，Agent 仅生成执行计划而不实际执行操作 |

> **提示** ：可用模式列表也会在 `session/new` 响应的 `modes.availableModes` 中返回。

### 10.6 session/update 通知类型

Agent 执行期间通过 GET SSE 推送：

#### agent\_message\_chunk — Agent 文本输出

```json
{

  "method": "session/update",

  "params": {

    "sessionId": "...",

    "update": {

      "sessionUpdate": "agent_message_chunk",

      "content": { "type": "text", "text": "Let me help you with that." }

    }

  }

}
```

#### agent\_thought\_chunk — Agent 思考过程

```json
{ "update": { "sessionUpdate": "agent_thought_chunk", "content": { "type": "text", "text": "Analyzing..." } } }
```

#### tool\_call — 工具调用开始

```json
{

  "update": {

    "sessionUpdate": "tool_call",

    "toolCallId": "tc_001",

    "title": "Reading file: src/index.ts",

    "kind": "read",

    "status": "in_progress",

    "rawInput": { "filePath": "src/index.ts" }

  }

}
```

| 字段 | 说明 |
| --- | --- |
| `toolCallId` | 工具调用唯一 ID |
| `title` | 可读标题 |
| `kind` | `read`, `edit`, `delete`, `execute`, `search`, `fetch`, `think`, `other` |
| `status` | `pending`, `in_progress`, `completed`, `failed` |
| `rawInput` | 工具输入参数 |

#### tool\_call\_update — 工具调用更新

```json
{

  "update": {

    "sessionUpdate": "tool_call_update",

    "toolCallId": "tc_001",

    "status": "completed",

    "rawOutput": { "content": "file contents here..." }

  }

}
```

#### plan — Agent 执行计划

```json
{

  "update": {

    "sessionUpdate": "plan",

    "entries": [

      { "content": "分析代码结构", "status": "completed", "priority": "high" },

      { "content": "重构函数", "status": "in_progress", "priority": "high" }

    ]

  }

}
```

#### user\_message\_chunk — 用户消息回显

```json
{ "update": { "sessionUpdate": "user_message_chunk", "content": { "type": "text", "text": "Hello" } } }
```

### 10.7 SSE 重连机制

支持 **5 分钟内** 的快速重连，无需重新初始化。

1. SSE 断开后，客户端携带原 `Acp-Connection-Id` 和 `Last-Event-ID` 重新 `GET /acp`
2. 服务端从 `Last-Event-ID + 1` 开始推送后续消息

```javascript
Client                              Server

  │── GET /acp ────────────────────►   │

  │   Acp-Connection-Id: <旧 ID>       │

  │   Last-Event-ID: 42               │

  │◄── SSE: 从 offset 43 恢复 ─────   │
```

> 超过 5 分钟需重新建立连接并执行完整初始化流程。

### 10.8 完整交互时序

**新会话** ：

```javascript
Client                                  Server

  │── 1. GET /acp ───────────────────►    │  建立 SSE 通知流

  │◄── Acp-Connection-Id: abc ─────      │

  │── 2. POST: initialize ──────────►     │  协议握手

  │◄── 202 → SSE(GET): 响应 ───────      │

  │── 3. POST: session/new ─────────►     │  创建会话

  │◄── 202 → SSE(GET): 响应 ───────      │

  │── 4. POST: session/prompt ──────►     │  发送消息

  │◄── SSE(POST): 流式推送 ────────      │

  │◄── SSE(GET): session/update... ──     │  Agent 输出、工具调用

  │◄── SSE(POST): { stopReason } ───     │  执行完毕
```

**恢复会话** ：

```javascript
Client                                  Server

  │── 1. GET /acp ───────────────────►    │

  │── 2. POST: initialize ──────────►     │

  │── 3. POST: session/load ────────►     │

  │◄── SSE(GET): 历史 session/update     │  按 offset 推送历史

  │◄── SSE(GET): session/load 响应 ──     │  历史推送完毕

  │── 4. POST: session/prompt ──────►     │  开始新对话
```

---

## 11\. Webhook 事件回调

如需接收 Agent 执行过程中的事件通知，可在 Manifest 中配置 Webhook URL。

### 支持的事件类型

| 事件 | 说明 | Session 状态 |
| --- | --- | --- |
| `PreToolUse` | 工具执行前 | Working |
| `PostToolUse` | 工具成功执行后 | Working |
| `PostToolUseFailure` | 工具执行失败 | Failed |
| `UserPromptSubmit` | 用户提交消息 | Working |
| `SessionStart` | 会话开始 | Working |
| `SessionEnd` | 会话结束 | Completed |
| `Stop` | Agent 停止 | Completed |
| `SubagentStart` | 子 Agent 开始 | Working |
| `SubagentStop` | 子 Agent 停止 | Working |
| `Notification` | 权限请求 / 超时提醒 | Pending |
| `PermissionRequest` | 权限请求 | Pending |
| `SessionCancel` | 用户取消 | Completed |

### 消息格式

```json
{

  "sessionId": "sess_123",

  "event": "PreToolUse",

  "data": {

    "toolName": "execute_command",

    "toolInput": { "command": "ls -la" }

  }

}
```

### 请求头

| 头部 | 说明 |
| --- | --- |
| `Content-Type` | `application/json` |
| `x-runtime-id` | Runtime ID |
| `x-timestamp` | Unix 时间戳（秒） |
| `x-webhook-signature` | HMAC-SHA256 签名 |

### 签名验证

算法： `HMAC-SHA256(secret, timestamp + "." + requestBody)`

```python
import hmac, hashlib

def verify_webhook(secret, timestamp, body, signature):

    expected = hmac.new(

        secret.encode(),

        f"{timestamp}.{body}".encode(),

        hashlib.sha256

    ).hexdigest()

    return hmac.compare_digest(f"sha256={expected}", signature)
```

### 重试机制

- 失败消息持久化到本地文件
- 指数退避：1s → 2s → 4s → 8s → 16s
- 最大重试 5 次，超时 30 秒

---

## 12\. Agent Manifest 配置

Manifest 是 Agent 的声明式配置，在创建 Runtime 或 Session 时通过 `agentManifest` 字段传入。

### 最小配置

```json
{

  "id": "my-agent",

  "name": "My Agent",

  "manifestVersion": "1.0"

}
```

### 完整配置示例

```json
{

  "id": "default-codebuddy-agent",

  "name": "CodeBuddy Agent",

  "manifestVersion": "1.0",

  "description": "Agent 描述信息",

  "system_prompt": "你是一个专业的 AI 助手...",

  "system_prompt_file": "system-prompt.md",

  "useWorkspaceRoot": true,

  "settings": "settings-key",

  "isolateConfigDir": false,

  "rules": [

    {

      "name": "security-rules",

      "downloadUrl": "https://example.com/rules/security.md",

      "scope": "PROJECT"

    },

    {

      "name": "coding-standards",

      "downloadUrl": "https://example.com/rules/coding.md",

      "scope": "USER"

    }

  ],

  "skills": [

    {

      "name": "web-search",

      "downloadUrl": "https://example.com/skills/web-search.tar.gz",

      "scope": "PROJECT"

    },

    {

      "name": "code-review",

      "downloadUrl": "https://example.com/skills/code-review.tar.gz",

      "scope": "USER"

    }

  ],

  "subagents": [

    {

      "name": "frontend-dev",

      "downloadUrl": "https://example.com/agents/frontend.tar.gz",

      "scope": "PROJECT"

    }

  ],

  "slashCommands": [

    {

      "name": "deploy",

      "downloadUrl": "https://example.com/commands/deploy.tar.gz",

      "scope": "PROJECT"

    }

  ],

  "plugins": [

    {

      "name": "seo-growth-experts",

      "marketplace": "experts",

      "marketplaceUrl": "https://example.com/marketplace/seo",

      "downloadUrl": "https://example.com/plugins/seo.tar.gz"

    }

  ],

  "mcp": [

    {

      "name": "project-mcp",

      "downloadUrl": "https://example.com/mcp/project-mcp.json",

      "scope": "PROJECT"

    },

    {

      "name": "user-mcp",

      "downloadUrl": "https://example.com/mcp/user-mcp.json",

      "scope": "USER"

    }

  ],

  "workspaces": [

    {

      "name": "main-project",

      "localPath": "/workspace/project",

      "repository": "https://github.com/org/repo.git",

      "ref": "main",

      "depth": 1,

      "includeSubmodules": true,

      "downloadUrl": "https://example.com/workspace/project.tar.gz",

      "templatesDownloadUrl": "https://example.com/templates/react.tar.gz",

      "initShellCommand": "npm install && npm run build",

      "initCommand": "初始化项目环境"

    },

    {

      "name": "expert-plugin-download",

      "initShellCommand": "mkdir -p $HOME/.codebuddy/plugins/marketplaces/experts/plugins/seo-growth-experts && curl -sSfL 'https://example.com/bundle.tar.gz' | tar xzf - -C $HOME/.codebuddy/plugins/marketplaces/experts/plugins/seo-growth-experts"

    }

  ],

  "secrets": [

    {

      "key": "API_KEY",

      "value": "sk-xxxxxxxxxxxx"

    },

    {

      "key": "DB_PASSWORD",

      "value": "super-secret"

    }

  ],

  "envs": [

    {

      "key": "X_EXPERT_ID",

      "value": "ContentCreator"

    },

    {

      "key": "X_EXPERT_LOCALE",

      "value": "zh"

    },

    {

      "key": "NODE_ENV",

      "value": "production"

    }

  ]

}
```

### 配置项说明

#### 基础配置

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | Agent 唯一标识符 |
| `name` | string | ✅ | Agent 显示名称 |
| `manifestVersion` | string | ✅ | Manifest 版本（当前 `1.0` ） |
| `system_prompt` | string | ❌ | 系统提示词（与 `system_prompt_file` 互斥） |
| `system_prompt_file` | string | ❌ | 系统提示词文件 URL |

#### 能力配置

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `rules` | Rule\[\] | 行为规则文件列表 |
| `skills` | Skill\[\] | 预定义技能（ `pdf`, `xlsx` 等） |
| `plugins` | Plugin\[\] | 扩展插件 |
| `mcp` | MCPConfig\[\] | MCP 服务配置 |
| `subagents` | Subagent\[\] | 可调用的子 Agent |

#### 工作空间配置

| 字段 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `workspaces[].name` | string | ✅ | 工作空间名（映射到 `/workspace/<name>/` ） |
| `workspaces[].repository` | string | ❌ | Git 仓库 URL |
| `workspaces[].downloadUrl` | string | ❌ | 源码包 URL |
| `workspaces[].ref` | string | ❌ | Git 分支 标签 Commit SHA |
| `workspaces[].initShellCommand` | string | ❌ | 初始化 Shell 命令 |
| `workspaces[].initCommand` | string | ❌ | CodeBuddy 初始化命令 |

#### 环境配置

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `secrets` | Secret\[\] | 敏感信息（通过安全通道注入，不写入沙箱文件） |
| `envs` | EnvVar\[\] | 环境变量（写入 manifest 并同步到运行环境） |

> **安全提示** ： `secrets` 支持 `${VAR_NAME}` 引用环境变量，避免硬编码密钥。系统会自动注入 `AGENTOS_RUNTIME_ID` 环境变量。

---

## 附录：错误码汇总

### 控制面 HTTP 状态码与错误码

| HTTP 状态码 | 错误码 | 说明 |
| --- | --- | --- |
| 400 | 10001 | 请求参数错误 |
| 403 | 10085 | 权限不足 |
| 404 | 10084 | 资源不存在 |
| 409 | 10002 | 资源冲突 |
| 500 | 10000 | 服务器内部错误 |

### ACP HTTP 状态码

| 状态码 | 说明 |
| --- | --- |
| 200 | 成功（GET SSE POST prompt SSE DELETE） |
| 202 | 消息已接受，响应通过 GET SSE 推送 |
| 400 | 缺少必需头部 |
| 404 | 连接不存在 |
| 406 | Accept 头不满足要求 |
| 409 | 并发 prompt 冲突 |
| 415 | Content-Type 不支持 |
| 503 | 达到最大连接数 |

### ACP JSON-RPC 错误码

| 错误码 | 说明 |
| --- | --- |
| \-32000 | 通用服务器错误 |
| \-32001 | 连接不存在 |
| \-32602 | Session 不存在 |

---

## 注意事项

1. **Token 过期** ：ACP Link 的 Token 有过期时间，过期后需重新调用 `GET /runtimes/{id}` 获取
2. **并发限制** ：同一 Session 同一时间只能有一个 `session/prompt` 在执行
3. **Webhook 配置** ：如需接收 Agent 事件回调，在 Manifest 中配置 Webhook URL 和 Secret
4. **SSE 重连窗口** ：ACP SSE 断开后 5 分钟内可快速重连，超时需完整重新初始化

---

## FAQ

### Q1: 创建 Runtime 报错 manifest missing required secret: CODEBUDDY\_API\_KEY

**错误示例** ：

```json
{

  "code": 14225,

  "msg": "failed to create sandbox: manifest missing required secret: CODEBUDDY_API_KEY",

  "requestId": "e34c3fc3-19c6-408e-b467-6375dda4015e"

}
```

**原因** ：Agent 运行需要 `CODEBUDDY_API_KEY` 来调用 LLM 服务，但 Manifest 中未提供该密钥。

**解决方法** ：

1. 前往 [https://www.codebuddy.cn/profile/keys](https://www.codebuddy.cn/profile/keys) 创建一个 API Key
2. 在创建 Runtime 时，将其放入 Manifest 的 `secrets` 中：

```json
{

  "runtimeName": "my-agent",

  "agentManifest": {

    "id": "my-agent",

    "name": "My Agent",

    "manifestVersion": "1.0",

    "secrets": [

      { "key": "CODEBUDDY_API_KEY", "value": "<你的 API Key>" }

    ]

  }

}
```

### Q2: 如何创建 Runtime 沙箱模板？没有看到相关 API

沙箱模板的制作流程如下：

1. **先创建一个普通 Runtime** ，获得其沙箱 ID（ `sandboxId` ）
2. **通过 ACP 连接沙箱 指挥 Agent 安装所需环境** （如安装依赖、配置工具链等）
3. **将该沙箱 ID 作为模板** ：后续创建新 Runtime 时，在 `sandboxTemplateId` 中传入该沙箱 ID，新 Runtime 会基于此模板创建，自带已安装好的环境

```json
{

  "runtimeName": "my-new-agent",

  "sandboxTemplateId": "<之前 Runtime 的 sandboxId>"

}
```

> **提示** ：如果需要对模板进行预热（加速后续创建速度），请联系我们提供沙箱 ID，由平台侧进行预热配置。

### Q3: 如何切换 Agent 使用的模型？

创建 Runtime 并通过 ACP 协议完成 `initialize` 和 `session/new` 后，可以通过 `session/set_model` 方法切换模型。

可用的模型列表在 `session/new` 响应的 `models.availableModels` 中返回。选择目标 `modelId` 后发送：

```json
{

  "jsonrpc": "2.0",

  "method": "session/set_model",

  "id": "6",

  "params": {

    "sessionId": "<你的 sessionId>",

    "modelId": "claude-sonnet-4"

  }

}
```

切换成功返回 `{}` 。该方法可以在 Session 空闲或执行中随时调用。

### Q4: 内网沙箱和外网沙箱如何创建？分别有什么访问限制？

沙箱类型由登录身份自动决定：通过内网（iOA）登录的用户创建 Runtime 时自动分配内网沙箱，通过公网登录的用户自动分配外网沙箱，无法手动指定。

两者的网络访问能力不同：

| 类型 | 部署环境 | 网络能力 |
| --- | --- | --- |
| 内网沙箱 | Dev 环境 | 可访问内网（Dev 网络、内部 API 等）及公司安全策略允许的外网 |
| 外网沙箱 | 云 IDC | 仅可访问外网 |

### Q5: Runtime 的生命周期是怎样的？什么时候会休眠？如何唤醒？

Runtime 沙箱具有自动管理的生命周期，状态流转如下：

```javascript
创建 Runtime ──▶ 运行中（Running）──▶ 2 小时首次运行窗口结束

                                          │

                                          ▼

                               10 分钟无访问 ──▶ 休眠（Sleeping）

                                                    │

                                          访问数据面接口 ──▶ 自动唤醒（Running）
```

**各阶段说明：**

| 阶段 | 行为 |
| --- | --- |
| **首次运行** | 创建 Runtime 后，沙箱保持运行状态最长 **2 小时** |
| **自动休眠** | 首次运行窗口结束后，若超过 **10 分钟** 无任何数据面访问，沙箱自动进入休眠状态（释放计算资源，磁盘数据保留） |
| **自动唤醒** | 沙箱休眠后，任何对数据面接口的请求（如 ACP 协议调用、文件操作等）都会 **自动唤醒** 沙箱，无需手动干预 |
| **数据持久化** | 休眠和唤醒过程中，沙箱内的文件系统数据 **不会丢失** |

> **注意** ：
> 
> - 控制面接口（如 `GET /runtimes/{runtimeId}` ） **不会** 触发自动唤醒，仅数据面接口会触发。
> - 自动唤醒可能需要数秒启动时间，首次请求的响应延迟会略高。
> - 如需长时间保持沙箱运行，建议定期发送心跳请求（如周期性调用 ACP 接口）以避免休眠。

### Q6: API Key 支持团队版/企业版吗？企业版是否支持海外模型？

支持。推荐通过 **内领方式下单旗舰版** 获取 API Key）。但官方不支持海外模型，如需要使用，只能通过配置自定义模型方法解决

### Q7：创建 Runtime 报错，调用沙箱接口失败

如出现类似报错信息，可以检查下请求体中的 agentManifest 结构中是否包含必填字段：agentManifest 下的字段 id、name、manifestVersion 是必填字段。

```javascript
{"code":10000,"msg":"RunCommand failed: 14241:E2B API error: code=500, msg=exit status 1","requestId":"114a5253-d27a-410e-aa2f-48b7a0e00fbe"}
```

### Q8: 如何进入沙箱

#### CS沙箱

[沙箱入口](http://555c1bdcdb8e4385ace166df933549eb.tc-nanjing.share.codebuddy.woa.com/public_space.html)  
**region** 从 runtime接口响应 data.links.sandboxLink.dataPlaneEndpoint 中解析获取

![Clipboard_Screenshot_1776254943.png](https://iwiki.woa.com/tencent/api/attachments/s3/url?attachmentid=43732604)

#### AGS沙箱（灰度中）

[https://doc.weixin.qq.com/doc/w3\_AScASQa7AL0CN8cTuKlAhQiWwhy1m?scode=AJEAIQdfAAoQspN2gTAScASQa7AL0](https://doc.weixin.qq.com/doc/w3_AScASQa7AL0CN8cTuKlAhQiWwhy1m?scode=AJEAIQdfAAoQspN2gTAScASQa7AL0 "https://doc.weixin.qq.com/doc/w3_AScASQa7AL0CN8cTuKlAhQiWwhy1m?scode=AJEAIQdfAAoQspN2gTAScASQa7AL0")

### Q9: Workspace 私有仓库如何设置 GIT 凭据

workspace repository 私有仓库如何设置 GIT 凭据，以下示例以 cnb.cool 为参考，其他平台请按字段替换值。

```javascript
{

    "id": "git-repo-001",

    "name": "Git Private Repo",

    "workspaces": [

        {

            "name": "test-repo",

            "repository": "https://cnb.cool/lucky/test",

            "ref": "main",

            "depth": 1

        }

    ],

    "secrets": [

        {

            "key": "GIT_CREDENTIAL",

            "value": "[{\"host\":\"cnb.cool\",\"username\":\"cnb\",\"password\":\"xxxx\"}]"

        }

    ]

}
```

### Q10: 如何自定义业务模型

在用户级目录下创建下面文件：

```javascript
~/.codebuddy/models.json
```

配置内容如下：

```javascript
{

  "models": [

    {

      "id": "my-custom-model",

      "name": "My Custom Model",

      "vendor": "OpenAI",

      // 非必填，默认使用用户的apiKey

      "apiKey": "sk-custom-key-here",

      "maxInputTokens": 128000,

      "maxOutputTokens": 4096,

      "url": "https://api.myservice.com/v1/chat/completions",

      "supportsToolCall": true

    }

  ]

}
```

重启/新建服务后即可看到新增的模型。  
完整文档可以参考： [https://www.codebuddy.cn/docs/cli/models](https://www.codebuddy.cn/docs/cli/models "https://www.codebuddy.cn/docs/cli/models")

### Q11: 是否有sdk可以使用

#### go sdk

[https://git.woa.com/cloudstudio/sandbox/golang-e2b-sdk](https://git.woa.com/cloudstudio/sandbox/golang-e2b-sdk "https://git.woa.com/cloudstudio/sandbox/golang-e2b-sdk")

#### js sdk

[https://e2b.dev/docs/sdk-reference/js-sdk/v2.14.1/sandbox](https://e2b.dev/docs/sdk-reference/js-sdk/v2.14.1/sandbox "https://e2b.dev/docs/sdk-reference/js-sdk/v2.14.1/sandbox")

#### py sdk

[https://e2b.dev/docs/sdk-reference/python-sdk/v2.14.1/exceptions](https://e2b.dev/docs/sdk-reference/python-sdk/v2.14.1/exceptions "https://e2b.dev/docs/sdk-reference/python-sdk/v2.14.1/exceptions")

### Q12: 沙箱环境说明

#### 公网沙箱集群

使用微信/手机号登录的用户api-key，沙箱将会创建在公网（无法访问司内资源）

#### 司内沙箱集群

使用ioa登录的用户api-key，沙箱将会创建在devcloud集群，可访问工蜂、cnb等内网资源，但是与idc网络隔离

#### IDC沙箱集群

创建runtime接口携带有 **X-Sandbox-Cluster-Id=ags-prod-idc** 时，沙箱会创建在idc集群，但是与devcloud网络隔离

目录