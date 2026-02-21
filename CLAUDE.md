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
- **颜色方案**（基于颜色设计系统）：
  - **橙色系**（统一使用，不再使用深绿色和青绿色）：
    - 主橙色：`#ed6c00`（主导航、主要按钮、强调色、标题）
    - 浅橙色：`#ff8c32`（渐变过渡、辅助元素、次要按钮）
    - 极浅橙色：`#ffb366`（背景高光、渐变终点）
    - 透明度变体：`rgba(237, 108, 0, 0.xx)`（边框、阴影、半透明效果）
  - **灰色系**：
    - `#666666`、`#cccccc`、`#e0e0e0`、`#f2f2f2`（背景、边框、次要文本）
  - **设计系统文件**：
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
  - 不再使用深绿色 (`#003f43`) 和青绿色 (`#2bb7b3`)，统一使用橙色系

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

## 给未来 Claude 实例的注意事项

- 这是一个 **微信小程序**，不是标准的Web应用。文件扩展名为 `.wxml`、`.wxss`、`.js`。
- **没有 package.json 或 npm 脚本**——开发完全依赖微信开发者工具。
- **组件系统** 使用微信的 `Component()` API，不是 React/Vue 组件。
- **状态管理** 通过 `getApp().globalData` 和本地存储（`wx.getStorageSync()`）。
- **测试** 是手动的；没有单元测试或集成测试框架。

更多仓库指南请参阅 `AGENTS.md`。

## 常见错误和注意事项

### WXSS 混入类语法错误
**错误示例**：
```css
/* 错误：微信小程序WXSS不支持Sass/Less混入语法 */
.search-container {
  .white-bg();
  .shadow-card-hover();
  .transition-normal();
}
```

**正确做法**：
```css
/* 正确：使用原生CSS属性 */
.search-container {
  background-color: #ffffff !important;
  box-shadow: 0 8rpx 32rpx rgba(237, 108, 0, 0.15) !important;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) !important;
}
```

**原因**：微信小程序WXSS不支持CSS自定义属性和Sass/Less混入语法。虽然项目提供了 `mixins.wxss` 文件，但其中定义的是CSS类（如 `.white-bg`），而不是可调用的混入函数。在WXSS中只能使用原生CSS属性。

**参考**：颜色设计系统中的混入类定义在 `wechat-miniprogram/styles/mixins.wxss` 中，只能通过 `@import` 导入后在WXML中使用类名（如 `<view class="white-bg">`），不能在WXSS中使用函数调用语法。

### 颜色设计系统使用指南
1. **JavaScript中**：导入 `colors.js` 中的颜色常量
2. **WXSS中**：直接使用颜色值，或通过 `@import '../../styles/mixins.wxss'` 后在WXML中使用类名
3. **WXML中**：使用 `class="primary-color white-bg"` 等类名应用样式

### 开发检查清单
- [ ] WXSS中不使用任何 `function()` 或 `mixin()` 语法
- [ ] 所有颜色值使用设计系统常量或硬编码值
- [ ] 在微信开发者工具中验证样式渲染
- [ ] 提交前检查语法错误