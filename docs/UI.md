# 现代化UI设计规范

基于 `pages/pub/event` 和 `pages/pub/team` 页面的UI风格沉淀

## 概述

本规范总结了南科大足球平台微信小程序中 `pages/pub/event` 和 `pages/pub/team` 页面的现代化UI设计风格。这两个页面共享相同的现代化设计模式：现代化的卡片设计、平滑的过渡动画、响应式布局和一致的橙色系配色方案，可作为其他页面UI设计的参考模板。

## 设计原则

### 1. 视觉层次
- **清晰的页面结构**：使用卡片容器分隔不同内容区域
- **视觉焦点明确**：重要信息突出显示，次要信息适当弱化
- **层级分明**：通过阴影、边框和间距建立清晰的视觉层次

### 2. 交互反馈
- **即时反馈**：所有可交互元素都有明确的激活状态
- **平滑过渡**：使用 `cubic-bezier(0.2, 0.8, 0.3, 1)` 缓动函数实现自然动画
- **触觉反馈**：点击元素有轻微的视觉变化（缩放、位移、颜色变化）

### 3. 一致性
- **统一配色**：严格遵循橙色系颜色设计系统
- **一致间距**：使用统一的间距系统（20rpx, 24rpx, 32rpx等）
- **规范圆角**：卡片、按钮等元素使用一致的圆角半径

### 4. 响应式设计
- **移动优先**：所有设计都考虑移动端体验
- **自适应布局**：在不同屏幕尺寸下保持良好的可用性
- **触摸友好**：确保按钮和交互区域有足够的触摸区域

## 颜色使用规范

### 核心颜色（遵循颜色设计系统）

#### 橙色系
| 用途 | 颜色值 | 透明度变体 | 应用场景 |
|------|--------|------------|----------|
| 主强调色 | `#ed6c00` | `rgba(237, 108, 0, 0.xx)` | 标题、强调文本、主要按钮 |
| 渐变起点 | `#ed6c00` | - | 渐变装饰条起点 |
| 渐变终点 | `#ff8c32` | - | 渐变装饰条终点 |
| 激活状态 | - | `rgba(237, 108, 0, 0.25)` | 按钮按下状态 |
| 边框颜色 | - | `rgba(237, 108, 0, 0.12)` | 卡片边框 |
| 阴影颜色 | - | `rgba(237, 108, 0, 0.1)` | 卡片阴影 |
| 浅色背景 | - | `rgba(237, 108, 0, 0.05)` | ID显示区域背景 |
| 中等背景 | - | `rgba(237, 108, 0, 0.08)` | 表格表头背景 |

#### 中性色
| 用途 | 颜色值 | 应用场景 |
|------|--------|----------|
| 页面背景 | `#f2f2f2` | 页面整体背景 |
| 卡片背景 | `#ffffff` | 卡片容器背景 |
| 主要文本 | `#333333` | 标题、重要信息 |
| 次要文本 | `#666666` | 描述文本、标签 |
| 辅助文本 | `#cccccc` | 提示文字、图标 |

### 渐变应用
```css
/* 顶部装饰条渐变 */
background: linear-gradient(90deg, #ed6c00 0%, #ff8c32 100%);

/* 指示器渐变 */
background: linear-gradient(90deg, #ed6c00 0%, #ff8c32 100%);

/* 卡片背景渐变 */
background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
```

## 布局与间距系统

### 页面结构
```
┌─────────────────────────────────┐
│        section-header           │
│  ┌─────────────────────────┐  │
│  │    team-card-big        │  │
│  │  (包含右上角操作按钮)   │  │
│  └─────────────────────────┘  │
├─────────────────────────────────┤
│        tabs (标签页导航)        │
├─────────────────────────────────┤
│        tab-content              │
│  ┌─────────────────────────┐  │
│  │    block-container      │  │
│  │    ┌─────────────────┐  │  │
│  │    │  block-top      │  │  │
│  │    └─────────────────┘  │  │
│  │    ┌─────────────────┐  │  │
│  │    │  block-main     │  │  │
│  │    └─────────────────┘  │  │
│  └─────────────────────────┘  │
│           ...                  │
└─────────────────────────────────┘
```

### 间距系统（基于rpx单位）
| 间距类型 | 值 | 应用场景 |
|----------|-----|----------|
| 页面边距 | 20rpx | 卡片容器的水平外边距 |
| 内容内边距 | 32rpx | 卡片内容区域的内边距 |
| 垂直间距 | 24rpx | 块级容器之间的垂直间距 |
| 内部间距 | 16rpx | 元素组内部的间距 |
| 紧凑间距 | 8rpx | 紧密排列元素的间距 |

