const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refereeId: -1,

    showRefereeMatchDot: false,
    showRefereeInvitationDotForMatch: false,
    showRefereeInvitationDotForEvent: false,

    refereeInvitationInformForMatch: [],
    refereeInvitationInformForEvent: [],
    refereeMatchInform: [],
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
          key:"refereeMatch",
          title:"比赛通知",
          visible:true,
          open:false,
          showRedDot:this.data.showRefereeMatchDot,
          list:this.data.refereeMatchInform,
          hint:"您两周内的比赛",
          emptyText:"您近两星期内没有比赛",
          event:"refereeMatch"
        },
        {
          key:"refereeInvitationForMatch",
          title:"比赛邀请通知",
          visible:true,
          open:false,
          showRedDot:this.data.showRefereeInvitationDotForMatch,
          list:this.data.refereeInvitationInformForMatch,
          hint:"点击邀请可选择接受或拒绝",
          emptyText:"您还没有收到任何比赛发出的邀请",
          event:"refereeInvitationForMatch"
        },
        {
          key:"refereeInvitationForEvent",
          title:"赛事邀请通知",
          visible:true,
          open:false,
          showRedDot:this.data.showRefereeInvitationDotForEvent,
          list:this.data.refereeInvitationInformForEvent,
          hint:"点击邀请可选择接受或拒绝",
          emptyText:"您还没有收到任何赛事发出的邀请",
          event:"refereeInvitationForEvent"
        },
      ]
    })
  },

  handleNotificationClick(e){
    const item = e.detail.item
    const type = e.currentTarget.dataset.event
    switch(type){
      case "refereeMatch":
        break
      case "refereeInvitationForMatch":
        this.showRefereeMatchInvitationModal(item)
        break
      case "refereeInvitationForEvent":
        this.showRefereeEventInvitationModal(item)
        break
    }
  },

  toggleNotification(e){
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.event
    const list = this.data.notifications
    list[index].open = !list[index].open
    switch(type){
      case "refereeMatch":
        break
      case "refereeInvitationForMatch":
        break
      case "refereeInvitationForEvent":
        break
    }
    list[index].showRedDot = false
    this.setData({
      notifications:list
    })
  },

  fetchData: function () {
    this.fetchRefereeId(userId);
  },

  fetchRefereeId(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getRefereeId',
      data: {
        userId: userId
      },
      success(res) {
        console.log("package-referee/pages/profile_referee_notice: fetchRefereeId->")
        
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("refereeId: " + res.data)
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
        console.log("package-referee/pages/profile_referee_notice: fetchRefereeMatch->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatRefereeMatches(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("package-referee/pages/profile_referee_notice: fetchRefereeInvitationsForMatch->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatRefereeInvitationsForMatch(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("package-referee/pages/profile_referee_notice: fetchReferee InvitationsForEvent->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatRefereeInvitationsForEvent(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
    });
  },

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
    let showDot = informs.length > 0 ? true : false;
    this.setData({
      refereeInvitationInformForEvent: informs,
      showRefereeInvitationDotForEvent: showDot
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
          return {
            content: `你在${matchDay.toLocaleString()}有一场比赛`,
          }
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

  // toggleRefereeMatchInform: function () {
  //   this.setData({
  //     showRefereeMatchInform: !this.data.showRefereeMatchInform,
  //     showRefereeMatchDot: false
  //   });
  // },

  // toggleRefereeInvitationInformForMatch: function () {
  //   this.setData({
  //     showRefereeInvitationInformForMatch: !this.data.showRefereeInvitationInformForMatch,
  //     showRefereeInvitationDotForMatch: false
  //   });
  // },

  // toggleRefereeInvitationInformForEvent: function () {
  //   this.setData({
  //     showRefereeInvitationInformForEvent: !this.data.showRefereeInvitationInformForEvent,
  //     showRefereeInvitationDotForEvent: false
  //   });
  // },

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
})