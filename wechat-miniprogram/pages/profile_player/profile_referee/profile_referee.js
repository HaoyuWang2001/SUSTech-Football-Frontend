// pages/profile_player/profile_referee/profile_referee.js
const app = getApp()
const URL = app.globalData.URL
const {
  formatTime
} = require("../../../utils/timeFormatter")
const {showModal} = require("../../../utils/modal")

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

    showRefereeMatchInform: false,
    showRefereeInvitationInformForMatch: false,
    showRefereeInvitationInformForEvent: false,

    showRefereeMatchDot: false,
    showRefereeInvitationDotForMatch: false,
    showRefereeInvitationDotForEvent: false,

    refereeInvitationInformForMatch: [],
    refereeInvitationInformForEvent: [],
    refereeMatchInform: [],
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
    app.addToRequestQueue(this.fetchRefereeId)
    this.setData({
      showRefereeMatchInform: false,
      showRefereeInvitationInformForMatch: false,
      showRefereeInvitationInformForEvent: false,
    })
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
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let refereeId = res.data
        that.setData({
          refereeId: refereeId
        })
        that.fetchData(refereeId)
        that.fetchRefereeMatches(refereeId)
        that.fetchRefereeEvents(refereeId)
        that.fetchRefereeInvitationsForMatch(refereeId)
        that.fetchRefereeInvitationsForEvent(refereeId)
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  // 拉取裁判个人信息
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

  // 拉取比赛
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
        that.formatRefereeMatches(res.data);
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  // 拉取赛事
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

  // 页面跳转
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
      url: `/pages/profile_player/profile_referee_edit/profile_referee_edit?${queryString}`
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

  gotoRegisterPage() {
    wx.navigateTo({
      url: '/pages/profile_player/profile_referee_register/profile_referee_register',
    })
  },

  gotoRefereeNoticePage() {
    wx.navigateTo({
      url: '/pages/profile_player/profile_referee_notice/profile_referee_notice',
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
        console.log("mine page: fetch Referee Invitations For Match->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatRefereeInvitationsForMatch(res.data);
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
        console.log("mine page: fetch Referee Invitations For Event->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatRefereeInvitationsForEvent(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  formatRefereeInvitationsForMatch: function (invitations) {
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      let matchTime = new Date(invitation.match.time).toLocaleString();
      if (invitation.status == "PENDING") {
        return {
          content: `邀请您执法${invitation.match.homeTeam.name}对阵${invitation.match.awayTeam.name}，比赛时间为${matchTime}, 邀请发起时间：${formattedDate}`,
          id: invitation.match.matchId,
        };
      } else if (invitation.status == "ACCEPTED") {

      } else if (invitation.status == "REJECTED") {

      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    this.setData({
      refereeInvitationInformForMatch: informs,
      showRefereeInvitationDotForMatch: showDot,
    });
  },

  formatRefereeInvitationsForEvent: function (invitations) {
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return {
          content: `邀请您执法赛事：${invitation.event.name}, 邀请发起时间：${formattedDate}`,
          id: invitation.event.eventId,
        };
      } else if (invitation.status == "ACCEPTED") {

      } else if (invitation.status == "REJECTED") {

      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    this.setData({
      refereeInvitationInformForEvent: informs,
      showRefereeInvitationDotForEvent: showDot
    });
  },

  formatRefereeMatches: function (matches) {
    const informs = matches.map(match => {
      const matchDay = new Date(match.time);
      const nowDay = new Date();
      if (matchDay < nowDay) return null;
      else {
        let differenceInDays = (matchDay - nowDay) / (1000 * 60 * 60 * 24);
        if (differenceInDays <= 14)
          return `你在${matchDay.toLocaleString()}有一场比赛`;
      }
      return null;
    }).filter(inform => inform !== null);
    const showDot = informs.length > 0 ? true : false
    this.setData({
      refereeMatchInform: informs,
      showRefereeMatchDot: showDot,
    });
  },

  toggleRefereeMatchInform: function () {
    this.setData({
      showRefereeMatchInform: !this.data.showRefereeMatchInform,
      showRefereeMatchDot: false
    });
  },
  toggleRefereeInvitationInformForMatch: function () {
    this.setData({
      showRefereeInvitationInformForMatch: !this.data.showRefereeInvitationInformForMatch,
      showRefereeInvitationDotForMatch: false
    });
  },

  toggleRefereeInvitationInformForEvent: function () {
    this.setData({
      showRefereeInvitationInformForEvent: !this.data.showRefereeInvitationInformForEvent,
      showRefereeInvitationDotForEvent: false
    });
  },

  showRefereeEventInvitationModal(e) {
    let eventId = e.currentTarget.dataset.id
    showModal({
      title: '赛事执法',
      content: `是否接受赛事执法邀请？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      onComfirm: () => {
        this.refereeReplyEventInvitation(true, eventId);
      },
      onCancel: () => {
        this.refereeReplyEventInvitation(false, eventId);
      },
    });
  },

  showRefereeMatchInvitationModal(e) {
    let matchId = e.currentTarget.dataset.id
    showModal({
      title: '比赛执法',
      content: `是否接受比赛执法邀请？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      onComfirm: () => {
        this.refereeReplyMatchInvitation(true, matchId);
      },
      onCancel: () => {
        this.refereeReplyMatchInvitation(false, matchId);
      },
    });
  },

  refereeReplyEventInvitation(accept, eventId) {
    const that = this
    const refereeId = Number(this.data.refereeId)
    eventId = Number(eventId)
    accept = Boolean(accept)

    wx.showLoading({
      title: '正在提交',
      mask: true,
    })

    wx.request({
      url: URL + '/referee/event/replyInvitation?refereeId=' + refereeId + '&eventId=' + eventId + '&accept=' + accept,
      method: "POST",
      success(res) {
        console.log("mine page: referee Reply Event Invitation ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '回复失败',
            icon: 'error',
          })
          return
        }
        wx.showToast({
          title: '回复成功',
          icon: 'success',
        })
        console.log("回复赛事邀请成功")
        app.addToRequestQueue(that.fetchRefereeId)
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
        wx.hideLoading()
        that.fetchRefereeInvitationsForEvent(that.data.refereeId)
      }
    })
  },

  refereeReplyMatchInvitation(accept, matchId) {
    const that = this
    const refereeId = Number(this.data.refereeId)
    matchId = Number(matchId)
    accept = Boolean(accept)

    wx.showLoading({
      title: '正在提交',
      mask: true,
    })

    wx.request({
      url: URL + '/referee/match/replyInvitation?refereeId=' + refereeId + '&matchId=' + matchId + '&accept=' + accept,
      method: "POST",
      success(res) {
        console.log("mine page: referee Reply Match Invitation ->")
        if (res.statusCode != 200) {
          console.error("请求失败" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '回复失败',
            icon: 'error',
          })
          return
        }
        wx.showToast({
          title: '回复成功',
          icon: 'success',
        })
        console.log("回复比赛邀请成功")
        app.addToRequestQueue(that.fetchRefereeId)
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
        wx.hideLoading()
        that.fetchRefereeInvitationsForMatch(that.data.refereeId)
      }
    })
  },
})