### 圆角系统
| 元素类型 | 圆角半径 | 应用场景 |
|----------|----------|----------|
| 大圆角 | 24rpx | 卡片容器、大按钮 |
| 中等圆角 | 16rpx | 表格、内部容器 |
| 小圆角 | 12rpx | ID显示区域 |
| 圆形 | 50% | 头像、Logo |

## 组件设计规范

### 1. 现代化卡片 (team-card-big / event-card-big)

#### 结构
```xml
<view class="container">
  <!-- 顶部装饰条 -->
  <view class="card-header"></view>

  <!-- 右上角插槽 -->
  <view class="top-right-slot">
    <slot name="top-right"></slot>
  </view>

  <!-- 卡片内容 -->
  <view class="card-content">
    <!-- Logo区域 -->
    <view class="team-logo-container">
      <view class="team-logo-bg"></view>
      <image class="team-logo"></image>
    </view>

    <!-- 信息区域 -->
    <view class="team-info">
      <view class="team-header">
        <text class="team-name"></text>
        <view class="team-status">
          <text class="status-badge"></text>
        </view>
      </view>

      <!-- 扩展信息区域 -->
      <view class="team-id-container">
        <text class="team-id-label">球队ID：</text>
        <text class="team-id-value"></text>
      </view>
    </view>

    <!-- 操作插槽 -->
    <view class="team-actions">
      <slot></slot>
    </view>
  </view>
</view>
```

#### 样式特性
- **背景渐变**：`linear-gradient(135deg, #ffffff 0%, #fafafa 100%)`
- **边框**：`2rpx solid rgba(237, 108, 0, 0.12)`
- **阴影**：双层阴影增强立体感
- **装饰条**：顶部橙色渐变装饰条，高度8rpx
- **交互效果**：点击时轻微下移、缩放和阴影变化

#### 响应式设计
```css
@media (max-width: 600rpx) {
  .container { margin: 16rpx 16rpx; }
  .card-content { padding: 30rpx 24rpx 26rpx 24rpx; gap: 24rpx; }
  .team-logo-container { width: 100rpx; height: 100rpx; }
  .team-logo { width: 68rpx; height: 68rpx; }
  .team-name { font-size: 32rpx; }
  .status-badge { font-size: 22rpx; padding: 8rpx 14rpx; }
  .top-right-slot { top: 16rpx; right: 16rpx; }
  .top-right-slot .icon { width: 44rpx; height: 44rpx; }
}
```

#### event-card-big 组件补充说明

`event-card-big` 组件与 `team-card-big` 共享相同的现代化设计模式，但针对赛事信息展示进行了优化：

**结构特点**：
- 左侧图标容器：圆角背景，橙色边框
- 赛事信息区域：包含赛事名称和ID显示
- 右侧操作插槽：可放置收藏按钮等功能

**样式特性**：
- **图标容器**：`background: rgba(237, 108, 0, 0.08)`，`border: 2rpx solid rgba(237, 108, 0, 0.15)`
- **ID显示区域**：浅橙色背景，橙色文字强调
- **交互反馈**：点击时图标缩放，文字颜色变化

**响应式设计**：
```css
@media (max-width: 600rpx) {
  .card-content {
    gap: 24rpx;
    padding: 24rpx;
  }
  .card-content.has-favorite-button {
    padding-right: 80rpx; /* 为收藏按钮预留空间 */
  }
}
```

### 2. 标签页导航 (tabs)

#### 结构
```xml
<view class="tabs">
  <view class="tab {{activeIndex==0?'active':''}}">
    <text class="tab-text">信息</text>
    <view class="tab-indicator {{activeIndex==0?'active':''}}"></view>
  </view>
  <!-- 更多标签 -->
</view>
```

#### 样式特性
- **容器**：白色背景，橙色边框，圆角24rpx
- **标签项**：等分布局，文字颜色 `#666666`
- **激活状态**：文字颜色 `#ed6c00`，字重700
- **指示器**：橙色渐变，缩放动画 `cubic-bezier(0.2, 0.8, 0.3, 1)`
- **点击反馈**：激活时背景色 `rgba(237, 108, 0, 0.05)`

### 3. 内容块容器 (block-container)

#### 结构
```xml
<view class="block-container modern-card">
  <view class="modern-card-header"></view>
  <view class="block-top">
    <text class="block-title primary-color text-bold">标题</text>
    <text class="block-more primary-color">查看更多</text> <!-- 可选 -->
  </view>
  <view class="block-main">
    <!-- 内容区域 -->
  </view>
</view>
```

