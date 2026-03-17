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

    const sortedPlayers = this.sortPlayersByNumber(playerList)

    this.setData({
      playerList: sortedPlayers,
      teamName
    });
  },

  onReady() {
    
  }

  ,sortPlayersByNumber(players = []) {
    const withNumber = []
    const withoutNumber = []

    players.forEach((player) => {
      const num = Number(player.number)
      const isValid = !Number.isNaN(num) && num >= 1 && num <= 99
      if (isValid) {
        withNumber.push({ ...player, _num: num })
      } else {
        withoutNumber.push({ ...player, number: '' })
      }
    })

    withNumber.sort((a, b) => a._num - b._num)

    return [
      ...withNumber.map(({ _num, ...rest }) => rest),
      ...withoutNumber,
    ]
  }
})