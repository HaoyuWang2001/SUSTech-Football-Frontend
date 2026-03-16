const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playerId: -1,

    showPlayerInvitationDot: false,
    showPlayerApplicationDot: false,

    playerInvitationInform: [],
    playerApplicationInform: [],
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
          key:"playerInvitation",
          title:"球队邀请通知",
          visible:true,
          open:false,
          showRedDot:this.data.showPlayerInvitationDot,
          list:this.data.playerInvitationInform,
          hint:"点击邀请可选择接受或拒绝",
          emptyText:"您还没有收到任何球队发出的邀请，可以尝试申请加入球队",
          event:"playerTeamInvitation"
        },
        {
          key:"playerApplication",
          title:"球队申请回复",
          visible:true,
          open:false,
          showRedDot:this.data.showPlayerApplicationDot,
          list:this.data.playerApplicationInform,
          hint:"球队管理员回复后，您将在此看到通知",
          emptyText:"暂无回复",
          event:"playerTeamApplication"
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
      case "playerTeamApplication":
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
        break
      case "playerTeamApplication":
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
        that.fetchPlayerTeamInvitations(playerId)
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
    that.initNotifications()
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
    this.initNotifications()
  },

  // 切换球队邀请通知的显示状态
  // togglePlayerInvitationInform: function () {
  //   this.setData({
  //     showPlayerInvitationInform: !this.data.showPlayerInvitationInform,
  //     showPlayerInvitationDot: false
  //   });
  // },

  // 切换申请加入球队通知的显示状态
  // toggleApplicationInform: function () {
  //   if (this.data.showPlayerApplicationDot === true) {
  //     this.confirmApplicationHasRead()
  //   }
  //   this.setData({
  //     showPlayerApplicationInform: !this.data.showPlayerApplicationInform,
  //     showPlayerApplicationDot: false
  //   });
  // },

  // 弹出 modal 用来同意或拒绝邀请
  showPlayerTeamInvitationModal(e) {
    let teamId = e.id
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