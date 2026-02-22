// pages/management/match_new/match_new.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const ANONYMITY = appInstance.globalData.ANONYMITY

Page({
  data: {
    date: '请选择日期',
    time: '请选择时间',
    homeTeam: {
      teamId: 0,
      name: "未选择",
      logoUrl: ANONYMITY,
    },
    awayTeam: {
      teamId: 0,
      name: "未选择",
      logoUrl: ANONYMITY,
    },
  },

  // 处理日期选择器选择完成事件
  bindDateChange: function (e) {
    // 更新页面上的日期显示
    this.setData({
      date: e.detail.value
    });
  },

  // 处理时间选择器选择完成事件
  bindTimeChange: function (e) {
    // 更新页面上的时间显示
    this.setData({
      time: e.detail.value
    });
  },

  // 选择主队
  openinviteHomeTeamModal() {
    const that = this
    wx.showModal({
      title: '选择主队',
      editable: true,
      placeholderText: '请输入球队id',
      complete: (res) => {
        if (res.confirm) {
          let teamId = res.content
          that.fetchHomeTeam(teamId)
        }
      }
    })
  },

  fetchHomeTeam(teamId) {
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
        console.log("match_new page: fetchHomeTeam ->")
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
          homeTeam: {
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

  // 选择客队
  openinviteAwayTeamModal() {
    const that = this
    wx.showModal({
      title: '邀请客队',
      editable: true,
      placeholderText: '请输入球队id',
      complete: (res) => {
        if (res.confirm) {
          let teamId = res.content
          that.fetchAwayTeam(teamId)
        }
      }
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

  // 点击确认创建按钮，弹出确认修改模态框
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

    var that = this
    wx.showModal({
      title: '确认创建',
      content: '确定要进行创建比赛吗？',
      confirmText: '确认',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.confirmCreate(date, time, homeTeamId, awayTeamId)
        } else if (res.cancel) {
          () => {}
        }
      }
    });
  },

  // 处理提交信息修改
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
      url: URL + '/match/create?ownerId=' + userId,
      method: 'POST',
      data: {
        homeTeamId: homeTeamId,
        awayTeamId: awayTeamId,
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
        wx.navigateBack()
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

  gotoSetTeamPage(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `./set_team/set_team?type=${type}`,
    })
  },
})