// components/match-card-big/match.js
import { Colors, Shadows, Gradients } from '../../utils/colors.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: String,
    stage: String,
    tag: String,
    team1: String,
    team2: String,
    icon1: String,
    icon2: String,
    score1: Number,
    score2: Number,
    penalty1: Number,
    penalty2: Number,
    time: String,
    hasBegun: Boolean,
    group: String,
    has_button: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 颜色设计系统常量，可在WXML中使用
    Colors: Colors,
    Shadows: Shadows,
    Gradients: Gradients,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击卡片事件
     */
    onCardTap() {
      this.triggerEvent('cardtap', {
        name: this.data.name,
        team1: this.data.team1,
        team2: this.data.team2,
        time: this.data.time,
        hasBegun: this.data.hasBegun,
      }, { bubbles: true });
    },

    /**
     * 长按卡片事件
     */
    onCardLongPress() {
      this.triggerEvent('cardlongpress', {
        name: this.data.name,
        team1: this.data.team1,
        team2: this.data.team2,
        time: this.data.time,
      }, { bubbles: true });
    },
  },

  /**
   * 组件生命周期函数
   */
  lifetimes: {
    attached() {
      // 组件实例进入页面节点树时执行
      console.log('match-card-big组件已附加');
    },

    detached() {
      // 组件实例被从页面节点树移除时执行
      console.log('match-card-big组件已移除');
    },
  },
})