// components/example-color-system/example.js
// 颜色设计系统使用示例

// 导入颜色设计系统常量
import { Colors, Shadows, Gradients, Borders, Tokens } from '../../utils/colors.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '颜色设计系统示例'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 颜色常量示例
    colors: {
      primary: Colors.primary,
      primaryLight: Colors.primaryLight,
      primaryLighter: Colors.primaryLighter,
      primaryAlpha12: Colors.primaryAlpha12,
      grayDark: Colors.grayDark,
      grayMedium: Colors.grayMedium
    },

    // 阴影常量示例
    shadows: {
      card: Shadows.card,
      button: Shadows.button,
      image: Shadows.image
    },

    // 渐变常量示例
    gradients: {
      primary: Gradients.primary,
      primaryLight: Gradients.primaryLight,
      background: Gradients.background
    },

    // 边框常量示例
    borders: {
      card: Borders.card,
      focus: Borders.focus,
      active: Borders.active
    },

    // 设计令牌示例
    tokens: {
      borderRadiusLarge: Tokens.borderRadiusLarge,
      spacingMedium: Tokens.spacingMedium
    },

    // 示例卡片数据
    cards: [
      { id: 1, title: '主橙色卡片', color: Colors.primary, text: '使用 Colors.primary' },
      { id: 2, title: '浅橙色卡片', color: Colors.primaryLight, text: '使用 Colors.primaryLight' },
      { id: 3, title: '极浅橙色卡片', color: Colors.primaryLighter, text: '使用 Colors.primaryLighter' },
      { id: 4, title: '透明度卡片', color: Colors.primaryAlpha12, text: '使用 Colors.primaryAlpha12' }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击卡片事件
     */
    onCardTap(e) {
      const { id } = e.currentTarget.dataset;
      console.log('点击卡片:', id);

      // 触发自定义事件
      this.triggerEvent('cardtap', { id });
    },

    /**
     * 获取颜色样式对象
     */
    getColorStyle(color) {
      return {
        color: color
      };
    },

    /**
     * 获取背景样式对象
     */
    getBackgroundStyle(color) {
      return {
        'background-color': color
      };
    },

    /**
     * 获取边框样式对象
     */
    getBorderStyle(border) {
      return {
        border: border
      };
    }
  }
});