const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showManageTeamApplicationDot: false,
    showManageTeamInvitationMatchDot: false,
    showManageTeamInvitationEventDot: false,
    showManageTeamInvitationPlayerDot: false,

    manageTeamApplicationsInform: [],
    manageTeamInvitationMatchInform: [],
    manageTeamInvitationEventInform: [],
    manageTeamInvitationPlayerInform: [],
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
          key:"managerTeamApplication",
          title:"球员申请入队通知",
          visible:true,
          open:false,
          showRedDot:this.data.showManageTeamApplicationDot,
          list:this.data.manageTeamApplicationsInform,
          hint:"点击审核可选择接受或拒绝",
          emptyText:"您还没有收到任何球员发出的申请",
          event:"managerTeamApplication"
        },
        {
          key:"managerTeamInvitationMatch",
          title:"友谊赛邀请通知",
          visible:true,
          open:false,
          showRedDot:this.data.showManageTeamInvitationMatchDot,
          list:this.data.manageTeamInvitationMatchInform,
          hint:"点击审核可选择接受或拒绝",
          emptyText:"您还没有收到任何球队发出的友谊赛邀请",
          event:"managerTeamInvitationMatch"
        },
        {
          key:"managerTeamInvitationEvent",
          title:"赛事邀请通知",
          visible:true,
          open:false,
          showRedDot:this.data.showManageTeamInvitationEventDot,
          list:this.data.manageTeamInvitationEventInform,
          hint:"点击审核可选择接受或拒绝",
          emptyText:"您还没有收到任何赛事发出的邀请",
          event:"managerTeamInvitationEvent"
        },
        {
          key:"managerTeamInvitationPlayer",
          title:"邀请球员入队 - 回复",
          visible:true,
          open:false,
          showRedDot:this.data.showManageTeamInvitationPlayerDot,
          list:this.data.manageTeamInvitationPlayerInform,
          hint:"",
          emptyText:"您还没有收到任何球员的回复",
          event:"managerTeamInvitationPlayer"
        },
      ]
    })
  },

  handleNotificationClick(e){
    const item = e.detail.item
    const type = e.currentTarget.dataset.event
    switch(type){
      case "managerTeamApplication":
        this.showManageTeamApplicationModal(item)
        break
      case "managerTeamInvitationMatch":
        this.showManageTeamInvitationMatchModal(item)
        break
      case "managerTeamInvitationEvent":
        this.showManageTeamInvitationEventModal(item)
        break
      case "managerTeamInvitationPlayer":
        break
    }
  },

  toggleNotification(e){
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.event
    const list = this.data.notifications
    list[index].open = !list[index].open
    switch(type){
      case "managerTeamApplication":
        break
      case "managerTeamInvitationMatch":
        break
      case "managerTeamInvitationEvent":
        break
      case "managerTeamInvitationPlayer":
        if(this.data.showManageTeamInvitationPlayerDot == true) {
          this.confirmReplyHasRead()
        }
        break
    }
    list[index].showRedDot = false
    this.setData({
      notifications:list
    })
  },

  fetchData: function () {
    this.fetchManageTeamList(userId)
  },

  fetchManageTeamList(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getUserManageTeam',
      data: {
        userId: userId
      },
      success(res) {
        console.log("pages/management/team_notice: fetchManageTeamList->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let manageTeamIdList = res.data;
        let manageTeamNumber = res.data.length;
        that.setData({
          // isTeamManager: res.data.length > 0 ? true : false,
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
        that.initNotifications()
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("pages/management/team_notice: fetch team application->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageTeamApplication(res.data, teamName);
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("pages/management/team_notice: fetch team invitations by match->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageTeamInvitationMatch(res.data, teamName);
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("pages/management/team_notice: fetch team invitations by event->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageTeamInvitationEvent(res.data, teamName);
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("pages/management/team_notice: fetch team invitations to player->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageTeamInvitationPlayer(res.data, teamName);
      },
      fail(err) {
        console.log('请求失败', err);
      },
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
    const mergedList = this.data.manageTeamApplicationsInform.concat(informs);
    this.setData({
      manageTeamApplicationsInform: mergedList,
      showManageTeamApplicationDot: mergedList.length > 0
    });
    this.initNotifications()
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
    const mergedList = this.data.manageTeamInvitationMatchInform.concat(informs);
    that.setData({
      manageTeamInvitationMatchInform: mergedList,
      showManageTeamInvitationMatchDot: mergedList.length > 0
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
    const mergedList = this.data.manageTeamInvitationEventInform.concat(informs);
    that.setData({
      manageTeamInvitationEventInform: mergedList,
      showManageTeamInvitationEventDot: mergedList.length > 0
    });
    that.initNotifications()
  },

  formatManageTeamInvitationPlayer: function (invitations, teamName) {
    const that = this
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return {
          content: `${teamName} （teamId = ${invitation.teamId}）所邀请 ${invitation.player.name}(球员) 还未被处理您发出的邀请，邀请发起时间：${formattedDate}`,
        }
      } else if (invitation.status == "ACCEPTED") {
        return {
          content: `${teamName} （teamId = ${invitation.teamId}）所邀请 ${invitation.player.name}(球员) 已经同意加入您的球队，处理时间时间：${formattedDate}`,
        }
      } else if (invitation.status == "REJECTED") {
        return {
          content: `${teamName} （teamId = ${invitation.teamId}）所邀请 ${invitation.player.name}(球员) 拒绝加入您的球队，处理时间时间：${formattedDate}`,
        }
      }
      return null;
    }).filter(inform => inform !== null);
    const mergedList = this.data.manageTeamInvitationPlayerInform.concat(informs);
    let showDot = this.data.showManageTeamInvitationPlayerDot
    for (let invitation of invitations) {
      if (invitation.hasRead === false) {
        showDot = true
        break
      }
    }
    that.setData({
      manageTeamInvitationPlayerInform: mergedList,
      showManageTeamInvitationPlayerDot: showDot
    });
    that.initNotifications()
  },

  confirmReplyHasRead() {
    wx.request({
      url: `${URL}/user/team/player/readReplies?userId=${userId}`,
      method: "POST",
      success(res) {
        if (res.statusCode !== 200) {
          return
        }
        console.log("confirmManageTeamInvitationPlayer ->")
        console.log("success")
      }
    })
  },

  showManageTeamApplicationModal(e) {
    let playerId = e.playerId
    let teamId = e.teamId
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
    let matchId = e.matchId
    let teamId = e.teamId
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
    let eventId = e.eventId
    let teamId = e.teamId
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
        console.log("pages/management/team_notice/team_notice: Team Reply Player Application ->")
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
        that.fetchManageTeamList(userId)
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
        console.log("pages/management/team_notice/team_notice: Team Reply Match Invitation ->")
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
        that.fetchManageTeamList(userId)
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
        console.log("pages/management/team_notice/team_notice: Team Reply Event Invitation ->")
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
        that.fetchManageTeamList(userId)
      }
    })
  },
})