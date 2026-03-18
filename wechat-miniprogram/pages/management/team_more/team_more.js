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
    showRedDot: false,
  },

  onLoad(options) {
    this.setData({
      authorityId: options.authorityId,
      showRedDot: false,
    })
  },

  onShow() {
    this.setData({
      showRedDot: false,
    })
    this.fetchData(userId)
  },

  onPullDownRefresh() {
    this.setData({
      showRedDot: false,
    })
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
      url: '/pages/management/team_new/team_new?authorityLevel=3&authorityId=' + this.data.authorityId,
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
        console.log("pages/management/team_more: fetch team application->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let applications = res.data.map(application => {
          if (application.status == "PENDING") {
            return application
          }
          return null;
        }).filter(application => application !== null);
        let showDot = applications.length > 0 ? true : false;
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

  fetchManageTeamInvitationMatch: function (teamId, teamName) {
    const that = this
    wx.request({
      url: URL + '/team/match/getInvitations',
      data: {
        teamId: teamId,
      },
      success(res) {
        console.log("pages/management/team_more: fetch team invitations by match->")
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

  fetchManageTeamInvitationEvent: function (teamId, teamName) {
    const that = this
    wx.request({
      url: URL + '/team/event/getInvitations',
      data: {
        teamId: teamId,
      },
      success(res) {
        console.log("pages/management/team_more: fetch team invitations by event->")
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

  fetchManageTeamInvitationPlayer: function (teamId, teamName) {
    const that = this
    wx.request({
      url: URL + '/team/player/getInvitations',
      data: {
        teamId: teamId,
      },
      success(res) {
        console.log("pages/management/team_more: fetch team invitations to player->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },
})