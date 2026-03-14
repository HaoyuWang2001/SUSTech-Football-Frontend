const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coachId: -1,

    showCoachMatchDot: false,
    showCoachInvitationDot: false,

    coachInvitationInform: [],
    coachMatchInform: [],
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
          key:"coachInvitation",
          title:"球队邀请通知",
          visible:true,
          open:false,
          showRedDot:this.data.showCoachInvitationDot,
          list:this.data.coachInvitationInform,
          hint:"点击邀请可选择接受或拒绝",
          emptyText:"您还没有收到任何球队发出的邀请，可以尝试申请加入球队",
          event:"coachInvitation"
        },
        {
          key:"coachMatch",
          title:"比赛通知",
          visible:true,
          open:false,
          showRedDot:this.data.showCoachMatchDot,
          list:this.data.coachMatchInform,
          hint:"您两周内的比赛",
          emptyText:"您近两星期内没有比赛",
          event:"coachMatch"
        },
      ]
    })
  },

  handleNotificationClick(e){
    const item = e.detail.item
    const type = e.currentTarget.dataset.event
    switch(type){
      case "coachInvitation":
        this.showCoachTeamInvitationModal(item)
        break
      case "coachMatch":
        break
    }
  },

  toggleNotification(e){
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.event
    const list = this.data.notifications
    list[index].open = !list[index].open
    switch(type){
      case "coachInvitation":
        break
      case "coachMatch":
        if (this.data.showPlayerApplicationDot === true) {
          this.confirmApplicationHasRead()
        }
        break
    }
    list[index].showRedDot = false
    this.setData({
      notifications:list
    })
  },

  // fetch data
  fetchData: function () {
    this.fetchCoachId(userId)
  },

  fetchCoachId(userId) {
    const that = this
    wx.request({
      url: URL + '/user/getCoachId',
      data: {
        userId: userId
      },
      success(res) {
        console.log("package-coach/pages/profile_coach_notice/profile_coach_notice: fetchCoachId->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("coachId: " + res.data)
        let coachId = res.data;
        that.setData({
          coachId: coachId,
        })
        that.fetchCoachMatches(coachId)
        that.fetchCoachTeamInvitations(coachId)
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("package-coach/pages/profile_coach_notice: fetchCoachMatches->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatCoachMatches(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
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
        console.log("package-coach/pages/profile_coach_notice: fetchCoachInvitations->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.formatCoachInvitations(res.data);
      },
      fail(err) {
        console.log('请求失败', err);
      },
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
          return {
            content: `你在${matchDay.toLocaleString()}有一场比赛`,
          }
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

  // toggleCoachMatchInform: function () {
  //   this.setData({
  //     showCoachMatchInform: !this.data.showCoachMatchInform,
  //     showCoachMatchDot: false
  //   });
  // },

  // toggleCoachInvitationInform: function () {
  //   this.setData({
  //     showCoachInvitationInform: !this.data.showCoachInvitationInform,
  //     showCoachInvitationDot: false
  //   });
  // },

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