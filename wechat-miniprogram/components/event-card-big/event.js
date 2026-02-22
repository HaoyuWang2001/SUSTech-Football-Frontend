// components/event-card-big/event.js
import { Colors, Shadows, Gradients } from '../../utils/colors.js';

Component({
  properties: {
    eventId: Number,
    icon: String,
    name: String,
    // 新增：是否显示收藏按钮区域
    has_favorite_button: {
      type: Boolean,
      value: false  // 默认不显示收藏按钮区域
    }
  },
  data: {
    // 颜色设计系统常量，可在WXML中使用
    Colors: Colors,
    Shadows: Shadows,
    Gradients: Gradients
  },
  methods: {
    // 点击卡片事件
    onCardTap() {
      // 触发 cardtap 事件，用于新页面
      this.triggerEvent('cardtap', {
        eventId: this.data.eventId,
        name: this.data.name,
        icon: this.data.icon
      }, { bubbles: true });
      // 同时触发 tap 事件，保持向后兼容性
      this.triggerEvent('tap', {
        eventId: this.data.eventId,
        name: this.data.name,
        icon: this.data.icon
      }, { bubbles: true });
    }
  },

  lifetimes: {
    attached() {
      console.log('event-card-big组件已附加');
    },

    detached() {
      console.log('event-card-big组件已移除');
    }
  }
})