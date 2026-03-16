// pages/pub/match/match_referee_updatePlayerList/match_referee_updatePlayerList.js
const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchId: Number,
    refereeId: Number,
    isHomeTeam: Boolean,
    team: Object,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let matchId = Number(options.matchId)
    let refereeId = Number(options.refereeId)
    let isHomeTeam = options.isHomeTeam == "true" ? true : false
    this.setData({
      matchId,
      refereeId,
      isHomeTeam
    })
    this.fetchData(matchId, isHomeTeam)
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

  // 获取比赛数据
  fetchData: function (matchId, isHomeTeam) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    const that = this
    let isEventMatch = true
    wx.request({
      url: URL + "/match/team/get",
      data: {
        matchId,
        isHomeTeam,
        isEventMatch
      },
      success: function (res) {
        console.log("match referee updatePlayerList page: fetchData->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)

        that.setData({
          team: res.data
        })
      },
      fail(err) {
        console.log("请求失败，错误码为：" + err.statusCode + "；错误信息为：" + err.message)
      },
      complete() {
        wx.hideLoading();
      }
    })
  },

  // 选择
  changeIsStart(e) {
    let playerId = e.currentTarget.dataset.id
    let team = this.data.team
    for (let player of team.players) {
      if (playerId == player.playerId) {
        player.isStart = !player.isStart
        break
      }
    }
    this.setData({
      team
    })
  },

  // 确认更改
  updatePlayerList() {
    let refereeId = this.data.refereeId
    let matchId = this.data.matchId
    let teamId = this.data.team.teamId
    let playerList = this.data.team.players
    
    // 日志
    console.log("match referee updatePlayerList: updatePlayerList ->")
    console.log(playerList);

    wx.showLoading({
      title: '正在更新',
    })

    const that = this
    wx.request({
      url: URL + '/match/referee/setPlayerList?refereeId=' + refereeId + '&matchId=' + matchId + '&teamId=' + teamId,
      method: 'POST',
      data: playerList,
      success(res) {
        console.log("match referee updatePlayerList: updatePlayerList->")
        if (res.statusCode != 200) {
          console.error("请求失败：" + res.statusCode + res.data)
          return
        }
        console.log("更新球员名单成功")
        wx.navigateBack()
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
      complete() {
        wx.hideLoading()
      }
    })
  }
})