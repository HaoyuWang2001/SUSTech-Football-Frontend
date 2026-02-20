# CLAUDE.md

本文档为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个 **微信小程序**，为南科大足球平台而建，使用微信小程序框架（WXML模板、WXSS样式、JavaScript）。它不是传统的Web应用程序——开发需要微信开发者工具并遵循微信特有的模式。

## 开发环境

- **主要工具**：微信开发者工具
- **没有 npm 或传统构建系统**；在微信开发者工具中打开 `wechat-miniprogram/project.config.json` 即可本地运行。
- **构建设置**：ES6、代码压缩和 postcss 已启用（参见 `project.config.json`）。
- **API 端点**：
  - 生产环境：`https://haoyu-wang141.top:8085`
  - 本地环境：`http://localhost:8085`
  - 配置在 `wechat-miniprogram/app.js` 中（`globalData.URL`、`globalData.SERVER`、`globalData.LOCAL`）

## 架构

### 关键目录

- `wechat-miniprogram/` – 主应用程序源码
  - `app.js` – 应用入口点，包含全局数据和请求队列系统
  - `app.json` – 配置文件（页面、窗口、tabBar、注册的组件）
  - `pages/` – 按功能组织（`home/`、`profile_player/`、`management/`、`mine/`、`pub/`）
  - `components/` – 可复用的UI卡片（kebab-case命名，如 `match-card-big/`）
  - `utils/` – 工具函数（`timeFormatter.js`、`searchFilter.js`）
  - `assets/` – 图片和静态资源
- `docs/` – 文档和提案
- `materials/` – 设计素材

### 核心模式

- **全局状态**：使用 `getApp().globalData` 获取共享数据（用户ID、URL、会话密钥）。
- **请求队列**：当 `userId` 尚未获取时，用 `addToRequestQueue()` 包装API调用（见 `app.js`）。
- **认证**：通过 `wx.login()` 进行微信登录；后端用 code 交换 `openid` 和 `session_key`。
- **组件注册**：所有可复用组件都在 `app.json` 的 `"usingComponents"` 中注册。
- **颜色方案**（来自 `pages/README.md`）：
  - 橙色：`#ed6c00`（主导航）
  - 深绿色：`#003f43`
  - 青绿色：`#2bb7b3`
  - 灰色系：`#666666`、`#cccccc`、`#e0e0e0`、`#f2f2f2`

## 编码规范

- **缩进**：2个空格（在 `project.config.json` 中配置）。
- **命名**：组件文件夹和标签使用 kebab-case（如 `match-card-big`）。
- **文件组织**：页面逻辑放在 `*.js`，视图放在 `*.wxml`，样式放在 `*.wxss`。避免跨页面导入。
- **提交信息**：使用前缀 `[update]`、`[add]`、`[fix]`，后接简短描述。
- **安全**：切勿在 issue 或 PR 中暴露密钥（`wx_AppSecret`、私钥等）。

## 测试

- **没有自动化测试套件**。在微信开发者工具中手动验证更改。
- **UI验证**：至少在一种小设备和一种大设备配置上测试。

## 常见任务

- **添加新页面**：
  1. 在 `pages/` 下创建文件夹，包含页面的 `.js`、`.wxml`、`.wxss` 和可选的 `.json`。
  2. 将页面路径添加到 `app.json` 的 `"pages"` 数组中（顺序重要——第一个页面是主页）。
- **创建可复用组件**：
  1. 在 `components/` 下创建 kebab-case 命名的文件夹。
  2. 实现组件（`.js`、`.wxml`、`.wxss`、可选的 `.json`）。
  3. 在 `app.json` 的 `"usingComponents"` 中用标签名注册它。
- **发起API调用**：
  ```javascript
  const app = getApp();
  wx.request({
    url: app.globalData.URL + '/your/endpoint',
    // ...
  });
  ```
  如果调用依赖 `userId`，用 `app.addToRequestQueue((userId) => { ... })` 包装。

## 给未来 Claude 实例的注意事项

- 这是一个 **微信小程序**，不是标准的Web应用。文件扩展名为 `.wxml`、`.wxss`、`.js`。
- **没有 package.json 或 npm 脚本**——开发完全依赖微信开发者工具。
- **组件系统** 使用微信的 `Component()` API，不是 React/Vue 组件。
- **状态管理** 通过 `getApp().globalData` 和本地存储（`wx.getStorageSync()`）。
- **测试** 是手动的；没有单元测试或集成测试框架。

更多仓库指南请参阅 `AGENTS.md`。