#### 样式特性
- **标题**：`32rpx`，字重600，橙色 `#ed6c00`
- **查看更多**：`24rpx`，橙色，下划线
- **间距**：块间垂直间距24rpx，块内间距20rpx

### 4. 功能按钮 (function-button)

#### 结构
```xml
<view class="function-container">
  <view class="function-button modern-card">
    <image class="function-image" />
    <text class="function-text primary-color">按钮文字</text>
  </view>
</view>
```

#### 样式特性
- **布局**：水平居中，等间距分布
- **按钮样式**：白色背景，橙色边框，圆角24rpx
- **图标尺寸**：`90rpx × 90rpx`
- **文字样式**：`28rpx`，字重600，橙色
- **交互效果**：点击时下移4rpx，轻微缩放，背景色变化

### 5. 表格 (table)

项目中有两种表格样式，分别用于不同场景：

#### 1. team页面表格（浅橙色表头）
用于球队页面的球员信息展示。

**结构**：同上
**样式特性**：
- **容器**：橙色边框 `rgba(237, 108, 0, 0.12)`，圆角16rpx
- **表头**：浅橙色背景 `rgba(237, 108, 0, 0.05)`，橙色文字 `#ed6c00`，字重600
- **行**：底部1rpx分隔线 `rgba(237, 108, 0, 0.08)`
- **单元格**：居中文字，`24rpx`，颜色 `#666666`

#### 2. event页面积分榜表格（渐变表头）
用于赛事页面的积分榜展示，视觉效果更突出。

**样式特性**：
- **容器**：无边框，圆角16rpx，阴影 `0 2rpx 8rpx rgba(237, 108, 0, 0.08)`
- **表头**：橙色渐变背景 `linear-gradient(90deg, #ed6c00 0%, #ff8c32 100%)`，白色文字，字重600
- **表头单元格**：白色文字，右侧边框 `1rpx solid rgba(255, 255, 255, 0.2)`
- **行**：底部1rpx分隔线 `rgba(237, 108, 0, 0.08)`，点击时背景色 `rgba(237, 108, 0, 0.05)`
- **单元格**：居中文字，`26rpx`，颜色 `#666666`，右侧边框 `1rpx solid rgba(237, 108, 0, 0.08)`
- **球队单元格**：左对齐，包含队标图标，图标有圆形边框和阴影

**积分榜表格代码示例**：
```css
/* 表头渐变效果 */
.row.header {
  background: linear-gradient(90deg, #ed6c00 0%, #ff8c32 100%);
  color: #ffffff;
  border-bottom: none;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

/* 单元格边框 */
.cell {
  border-right: 1rpx solid rgba(237, 108, 0, 0.08);
}

/* 球队图标样式 */
.cell-team-icon {
  width: 48rpx;
  height: 48rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(237, 108, 0, 0.15);
  background-color: rgba(237, 108, 0, 0.08);
  padding: 4rpx;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}
```

### 6. 滚动容器 (scroll-container)

#### 样式特性
- **布局**：水平滚动，`flex-direction: row`
- **间距**：底部内边距20rpx
- **内容**：`white-space: nowrap` 防止换行

### 7. 统计卡片 (statistic-card)

`event`页面特有的2列统计卡片布局，用于展示赛事统计数据。

#### 结构
```xml
<view class="statistic-container">
  <view wx:for="{{statisticData}}" class="statistic-card" wx:key="index">
    <view class="statistic-card-content">
      <image class="statistic-icon" src="{{item.icon}}" mode="scaleToFill" />
      <view class="statistic-count">{{item.count}}</view>
    </view>
    <view class="statistic-title">{{item.title}}</view>
  </view>
</view>
```

#### 样式特性
- **布局**：2列网格，间隙24rpx，宽度 `calc(50% - 12rpx)`
- **卡片样式**：白色渐变背景，橙色边框，圆角20rpx
- **装饰条**：顶部橙色渐变装饰条，高度6rpx
- **图标区域**：图标尺寸64rpx×64rpx，带有阴影效果
- **数字显示**：大号橙色文字（48rpx），字重800，带有文字阴影
- **标题**：灰色文字（26rpx），顶部1rpx分隔线

#### 交互效果
```css
.statistic-card:active {
  transform: translateY(4rpx) scale(0.995);
  box-shadow: 0 2rpx 8rpx rgba(237, 108, 0, 0.08);
  border-color: rgba(237, 108, 0, 0.25);
}

.statistic-card:active .statistic-icon {
  transform: scale(0.95);
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
}
```

