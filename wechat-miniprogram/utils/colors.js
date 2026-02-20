/**
 * 颜色设计系统 - JavaScript 颜色常量
 *
 * 本文件定义了微信小程序中使用的所有颜色常量、阴影和渐变。
 * 所有颜色基于橙色系调色板，不再使用深绿色 (#003f43) 和青绿色 (#2bb7b3)。
 *
 * 使用方法：
 * import { Colors, Shadows, Gradients } from '../../utils/colors.js';
 */

// ============================================================================
// 核心颜色常量
// ============================================================================

/**
 * 颜色常量对象
 * 包含所有基于橙色系的颜色值
 */
export const Colors = {
  // ==================== 橙色系 ====================

  /** 主橙色 - 主导航、主要按钮、强调色、标题 */
  primary: '#ed6c00',
  primaryRgb: '237, 108, 0',

  /** 浅橙色 - 渐变过渡、辅助元素、次要按钮 */
  primaryLight: '#ff8c32',
  primaryLightRgb: '255, 140, 50',

  /** 极浅橙色 - 背景高光、渐变终点 */
  primaryLighter: '#ffb366',
  primaryLighterRgb: '255, 179, 102',

  // ==================== 透明度变体 ====================

  /** 边框透明度 (12%) - 卡片边框、分隔线 */
  primaryAlpha12: 'rgba(237, 108, 0, 0.12)',

  /** 阴影透明度 (10%) - 阴影效果、悬浮状态 */
  primaryAlpha10: 'rgba(237, 108, 0, 0.1)',

  /** 激活状态透明度 (25%) - 激活状态、按下状态 */
  primaryAlpha25: 'rgba(237, 108, 0, 0.25)',

  /** 浅色边框透明度 (8%) - 内部区域分隔 */
  primaryAlpha8: 'rgba(237, 108, 0, 0.08)',

  /** 中等透明度 (15%) - 图片阴影 */
  primaryAlpha15: 'rgba(237, 108, 0, 0.15)',

  /** 较高透明度 (20%) - 按钮阴影 */
  primaryAlpha20: 'rgba(237, 108, 0, 0.2)',

  /** 高透明度 (30%) - 聚焦状态 */
  primaryAlpha30: 'rgba(237, 108, 0, 0.3)',

  /** 极高透明度 (50%) - 活动状态 */
  primaryAlpha50: 'rgba(237, 108, 0, 0.5)',

  // ==================== 灰色系 ====================

  /** 深灰 - 主要文本、标题 */
  grayDark: '#666666',
  grayDarkRgb: '102, 102, 102',

  /** 中灰 - 次要文本、图标 */
  grayMedium: '#cccccc',
  grayMediumRgb: '204, 204, 204',

  /** 浅灰 - 边框、分隔线 */
  grayLight: '#e0e0e0',
  grayLightRgb: '224, 224, 224',

  /** 极浅灰 - 背景、容器底色 */
  grayLighter: '#f2f2f2',
  grayLighterRgb: '242, 242, 242',

  /** 白色 */
  white: '#ffffff',
  whiteRgb: '255, 255, 255',

  /** 黑色 */
  black: '#000000',
  blackRgb: '0, 0, 0',

  // ==================== 功能色（基于橙色变体） ====================

  /** 成功色 - 成功状态、确认操作 */
  success: 'rgba(237, 108, 0, 0.8)',

  /** 警告色 - 警告信息、注意提示 */
  warning: 'rgba(255, 140, 50, 0.8)',

  /** 错误色 - 错误状态、危险操作 */
  error: 'rgba(255, 100, 0, 0.8)',

  /** 信息色 - 提示信息 */
  info: 'rgba(237, 108, 0, 0.6)',

  // ==================== 辅助函数 ====================

  /**
   * 创建自定义透明度的橙色
   * @param {number} alpha - 透明度 (0-1)
   * @returns {string} rgba颜色字符串
   */
  primaryWithAlpha(alpha) {
    return `rgba(237, 108, 0, ${alpha})`;
  },

  /**
   * 创建自定义透明度的浅橙色
   * @param {number} alpha - 透明度 (0-1)
   * @returns {string} rgba颜色字符串
   */
  primaryLightWithAlpha(alpha) {
    return `rgba(255, 140, 50, ${alpha})`;
  },

  /**
   * 创建自定义透明度的极浅橙色
   * @param {number} alpha - 透明度 (0-1)
   * @returns {string} rgba颜色字符串
   */
  primaryLighterWithAlpha(alpha) {
    return `rgba(255, 179, 102, ${alpha})`;
  },
};

// ============================================================================
// 阴影系统
// ============================================================================

/**
 * 阴影常量对象
 * 包含所有阴影定义，使用橙色透明度
 */
export const Shadows = {
  /** 卡片阴影 - 卡片、浮层 */
  card: '0 4rpx 24rpx rgba(237, 108, 0, 0.1)',

  /** 中等阴影 - 悬浮卡片 */
  cardHover: '0 8rpx 32rpx rgba(237, 108, 0, 0.15)',

  /** 图片阴影 - 图片、头像 */
  image: '0 8rpx 32rpx rgba(237, 108, 0, 0.15)',

  /** 按钮阴影 - 按钮悬浮状态 */
  button: '0 4rpx 12rpx rgba(237, 108, 0, 0.2)',

  /** 深度阴影 - 模态框、下拉菜单 */
  deep: '0 12rpx 48rpx rgba(237, 108, 0, 0.25)',

  /** 内阴影 - 输入框、凹陷效果 */
  inset: 'inset 0 2rpx 4rpx rgba(237, 108, 0, 0.1)',

  /** 文本阴影 - 文字效果 */
  text: '0 2rpx 4rpx rgba(237, 108, 0, 0.2)',

  /** 小阴影 - 微小元素 */
  small: '0 2rpx 8rpx rgba(237, 108, 0, 0.08)',
};

