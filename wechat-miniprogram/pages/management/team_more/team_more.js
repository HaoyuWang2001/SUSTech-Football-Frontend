const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({
  data: {
    authorityId: 0,
    deleteTeamId: 0,
    teamList: [],
    isTeamManager: false,
    manageTeamNumber: 0,

    showManageTeamApplicationInform: false,
    showManageTeamInvitationMatchInform: false,
    showManageTeamInvitationEventInform: false,
    showManageTeamInvitationPlayerInform: false,

    showManageTeamApplicationDot: false,
    showManageTeamInvitationMatchDot: false,
    showManageTeamInvitationEventDot: false,
    showManageTeamInvitationPlayerDot: false,

    manageTeamApplicationsInform: [],
    manageTeamInvitationMatchInform: [],
    manageTeamInvitationEventInform: [],
    manageTeamInvitationPlayerInform: [],
  },

  onLoad(options) {
    this.setData({
      authorityId: options.authorityId,
    })
  },

  onShow() {
    this.fetchData(userId)
  },

  onPullDownRefresh() {
    this.fetchData(userId)
    wx.stopPullDownRefresh()
  },

  fetchData(userId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: URL + '/user/getUserManageTeam?userId=' + userId,
      success(res) {
        console.log("team->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let teamList = res.data;
        let manageTeamNumber = res.data.length;
        that.setData({
          teamList: res.data,
          isTeamManager: (res.data.length > 0) ? true : false,
          manageTeamApplicationsInform: [],
          manageTeamInvitationMatchInform: [],
          manageTeamInvitationEventInform: [],
          manageTeamInvitationPlayerInform: [],
          manageTeamNumber: res.data.length
        });
        for (let index = 0; index < manageTeamNumber; index++) {
          const team = teamList[index];
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
        // 可以显示失败的提示信息，或者做一些错误处理
      },
      complete() {
        // 无论请求成功还是失败都会执行
        wx.hideLoading(); // 关闭加载提示框
      }
    });
  },

  // 点击取消比赛按钮，弹出确认取消模态框
  showCancelModal(e) {
    this.setData({
      deleteTeamId: e.currentTarget.dataset.id
    })
    var that = this
    wx.showModal({
      title: '确认删除球队',
      content: '确定要删除这支球队吗？',
      confirmText: '确认删除',
      confirmColor: '#FF0000',
      cancelText: '我再想想',
      success(res) {
        if (res.confirm) {
          that.deleteTeam() // 点击确认删除时的回调函数
        } else if (res.cancel) {
          () => {} // 点击我再想想时的回调函数，这里不做任何操作
        }
      }
    });
  },

  deleteTeam() {
    var that = this;
    wx.showLoading({
      title: '删除中',
      mask: true,
    })
    wx.request({
      url: URL + '/team/delete?teamId=' + that.data.deleteTeamId + '&userId=' + userId,
      method: 'DELETE',
      success(res) {
        wx.hideLoading()
        console.log("delete team->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败，请重试',
            icon: "error",
          });
          return
        }
        that.fetchData(userId)
        wx.showToast({
          title: "删除成功",
          icon: "success",
        });
      },
      fail(err) {
        wx.hideLoading()
        console.error('球队删除失败', err);
        wx.showToast({
          title: '删除失败，请重试',
          icon: 'error',
        });
      },
    });
  },

  createNewTeam() {
    wx.navigateTo({
      url: '/pages/management/team_new/team_new',
    })
  },

  gotoEditTeam: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/team_edit/team_edit?id=' + dataset.id,
    })
  },

  gotoTeamManagerNoticePage() {
    wx.navigateTo({
      url: '/pages/management/team_notice/team_notice',
    })
  },

  gotoTeamEventsPage() {
    wx.navigateTo({
      url: '/pages/management/team_events/team_events',
    })
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

  toggleManageTeamApplicationInform: function () {
    this.setData({
      showManageTeamApplicationInform: !this.data.showManageTeamApplicationInform,
      showManageTeamApplicationDot: false
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
        that.fetchData(userId)
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
        
        wx.hideLoading()
        
        // 如果接受邀请，跳转到大名单设置页面
        if (accept) {
          // 先获取赛事信息以获取rosterSize和matchPlayerCount
          wx.request({
            url: URL + '/event/get?id=' + eventId,
            method: 'GET',
            success(eventRes) {
              if (eventRes.statusCode === 200) {
                const eventData = eventRes.data
                // 获取球队信息
                wx.request({
                  url: URL + '/team/get?id=' + teamId,
                  method: 'GET',
                  success(teamRes) {
                    if (teamRes.statusCode === 200) {
                      const teamData = teamRes.data
                      wx.showToast({
                        title: '接受成功，请设置大名单',
                        icon: 'success',
                        duration: 2000
                      })
                      setTimeout(() => {
                        wx.navigateTo({
                          url: `/pages/management/event_roster/event_roster?eventId=${eventId}&teamId=${teamId}&eventName=${eventData.name || ''}&teamName=${teamData.name || ''}&rosterSize=${eventData.rosterSize || 23}&matchPlayerCount=${eventData.matchPlayerCount || 11}`
                        })
                      }, 1500)
                    }
                  }
                })
              }
            },
            fail() {
              wx.showToast({
                title: '接受成功',
                icon: 'success',
              })
              that.fetchData(userId)
            }
          })
        } else {
          wx.showToast({
            title: '已拒绝邀请',
            icon: 'success',
          })
          that.fetchData(userId)
        }
        console.log("回复赛事邀请成功")
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg)
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        })
        wx.hideLoading()
      }
    })
  },

})