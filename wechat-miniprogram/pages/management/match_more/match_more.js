// pages/management/match_more/match_more.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const ANONYMITY = appInstance.globalData.ANONYMITY
const {
  formatTime
} = require("../../../utils/timeFormatter")

Page({
  data: {
    authorityId: 0,
    userId: Number,
    matchList: Array,
    manageMatchNumber: 0,
    manageMatchIdList: [],
    showManageMatchInvitationTeamInform: false,
    showManageMatchInvitationTeamDot: false,
    manageMatchInvitationTeamInform: [],
    newMatch: {
      name: '发起新比赛',
      team1: '主队',
      team2: '客队',
      icon1: '/assets/newplayer.png',
      icon2: '/assets/newplayer.png',
      score1: 0,
      score2: 0,
      hasBegun: true,
      time: String
    }
  },

  onLoad(options) {
    this.setData({
      authorityId: options.authorityId,
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
    appInstance.addToRequestQueue(this.fetchData)
    appInstance.addToRequestQueue(this.fetchUserId)
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
    appInstance.addToRequestQueue(this.fetchData)
    appInstance.addToRequestQueue(this.fetchUserId)
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
  fetchUserId(userId) {
    const that = this
    that.setData({
      userId: userId
    })
  },
  fetchData: function (userId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: URL + '/user/getUserManageMatch?userId=' + userId,
      success(res) {
        console.log("user manage matches->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        // 格式化时间
        let matchList = res.data ?? []
        for (let match of matchList) {
          let date = new Date(match.time)
          match.strTime = formatTime(date)
          match.hasBegun = match.status == 'PENDING' ? false : true
          match.awayTeamId = match.awayTeamId ?? 0
          match.awayTeam = match.awayTeam ?? {
            teamId: 0,
            name: "客队",
            logoUrl: ANONYMITY,
          }
        }
        let manageMatchIdList = res.data;
        let manageMatchNumber = res.data.length;
        that.setData({
          matchList: res.data,
          isMatchManager: res.data.length > 0 ? true : false,
          manageMatchIdList: res.data,
          manageMatchNumber: res.data.length,
          manageMatchInvitationTeamInform: []
        })
        for (let index = 0; index < manageMatchNumber; index++) {
          const match = manageMatchIdList[index];
          that.fetchManageMatchInvitationTeam(match.matchId);
        }
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });
  },

  gotoEditMatch: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/match_edit/match_edit?id=' + dataset.id,
    })
  },

  createNewMatch() {
    wx.navigateTo({
      url: '/pages/management/match_new/match_new',
    })
  },

  fetchManageMatchInvitationTeam(matchId) {
    const that = this
    wx.request({
      url: URL + '/match/team/getInvitations',
      data: {
        matchId: matchId,
      },
      success(res) {
        console.log("management/match_more page: fetch match invitations to team->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatManageMatchInvitationTeam(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  formatManageMatchInvitationTeam: function (invitations) {
    const that = this
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return `${invitation.matchId} 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 还未被处理您发出的邀请，邀请发起时间：${formattedDate}`
      } else if (invitation.status == "ACCEPTED") {
        return `${invitation.matchId} 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 已经同意参与您所创建的比赛，处理时间时间：${formattedDate}`
      } else if (invitation.status == "REJECTED") {
        return `${invitation.matchId} 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 已经拒绝参与您所创建的比赛，处理时间时间：${formattedDate}`
      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    that.setData({
      manageMatchInvitationTeamInform: this.data.manageMatchInvitationTeamInform.concat(informs),
      showManageMatchInvitationTeamDot: showDot
    });
  },

  formatManageEventInvitationTeam: function (invitations) {
    const that = this
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return `${invitation.eventId} 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 还未被处理您发出的邀请，邀请发起时间：${formattedDate}`
      } else if (invitation.status == "ACCEPTED") {
        return `${invitation.eventId} 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 已经同意参与您所创建的赛事，处理时间时间：${formattedDate}`
      } else if (invitation.status == "REJECTED") {
        return `${invitation.eventId} 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 已经拒绝参与您所创建的赛事，处理时间时间：${formattedDate}`
      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    that.setData({
      manageEventInvitationTeamInform: this.data.manageEventInvitationTeamInform.concat(informs),
      showManageEventInvitationTeamDot: showDot
    });
  },
  
  toggleManageMatchInvitationTeamInform: function () {
    this.setData({
      showManageMatchInvitationTeamInform: !this.data.showManageMatchInvitationTeamInform,
      showManageMatchInvitationTeamDot: false
    });
  },

  toggleManageEventInvitationTeamInform: function () {
    this.setData({
      showManageEventInvitationTeamInform: !this.data.showManageEventInvitationTeamInform,
      showManageEventInvitationTeamDot: false
    });
  },
})