// pages/management/match_new/match_new.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const ANONYMITY = appInstance.globalData.ANONYMITY
const { showModal } = require("../../../utils/modal")

Page({
  authorityLevel: 0,
  authorityId: 0,
  data: {
    date: '请选择日期',
    time: '请选择时间',
    homeTeam: {
      teamId: 0,
      name: "未指定",
      logoUrl: ANONYMITY,
    },
    awayTeam: {
      teamId: 0,
      name: "未邀请",
      logoUrl: ANONYMITY,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      authorityLevel: options.authorityLevel,
      authorityId: options.authorityId,
    })
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

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },

  // 选定主队
  inviteHomeTeam: function (e) {
    wx.navigateTo({
      url: '/pages/management/match_new/set_homeTeam/set_homeTeam',
    })
  },

  // 邀请客队
  openinviteAwayTeamModal() {
    showModal({
      title: '邀请客队',
      editable: true,
      placeholderText: '请输入球队id',
      onComplete: (res) => {
        let teamId = res.content
        this.fetchAwayTeam(teamId)
      },
    })
  },

  fetchAwayTeam(teamId) {
    if (isNaN(teamId) || teamId.trim() === '') {
      wx.showToast({
        title: '请输入正确id',
        icon: 'error',
      })
      return
    }
    teamId = Number(teamId)

    wx.showLoading({
      title: '正在查询',
      mask: true,
    })

    const that = this
    wx.request({
      url: `${URL}/team/get?id=${teamId}`,
      success(res) {
        wx.hideLoading()
        console.log("match_new page: fetchAwayTeam ->")
        if (res.statusCode != 200) {
          console.error(res)
          wx.showToast({
            title: "查询失败",
            icon: 'error'
          })
          return
        }
        console.log(res.data)

        wx.showToast({
          title: '查询成功',
          icon: 'success'
        })

        that.setData({
          awayTeam: {
            teamId: res.data.teamId,
            name: res.data.name,
            logoUrl: res.data.logoUrl
          }
        })
      },
      fail(err) {
        wx.hideLoading()
        console.error(err)
        wx.showToast({
          title: '查询失败',
          icon: 'error'
        })
      }
    })
  },

  showCreateModal() {
    let date = this.data.date
    let time = this.data.time
    let homeTeamId = Number(this.data.homeTeam.teamId)
    let awayTeamId = Number(this.data.awayTeam.teamId)

    if (!this.isValidDate(date) || !this.isValidTime(time) || homeTeamId < 0 || homeTeamId == NaN || awayTeamId < 0 || awayTeamId == NaN) {
      wx.showToast({
        title: "请填写所有数据",
        icon: "error",
      });
      return
    }

    showModal({
      title: '确认创建',
      content: '确定要进行创建比赛吗？',
      onConfirm: () => {
        this.confirmCreate(date, time, homeTeamId, awayTeamId);
      },
    });
  },

  confirmCreate(date, time, homeTeamId, awayTeamId) {
    if (homeTeamId === awayTeamId) {
      wx.showToast({
        title: '两球队不能相同',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '正在创建',
      mask: true,
    })

    let that = this
    wx.request({
      url: `${URL}/match/create?ownerId=${userId}&authorityLevel=${this.data.authorityLevel}&authorityId=${this.data.authorityId}`,
      method: 'POST',
      data: {
        homeTeamId: homeTeamId,
        time: date + 'T' + time + ':00+08:00',
      },
      success: res => {
        wx.hideLoading()
        console.log("management/match_new: confirmCreate ->")
        if (res.statusCode != 200) {
          console.error(res)
          wx.showToast({
            title: "创建失败",
            icon: "error"
          })
          return
        }
        console.log(`created match id: ${res.data}`)
        let matchId = res.data
        that.inviteAwayTeam(matchId, awayTeamId)
      },
      fail: err => {
        wx.hideLoading()
        console.error(err);
        wx.showToast({
          title: "创建失败",
          icon: "error",
        });
      },
    });
  },

  inviteAwayTeam(matchId, awayTeamId) {
    wx.showLoading({
      title: '正在创建',
      mask: true,
    })
    wx.request({
      url: URL + `/match/team/invite?matchId=${matchId}&teamId=${awayTeamId}&isHomeTeam=false`,
      method: 'POST',
      success: res => {
        wx.hideLoading()
        console.log("management/match_new: inviteAwayTeam ->")
        if (res.statusCode != 200) {
          console.error(res)
          wx.showToast({
            title: "创建失败",
            icon: 'error'
          })
          return
        }
      
        wx.navigateBack({
          success: () => {
            setTimeout(function () {
              wx.showToast({
                title: "创建成功",
                icon: "success",
              })
            }, 500)
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        console.error(err);
        wx.showToast({
          title: "创建失败",
          icon: "error",
        });
      },
    });
  },

  // 判断日期是否符合 yyyy-mm-dd 格式
  isValidDate(dateStr) {
    // 正则表达式，匹配格式为 yyyy-mm-dd
    var dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateStr);
  },

  // 判断时间是否符合 hh:mm 格式
  isValidTime(timeStr) {
    // 正则表达式，匹配格式为 hh:mm
    var timeRegex = /^\d{2}:\d{2}$/;
    return timeRegex.test(timeStr);
  },
})