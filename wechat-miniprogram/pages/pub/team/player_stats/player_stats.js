// pages/pub/team/player_stats/player_stats.js
import { Colors, Shadows, Gradients, Borders, Tokens } from '../../../../utils/colors.js'

Page({
  data: {
    playerList: [],
    teamName: ""
  },

  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
  
    eventChannel.on('acceptData', (data) => {
      this.setData({
        playerList: data.playerList,
        teamName: data.teamName
      });
    });
  },

  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.teamName + ' - 球员统计'
    });
  }
})