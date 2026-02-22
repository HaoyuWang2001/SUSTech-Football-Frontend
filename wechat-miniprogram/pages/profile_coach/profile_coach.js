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
    coachId: 0,
    coach: {},
    matchList: [],
    teamList: [],
    eventList: [],
    showCoachMatchInform: false,
    showCoachInvitationInform: false,

    showCoachMatchDot: false,
    showCoachInvitationDot: false,

    coachInvitationInform: [],
    coachMatchInform: [],
    isLoading: true, // 新增：加载状态
  },

  onLoad(options) {},

  onShow() {
    this.setData({
      isLoading: true, // 开始加载
      showCoachMatchInform: false,
      showCoachInvitationInform: false,
    })
    app.addToRequestQueue(this.fetchCoachId)
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
    app.addToRequestQueue(this.fetchCoachId)
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

  // 拉取数据
  fetchCoachId(userId) {
    let that = this
    wx.request({
      url: URL + '/user/getCoachId',
      data: {
        userId: userId,
      },
      success(res) {
        console.log("profile coach page: fetchCoachId ->")
        if (res.statusCode == 404) {
          console.log("用户未注册为教练")
          that.setData({
            isLoading: false, // 加载完成，隐藏loading
            coachId: 0, // 明确设置为0
          })
          wx.showToast({
            title: '请先注册为教练',
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
        let coachId = res.data
        that.setData({
          coachId: coachId,
          isLoading: false // 加载完成，隐藏loading
        })
        // 后续数据获取不显示loading
        that.fetchData(coachId)
        that.fetchCoachMatches(coachId)
        that.fetchCoachTeams(coachId)
        that.fetchCoachEvents(coachId)
        that.fetchCoachTeamInvitations(coachId)
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
        that.setData({
          isLoading: false // 加载完成（即使失败）
        })
      },
    })
  },

  fetchData(coachId) {
    let that = this
    wx.request({
      url: URL + '/coach/get',
      data: {
        id: coachId,
      },
      success(res) {
        console.log("profile coach page: fetchData ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          coach: res.data,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchCoachMatches(coachId) {
    let that = this
    wx.request({
      url: URL + '/coach/match/getAll',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("profile coach page: fetchCoachMatches ->")
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
        that.formatCoachMatches(res.data);
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchCoachTeams(coachId) {
    let that = this
    wx.request({
      url: URL + '/coach/team/getAll',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("profile coach page: fetchCoachTeams ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let teamList = res.data ?? []
        that.setData({
          teamList: teamList,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchCoachEvents(coachId) {
    let that = this
    wx.request({
      url: URL + '/coach/event/getAll',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("profile coach page: fetchCoachEvents ->")
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
      let coach = this.data.coach
      console.log(coach)
      const queryString = Object.keys(coach).map(key => {
        console.log(key + ": " + encodeURIComponent(coach[key]))
        return `${key}=${encodeURIComponent(coach[key])}`
      }).join('&');
      console.log("queryString->")
      console.log(queryString)
      wx.navigateTo({
        url: `/pages/profile_player/profile_coach_edit/profile_coach_edit?${queryString}`
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
    wx.navigateTo({
      url: `coach_teams/coach_teams?coachId=${this.data.coachId}`,
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
      url: '../profile_coach_register/profile_coach_register',
    })
  },

  gotoCoachNoticePage() {
    wx.navigateTo({
      url: '/pages/profile_player/profile_coach_notice/profile_coach_notice',
    })
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
  toggleCoachMatchInform: function () {
    this.setData({
      showCoachMatchInform: !this.data.showCoachMatchInform,
      showCoachMatchDot: false
    });
  },
  toggleCoachInvitationInform: function () {
    this.setData({
      showCoachInvitationInform: !this.data.showCoachInvitationInform,
      showCoachInvitationDot: false
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
})