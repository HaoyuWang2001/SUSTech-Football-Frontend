// pages/management/match_edit/match_edit.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const {
  formatTime,
  splitDateTime
} = require("../../../utils/timeFormatter")
const { showModal } = require("../../../utils/modal")

Page({
  data: {
    matchId: 0,
    hasBegun: false,
    strTimeInfo: '',
    strDate: '',
    strTime: '',
    name: '',
    tempHomeTeamId: 0,
    tempAwayTeamId: 0,
    time: '',
    homeTeam: [],
    awayTeam: [],
    homeTeamId: 0,
    awayTeamId: 0,
    homeTeamName: '',
    awayTeamName: '',
    homeTeamLogoUrl: '',
    awayTeamLogoUrl: '',
    homeTeamScore: 0,
    awayTeamScore: 0,
    homeTeamPenalty: 0,
    awayTeamPenalty: 0,
    matchPlayerActionList: [],
    refereeList: [{
      refereeId: 0,
      name: "",
      photoUrl: "",
      bio: "",
      userId: 0,
      matchList: []
    }],
    matchEvent: {
      eventId: 0,
      matchStage: "",
      matchTag: "",
      eventName: ""
    },
    modalHidden: true,
    array: [
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    ],
    status: '',
    statusArray: ['PENDING', 'ONGOING', 'FINISHED'],
    strStatus: '',
    strStatusArray: ['未开始', '正在进行', '已结束'],
  },

  onLoad(options) {
    this.setData({
      matchId: options.id
    })
    this.fetchData();
  },

  onShow() {
    this.fetchData();
  },

  onPullDownRefresh() {
    this.fetchData();
    wx.stopPullDownRefresh();
  },

  fetchData() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });

    var that = this;
    wx.request({
      url: URL + '/match/get?id=' + that.data.matchId,
      success(res) {
        console.log("match->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        var date = new Date(res.data.time)
        let strTimeInfo = formatTime(date)
        let hasBegun = res.data.status != "PENDING"
        let strStatus
        switch (res.data.status) {
          case "PENDING":
            strStatus = "未开始"
            break
          case "ONGOING":
            strStatus = "正在进行"
            break
          case "FINISHED":
            strStatus = "已结束"
        }
        let {
          strDate,
          strTime
        } = splitDateTime(strTimeInfo)
        console.log(res.data.time)
        console.log(date)
        console.log(strTimeInfo)
        that.setData({
          hasBegun: hasBegun,
          strTimeInfo: strTimeInfo,
          strDate: strDate,
          strTime: strTime,
          matchId: res.data.matchId,
          time: res.data.time,
          homeTeam: res.data.homeTeam,
          awayTeam: res.data.awayTeam,
          homeTeamName: res.data.homeTeam.name,
          awayTeamName: res.data.awayTeam.name,
          homeTeamLogoUrl: res.data.homeTeam.logoUrl,
          awayTeamLogoUrl: res.data.awayTeam.logoUrl,
          homeTeamId: res.data.homeTeam.teamId,
          awayTeamId: res.data.awayTeam.teamId,
          homeTeamScore: res.data.homeTeam.score,
          awayTeamScore: res.data.awayTeam.score,
          homeTeamPenalty: res.data.homeTeam.penalty,
          awayTeamPenalty: res.data.awayTeam.penalty,
          refereeList: res.data.refereeList,
          status: res.data.status,
          strStatus: strStatus
        });
      },
      fail(err) {
        console.log('请求失败', err);
        wx.showToast({
          title: '请求失败，请重试',
          icon: 'error',
        });
      },
      complete() {
        wx.hideLoading();
        if (that.data.tempHomeTeamId !== 0) {
          console.log('homeTeamId');
          console.log(that.data.tempHomeTeamId);
          wx.request({
            url: URL + '/team/get?id=' + that.data.tempHomeTeamId,
            success(res) {
              console.log("homeTeam->")
              console.log(res.data)
              if (res.statusCode !== 200) {
                console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                return
              }
              that.setData({
                homeTeamId: res.data.teamId,
                homeTeamName: res.data.name,
                homeTeamLogoUrl: res.data.logoUrl,
              });
            },
            fail(err) {
              console.log('请求失败', err);
            },
            complete() {
              wx.hideLoading();
            }
          });
        }

        if (that.data.tempAwayTeamId !== 0) {
          console.log('awayTeamId');
          console.log(that.data.tempAwayTeamId)
          wx.request({
            url: URL + '/team/get?id=' + that.data.tempAwayTeamId,
            success(res) {
              console.log("awayTeam->")
              console.log(res.data)
              if (res.statusCode !== 200) {
                console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                return
              }
              that.setData({
                awayTeamId: res.data.teamId,
                awayTeamName: res.data.name,
                awayTeamLogoUrl: res.data.logoUrl,
              });
            },
            fail(err) {
              console.log('请求失败', err);
            },
            complete() {
              wx.hideLoading();
            }
          });
        }
      }
    });
  },

  bindDateChange: function (e) {
    // 更新页面上的日期显示
    this.setData({
      strDate: e.detail.value
    });
  },

  bindTimeChange: function (e) {
    // 更新页面上的时间显示
    this.setData({
      strTime: e.detail.value
    });
  },

  bindPickerChangeScore: function (e) {
    const value = e.detail.value;
    // 更新页面上的比分显示
    this.setData({
      homeTeamScore: this.data.array[0][value[0]],
      awayTeamScore: this.data.array[0][value[1]]
    });
  },

  bindPickerChangePenalty: function (e) {
    const value = e.detail.value;
    // 更新页面上的点球比分显示
    this.setData({
      homeTeamPenalty: this.data.array[0][value[0]],
      awayTeamPenalty: this.data.array[0][value[1]]
    });
  },

  showConfirmModal() {
    showModal({
      title: '确认修改',
      content: '确定要进行修改吗？',
      onConfirm: () => {
        this.confirmEdit();
      },
    });
  },

  showCancelModal() {
    showModal({
      title: '确认取消比赛',
      content: '确定要取消这场比赛吗？',
      confirmText: '确认取消',
      confirmColor: '#FF0000',
      cancelText: '我再想想',
      onConfirm: () => {
        this.deleteMatch();
      },
    });
  },

  confirmEdit() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    let sqlTimestamp = this.data.strDate + 'T' + this.data.strTime + ":00.000+08:00"; // 转换为 ISO 
    that.setData({
      time: sqlTimestamp,
    });
    const dataToUpdate = {
      matchId: this.data.matchId,
      homeTeamId: this.data.homeTeamId,
      awayTeamId: this.data.awayTeamId,
      time: this.data.time,
      status: this.data.status,
      homeTeamScore: this.data.homeTeamScore,
      awayTeamScore: this.data.awayTeamScore,
      homeTeamPenalty: this.data.homeTeamPenalty,
      awayTeamPenalty: this.data.awayTeamPenalty,
    };
    console.log('dataToUpdate->');
    console.log(dataToUpdate);
    wx.request({
      url: URL + '/match/update',
      method: 'PUT',
      data: dataToUpdate,
      success: res => {
        wx.hideLoading()
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '修改失败',
            icon: "error",
          })
          return
        }
        console.log('比赛信息更新成功', res.data);
        wx.navigateBack({
          success: () => {
            setTimeout(function () {
              wx.showToast({
                title: "修改成功",
                icon: "success",
              })
            }, 500)
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        console.error('比赛信息修改失败', err);
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'error',
        });
      },
    });
  },

  deleteMatch() {
    var that = this;
    wx.showLoading({
      title: '删除中',
      mask: true
    })
    wx.request({
      url: URL + '/match/delete?matchId=' + that.data.matchId + '&userId=' + userId,
      method: 'DELETE',
      success(res) {
        wx.hideLoading()
        console.log("delete match->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败，请重试',
            icon: 'error',
          });
          return
        }
        wx.navigateBack({
          success: () => {
            setTimeout(function () {
              wx.showToast({
                title: "删除成功",
                icon: "success",
              })
            }, 500)
          }
        })
      },
      fail(err) {
        wx.hideLoading()
        console.error('友谊赛删除失败', err);
        wx.showToast({
          title: '删除失败，请重试',
          icon: "error",
        });
      },
    });
  },

  gotoInviteReferee: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/invite/invite?id=' + dataset.id + '&type=' + 'referee',
    })
  },

  bindStatusChange(e) {
    const value = e.detail.value;
    this.setData({
      status: this.data.statusArray[value],
      strStatus: this.data.strStatusArray[value],
    })
  },

  showCheckRefereeModal(e) {
    const id = e.currentTarget.dataset.id
    showModal({
      title: '确认查看',
      content: '确定要查看该教练吗？',
      onConfirm: () => {
        this.gotoRefereePage(id);
      },
    });
  },

  gotoRefereePage(e) {
    const refereeId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/user/referee/referee?id=' + refereeId,
    })
  },

  showDeleteRefereeModal(e) {
    const refereeId = e.currentTarget.dataset.id
    showModal({
      title: '确认移除',
      content: '确定要移除该教练吗？',
      confirmColor: '#FF0000',
      onConfirm: () => {
        this.deleteReferee(refereeId);
      },
    });
  },

  deleteReferee(refereeId) {
    const matchId = this.data.matchId
    const that = this
    wx.showLoading({
      title: '删除中',
      mask: true,
    })
    wx.request({
      url: `${URL}/match/referee/delete?matchId=${matchId}&refereeId=${refereeId}`,
      method: 'DELETE',
      success(res) {
        console.log("/pages/management/match_edit: deleteReferee ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("删除裁判成功")
        that.fetchData()
      },
      fail(err) {
        console.error(err)
      },
      complete() {
        wx.hideLoading()
      }
    })
  }

})