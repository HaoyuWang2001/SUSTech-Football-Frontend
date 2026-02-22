const appInstance = getApp()
const URL = appInstance.globalData.URL
const ANONYMITY = appInstance.globalData.ANONYMITY
const {
  formatTime
} = require("../../../../utils/timeFormatter")

Page({

  data: {
    matchList: Array,
  },

  onShow() {
    this.fetchData()
  },

  onPullDownRefresh() {
    this.fetchData()
    wx.stopPullDownRefresh()
  },

  fetchData: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    // 模拟网络请求
    wx.request({
      url: `${URL}/match/getAllFriendlyMatches`,
      success(res) {
        console.log("all match->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
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
          console.log("match->")
          console.log(match.matchId)
          that.fetchManageMatchInvitationTeam(match.matchId);
        }
      },
      fail(err) {
        console.log('请求失败', err);
        // 可以显示失败的提示信息，或者做一些错误处理
      },
      complete() {
        // 无论请求成功还是失败都会执行
        wx.hideLoading(); // 关闭加载提示框
      }
    });
  },

  // 跳转到编辑比赛页面
  gotoEditMatch: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/match_edit/match_edit?id=' + dataset.id,
    })
  },

  // 跳转到创建比赛页面
  createNewMatch() {
    wx.navigateTo({
      url: 'match_new/match_new',
    })
  },
  fetchManageMatchInvitationTeam: function (matchId) {
    const that = this
    wx.request({
      url: URL + '/match/team/getInvitations',
      data: {
        matchId: matchId,
      },
      success(res) {
        console.log("mine page: fetch match invitations to team->")
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