### 8. 现代化选择器 (stageAndTag)

`event`页面中的比赛选择器现代化设计，用于选择比赛阶段和标签。

#### 结构
```xml
<view class="stageAndTag">
  {{stageAndTag}}
  <image src="/assets/down.png" class="icon-down"></image>
</view>
```

#### 样式特性
- **容器样式**：白色渐变背景，橙色边框，圆角24rpx，双层阴影
- **装饰条**：顶部橙色渐变装饰条，高度6rpx（使用::before伪元素）
- **文字样式**：30rpx，字重600，颜色 `#666666`
- **下拉图标**：44rpx×44rpx，带有阴影效果，透明度0.7

#### 交互效果
```css
.stageAndTag:active {
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-color: rgba(237, 108, 0, 0.25);
  transform: translateY(4rpx) scale(0.995);
  box-shadow:
    0 2rpx 12rpx rgba(237, 108, 0, 0.08),
    0 1rpx 6rpx rgba(237, 108, 0, 0.06);
}

.stageAndTag:active .icon-down {
  opacity: 0.9;
  transform: translateY(2rpx);
  filter: drop-shadow(0 1rpx 2rpx rgba(0, 0, 0, 0.05));
}
```

## 交互设计规范

### 1. 动画缓动函数
```css
/* 标准过渡 */
transition: all 0.3s cubic-bezier(0.2, 0.8, 0.3, 1);

/* 快速过渡 */
transition: all 0.2s ease;

/* 慢速过渡 */
transition: all 0.4s cubic-bezier(0.2, 0.8, 0.3, 1);
```

### 2. 点击状态
```css
/* 卡片点击效果 */
.container:active {
  transform: translateY(4rpx) scale(0.995);
  box-shadow: /* 减少阴影 */;
  border-color: rgba(237, 108, 0, 0.25);
}

/* 按钮点击效果 */
.function-button:active {
  background-color: rgba(237, 108, 0, 0.1);
  transform: translateY(4rpx) scale(0.98);
  border-color: rgba(237, 108, 0, 0.5);
}

/* 图标点击效果 */
.icon:active {
  transform: scale(0.95);
}
```

### 3. 状态指示器
- **标签页指示器**：从中心缩放显示，透明度变化
- **加载状态**：使用微信原生 `wx.showLoading()`
- **空状态**：居中图标和提示文字

## 响应式设计规范

### 断点设置
```css
/* 小屏幕设备 (宽度小于600rpx) */
@media (max-width: 600rpx) {
  /* 调整间距 */
  .container { margin: 16rpx 16rpx; }
  .tabs { margin: 16rpx 16rpx 0 16rpx; }
  .tab-content { padding: 0 16rpx 32rpx 16rpx; }

  /* 调整字体大小 */
  .team-name { font-size: 32rpx; }
  .team-id { font-size: 48rpx; }

  /* 调整元素尺寸 */
  .function-button { padding: 24rpx 32rpx; min-width: 180rpx; }
  .top-right-slot .icon { width: 44rpx; height: 44rpx; }

  /* event页面组件响应式调整 */
  /* 块容器 */
  .block-container {
    margin: 16rpx 16rpx;
    padding: 24rpx 20rpx;
  }
  .block-title { font-size: 30rpx; }
  .block-more { font-size: 24rpx; padding: 6rpx 12rpx; }

  /* 选项卡 */
  .tabs { margin: 16rpx 16rpx 0 16rpx; }
  .tab { padding: 20rpx 0; font-size: 26rpx; }
  .tab-content { padding: 0 16rpx 32rpx 16rpx; }

  /* 比赛选择器 */
  .stageAndTag {
    margin: 16rpx 16rpx 0 16rpx;
    padding: 24rpx 28rpx;
    font-size: 28rpx;
    border-radius: 20rpx;
  }
  .icon-down {
    height: 36rpx;
    width: 36rpx;
    margin-left: 12rpx;
  }

  /* 统计卡片 */
  .statistic-card {
    width: calc(50% - 12rpx);
    padding: 24rpx 16rpx;
    border-radius: 16rpx;
  }
  .statistic-icon {
    width: 56rpx;
    height: 56rpx;
    margin-right: 16rpx;
  }
  .statistic-count { font-size: 40rpx; min-width: 70rpx; }
  .statistic-title { font-size: 24rpx; }

  /* 积分榜表格 */
  .cell {
    padding: 20rpx 8rpx;
    font-size: 24rpx;
  }
  .cell-team-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 12rpx;
  }
}
```

