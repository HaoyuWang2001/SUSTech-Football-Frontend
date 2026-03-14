// pages/profile_player/profile_referee/profile_referee.js
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
    refereeId: 0,
    referee: {},
    matchList: [],
    teamList: [],
    eventList: [],
    isLoading: true, // 新增：加载状态
    showRedDot: false,
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
      isLoading: true, // 开始加载
    })
    app.addToRequestQueue(this.fetchRefereeId)
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
    app.addToRequestQueue(this.fetchRefereeId)
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

  // 拉取裁判id
  fetchRefereeId(userId) {
    let that = this
    wx.request({
      url: URL + '/user/getRefereeId',
      data: {
        userId: userId,
      },
      success(res) {
        console.log("profile referee page: fetchRefereeId ->")
        if (res.statusCode == 404) {
          console.log("用户未注册为裁判")
          that.setData({
            isLoading: false, // 加载完成，隐藏loading
            refereeId: 0, // 明确设置为0
          })
          wx.showToast({
            title: '请先注册为裁判',
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
        let refereeId = res.data
        that.setData({
          refereeId: refereeId,
          isLoading: false // 加载完成，隐藏loading
        })
        // 后续数据获取不显示loading
        that.fetchData(refereeId)
        that.fetchRefereeMatches(refereeId)
        that.fetchRefereeEvents(refereeId)
        that.fetchRefereeInvitationsForMatch(refereeId)
        that.fetchRefereeInvitationsForEvent(refereeId)
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
        that.setData({
          isLoading: false // 加载完成（即使失败）
        })
      },
    })
  },

  fetchData(refereeId) {
    let that = this
    wx.request({
      url: URL + '/referee/get',
      data: {
        id: refereeId,
      },
      success(res) {
        console.log("profile referee page: fetchData ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          referee: res.data,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchRefereeEvents(refereeId) {
    let that = this
    wx.request({
      url: URL + '/referee/event/getAll',
      data: {
        refereeId: refereeId,
      },
      success(res) {
        console.log("profile referee page: fetchRefereeEvents ->")
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

  fetchRefereeMatches(refereeId) {
    let that = this
    wx.request({
      url: URL + '/referee/match/getAll',
      data: {
        refereeId,
      },
      success(res) {
        console.log("profile referee page: fetchRefereeMatches ->")
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
        let matches = res.data.map(match => {
          const matchDay = new Date(match.time);
          const nowDay = new Date();
          if (matchDay < nowDay) return null;
          else {
            let differenceInDays = (matchDay - nowDay) / (1000 * 60 * 60 * 24);
            if (differenceInDays <= 14)
              return match
          }
          return null;
        }).filter(match => match !== null);
        let showDot = matches.length > 0 ? true : false;
        if (showDot == true) {
          that.setData({
            showRedDot: showDot
          })
        }
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchRefereeInvitationsForMatch(refereeId) {
    const that = this
    wx.request({
      url: URL + '/referee/match/getInvitations',
      data: {
        refereeId: refereeId,
      },
      success(res) {
        console.log("profile referee page: fetch Referee Invitations For Match->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let invitations = res.data.map(invitation => {
          if (invitation.status == "PENDING") {
            return invitation
          }
          return null;
        }).filter(invitation => invitation !== null);
        let showDot = invitations.length > 0 ? true : false;
        if (showDot == true) {
          that.setData({
            showRedDot: showDot
          })
        }
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchRefereeInvitationsForEvent(refereeId) {
    const that = this
    wx.request({
      url: URL + '/referee/event/getInvitations',
      data: {
        refereeId: refereeId,
      },
      success(res) {
        console.log("profile referee page: fetch Referee Invitations For Event->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let invitations = res.data.map(invitation => {
          if (invitation.status == "PENDING") {
            return invitation
          }
          return null;
        }).filter(invitation => invitation !== null);
        let showDot = invitations.length > 0 ? true : false;
        if (showDot == true) {
          that.setData({
            showRedDot: showDot
          })
        }
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  edit_information() {
    let referee = this.data.referee
    console.log(referee)
    const queryString = Object.keys(referee).map(key => {
      console.log(key + ": " + encodeURIComponent(referee[key]))
      return `${key}=${encodeURIComponent(referee[key])}`
    }).join('&');
    console.log("queryString->")
    console.log(queryString)
    wx.navigateTo({
      url: `/package-referee/pages/profile_referee_edit/profile_referee_edit?${queryString}`
    })
  },

  gotoMatchesPage(e) {
    let matchList = e.currentTarget.dataset.list ?? []
    let matchIdList = matchList.map(match => match.matchId)
    wx.navigateTo({
      url: '/pages/pub/matches/matches?idList=' + encodeURIComponent(JSON.stringify(matchIdList)),
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
      url: '/pages/pub/teams/teams?idList=' + encodeURIComponent(JSON.stringify(teamIdList)),
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
      url: '/package-referee/pages/profile_referee_register/profile_referee_register',
    })
  },

  gotoRefereeNoticePage() {
    wx.navigateTo({
      url: '/package-referee/pages/profile_referee_notice/profile_referee_notice',
    })
  },
})