// pages/pub/team/team.js
import { Colors, Shadows, Gradients, Borders, Tokens } from '../../../utils/colors.js'
const appInstance = getApp()
const userId = appInstance.globalData.userId
const {
  formatTime
} = require("../../../utils/timeFormatter")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    name: String,
    logoUrl: String,
    captainId: String,
    coachList: Array,
    playerIdList: Array,
    eventList: Array,
    matchList: Array,
    activeIndex: 0,
    favorited: Boolean,
    description: "",
    teamStats: null,
    // 颜色设计系统常量（用于内联样式）
    Colors: Colors,
    Shadows: Shadows,
    Gradients: Gradients,
    Borders: Borders,
    Tokens: Tokens,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.fetchData(this.data.id);
    this.isFavorite(userId, this.data.id)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.fetchData(this.data.id);
    this.isFavorite(userId, this.data.id)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  ////////////////////////////////////////////////////////////////
  // HTTP 请求

  // 获取基本数据
  fetchData: function (id) {
    const URL = getApp().globalData.URL
    console.log("URL:", URL, "id:", id)
    // 显示加载提示框，提示用户正在加载
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    const that = this
    wx.request({
      url: URL + "/team/get?id=" + id,

      success(res) {
        console.log("/team/get?id=" + id + " ->")
        console.log(res.data)
        let eventList = res.data.eventList ?? []
        let matchList = res.data.matchList ?? []
        for (let match of matchList) {
          let date = new Date(match.time)
          match.strTime = formatTime(date)
          match.hasBegun = match.status == 'PENDING' ? false : true
        }
        that.setData({
          name: res.data.name,
          logoUrl: res.data.logoUrl,
          captainId: res.data.captainId,
          coachList: res.data.coachList,
          playerList: res.data.playerList,
          eventList: eventList,
          matchList: matchList,
          description: res.data.description
        })
        that.calculateTeamStats()
      },
      fail(err) {
        console.log("请求失败：", err)
        console.log("errMsg:", err.errMsg)
      },
      complete() {
        // 无论请求成功还是失败都会执行
        wx.hideLoading(); // 关闭加载提示框
      }
    })
  },

  ////////////////////////////////////////////////////////////////
  // 页面响应

  switchTab: function (e) {
    const tabIndex = e.currentTarget.dataset.index;
    this.setData({
      activeIndex: tabIndex
    })
  },

  ////////////////////////////////////////////////////////////////
  // 页面跳转

  gotoMatchPage: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + id
    })
  },

  gotoMatchesPage(e) {
    let matchList = e.currentTarget.dataset.list ?? []
    let matchIdList = matchList.map(match => match.matchId)
    wx.navigateTo({
      url: '/pages/pub/matches/matches?idList=' + matchIdList,
    })
  },

  gotoPlayerPage: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/user/player/player?id=' + id
    })
  },

  gotoHonorPage() {
    let teamId = this.data.teamId
    wx.showToast({
      title: '功能尚未完善',
      icon: "error"
    })
  },

  gotoRetiredPlayersPage() {
    let teamId = this.data.teamId
    wx.showToast({
      title: '功能尚未完善',
      icon: "error"
    })
    // wx.navigateTo({
    //   url: `/pages/pub/team/retired_players/retired_players?teamId=${teamId}`,
    // })
  },

  // 获取用户是否关注该比赛
  isFavorite(userId, id) {
    const URL = getApp().globalData.URL
    let that = this
    wx.request({
      url: URL + '/isFavorite',
      data: {
        userId: userId,
        type: "team",
        id: id,
      },
      success(res) {
        console.log("team page: isFavorite->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          favorited: Boolean(res.data)
        })
      }
    })
  },

  // 关注球队
  favorite() {
    const URL = getApp().globalData.URL
    let that = this
    wx.showLoading({
      title: '收藏中',
      mask: true,
    })
    wx.request({
      url: URL + '/favorite?type=team&userId=' + userId + '&id=' + that.data.id,
      method: "POST",
      success(res) {
        console.log("team page: favorite->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("收藏成功")
        that.setData({
          favorited: true,
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  // 取消关注
  unfavorite() {
    const URL = getApp().globalData.URL
    let that = this
    wx.showModal({
      title: '确认取消收藏',
      content: '确定要取消收藏这个球队吗？',
      confirmText: '确认取消',
      confirmColor: '#ed6c00',
      cancelText: '我再想想',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消收藏中',
            mask: true,
          })
          wx.request({
            url: URL + '/unfavorite?type=team&userId=' + userId + '&id=' + that.data.id,
            method: "POST",
            success(res) {
              console.log("team page: unfavorite->")
              if (res.statusCode !== 200) {
                console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                return
              }
              console.log("取消收藏成功")
              that.setData({
                favorited: false
              })
            },
            complete() {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          // 用户取消，不做任何操作
        }
      }
    })
  },

  // 跳转到教练页面
  gotoCoachPage: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/user/coach/coach?id=' + id
    })
  },

  // 跳转到球员统计数据页面
  gotoPlayerStatsPage() {
    const playerList = this.data.playerList;
    const teamName = this.data.name;
    wx.navigateTo({
      url: `/pages/pub/team/player_stats/player_stats?playerList=${JSON.stringify(playerList)}&teamName=${encodeURIComponent(teamName)}`,
    });
  },

  // 计算球队统计信息
  calculateTeamStats() {
    const { playerList, matchList, eventList } = this.data;

    // 球员统计数据汇总
    const playerStats = {
      totalGoals: playerList.reduce((sum, player) => sum + (player.goals || 0), 0),
      totalAssists: playerList.reduce((sum, player) => sum + (player.assists || 0), 0),
      totalYellowCards: playerList.reduce((sum, player) => sum + (player.yellowCards || 0), 0),
      totalRedCards: playerList.reduce((sum, player) => sum + (player.redCards || 0), 0),
    };

    // 比赛统计数据（需要区分主客场计算得失球）
    let totalGoalsScored = 0;
    let totalGoalsConceded = 0;

    // 假设当前球队ID是this.data.id
    const teamId = this.data.id;

    matchList.forEach(match => {
      if (match.homeTeam && match.homeTeam.teamId === teamId) {
        totalGoalsScored += match.homeTeamScore || 0;
        totalGoalsConceded += match.awayTeamScore || 0;
      } else if (match.awayTeam && match.awayTeam.teamId === teamId) {
        totalGoalsScored += match.awayTeamScore || 0;
        totalGoalsConceded += match.homeTeamScore || 0;
      }
    });

    this.setData({
      teamStats: {
        eventCount: eventList.length,
        matchCount: matchList.length,
        totalGoals: playerStats.totalGoals,
        totalGoalsScored: totalGoalsScored,
        totalGoalsConceded: totalGoalsConceded,
        totalAssists: playerStats.totalAssists,
        totalYellowCards: playerStats.totalYellowCards,
        totalRedCards: playerStats.totalRedCards,
      }
    });
  },

})
