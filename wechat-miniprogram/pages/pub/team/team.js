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
    matchList: Array,
    activeIndex: 0,
    favorited: Boolean,
    description: "",
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
          matchList: matchList,
          description: res.data.description
        })
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
  },

})
