// components/team-card-big/team.js
import { Colors, Shadows, Gradients } from '../../utils/colors.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: String,
    img: String,
    number: Number, // 球员数量
    teamId: String, // 球队ID（可选）
    winRate: Number, // 胜率（可选）
    matchCount: Number, // 比赛场次（可选）
    has_button: {
      type: Boolean,
      value: false  // 默认不显示收藏按钮，为true时预留右上角按钮空间
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

    // 格式化后的显示文本
    displayNumber: '',

    // 默认统计信息
    defaultStats: {
      players: '阵容',
      achievements: '成就',
      stats: '统计'
    }
  },

  /**
   * 属性监听器
   */
  observers: {
    'number': function(number) {
      // 监听球员数量变化，格式化显示文本
      const displayNumber = this.formatPlayerCount(number);
      this.setData({ displayNumber });
    },
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
        img: this.data.img,
        number: this.data.number,
        teamId: this.data.teamId,
      }, { bubbles: true });
    },

    /**
     * 格式化球员数量显示
     */
    formatPlayerCount(count) {
      if (!count && count !== 0) return '0名球员';
      return `${count}名球员`;
    },

    /**
     * 计算胜率显示
     */
    formatWinRate(winRate) {
      if (!winRate && winRate !== 0) return 'N/A';
      return `${winRate}%`;
    },

    /**
     * 格式化比赛场次
     */
    formatMatchCount(count) {
      if (!count && count !== 0) return '0场';
      return `${count}场`;
    }
  },

  /**
   * 组件生命周期函数
   */
  lifetimes: {
    attached() {
      // 组件实例进入页面节点树时执行
      console.log('team-card-big组件已附加');

      // 初始化格式化文本
      const displayNumber = this.formatPlayerCount(this.data.number);
      this.setData({ displayNumber });

      // 如果没有提供图片，可以设置默认图片
      if (!this.data.img) {
        // 这里可以设置一个默认的球队logo路径
        // this.setData({ img: '/assets/default-team-logo.png' });
      }
    },

    detached() {
      // 组件实例被从页面节点树移除时执行
      console.log('team-card-big组件已移除');
    },
  },

  /**
   * 组件生命周期函数 - 在组件实例进入页面节点树时执行
   */
  ready() {
    // 组件布局完成后执行
    if (!this.data.img) {
      // 如果没有提供图片，可以设置默认图片
      this.setData({
        img: '/assets/default-team-logo.png' // 假设有默认图片
      });
    }
  },
})