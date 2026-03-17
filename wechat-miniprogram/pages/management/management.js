// pages/management/management.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const ANONYMITY = appInstance.globalData.ANONYMITY
const {
  formatTime
} = require("../../utils/timeFormatter")

Page({
  data: {
    hasThirdAuthority: false,
    authorityId: 0,
    id: 0,
    teams: [],
    matches: [],
    events: [],
    newEvent: {
      id: 'id',
      icon: '/assets/newplayer.png',
      name: '创建赛事'
    },
    manageEventIdList: [],
    manageEventNumber: 0,
    showManageEventInvitationTeamDot: false,
    manageEventInvitationTeamInform: [],
  },

  onLoad(options) {

  },

  onShow() {
    appInstance.addToRequestQueue(this.fetchThirdAuthority)
    appInstance.addToRequestQueue(this.fetchData)
  },

  onPullDownRefresh() {
    appInstance.addToRequestQueue(this.fetchThirdAuthority)
    appInstance.addToRequestQueue(this.fetchData)
    wx.stopPullDownRefresh()
  },

  initNotifications(){
    this.setData({
      notifications:[
        {
          key:"managerEventInvitationTeam",
          title:"邀请球队参加赛事 - 回复",
          visible:this.data.isEventManager,
          open:false,
          showRedDot:this.data.showManageEventInvitationTeamDot,
          list:this.data.manageEventInvitationTeamInform,
          hint:"",
          emptyText:"您还没有收到任何球队的回复，可以尝试邀请球队参加赛事",
          event:"managerEventInvitationTeam"
        },
      ]
    })
  },

  handleNotificationClick(e){
    const item = e.detail.item
    const type = e.currentTarget.dataset.event
    switch(type){
      case "managerEventInvitationTeam":
        break
    }
  },

  toggleNotification(e){
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.event
    const list = this.data.notifications
    list[index].open = !list[index].open
    switch(type){
      case "managerEventInvitationTeam":
        if (this.data.showManageEventInvitationTeamDot === true) {
          this.confirmReplyHasRead()
        }
        break
    }
    list[index].showRedDot = false
    this.setData({
      notifications:list
    })
  },

  fetchThirdAuthority() {
    const that = this
    wx.request({
      url: `${URL}/authority/check/third?userId=${userId}`,
      method: "POST",
      success(res) {
        console.log("management page: fetchThirdAuthority ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let authorityId = res.data
        console.log("third authority id: " + authorityId)
        if (authorityId > 0) {
          that.setData({
            hasThirdAuthority: true,
            authorityId: authorityId,
          })
        } else {
          that.setData({
            hasThirdAuthority: false,
            authorityId: 0,
          })
        }
      }
    })
  },

  fetchData() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: URL + '/user/getUserManageTeam?userId=' + userId,
      success(res) {
        console.log("teams->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          teams: res.data,
        });
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });

    wx.request({
      url: URL + '/user/getUserManageMatch?userId=' + userId,
      success(res) {
        console.log('matches->');
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
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
        that.setData({
          matches: matchList,
        });
        console.log(that.data.matches);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });

    wx.request({
      url: URL + '/user/getUserManageEvent?userId=' + userId,
      success(res) {
        console.log("events->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let manageEventIdList = res.data;
        let manageEventNumber = res.data.length;
        that.setData({
          events: res.data,
          isEventManager: res.data.length > 0 ? true : false,
          manageEventIdList: res.data,
          manageEventNumber: res.data.length,
          manageEventInvitationTeamInform: []
        })
        for (let index = 0; index < manageEventNumber; index++) {
          const event = manageEventIdList[index];
          that.fetchManageEventInvitationTeam(event.eventId);
        }

        that.initNotifications()
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });
  },

  fetchManageEventInvitationTeam(eventId) {
    const that = this
    wx.request({
      url: URL + '/event/team/getInvitations',
      data: {
        eventId: eventId
      },
      success(res) {
        console.log("management page: fetch event invitations to team->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatManageEventInvitationTeam(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
    });
  },

  formatManageEventInvitationTeam: function (invitations) {
    console.log(invitations)
    const that = this
    const informs = invitations.map(invitation => {
      const formattedDate = (invitation.lastUpdated != null) ? new Date(invitation.lastUpdated).toLocaleString() : '未知';
      if (invitation.status == "PENDING") {
        return {
          content: `${invitation.eventId}(eventId) 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 还未被处理您发出的邀请，邀请发起时间：${formattedDate}`
        }
      } else if (invitation.status == "ACCEPTED") {
        return {
          content: `${invitation.eventId}(eventId) 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 已经同意参与您所创建的赛事，处理时间时间：${formattedDate}`
        }
      } else if (invitation.status == "REJECTED") {
        return {
          content: `${invitation.eventId}(eventId) 所邀请 ${invitation.team.name}(teamId = ${invitation.teamId}) 已经拒绝参与您所创建的赛事，处理时间时间：${formattedDate}`
        }
      }
      return null;
    }).filter(inform => inform !== null);
    let showDot = false
    for (let invitation of invitations) {
      if (invitation.hasRead === false) {
        showDot = true
        break
      }
    }
    that.setData({
      manageEventInvitationTeamInform: this.data.manageEventInvitationTeamInform.concat(informs),
      showManageEventInvitationTeamDot: showDot
    });
    that.initNotifications()
  },

  confirmReplyHasRead() {
    wx.request({
      url: `${URL}/user/event/team/readReplies?userId=${userId}`,
      method: "POST",
      success(res) {
        if (res.statusCode !== 200) {
          return
        }
        console.log("confirmEventInviteTeamReplyHasRead ->")
        console.log("success")
      }
    })
  },

  gotoMatches: function (e) {
    wx.navigateTo({
      url: `/pages/management/match_more/match_more?authorityLevel=3&authorityId=${this.data.authorityId}`,
    })
  },

  gotoTeams: function (e) {
    wx.navigateTo({
      url: `/pages/management/team_more/team_more?authorityLevel=3&authorityId=${this.data.authorityId}`,
    })
  },

  gotoMatchPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + dataset.id,
    })
  },

  gotoTeamPage: function (e) {
    const teamId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/pub/team/team?id=${teamId}`,
    })
  },

  // gotoEditMatch: function (e) {
  //   const dataset = e.currentTarget.dataset
  //   wx.navigateTo({
  //     url: '/pages/management/match_edit/match_edit?id=' + dataset.id,
  //   })
  // },

  gotoEditEvent: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/event_edit/event_edit?id=' + dataset.id,
    })
  },

  // gotoNewEvent() {
  //   wx.navigateTo({
  //     url: '/pages/management/event_new/event_new',
  //   })
  // },

  applyThirdAuthority() {
    wx.showToast({
      title: '目前未开放申请渠道，请联系管理员手动添加',
      icon: 'none',
      duration: 2000,
    })
  },
})