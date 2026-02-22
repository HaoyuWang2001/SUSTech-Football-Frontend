const app = getApp()
const URL = app.globalData.URL
const {
  formatTime
} = require("../../utils/timeFormatter")

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
    isLoading: true, // 新增：加载状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    this.setData({
      isLoading: true // 开始加载
    })
    app.addToRequestQueue(this.fetchPlayerId)
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
    this.setData({
      isLoading: true // 开始加载
    })
    app.addToRequestQueue(this.fetchPlayerId)
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
  fetchPlayerId(userId) {
    let that = this
    wx.request({
      url: URL + '/user/getPlayerId',
      data: {
        userId: userId,
      },
      success(res) {
        console.log("profile player page: fetchPlayerId ->")
        if (res.statusCode == 404) {
          console.log("用户未注册")
          that.setData({
            isLoading: false, // 加载完成，隐藏loading
            playerId: 0, // 明确设置为0
          })
          wx.showToast({
            title: '请先注册为球员',
            icon: 'error',
          })
          return
        }
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          that.setData({
            isLoading: false // 加载完成（即使失败）
          })
          return
        }
        console.log(res.data)
        let playerId = res.data
        that.setData({
          playerId: playerId,
          isLoading: false // 加载完成，隐藏loading
        })
        // 后续数据获取不显示loading
        that.fetchData(playerId)
        that.fetchPlayerMatches(playerId)
        that.fetchPlayerTeams(playerId)
        that.fetchPlayerEvents(playerId)
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
        that.setData({
          isLoading: false // 加载完成（即使失败）
        })
      },
    })
  },

  fetchData(playerId) {
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
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchPlayerMatches(playerId) {
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

  fetchPlayerTeams(playerId) {
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

  fetchPlayerEvents(playerId) {
    let that = this
    wx.request({
      url: `${URL}/player/event/getAll?playerId=${playerId}`,
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
  edit_information() {
    let player = this.data.player
    console.log(player)
    const queryString = Object.keys(player).map(key => {
      console.log(key + ": " + encodeURIComponent(player[key]))
      return `${key}=${encodeURIComponent(player[key])}`
    }).join('&');
    console.log("queryString->")
    console.log(queryString)
    wx.navigateTo({
      url: `/package-player/pages/profile_player_edit/profile_player_edit?${queryString}`
    })
  },


  gotoProfileRefereePage() {
    wx.navigateTo({
      url: '/pages/profile_player/profile_referee/profile_referee',
    })
  },

  gotoPlayerNoticePage() {
    wx.navigateTo({
      url: '/pages/profile_player/player_notice/player_notice',
    })
  },

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

  gotoPlayerTeamsPage(e) {
    wx.navigateTo({
      url: `player_teams/player_teams?playerId=${this.data.playerId}`,
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

  gotoRegisterPage() {
    wx.navigateTo({
      url: './profile_player_register/profile_player_register',
    })
  },

  // 加入球队
  openJoinTeamModal() {
    const that = this
    wx.showModal({
      title: '申请加入球队',
      editable: true,
      placeholderText: '请输入球队id',
      complete: (res) => {
        if (res.confirm) {
          let teamId = res.content
          that.applyToJoinTeam(teamId)
        }
      }
    })
  },

  applyToJoinTeam(teamId) {
    if (isNaN(teamId) || teamId.trim() === '') {
      wx.showToast({
        title: '输入的不是数字',
        icon: 'error',
      })
      return
    }
    teamId = Number(teamId)
    let playerId = this.data.playerId
    console.log('playerId:' + playerId)
    console.log(typeof (playerId))
    console.log(`playerId: ${playerId}`)

    wx.showLoading({
      title: '正在发送申请',
    })

    wx.request({
      url: `${URL}/player/team/applyToJoin?playerId=${playerId}&teamId=${teamId}`,
      method: 'POST',
      success(res) {
        wx.hideLoading()
        console.log("profile player page: applyToJoinTeam ->")
        if (res.statusCode != 200) {
          console.error(res)
          wx.showToast({
            title: res.data,
            icon: 'error'
          })
          return
        }
        wx.showToast({
          title: '已申请',
          icon: 'success'
        })
      },
      fail(err) {
        wx.hideLoading()
        console.error(err)
        wx.showToast({
          title: '申请失败',
          icon: 'error'
        })
      }
    })
  },

})