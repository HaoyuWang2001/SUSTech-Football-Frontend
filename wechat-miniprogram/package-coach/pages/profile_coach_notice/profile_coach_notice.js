const appInstance = getApp()
const URL = appInstance.globalData.URL
// const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: Number,
    avatarUrl: '',
    nickName: '',

    playerId: Number,
    coachId: Number,
    refereeId: Number,
    manageTeamIdList: [],
    manageMatchIdList: [],
    manageEventIdList: [],
    isPlayer: false,
    isCoach: false,
    isReferee: false,
    isTeamManager: false,
    isMatchManager: false,
    isEventManager: false,

    manageTeamNumber: 0,
    manageMatchNumber: 0,
    manageEventNumber: 0,

    // 控制比赛通知和球队邀请通知的显示
    showPlayerMatchInform: false,
    showCoachMatchInform: false,
    showRefereeMatchInform: false,
    showPlayerInvitationInform: false,
    showCoachInvitationInform: false,
    showRefereeInvitationInformForMatch: false,
    showRefereeInvitationInformForEvent: false,
    showManageTeamApplicationInform: false,
    showManageTeamInvitationMatchInform: false,
    showManageTeamInvitationEventInform: false,
    showManageTeamInvitationPlayerInform: false,
    showManageMatchInvitationTeamInform: false,
    showManageEventInvitationTeamInform: false,

    // 控制红点的显示
    showPlayerMatchDot: false,
    showCoachMatchDot: false,
    showRefereeMatchDot: false,
    showPlayerInvitationDot: false,
    showCoachInvitationDot: false,
    showRefereeInvitationDotForMatch: false,
    showRefereeInvitationDotForEvent: false,
    showApplicationDot: false,
    showManageTeamApplicationDot: false,
    showManageTeamInvitationMatchDot: false,
    showManageTeamInvitationEventDot: false,
    showManageTeamInvitationPlayerDot: false,
    showManageMatchInvitationTeamDot: false,
    showManageEventInvitationTeamDot: false,

    playerInvitationInform: [],
    coachInvitationInform: [],
    refereeInvitationInformForMatch: [],
    refereeInvitationInformForEvent: [],
    playerMatchInform: [],
    coachMatchInform: [],
    refereeMatchInform: [],
    applicationsInform: [],
    manageTeamApplicationsInform: [],
    manageTeamInvitationMatchInform: [],
    manageTeamInvitationEventInform: [],
    manageTeamInvitationPlayerInform: [],
    manageEventInvitationTeamInform: [],
    manageMatchInvitationTeamInform: []
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
    appInstance.addToRequestQueue(this.fetchData)
    appInstance.addToRequestQueue(this.fetchUserId)
    this.setData({
      showPlayerMatchInform: false,
      showCoachMatchInform: false,
      showRefereeMatchInform: false,
      showPlayerInvitationInform: false,
      showCoachInvitationInform: false,
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

  // ------------------
  // fetch data

  fetchUserId(userId) {
    const that = this
    that.setData({
      userId: userId
    })
  },

  // 根据userId获取本页面全部数据
  fetchData: function (userId) {

    const that = this
    //教练身份
    that.fetchCoachId(userId)
  },

  // ------------------
  // fetch data: player
  postUserInfo(userId, avatarUrl, nickName) {
    const that = this
    console.log('avatarUrl')
    console.log(avatarUrl)
    wx.request({
      url: URL + '/user/update?userId=' + userId + '&avatarUrl=' + avatarUrl + '&nickName=' + nickName,
      method: 'POST',
      success(res) {
        console.log("mine page: postUserInfo->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchUserInfo(userId) {
    const that = this
    wx.request({
      url: URL + '/user/get?userId=' + userId,
      method: 'POST',
      success(res) {
        console.log("mine page: userInfo->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.setData({
          nickName: res.data.nickName,
          avatarUrl: res.data.avatarUrl
        })
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchPlayerId(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getPlayerId',
      data: {
        userId: userId
      },
      success(res) {
        console.log("mine page: playerId->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let playerId = res.data;
        that.setData({
          isPlayer: true,
          playerId: res.data
        })

        //球员身份：比赛信息
        that.fetchPlayerMatches(playerId)

        //球员身份：球队邀请
        that.fetchPlayerTeamInvitations(playerId)

        //球员身份：球队申请
        that.fetchPlayerTeamApplications(playerId)
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchPlayerMatches(playerId) {
    const that = this
    wx.request({
      url: URL + '/player/match/getAll',
      data: {
        playerId: playerId,
      },
      success(res) {
        console.log("mine page: fetch Player Matches->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatPlayerMatches(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchPlayerTeamInvitations(playerId) {
    const that = this
    wx.request({
      url: URL + '/player/team/getInvitations',
      data: {
        playerId: playerId,
      },
      success(res) {
        console.log("mine page: fetch Player Team Invitations->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatPlayerInvitations(res.data)
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchPlayerTeamApplications(playerId) {
    const that = this
    wx.request({
      url: URL + '/player/team/getApplications',
      data: {
        playerId: playerId,
      },
      success(res) {
        console.log("mine page: fetch Player Team Applications->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatApplications(res.data)
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  // ------------------
  // fetch data: coach

  fetchCoachId(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getCoachId',
      data: {
        userId: userId
      },
      success(res) {
        console.log("mine page: CoachId->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let coachId = res.data;
        that.setData({
          isCoach: true,
          coachId: coachId,
        })

        that.fetchCoachMatches(coachId)
        that.fetchCoachTeamInvitations(coachId)
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchCoachMatches(coachId) {
    const that = this
    wx.request({
      url: URL + '/coach/match/getAll',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("mine page: fetch Coach Matches->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatCoachMatches(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchCoachTeamInvitations(coachId) {
    const that = this
    wx.request({
      url: URL + '/coach/team/getInvitations',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("mine page: fetch Coach Invitations->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatCoachInvitations(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  // ------------------
  // fetch data: referee

  fetchRefereeId(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getRefereeId',
      data: {
        userId: userId
      },
      success(res) {
        console.log("mine page: RefereeId->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let refereeId = res.data
        that.setData({
          isReferee: true,
          refereeId: refereeId
        })

        that.fetchRefereeMatches(refereeId)
        that.fetchRefereeInvitationsForMatch(refereeId)
        that.fetchRefereeInvitationsForEvent(refereeId)

      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchRefereeMatches(refereeId) {
    const that = this
    wx.request({
      url: URL + '/referee/match/getAll',
      data: {
        refereeId: refereeId,
      },
      success(res) {
        console.log("mine page: fetch Referee Match->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatRefereeMatches(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
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

  // ------------------
  // fetch data: manager

  fetchManageTeamList(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getUserManageTeam',
      data: {
        userId: userId
      },
      success(res) {
        console.log("mine page: manageTeam->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let manageTeamIdList = res.data;
        let manageTeamNumber = res.data.length;
        that.setData({
          isTeamManager: res.data.length > 0 ? true : false,
          manageTeamApplicationsInform: [],
          manageTeamInvitationMatchInform: [],
          manageTeamInvitationEventInform: [],
          manageTeamInvitationPlayerInform: [],
          manageTeamIdList: res.data,
          manageTeamNumber: res.data.length
        })
        for (let index = 0; index < manageTeamNumber; index++) {
          const team = manageTeamIdList[index];
          console.log("team->")
          console.log(team.teamId)
          that.fetchManageTeamApplications(team.teamId, team.name);
          that.fetchManageTeamInvitationMatch(team.teamId, team.name);
          that.fetchManageTeamInvitationEvent(team.teamId, team.name);
          that.fetchManageTeamInvitationPlayer(team.teamId, team.name);
        }
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchManageTeamApplications: function (teamId, teamName) {
    const that = this
    wx.request({
      url: URL + '/team/player/getApplications',
      data: {
        teamId: teamId,
      },
      success(res) {
        console.log("mine page: fetch team application->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatManageTeamApplication(res.data, teamName);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchManageTeamInvitationMatch: function (teamId, teamName) {
    const that = this
    wx.request({
      url: URL + '/team/match/getInvitations',
      data: {
        teamId: teamId,
      },
      success(res) {
        console.log("mine page: fetch team invitations by match->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatManageTeamInvitationMatch(res.data, teamName);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchManageTeamInvitationEvent: function (teamId, teamName) {
    const that = this
    wx.request({
      url: URL + '/team/event/getInvitations',
      data: {
        teamId: teamId,
      },
      success(res) {
        console.log("mine page: fetch team invitations by event->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatManageTeamInvitationEvent(res.data, teamName);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchManageTeamInvitationPlayer: function (teamId, teamName) {
    const that = this
    wx.request({
      url: URL + '/team/player/getInvitations',
      data: {
        teamId: teamId,
      },
      success(res) {
        console.log("mine page: fetch team invitations to player->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatManageTeamInvitationPlayer(res.data, teamName);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchManageMatchList(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getUserManageMatch',
      data: {
        userId: userId
      },
      success(res) {
        console.log("mine page: manageMatch->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let manageMatchIdList = res.data;
        let manageMatchNumber = res.data.length;
        that.setData({
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
      },
      complete() {}
    });
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

  fetchManageEventList(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getUserManageEvent',
      data: {
        userId: userId
      },
      success(res) {
        console.log("mine page: manageEvent->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let manageEventIdList = res.data;
        let manageEventNumber = res.data.length;
        that.setData({
          isEventManager: res.data.length > 0 ? true : false,
          manageEventIdList: res.data,
          manageEventNumber: res.data.length,
          manageEventInvitationTeamInform: []
        })
        for (let index = 0; index < manageEventNumber; index++) {
          const event = manageEventIdList[index];
          console.log("event->")
          console.log(event.eventId)
          that.fetchManageEventInvitationTeam(event.eventId);
        }
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchManageEventInvitationTeam: function (eventId) {
    const that = this
    wx.request({
      url: URL + '/event/team/getInvitations',
      data: {
        eventId: eventId
      },
      success(res) {
        console.log("mine page: fetch event invitations to team->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.formatManageEventInvitationTeam(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  // ------------------
  // format applications

  formatApplications: function (applications) {
    const informs = applications.map(application => {
      const formattedDate = (application.lastUpdated != null) ? new Date(application.lastUpdated).toLocaleString() : ''; // 将时间戳转换为可读日期
      let stadus;
      if (application.status == "PENDING") {
        stadus = "正在审核中"
      } else if (application.status == "ACCEPTED") {
        stadus = "已被接受"
      } else if (application.status == "REJECTED") {
        stadus = "已被拒绝"
      }
      return `您对${application.team.name}（球队）的申请${stadus}：${formattedDate}`
    });
    let showDot = informs.length > 0 ? true : false;
    this.setData({
      applicationInform: informs,
      showApplicationDot: showDot,
    });
  },

  formatManageTeamApplication: function (applications, teamName) {
    const informs = applications.map(application => {
      const formattedDate = (application.lastUpdated != null) ? new Date(application.lastUpdated).toLocaleString() : ''; // 将时间戳转换为可读日期
      if (application.status == "PENDING") {
        return {
          content: `${application.player.name}（球员）于${formattedDate}对您所管理的球队 ${teamName} (teamId = ${application.teamId})发出了入队申请，请您进行审核`,
          teamId: application.teamId,
          playerId: application.player.playerId
        }
      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    this.setData({
      manageTeamApplicationsInform: this.data.manageTeamApplicationsInform.concat(informs),
      showManageTeamApplicationDot: showDot
    });
  },

  // ------------------
  // format invitations

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

  formatCoachInvitations: function (invitations) {
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return {
          content: `${invitation.team.name} 邀请您执教球队，邀请发起时间：${formattedDate}`,
          id: invitation.team.teamId,
        };
      } else if (invitation.status == "ACCEPTED") {

      } else if (invitation.status == "REJECTED") {

      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    this.setData({
      coachInvitationInform: informs,
      showCoachInvitationDot: showDot
    });
  },

  formatPlayerInvitations: function (invitations) {
    const that = this
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return {
          content: `${invitation.team.name} 邀请您加入球队，邀请发起时间：${formattedDate}`,
          id: invitation.team.teamId,
        };
      } else if (invitation.status == "ACCEPTED") {

      } else if (invitation.status == "REJECTED") {

      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    that.setData({
      playerInvitationInform: informs,
      showPlayerInvitationDot: showDot
    });
  },

  formatManageTeamInvitationMatch: function (invitations, teamName) {
    const that = this
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return {
          content: `${invitation.matchId} (MatchId) 邀请您所管理的 ${teamName} (球队)参与比赛，比赛的描述信息为：${invitation.description}，邀请发起时间：${formattedDate}`,
          teamId: invitation.teamId,
          matchId: invitation.matchId,
        };
      } else if (invitation.status == "ACCEPTED") {

      } else if (invitation.status == "REJECTED") {

      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    that.setData({
      manageTeamInvitationMatchInform: this.data.manageTeamInvitationMatchInform.concat(informs),
      showManageTeamInvitationMatchDot: showDot
    });
  },

  formatManageTeamInvitationEvent: function (invitations, teamName) {
    const that = this
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return {
          content: `${invitation.event.name} 赛事邀请您的管理的 ${teamName} (球队)参与，邀请发起时间：${formattedDate}`,
          eventId: invitation.event.eventId,
          teamId: invitation.teamId,
        };
      } else if (invitation.status == "ACCEPTED") {

      } else if (invitation.status == "REJECTED") {

      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    that.setData({
      manageTeamInvitationEventInform: this.data.manageTeamInvitationEventInform.concat(informs),
      showManageTeamInvitationEventDot: showDot
    });
  },

  formatManageTeamInvitationPlayer: function (invitations, teamName) {
    const that = this
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return `${teamName} （teamId = ${invitation.teamId}）所邀请 ${invitation.player.name}(球员) 还未被处理您发出的邀请，邀请发起时间：${formattedDate}`
      } else if (invitation.status == "ACCEPTED") {
        return `${teamName} （teamId = ${invitation.teamId}）所邀请 ${invitation.player.name}(球员) 已经同意加入您的球队，处理时间时间：${formattedDate}`
      } else if (invitation.status == "REJECTED") {
        return `${teamName} （teamId = ${invitation.teamId}）所邀请 ${invitation.player.name}(球员) 拒绝加入您的球队，处理时间时间：${formattedDate}`
      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    that.setData({
      manageTeamInvitationPlayerInform: this.data.manageTeamInvitationPlayerInform.concat(informs),
      showManageTeamInvitationPlayerDot: showDot
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

  // ------------------
  // format matches

  formatPlayerMatches: function (matches) {
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
      playerMatchInform: informs,
      showPlayerMatchDot: showDot,
    });
  },

  formatCoachMatches: function (matches) {
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
      coachMatchInform: informs,
      showCoachMatchDot: showDot,
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

  // ------------------
  uploadImage: function () {
    var that = this; // 保存当前上下文的this值
    // 打开相册或相机选择图片
    wx.chooseMedia({
      count: 1, // 默认为9，设置为1表示只选择一张图片
      mediaType: ['image'],
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表
        console.log(res.tempFiles)
        var tempFilePath = res.tempFiles[0].tempFilePath;
        // 选取完成后，上传到服务器
        wx.showLoading({
          title: '上传头像，请稍后',
          mask: true,
        })
        wx.uploadFile({
          url: URL + '/upload', // 你的上传图片的服务器API地址
          filePath: tempFilePath,
          name: 'file', // 必须填写，因为后台需要根据name键来获取文件内容
          success: function (uploadRes) {
            console.log('profile coach register: uploadImage ->')
            console.log(uploadRes)
            if (uploadRes.statusCode != 200) {
              console.error("请求失败，状态码为：" + uploadRes.statusCode + "; 错误信息为：" + uploadRes.data)
              wx.showToast({
                title: '上传头像失败，请检查网络！', // 错误信息文本
                icon: 'error', // 'none' 表示不显示图标，其他值如'success'、'loading'
                duration: 2000 // 持续时间
              });
              return
            }
            var filename = uploadRes.data;
            that.setData({
              avatarUrl: URL + '/download?filename=' + filename
            });
            let avatarUrl = that.data.avatarUrl
            let userId = that.data.userId
            let nickName = that.data.nickName
            that.postUserInfo(userId, avatarUrl, nickName)
            wx.hideLoading()
            
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000,
            });
           
          },
          fail: function (error) {
            console.log('上传失败', error);
            wx.hideLoading()
            wx.showToast({
              title: '上传头像失败，请检查网络！', // 错误信息文本
              icon: 'error', // 'none' 表示不显示图标，其他值如'success'、'loading'
              duration: 2000 // 持续时间
            });
          }
        })
      }
    })
  },

  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl: avatarUrl,
    })
    appInstance.globalData.avatarUrl = avatarUrl
    // 或者使用异步方式保存
    wx.setStorage({
      key: 'avatarUrl',
      data: avatarUrl,
      success: function () {
        console.log('用户头像URL已保存到本地存储');
      },
      fail: function (e) {
        console.error('保存用户头像URL到本地存储失败', e);
      }
    });
  },

  // ------------------
  // 切换比赛通知的显示状态

  togglePlayerMatchInform: function () {
    this.setData({
      showPlayerMatchInform: !this.data.showPlayerMatchInform,
      showPlayerMatchDot: false
    });
  },

  toggleCoachMatchInform: function () {
    this.setData({
      showCoachMatchInform: !this.data.showCoachMatchInform,
      showCoachMatchDot: false
    });
  },

  toggleRefereeMatchInform: function () {
    this.setData({
      showRefereeMatchInform: !this.data.showRefereeMatchInform,
      showRefereeMatchDot: false
    });
  },

  // ------------------
  // 切换球队邀请通知的显示状态

  togglePlayerInvitationInform: function () {
    this.setData({
      showPlayerInvitationInform: !this.data.showPlayerInvitationInform,
      showPlayerInvitationDot: false
    });
  },

  toggleCoachInvitationInform: function () {
    this.setData({
      showCoachInvitationInform: !this.data.showCoachInvitationInform,
      showCoachInvitationDot: false
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

  toggleManageTeamInvitationMatchInform: function () {
    this.setData({
      showManageTeamInvitationMatchInform: !this.data.showManageTeamInvitationMatchInform,
      showManageTeamInvitationMatchDot: false
    });
  },

  toggleManageTeamInvitationEventInform: function () {
    this.setData({
      showManageTeamInvitationEventInform: !this.data.showManageTeamInvitationEventInform,
      showManageTeamInvitationEventDot: false
    });
  },

  toggleManageTeamInvitationPlayerInform: function () {
    this.setData({
      showManageTeamInvitationPlayerInform: !this.data.showManageTeamInvitationPlayerInform,
      showManageTeamInvitationPlayerDot: false
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
  // ------------------
  // 切换申请加入球队通知的显示状态

  toggleApplicationInform: function () {
    this.setData({
      showApplicationInform: !this.data.showApplicationInform,
      showApplicationDot: false
    });
  },

  // ------------------
  // 切换球队管理员处理申请通知的显示状态

  toggleManageTeamApplicationInform: function () {
    this.setData({
      showManageTeamApplicationInform: !this.data.showManageTeamApplicationInform,
      showManageTeamApplicationDot: false
    });
  },
  // ------------------
  // 弹出 modal 用来同意或拒绝邀请

  showPlayerTeamInvitationModal(e) {
    let teamId = e.currentTarget.dataset.id
    wx.showModal({
      title: '球队邀请',
      content: `是否加入球队？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      success: (res) => {
        if (res.confirm) {
          this.playerReplyTeamInvitation(true, teamId);
        } else if (res.cancel) {
          this.playerReplyTeamInvitation(false, teamId);
        }
      }
    });
  },

  showCoachTeamInvitationModal(e) {
    let teamId = e.currentTarget.dataset.id
    wx.showModal({
      title: '执教邀请',
      content: `是否接受球队执教邀请？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      success: (res) => {
        if (res.confirm) {
          this.coachReplyTeamInvitation(true, teamId);
        } else if (res.cancel) {
          this.coachReplyTeamInvitation(false, teamId);
        }
      }
    });
  },

  showRefereeEventInvitationModal(e) {
    let eventId = e.currentTarget.dataset.id
    wx.showModal({
      title: '赛事执法',
      content: `是否接受赛事执法邀请？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      success: (res) => {
        if (res.confirm) {
          this.refereeReplyEventInvitation(true, eventId);
        } else if (res.cancel) {
          this.refereeReplyEventInvitation(false, eventId);
        }
      }
    });
  },

  showRefereeMatchInvitationModal(e) {
    let matchId = e.currentTarget.dataset.id
    wx.showModal({
      title: '比赛执法',
      content: `是否接受比赛执法邀请？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      success: (res) => {
        if (res.confirm) {
          this.refereeReplyMatchInvitation(true, matchId);
        } else if (res.cancel) {
          this.refereeReplyMatchInvitation(false, matchId);
        }
      }
    });
  },

  showManageTeamApplicationModal(e) {
    let playerId = e.currentTarget.dataset.playerId
    let teamId = e.currentTarget.dataset.teamId
    console.log(playerId)
    console.log(teamId)
    wx.showModal({
      title: '球员申请',
      content: `是否同意该球员加入球队？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      success: (res) => {
        if (res.confirm) {
          this.teamManagerReplyApplication(true, playerId, teamId);
        } else if (res.cancel) {
          this.teamManagerReplyApplication(false, playerId, teamId);
        }
      }
    });
  },

  showManageTeamInvitationMatchModal(e) {
    let matchId = e.currentTarget.dataset.matchId
    let teamId = e.currentTarget.dataset.teamId
    console.log(matchId)
    console.log(teamId)
    wx.showModal({
      title: '比赛邀请',
      content: `是否同意参与该比赛？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      success: (res) => {
        if (res.confirm) {
          this.teamManagerReplyInvitationMatch(true, matchId, teamId);
        } else if (res.cancel) {
          this.teamManagerReplyInvitationMatch(false, matchId, teamId);
        }
      }
    });
  },

  showManageTeamInvitationEventModal(e) {
    let eventId = e.currentTarget.dataset.eventId
    let teamId = e.currentTarget.dataset.teamId
    console.log(eventId)
    console.log(teamId)
    wx.showModal({
      title: '比赛邀请',
      content: `是否同意参与该比赛？`,
      cancelText: '拒绝',
      cancelColor: '#FF0000',
      confirmText: '接受',
      confirmColor: '#1cb72d',
      success: (res) => {
        if (res.confirm) {
          this.teamManagerReplyInvitationEvent(true, eventId, teamId);
        } else if (res.cancel) {
          this.teamManagerReplyInvitationEvent(false, eventId, teamId);
        }
      }
    });
  },
  // ------------------
  // 同意/拒绝各邀请, accepted=true/false

  playerReplyTeamInvitation(accept, teamId) {
    const that = this
    const playerId = Number(this.data.playerId)
    teamId = Number(teamId)
    accept = Boolean(accept)

    wx.showLoading({
      title: '正在提交',
      mask: true,
    })

    wx.request({
      url: URL + '/player/team/replyInvitation?playerId=' + playerId + '&teamId=' + teamId + '&accept=' + accept,
      method: "POST",
      success(res) {
        console.log("mine page: player Reply Team Invitation ->")
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
        console.log("回复球队邀请成功")
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
        wx.hideLoading()
        that.fetchPlayerTeamInvitations(that.data.playerId)
      }
    })
  },

  coachReplyTeamInvitation(accept, teamId) {
    const that = this
    const coachId = Number(this.data.coachId)
    teamId = Number(teamId)
    accept = Boolean(accept)

    wx.showLoading({
      title: '正在提交',
      mask: true,
    })

    wx.request({
      url: URL + '/coach/team/replyInvitation?coachId=' + coachId + '&teamId=' + teamId + '&accept=' + accept,
      method: "POST",
      success(res) {
        console.log("mine page: coach Reply Team Invitation ->")
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
        console.log("回复球队邀请成功")
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
        wx.hideLoading()
        that.fetchCoachTeamInvitations(that.data.coachId)
      }
    })
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

  teamManagerReplyApplication(accept, playerId, teamId) {
    const that = this
    teamId = Number(teamId)
    playerId = Number(playerId)
    accept = Boolean(accept)

    wx.showLoading({
      title: '正在提交',
      mask: true,
    })

    wx.request({
      url: URL + '/team/player/replyApplication?teamId=' + teamId + '&playerId=' + playerId + '&accept=' + accept,
      method: "POST",
      success(res) {
        console.log("mine page: Team Reply Player Application ->")
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
        console.log("回复球员申请成功")
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
        wx.hideLoading()
        that.fetchManageTeamList(that.data.userId)
      }
    })
  },

  teamManagerReplyInvitationMatch(accept, matchId, teamId) {
    const that = this
    teamId = Number(teamId)
    matchId = Number(matchId)
    accept = Boolean(accept)

    wx.showLoading({
      title: '正在提交',
      mask: true,
    })

    wx.request({
      url: URL + '/team/match/replyInvitation?teamId=' + teamId + '&matchId=' + matchId + '&accept=' + accept,
      method: "POST",
      success(res) {
        console.log("mine page: Team Reply Match Invitation ->")
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
        console.log("回复比赛邀请成功")
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
        wx.hideLoading()
        that.fetchManageTeamList(that.data.userId)
      }
    })
  },

  teamManagerReplyInvitationEvent(accept, eventId, teamId) {
    const that = this
    teamId = Number(teamId)
    eventId = Number(eventId)
    accept = Boolean(accept)

    wx.showLoading({
      title: '正在提交',
      mask: true,
    })

    wx.request({
      url: URL + '/team/event/replyInvitation?teamId=' + teamId + '&eventId=' + eventId + '&accept=' + accept,
      method: "POST",
      success(res) {
        console.log("mine page: Team Reply Event Invitation ->")
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
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
        wx.hideLoading()
        that.fetchManageTeamList(that.data.userId)
      }
    })
  },

})