### 自适应策略
1. **间距自适应**：小屏幕减少边距和内边距
2. **字体自适应**：重要文字保持可读性
3. **元素缩放**：图标、头像等元素按比例缩小
4. **布局优化**：确保触摸区域不小于44px

## 代码实现示例

### 页面结构模板
```xml
<!-- 页面结构参考 -->
<view class="section-header">
  <team-card-big name="{{name}}" img="{{logoUrl}}" number="{{count}}" teamId="{{id}}">
    <view slot="top-right">
      <!-- 右上角操作按钮 -->
    </view>
  </team-card-big>
</view>

<view class="tabs modern-card">
  <!-- 标签页导航 -->
</view>

<view class="tab-content">
  <view wx:if="{{activeIndex == 0}}">
    <view class="block-container modern-card">
      <view class="modern-card-header"></view>
      <view class="block-top">
        <text class="block-title primary-color text-bold">标题</text>
      </view>
      <view class="block-main">
        <!-- 内容区域 -->
      </view>
    </view>
  </view>
</view>
```

### event页面组件示例

以下展示 `event` 页面特有的组件实现：

#### 1. 统计卡片布局
```xml
<view class="block-container">
  <view class="block-top">
    <text class="block-title">赛事统计</text>
  </view>
  <view class="block-main">
    <view class="statistic-container">
      <view class="statistic-card">
        <view class="statistic-card-content">
          <image class="statistic-icon" src="/assets/team-icon.png" />
          <view class="statistic-count">16</view>
        </view>
        <view class="statistic-title">参赛球队</view>
      </view>
      <view class="statistic-card">
        <view class="statistic-card-content">
          <image class="statistic-icon" src="/assets/match-icon.png" />
          <view class="statistic-count">48</view>
        </view>
        <view class="statistic-title">比赛场次</view>
      </view>
    </view>
  </view>
</view>
```

#### 2. 现代化选择器
```xml
<view class="stageAndTag">
  小组赛 · 第1轮
  <image src="/assets/down.png" class="icon-down"></image>
</view>
```

#### 3. 积分榜表格
```xml
<view class="table">
  <view class="row header">
    <view class="cell">球队</view>
    <view class="cell">胜</view>
    <view class="cell">平</view>
    <view class="cell">负</view>
    <view class="cell">进/失</view>
    <view class="cell">积分</view>
  </view>
  <view class="row">
    <view class="cell">
      <view class="cell-team">
        <image class="cell-team-icon" src="/assets/team-logo.png" />球队A
      </view>
    </view>
    <view class="cell">5</view>
    <view class="cell">2</view>
    <view class="cell">1</view>
    <view class="cell">15/8</view>
    <view class="cell">17</view>
  </view>
</view>
```

### WXSS导入
```css
/* 导入颜色设计系统混入类 */
@import '../../styles/mixins.wxss';

/* 使用颜色常量 */
.primary-color {
  color: #ed6c00;
}

.gray-medium-color {
  color: #cccccc;
}

/* 使用卡片样式类 */
.modern-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border-radius: 24rpx;
  border: 2rpx solid rgba(237, 108, 0, 0.12);
  box-shadow: 0 4rpx 24rpx rgba(237, 108, 0, 0.1);
}
```

## 最佳实践

### 1. 颜色使用
- 始终使用颜色设计系统定义的颜色常量
- 避免硬编码颜色值，使用透明度变体
- 确保足够的颜色对比度（WCAG AA标准）

### 2. 动画优化
- 使用 `transform` 和 `opacity` 进行动画，性能更好
- 避免在动画中修改 `width`、`height` 和 `margin`
- 使用 `will-change` 属性提示浏览器优化

### 3. 性能考虑
- 图片使用合适的尺寸和压缩格式
- 避免过多的阴影和渐变层级
- 使用CSS精灵图减少HTTP请求

### 4. 可访问性
- 确保所有交互元素都有明确的焦点状态
- 为图标提供替代文本或说明
- 保持足够的触摸目标尺寸（最小44px）

## 更新日志

| 版本 | 日期 | 变更描述 |
|------|------|----------|
| 1.1.0 | 2026-02-23 | 整合pages/pub/event页面UI样式，补充统计卡片、现代化选择器、积分榜表格等组件 |
| 1.0.0 | 2026-02-21 | 初始版本：基于pages/pub/team页面UI风格沉淀 |

---

**参考文件**：
- `pages/pub/event/event.wxml`
- `pages/pub/event/event.wxss`
- `components/event-card-big/event.wxss`
- `pages/pub/team/team.wxml`
- `pages/pub/team/team.wxss`
- `components/team-card-big/team.wxss`
- `docs/color-design-system.md`