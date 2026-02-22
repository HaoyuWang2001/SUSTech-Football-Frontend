# Tab UI Design

## 设计系统概览
项目使用橙色系颜色设计系统（详见 `docs/color-design-system.md`）：
- **主橙色**: `#ed6c00`
- **浅橙色**: `#ff8c32`
- **极浅橙色**: `#ffb366`
- **灰色系**: `#666666`, `#cccccc`, `#e0e0e0`, `#f2f2f2`

## 标签页结构分析

### 1. WXML结构 (team.wxml:19-32)
```xml
<view class="tabs modern-card">
  <view class="tab {{activeIndex==0?'active':''}}" data-index="0" bindtap="switchTab">
    <text class="tab-text">tab-A</text>
    <view class="tab-indicator {{activeIndex==0?'active':''}}"></view>
  </view>
  <view class="tab {{activeIndex==1?'active':''}}" data-index="1" bindtap="switchTab">
    <text class="tab-text">tab-B</text>
    <view class="tab-indicator {{activeIndex==1?'active':''}}"></view>
  </view>
  <view class="tab {{activeIndex==2?'active':''}}" data-index="2" bindtap="switchTab">
    <text class="tab-text">tab-C</text>
    <view class="tab-indicator {{activeIndex==2?'active':''}}"></view>
  </view>
</view>
```

**关键元素**:
- **容器**: `.tabs.modern-card` - 现代卡片样式容器
- **标签项**: `.tab` - 单个标签容器，包含 `data-index` 属性和 `bindtap` 事件
- **标签文本**: `.tab-text` - 标签文字单独包装
- **指示器**: `.tab-indicator` - 独立的下划线指示器元素
- **激活状态**: 通过 `activeIndex` 数据绑定和条件类名控制

### 2. JavaScript逻辑 (team.js)
```javascript
// 数据定义
data: {
  activeIndex: 0,  // 当前激活标签索引
  Colors: Colors,   // 设计系统颜色常量
  Shadows: Shadows,
  Gradients: Gradients,
  Borders: Borders,
  Tokens: Tokens,
},

// 标签切换函数
switchTab: function (e) {
  const tabIndex = e.currentTarget.dataset.index;
  this.setData({
    activeIndex: tabIndex
  })
},
```

**功能特点**:
- 使用 `activeIndex` 跟踪当前激活标签
- `switchTab` 函数通过事件对象的 `dataset.index` 获取点击的标签索引
- 导入并暴露设计系统常量供WXML使用

### 3. WXSS样式 (team.wxss:29-73)

#### 容器样式 (`.tabs`)
```css
.tabs {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff; /* Colors.white */
  padding: 0;
  margin: 20rpx 20rpx 0 20rpx;
  border-radius: 24rpx; /* Tokens.borderRadiusLarge */
  border: 2rpx solid rgba(237, 108, 0, 0.12); /* Borders.card */
  box-shadow: 0 4rpx 24rpx rgba(237, 108, 0, 0.1); /* Shadows.card */
}
```

#### 标签项样式 (`.tab`)
```css
.tab {
  flex-grow: 1;
  text-align: center;
  padding: 28rpx 0;
  color: #666666; /* Colors.grayDark */
  position: relative;
  transition: all 0.3s ease;
}

.tab.active .tab-text {
  color: #ed6c00; /* Colors.primary */
  font-weight: 700;
}
```

#### 指示器样式 (`.tab-indicator`)
```css
.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 6rpx;
  background: linear-gradient(90deg, #ed6c00 0%, #ff8c32 100%); /* Gradients.primary */
  border-radius: 3rpx;
  opacity: 0;
  transform: scaleX(0.8);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.3, 1);
}

.tab.active .tab-indicator {
  opacity: 1;
  transform: scaleX(1);
}
```

## 设计特点总结

### 1. 视觉设计
- **现代卡片风格**: 使用 `modern-card` 类，包含圆角、边框、阴影
- **渐变指示器**: 橙色渐变下划线，增强视觉层次
- **颜色对比**: 激活状态使用主橙色 (`#ed6c00`)，非激活状态使用深灰色 (`#666666`)
- **平滑过渡**: 所有状态变化都有0.3秒过渡动画

### 2. 交互设计
- **点击切换**: 通过 `bindtap="switchTab"` 绑定点击事件
- **数据驱动**: 使用 `activeIndex` 控制激活状态
- **指示器动画**: 指示器有缩放和透明度动画效果
- **触摸友好**: 标签项有足够的点击区域 (28rpx垂直内边距)

### 3. 设计系统合规性
- **颜色系统**: 使用设计系统常量而非硬编码值
- **设计令牌**: 使用 `Tokens.borderRadiusLarge` 等令牌确保一致性
- **现代样式**: 集成 `modern-card` 样式类
- **响应式设计**: 包含媒体查询适应小屏幕

---
*文档生成时间: 2026-02-22*
*基于 `wechat-miniprogram/pages/pub/team/` 页面分析*