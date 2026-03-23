# AGENTS.md

本文档为 Codex (Codex.ai/code) 在此代码库中工作时提供指导。

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
- **颜色方案**：
  - `docs/color-design-system.md` - 完整颜色规范
  - `wechat-miniprogram/utils/colors.js` - JavaScript颜色常量
  - `wechat-miniprogram/styles/mixins.wxss` - WXSS混入类

## 编码规范

- **缩进**：2个空格（在 `project.config.json` 中配置）。
- **命名**：组件文件夹和标签使用 kebab-case（如 `match-card-big`）。
- **文件组织**：页面逻辑放在 `*.js`，视图放在 `*.wxml`，样式放在 `*.wxss`。避免跨页面导入。
- **提交信息**：使用前缀 `[update]`、`[add]`、`[fix]`，后接简短描述。
- **提交频率**：每完成一个功能或修复一个bug后立即进行一次git commit提交，保持提交的原子性和可追溯性。
- **安全**：切勿在 issue 或 PR 中暴露密钥（`wx_AppSecret`、私钥等）。
- **颜色使用**：
  - 所有新组件开发必须使用颜色设计系统
  - 组件现代化改造过程中迁移到颜色系统
  - JavaScript中使用 `import { Colors, Shadows, Gradients } from '../../utils/colors.js'`
  - WXSS中使用 `@import '../../styles/mixins.wxss'` 导入CSS类
    - 注意：微信小程序WXSS不支持CSS自定义属性和Sass/Less混入语法
    - 在WXML中使用类名：`<view class="primary-color">橙色文字</view>`

## 常见任务

- **添加新页面**：
  1. 在 `pages/` 下创建文件夹，包含页面的 `.js`、`.wxml`、`.wxss` 和可选的 `.json`。
  2. 将页面路径添加到 `app.json` 的 `"pages"` 数组中（顺序重要——第一个页面是主页）。
- **创建可复用组件**：
  1. 在 `components/` 下创建 kebab-case 命名的文件夹。
  2. 实现组件（`.js`、`.wxml`、`.wxss`、可选的 `.json`）。
  3. 在 `app.json` 的 `"usingComponents"` 中用标签名注册它。
- **使用颜色设计系统**：
  ```javascript
  // 在JS文件中导入颜色常量
  import { Colors, Shadows, Gradients } from '../../utils/colors.js';
  
  Page({
    data: {
      primaryColor: Colors.primary,
      cardShadow: Shadows.card,
      primaryGradient: Gradients.primary
    }
  });
  ```
  ```css
  /* 在WXSS文件中导入混入类 */
  @import '../../styles/mixins.wxss';
  
  .card-title {
    .primary-color();
    font-weight: bold;
  }
  
  .card-container {
    .modern-card();
    .gradient-primary();
  }
  ```
- **发起API调用**：
  ```javascript
  const app = getApp();
  wx.request({
    url: app.globalData.URL + '/your/endpoint',
    // ...
  });
  ```
  如果调用依赖 `userId`，用 `app.addToRequestQueue((userId) => { ... })` 包装。
