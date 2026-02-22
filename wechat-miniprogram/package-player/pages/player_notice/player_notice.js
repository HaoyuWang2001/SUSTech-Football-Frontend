const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',

    playerId: -1,

    // 展开框框
    showPlayerInvitationInform: false,
    showPlayerApplicationInform: false,

    // 控制红点的显示
    showPlayerInvitationDot: false,
    showPlayerApplicationDot: false,

    // 消息列表
    playerInvitationInform: [],
    playerApplicationInform: [],
  },

  onShow() {
    this.fetchData()
    this.setData({
      showPlayerInvitationInform: false,
      showPlayerApplicationInform: false,
    })
  },

  onPullDownRefresh() {
    this.fetchData()
    this.setData({
      showPlayerInvitationInform: false,
      showPlayerApplicationInform: false,
    })
    wx.stopPullDownRefresh()
  },

  // fetch data
  fetchData: function () {
    this.fetchPlayerId(userId)
  },

  fetchPlayerId(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getPlayerId',
      data: {
        userId: userId
      },
      success(res) {
        console.log("/pages/profile_player/player_notice: fetchPlayerId->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("playerId: " + res.data)
        let playerId = res.data;
        that.setData({
          playerId: playerId
        })

        //球员身份：球队邀请
        that.fetchPlayerTeamInvitations(playerId)

        //球员身份：球队申请
        that.fetchPlayerTeamApplications(playerId)
      },
      fail(err) {
        console.log('请求失败', err);
      },
    });
  },

  fetchPlayerTeamInvitations(playerId) {
    const that = this
    wx.request({
      url: `${URL}/player/team/getInvitations?playerId=${playerId}&status=PENDING`,
      success(res) {
        console.log("/pages/profile_player/player_notice: fetchPlayerTeamInvitations->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatPlayerInvitations(res.data)
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("/pages/profile_player/player_notice: fetchPlayerTeamApplications->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatApplications(res.data)
      },
      fail(err) {
        console.log('请求失败', err);
      },
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
      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = informs.length > 0 ? true : false;
    that.setData({
      playerInvitationInform: informs,
      showPlayerInvitationDot: showDot
    });
  },

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
      return {
        content: `您对${application.team.name}（球队）的申请${stadus}：${formattedDate}`,
        hasRead: application.hasRead
      }
    });

    let showDot = false
    for (let application of applications) {
      if (application.hasRead === false) {
        showDot = true
        break
      }
    }

    this.setData({
      playerApplicationInform: informs,
      showPlayerApplicationDot: showDot,
    });
  },

  // 切换球队邀请通知的显示状态
  togglePlayerInvitationInform: function () {
    this.setData({
      showPlayerInvitationInform: !this.data.showPlayerInvitationInform,
      showPlayerInvitationDot: false
    });
  },

  // 切换申请加入球队通知的显示状态
  toggleApplicationInform: function () {
    if (this.data.showPlayerApplicationDot === true) {
      this.confirmApplicationHasRead()
    }
    this.setData({
      showPlayerApplicationInform: !this.data.showPlayerApplicationInform,
      showPlayerApplicationDot: false
    });
  },

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

  confirmApplicationHasRead() {
    wx.request({
      url: `${URL}/player/team/readApplications?playerId=${this.data.playerId}`,
      method: "POST",
      success(res) {
        if (res.statusCode !== 200) {
          return
        }
        console.log("confirmApplicationHasRead ->")
        console.log("success")
      }
    })
  },

})