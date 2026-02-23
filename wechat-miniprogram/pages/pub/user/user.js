const app = getApp()
const URL = app.globalData.URL
// 导入颜色设计系统
import { Colors, Shadows, Gradients, Borders, Tokens } from '../../../utils/colors.js'
// const {
//   formatTime
// } = require("../../../utils/timeFormatter")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,  // 查看的用户的用户id
    user: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userId: options.id,
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
    app.addToRequestQueue(this.fetchData)
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
    app.addToRequestQueue(this.fetchData)
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

  ///////////////////////////////////////////////////////////////////////////////
  // 拉取数据

  fetchData(id) {
    let userId = this.data.userId
    // this.fetchPlayerId(userId)
    // this.fetchRefereeId(userId)
    // this.fetchCoachId(userId)
    let that = this
    wx.request({
      url: URL + '/user/getRoleUserById',
      data: {
        userId: userId,
      },
      success(res) {
        console.log("user page: fetch user ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          user: res.data,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  // 弃用
  fetchPlayerId(userId) {
    let that = this
    wx.request({
      url: URL + '/user/getPlayerId',
      data: {
        userId: userId,
      },
      success(res) {
        console.log("user page: fetchPlayerId ->")
        if (res.statusCode == 404) {
          console.log("用户未注册")
          that.setData({
            playerId: -1,
          })
          return
        }
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let playerId = res.data
        that.setData({
          playerId: playerId,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  // 弃用
  fetchRefereeId(userId) {
    let that = this
    wx.request({
      url: URL + '/user/getRefereeId',
      data: {
        userId: userId,
      },
      success(res) {
        console.log("user page: fetchRefereeId ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let refereeId = res.data
        that.setData({
          refereeId: refereeId,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  // 弃用
  fetchCoachId(userId) {
    let that = this
    wx.request({
      url: URL + '/user/getCoachId',
      data: {
        userId: userId,
      },
      success(res) {
        console.log("user page: fetchCoachId ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let coachId = res.data
        that.setData({
          coachId: coachId,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  ///////////////////////////////////////////////////////////////////////////////
  // 页面跳转

  gotoPlayerPage() {
    let user = this.data.user
    wx.navigateTo({
      url: '/pages/pub/user/player/player?id=' + user.playerRole.playerId,
    })
  },

  gotoCoachPage() {
    let user = this.data.user
    wx.navigateTo({
      url: '/pages/pub/user/coach/coach?id=' + user.coachRole.coachId,
    })
  },

  gotoRefereePage() {
    let user = this.data.user
    wx.navigateTo({
      url: '/pages/pub/user/referee/referee?id=' + user.refereeRole.refereeId,
    })
  },

})