// pages/mine/mine.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    userId: -1,

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

    showPlayerInvitationDot: false,
    showCoachInvitationDot: false,
    showRefereeInvitationDotForEvent: false,
    showRefereeInvitationDotForMatch: false,
    showManageTeamApplicationDot: false,
    showManageTeamInvitationMatchDot: false,
    showManageTeamInvitationEventDot: false,

    playerInvitationInform: [],
    coachInvitationInform: [],
    refereeInvitationInformForMatch: [],
    refereeInvitationInformForEvent: [],
    manageTeamApplicationsInform: [],
    manageTeamInvitationMatchInform: [],
    manageTeamInvitationEventInform: [],
    isLoading: true, // 新增：加载状态

    notifications: [],
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
      isLoading: true,
      userId: userId
    })
    appInstance.addToRequestQueue(this.fetchData)
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
      isLoading: true,
      userId: userId
    })
    appInstance.addToRequestQueue(this.fetchData)
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

  initNotifications(){
    this.setData({
      notifications:[
        {
          key:"playerInvitation",
          title:"球员身份：球队邀请通知",
          visible:this.data.isPlayer,
          open:false,
          showRedDot:this.data.showPlayerInvitationDot,
          list:this.data.playerInvitationInform,
          hint:"点击邀请可选择接受或拒绝",
          emptyText:"您还没有收到任何球队发出的邀请，可以尝试申请加入球队",
          event:"playerTeamInvitation"
        },
        {
          key:"coachInvitation",
          title:"教练身份：球队邀请通知",
          visible:this.data.isCoach,
          open:false,
          showRedDot:this.data.showCoachInvitationDot,
          list:this.data.coachInvitationInform,
          hint:"点击邀请可选择接受或拒绝",
          emptyText:"您还没有收到任何球队发出的邀请，但是您无法主动申请加入球队，您可以通过与球队管理员私聊，来让对方邀请您执教其球队",
          event:"coachTeamInvitation"
        },
        {
          key:"refereeEventInvitation",
          title:"裁判身份：赛事邀请通知",
          visible:this.data.isReferee,
          open:false,
          showRedDot:this.data.showRefereeInvitationDotForEvent,
          list:this.data.refereeInvitationInformForEvent,
          hint:"点击邀请可选择接受或拒绝",
          emptyText:"您还没有收到任何赛事发出的邀请",
          event:"refereeEventInvitation"
        },
        {
          key:"refereeMatchInvitation",
          title:"裁判身份：比赛邀请通知",
          visible:this.data.isReferee,
          open:false,
          showRedDot:this.data.showRefereeInvitationDotForMatch,
          list:this.data.refereeInvitationInformForMatch,
          hint:"点击邀请可选择接受或拒绝",
          emptyText:"您还没有收到任何比赛发出的邀请",
          event:"refereeMatchInvitation"
        },
        {
          key:"managerTeamApplicationPlayer",
          title:"球队管理员身份：球员申请入队",
          visible:this.data.isTeamManager,
          open:false,
          showRedDot:this.data.showManageTeamApplicationDot,
          list:this.data.manageTeamApplicationsInform,
          hint:"点击审核可选择接受或拒绝",
          emptyText:"您的球队还没有收到任何球员发出的申请",
          event:"managerTeamApplicationPlayer"
        },
        {
          key:"managerTeamInvitationMatch",
          title:"球队管理员身份：比赛邀请通知",
          visible:this.data.isTeamManager,
          open:false,
          showRedDot:this.data.showManageTeamInvitationMatchDot,
          list:this.data.manageTeamInvitationMatchInform,
          hint:"点击审核可选择接受或拒绝",
          emptyText:"您的球队还没有收到任何比赛发出的邀请",
          event:"managerTeamInvitationMatch"
        },
        {
          key:"managerTeamInvitationEvent",
          title:"球队管理员身份：赛事邀请通知",
          visible:this.data.isTeamManager,
          open:false,
          showRedDot:this.data.showManageTeamInvitationEventDot,
          list:this.data.manageTeamInvitationEventInform,
          hint:"点击审核可选择接受或拒绝",
          emptyText:"您的球队还没有收到任何赛事发出的邀请",
          event:"managerTeamInvitationEvent"
        },
      ]
    })
  },

  handleNotificationClick(e){
    const item = e.detail.item
    const type = e.currentTarget.dataset.event
    switch(type){
      case "playerTeamInvitation":
        this.showPlayerTeamInvitationModal(item)
        break
      case "coachTeamInvitation":
        this.showCoachTeamInvitationModal(item)
        break
      case "refereeEventInvitation":
        this.showRefereeEventInvitationModal(item)
        break
      case "refereeMatchInvitation":
        this.showRefereeMatchInvitationModal(item)
        break
      case "managerTeamApplicationPlayer":
        this.showManageTeamApplicationModal(item)
        break
      case "managerTeamInvitationMatch":
        this.showManageTeamInvitationMatchModal(item)
        break
      case "managerTeamInvitationEvent":
        this.showManageTeamInvitationEventModal(item)
        break
    }
  },

  toggleNotification(e){
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.event
    const list = this.data.notifications
    list[index].open = !list[index].open
    switch(type){
      case "playerTeamInvitation":
        this.showPlayerTeamInvitationModal(item)
        break
      case "coachTeamInvitation":
        this.showCoachTeamInvitationModal(item)
        break
      case "refereeEventInvitation":
        this.showRefereeEventInvitationModal(item)
        break
      case "refereeMatchInvitation":
        this.showRefereeMatchInvitationModal(item)
        break
      case "managerTeamApplicationPlayer":
        this.showManageTeamApplicationModal(item)
        break
      case "managerTeamInvitationMatch":
        this.showManageTeamInvitationMatchModal(item)
        break
      case "managerTeamInvitationEvent":
        this.showManageTeamInvitationEventModal(item)
        break
    }
    list[index].showRedDot = false
    this.setData({
      notifications:list
    })
  },


  fetchData: function () {
    const that = this

    // fetchData执行完成后立即隐藏loading
    // 注意：这里使用setTimeout确保在函数执行完成后更新状态
    setTimeout(() => {
      that.setData({
        isLoading: false
      })
    }, 0)

    that.fetchUserInfo(userId)
    //球员相关
    that.fetchPlayerId(userId)
    //教练身份
    that.fetchCoachId(userId)
    //裁判身份
    that.fetchRefereeId(userId)
    //球队管理员身份
    that.fetchManageTeamList(userId)
    //比赛管理员身份
    that.fetchManageMatchList(userId)
    //赛事管理员身份
    that.fetchManageEventList(userId)
  },

  postUserInfo(userId, avatarUrl, nickName) {
    const that = this
    console.log('avatarUrl')
    console.log(avatarUrl)
    wx.request({
      url: URL + '/user/update?userId=' + encodeURIComponent(userId) + '&avatarUrl=' + encodeURIComponent(avatarUrl) + '&nickName=' + encodeURIComponent(nickName),
      method: 'POST',
      success(res) {
        console.log("pages/mine: postUserInfo->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.setData({
          avatarUrl,
          nickName
        })
      },
      fail(err) {
        console.error('请求失败', err);
      },
      complete() {}
    });
  },

  // 更改昵称
  openChangeNickNameModal() {
    const that = this
    wx.showModal({
      title: '更改昵称',
      editable: true,
      placeholderText: '10字以内',
      complete: (res) => {
        if (res.confirm) {
          let avatarUrl = that.data.avatarUrl
          let userId = that.data.userId
          let nickName = res.content
          if (nickName.length > 10) {
            wx.showToast({
              title: '昵称过长！',
              icon: 'error'
            })
            return
          }
          that.postUserInfo(userId, avatarUrl, nickName)
        }
      }
    })
  },

  fetchUserInfo(userId) {
    const that = this
    wx.request({
      url: URL + '/user/get?userId=' + userId,
      method: 'POST',
      success(res) {
        console.log("pages/mine: fetchUserInfo->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          nickName: res.data.nickName,
          avatarUrl: res.data.avatarUrl
        })
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchPlayerId->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
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

        that.initNotifications()
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchPlayerMatches->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatPlayerMatches(res.data);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchPlayerTeamInvitations->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatPlayerInvitations(res.data)
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchPlayerTeamApplications->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatApplications(res.data)
      },
      fail(err) {
        console.error('请求失败', err);
      },
    });
  },

  fetchCoachId(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getCoachId',
      data: {
        userId: userId
      },
      success(res) {
        console.log("pages/mine: fetchCoachId->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let coachId = res.data;
        that.setData({
          isCoach: true,
          coachId: coachId,
        })
        that.fetchCoachMatches(coachId)
        that.fetchCoachTeamInvitations(coachId)

        that.initNotifications()
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchCoachMatches->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatCoachMatches(res.data);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetch Coach Invitations->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatCoachInvitations(res.data);
      },
      fail(err) {
        console.error('请求失败', err);
      },
    });
  },

  fetchRefereeId(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getRefereeId',
      data: {
        userId: userId
      },
      success(res) {
        console.log("pages/mine: fetchRefereeId->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let refereeId = res.data
        that.setData({
          isReferee: true,
          refereeId: refereeId
        })
        that.fetchRefereeMatches(refereeId)
        that.fetchRefereeInvitationsForMatch(refereeId)
        that.fetchRefereeInvitationsForEvent(refereeId)

        that.initNotifications()
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchRefereeMatches->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatRefereeMatches(res.data);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchRefereeInvitationsForMatch->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatRefereeInvitationsForMatch(res.data);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchRefereeInvitationsForEvent->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatRefereeInvitationsForEvent(res.data);
      },
      fail(err) {
        console.error('请求失败', err);
      },
    });
  },

  fetchManageTeamList(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getUserManageTeam',
      data: {
        userId: userId
      },
      success(res) {
        console.log("pages/mine: fetchManageTeamList->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
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
          that.fetchManageTeamApplications(team.teamId, team.name);
          that.fetchManageTeamInvitationMatch(team.teamId, team.name);
          that.fetchManageTeamInvitationEvent(team.teamId, team.name);
          that.fetchManageTeamInvitationPlayer(team.teamId, team.name);
        }

        that.initNotifications()
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchManageTeam Applications->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageTeamApplication(res.data, teamName);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchManageTeam InvitationMatch->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageTeamInvitationMatch(res.data, teamName);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchManageTeam InvitationEvent->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageTeamInvitationEvent(res.data, teamName);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchManageTeam InvitationPlayer->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageTeamInvitationPlayer(res.data, teamName);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchManageMatch->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
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
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchManageMatch InvitationTeam->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageMatchInvitationTeam(res.data);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchManageEventList->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
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
        console.error('请求失败', err);
      },
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
        console.log("pages/mine: fetchManageEvent InvitationTeam->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageEventInvitationTeam(res.data);
      },
      fail(err) {
        console.error('请求失败', err);
      },
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
    this.setData({
      applicationInform: informs,
    });
    this.initNotifications()
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
    this.setData({
      manageTeamApplicationsInform: this.data.manageTeamApplicationsInform.concat(informs),
    });
    this.initNotifications()
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
    this.setData({
      refereeInvitationInformForMatch: informs,
    });
    this.initNotifications()
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
    this.setData({
      refereeInvitationInformForEvent: informs,
    });
    this.initNotifications()
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
    });
    this.initNotifications()
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
    that.setData({
      playerInvitationInform: informs,
    });
    that.initNotifications()
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
    that.setData({
      manageTeamInvitationMatchInform: this.data.manageTeamInvitationMatchInform.concat(informs),
    });
    that.initNotifications()
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
    that.setData({
      manageTeamInvitationEventInform: this.data.manageTeamInvitationEventInform.concat(informs),
    });
    that.initNotifications()
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
    that.initNotifications()
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
    that.initNotifications()
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
    that.initNotifications()
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
    this.initNotifications()
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
    this.initNotifications()
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
    this.initNotifications()
  },

  // ------------------
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl: avatarUrl,
    })
    var that = this;
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
    wx.uploadFile({
      url: URL + '/upload', // 你的上传图片的服务器API地址
      filePath: avatarUrl,
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
        wx.hideLoading()
        console.log("pages/mine: player Reply Team Invitation ->")
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
        wx.hideLoading()
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
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
        wx.hideLoading()
        console.log("pages/mine: coach Reply Team Invitation ->")
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
        wx.hideLoading()
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
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
        wx.hideLoading()
        console.log("pages/mine: referee Reply Event Invitation ->")
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
        wx.hideLoading()
        console.error('请求失败：', err.statusCode, err.errMsg);
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
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
        wx.hideLoading()
        console.log("pages/mine: referee Reply Match Invitation ->")
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
        wx.hideLoading()
        console.error('请求失败：', err.statusCode, err.errMsg);
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
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
        wx.hideLoading()
        console.log("pages/mine: Team Reply Player Application ->")
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
        wx.hideLoading()
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
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
        wx.hideLoading()
        console.log("pages/mine: Team Reply Match Invitation ->")
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
        wx.hideLoading()
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
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
        wx.hideLoading()
        console.log("pages/mine: Team Reply Event Invitation ->")
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
        wx.hideLoading()
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
      },
      complete() {
        that.fetchManageTeamList(that.data.userId)
      }
    })
  },

  gotoSportCenterPage() {
    wx.navigateTo({
      url: '/package-mine/pages/sport_center_login/sport_center_login',
    })
  },

  gotoSecondAuthorityPage() {
    wx.navigateTo({
      url: '/package-mine/pages/second_authority_login/second_authority_login',
    })
  },

  gotoManagementPage() {
    wx.navigateTo({
      url: '../management/management',
    })
  },
})