// ============================================================================
// 渐变系统
// ============================================================================

/**
 * 渐变常量对象
 * 包含所有渐变定义，基于橙色系
 */
export const Gradients = {
  /** 主橙色渐变 - 顶部装饰条、主要按钮 */
  primary: 'linear-gradient(90deg, #ed6c00 0%, #ff8c32 100%)',

  /** 浅橙色渐变 - 次要元素、背景装饰 */
  primaryLight: 'linear-gradient(90deg, #ff8c32 0%, #ffb366 100%)',

  /** 淡出渐变 - 卡片装饰、渐变背景 */
  primaryFade: 'linear-gradient(90deg, rgba(237, 108, 0, 0.9) 0%, rgba(237, 108, 0, 0.1) 100%)',

  /** 垂直橙色渐变 */
  primaryVertical: 'linear-gradient(180deg, #ed6c00 0%, #ff8c32 100%)',

  /** 浅色垂直渐变 */
  primaryLightVertical: 'linear-gradient(180deg, #ff8c32 0%, #ffb366 100%)',

  /** 背景渐变 - 卡片背景、页面区域 */
  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',

  /** 对角橙色渐变 */
  primaryDiagonal: 'linear-gradient(135deg, #ed6c00 0%, #ff8c32 100%)',

  /** 浅色对角渐变 */
  primaryLightDiagonal: 'linear-gradient(135deg, #ff8c32 0%, #ffb366 100%)',

  /** 径向橙色渐变 */
  primaryRadial: 'radial-gradient(circle, #ed6c00 0%, #ff8c32 100%)',
};

// ============================================================================
// 边框系统
// ============================================================================

/**
 * 边框常量对象
 * 包含所有边框定义
 */
export const Borders = {
  /** 卡片边框 - 卡片外边框 */
  card: '2rpx solid rgba(237, 108, 0, 0.12)',

  /** 内部边框 - 内部区域分隔 */
  inner: '1rpx solid rgba(237, 108, 0, 0.08)',

  /** 聚焦边框 - 输入框聚焦状态 */
  focus: '2rpx solid rgba(237, 108, 0, 0.3)',

  /** 活动边框 - 活动标签、选中状态 */
  active: '2rpx solid rgba(237, 108, 0, 0.5)',

  /** 细边框 - 微小元素 */
  thin: '1rpx solid rgba(237, 108, 0, 0.12)',

  /** 虚线边框 */
  dashed: '2rpx dashed rgba(237, 108, 0, 0.2)',
};

// ============================================================================
// 设计令牌（Design Tokens）
// ============================================================================

/**
 * 设计令牌对象
 * 包含间距、圆角等其他设计常量
 */
export const Tokens = {
  // 圆角
  borderRadiusSmall: '8rpx',
  borderRadiusMedium: '16rpx',
  borderRadiusLarge: '24rpx',
  borderRadiusXlarge: '32rpx',
  borderRadiusRound: '50%',

  // 间距
  spacingXsmall: '8rpx',
  spacingSmall: '16rpx',
  spacingMedium: '24rpx',
  spacingLarge: '32rpx',
  spacingXlarge: '48rpx',
  spacingXxlarge: '64rpx',

  // 字体大小（如需）
  fontSizeXsmall: '20rpx',
  fontSizeSmall: '24rpx',
  fontSizeMedium: '28rpx',
  fontSizeLarge: '32rpx',
  fontSizeXlarge: '36rpx',
  fontSizeXxlarge: '48rpx',
};

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 检查颜色对比度是否满足可访问性要求
 * @param {string} color1 - 颜色1 (十六进制)
 * @param {string} color2 - 颜色2 (十六进制)
 * @returns {boolean} 是否满足AA级对比度 (4.5:1)
 */
export function checkColorContrast(color1, color2) {
  // 简化实现 - 实际项目可能需要完整的对比度计算
  console.warn('颜色对比度检查需要完整实现，当前为简化版本');
  return true;
}

/**
 * 获取颜色的RGB数组
 * @param {string} hexColor - 十六进制颜色
 * @returns {Array<number>} RGB数组 [r, g, b]
 */
export function hexToRgb(hexColor) {
  // 移除#号
  const hex = hexColor.replace('#', '');

  // 解析RGB值
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
}

/**
 * 创建CSS变量字符串
 * @param {Object} variables - 变量对象
 * @returns {string} CSS变量定义字符串
 */
export function createCssVariables(variables) {
  let css = ':root {\n';
  for (const [key, value] of Object.entries(variables)) {
    css += `  --${key}: ${value};\n`;
  }
  css += '}';
  return css;
}

// ============================================================================
// 默认导出
// ============================================================================

export default {
  Colors,
  Shadows,
  Gradients,
  Borders,
  Tokens,
  checkColorContrast,
  hexToRgb,
  createCssVariables,
};