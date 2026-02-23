// pages/pub/team/player_stats/player_stats.js
import { Colors, Shadows, Gradients, Borders, Tokens } from '../../../../utils/colors.js'

Page({
  data: {
    playerList: [],
    teamName: ""
  },

  onLoad(options) {
    const playerList = JSON.parse(options.playerList || '[]');
    const teamName = options.teamName || '';
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