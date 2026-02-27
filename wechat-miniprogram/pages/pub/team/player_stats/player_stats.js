// pages/pub/team/player_stats/player_stats.js
import { Colors, Shadows, Gradients, Borders, Tokens } from '../../../../utils/colors.js'

Page({
  data: {
    playerList: [],
    teamName: ""
  },

  onLoad(options) {
    let playerList = [];
    const teamName = options.teamName || '';

    try {
      // 先解码，再解析JSON
      const playerListStr = decodeURIComponent(options.playerList || '[]');
      playerList = JSON.parse(playerListStr);

      // 验证playerList是数组
      if (!Array.isArray(playerList)) {
        console.error('playerList is not an array:', playerList);
        playerList = [];
      }
    } catch (error) {
      console.error('Failed to parse playerList:', error);
      console.error('Raw playerList string:', options.playerList);
      playerList = [];

      // 显示错误提示给用户
      wx.showToast({
        title: '数据加载失败',
        icon: 'error',
        duration: 2000
      });
    }

    this.setData({
      playerList,
      teamName
    });
  },

  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.teamName + ' - 球员统计'
    });
  }
})