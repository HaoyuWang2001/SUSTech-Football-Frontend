const app = getApp()
const URL = app.globalData.URL
// 导入颜色设计系统
import { Colors, Shadows, Gradients, Borders, Tokens } from '../../../../utils/colors.js'
const {
  formatTime
} = require("../../../../utils/timeFormatter")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playerId: 0,
    player: null,
    matchList: [],
    teamList: [],
    eventList: [],
    defaultValue: '暂无',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      playerId: options.id,
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

  // 拉取数据
  // fetchPlayerId(userId) {
  //   let that = this
  //   wx.request({
  //     url: URL + '/user/getPlayerId',
  //     data: {
  //       userId: userId,
  //     },
  //     success(res) {
  //       console.log("profile player page: fetchPlayerId ->")
  //       if (res.statusCode == 404) {
  //         console.log("用户未注册")
  //         wx.showToast({
  //           title: '请先注册为球员',
  //           icon: 'none',
  //         })
  //         return
  //       }
  //       if (res.statusCode != 200) {
  //         console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
  //         return
  //       }
  //       console.log(res.data)
  //       let playerId = res.data
  //       that.setData({
  //         playerId: playerId,
  //       })
  //       that.fetchData(playerId)
  //       that.fetchPlayerMatches(playerId)
  //       that.fetchPlayerTeams(playerId)
  //       that.fetchPlayerEvents(playerId)
  //     },
  //     fail(err) {
  //       console.error('请求失败：', err.statusCode, err.errMsg);
  //     },
  //   })
  // },

  fetchData(id) {
    let playerId = this.data.playerId
    var that = this
    wx.request({
      url: URL + '/player/get',
      data: {
        id: playerId,
      },
      success(res) {
        console.log("profile player page: fetchData ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let player = res.data
        if (player.birthDate == '' || player.birthDate == null) {
          player.strBirthDate = '暂无';
        } else {
          const date = new Date(player.birthDate);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          player.strBirthDate = `${year}-${month}-${day}`;
        }
        that.setData({
          player: player,
        })
        app.addToRequestQueue(that.fetchPlayerMatches)
        app.addToRequestQueue(that.fetchPlayerTeams)
        app.addToRequestQueue(that.fetchPlayerEvents)
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchPlayerMatches(id) {
    let playerId = this.data.playerId
    let that = this
    wx.request({
      url: URL + '/player/match/getAll',
      data: {
        playerId: playerId,
      },
      success(res) {
        console.log("profile player page: fetchPlayerMatches ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let matchList = res.data ?? []
        for (let match of matchList) {
          let date = new Date(match.time)
          match.strTime = formatTime(date)
          match.hasBegun = match.status == 'PENDING' ? false : true
        }
        that.setData({
          matchList,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchPlayerTeams(id) {
    let playerId = this.data.playerId
    let that = this
    wx.request({
      url: URL + '/player/team/getAll',
      data: {
        playerId: playerId,
      },
      success(res) {
        console.log("profile player page: fetchPlayerTeams ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let teamList = res.data ?? []
        that.setData({
          teamList: teamList,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchPlayerEvents(id) {
    let playerId = this.data.playerId
    let that = this
    wx.request({
      url: URL + '/player/event/getAll',
      data: {
        playerId: playerId,
      },
      success(res) {
        console.log("profile player page: fetchPlayerEvents ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let eventList = res.data ?? []
        that.setData({
          eventList: eventList,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  // 页面跳转

  gotoMatchesPage(e) {
    let matchList = e.currentTarget.dataset.list ?? []
    let matchIdList = matchList.map(match => match.matchId)
    wx.navigateTo({
      url: '/pages/pub/matches/matches?idList=' + matchIdList,
    })
  },

  gotoMatchPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + dataset.id,
    })
  },

  gotoTeamsPage(e) {
    let teamList = e.currentTarget.dataset.list ?? []
    let teamIdList = teamList.map(team => team.teamId)
    wx.navigateTo({
      url: '/pages/pub/teams/teams?idList=' + teamIdList,
    })
  },

  gotoTeamPage: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/team/team?id=' + id,
    })
  },

  gotoEventPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/event/event?id=' + dataset.id,
    })
  },

})