// pages/management/event_edit/event_edit.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const {
  formatTime
} = require("../../../utils/timeFormatter")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '/assets/cup.svg',
    modalHiddenEname: true, // 控制模态框显示隐藏
    modalHiddenEdes: true,

    eventId: 0,
    name: '',
    description: '',
    matchPlayerCount: 11,
    rosterSize: 23,
    rosterDeadline: '',
    rosterDeadlineDate: '',
    rosterDeadlineTime: '',
    savedDeadline: '',
    teamList: [],
    matchList: [],
    groupList: [],
    managerList: [],
    stageList: [],
    eventType: '',
    groupNumber: [],
    teamNumber: [],
    turnNumber: [],
    gNumber: 0,
    tNumber: 0,
    tuNumber: 0,
    inviteManager: {
      name: '邀请管理员',
      img: '/assets/newplayer.png'
    },
    managerList: [],
    modalHidden_inviteManager: true,
    inviteManagerId: -1,
    refereeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      eventId: options.id
    })
    this.fetchData();
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
    this.fetchData();
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
    this.fetchData();
    wx.stopPullDownRefresh();
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

  fetchData: function () {
    // 显示加载提示框，提示用户正在加载
    wx.showLoading({
      title: '加载中',
      mask: true // 创建一个蒙层，防止用户操作
    });

    var that = this;
    // 模拟网络请求
    wx.request({
      url: URL + '/event/get?id=' + that.data.eventId,
      success(res) {
        console.log("event->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        // 格式化时间
        let matchList = res.data.matchList ?? []
        for (let match of matchList) {
          let date = new Date(match.time)
          match.strTime = formatTime(date)
          match.hasBegun = match.status == 'PENDING' ? false : true
        }
        // 基本数据
        that.setData({
          eventId: res.data.eventId,
          name: res.data.name,
          description: res.data.description,
          matchPlayerCount: res.data.matchPlayerCount || 11,
          rosterSize: res.data.rosterSize || 23,
          teamList: res.data.teamList,
          matchList: res.data.matchList,
          groupList: res.data.groupList,
          managerList: res.data.managerList,
          stageList: res.data.stageList,
        });
        // 处理大名单截止日期
        if (res.data.rosterDeadline) {
          var deadline = new Date(res.data.rosterDeadline);
          var dateStr = deadline.getFullYear() + '-' + 
                        String(deadline.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(deadline.getDate()).padStart(2, '0');
          var timeStr = String(deadline.getHours()).padStart(2, '0') + ':' + 
                        String(deadline.getMinutes()).padStart(2, '0');
          that.setData({
            rosterDeadline: res.data.rosterDeadline,
            rosterDeadlineDate: dateStr,
            rosterDeadlineTime: timeStr,
            savedDeadline: dateStr + ' ' + timeStr
          });
        }
        if (that.data.stageList[0].stageName === '联赛') {
          const eventType = '联赛';
          const tuNumber = that.data.stageList[0].tags.length;
          that.setData({
            eventType: eventType,
            tuNumber: tuNumber
          })
        } else {
          const eventType = '杯赛';
          const gNumber = that.data.stageList[0].tags.length;
          var tNumber;
          if (that.data.stageList[1].tags.length === 1) {
            tNumber = 2;
          } else {
            tNumber = 2 ** (that.data.stageList[1].tags.length - 1);
          }
          that.setData({
            eventType: eventType,
            gNumber: gNumber,
            tNumber: tNumber
          })
        }
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        // 无论请求成功还是失败都会执行
        that.fetchReferee();
        wx.hideLoading(); // 关闭加载提示框
      }
    });
  },

  fetchReferee: function () {
    var that = this;
    // 模拟网络请求
    wx.request({
      url: URL + '/event/referee/getAll?eventId=' + that.data.eventId,
      success(res) {
        console.log("event referee->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.setData({
          refereeList: res.data
        });
      },
      fail(err) {
        console.log('请求失败', err);
      },
    });
  },

  // 赛事管理员
  showInviteManagerModal: function () {
    this.setData({
      modalHidden_inviteManager: false
    });
  },

  inputManagerId: function (e) {
    this.setData({
      inviteManagerId: e.detail.value
    });
  },

  confirmInviteManager: function () {
    this.setData({
      modalHidden_inviteManager: true
    });
    this.inviteEventManager(this.data.eventId, this.data.inviteManagerId)
  },

  cancelInviteManager: function () {
    this.setData({
      modalHidden_inviteManager: true
    });
  },

  inviteEventManager(eventId, managerId) {
    wx.showLoading({
      title: '上传中',
      mask: true,
    })
    let that = this
    wx.request({
      url: `${URL}/event/manager/invite?eventId=${eventId}&managerId=${managerId}`,
      method: 'POST',
      success: res => {
        wx.hideLoading()
        console.log('event edit page: inviteEventManager ->');
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: res.data,
            icon: "error",
          });
          return
        }
        wx.showToast({
          title: "邀请成功",
          icon: "success",
        });
        that.fetchData()
      },
      fail: err => {
        wx.hideLoading()
        console.error('邀请管理员失败', err);
        wx.showToast({
          title: '邀请失败',
          icon: "error",
        });
      }
    });
  },

  // 引入模态框的通用方法
  showModal: function (title, content, confirmText, confirmColor, cancelText, confirmCallback, cancelCallback) {
    wx.showModal({
      title: title,
      content: content,
      confirmText: confirmText,
      confirmColor: confirmColor,
      cancelText: cancelText,
      success(res) {
        if (res.confirm) {
          confirmCallback();
        } else if (res.cancel) {
          cancelCallback();
        }
      }
    });
  },

  // 显示赛事名称输入弹窗
  showNameInput: function () {
    this.setData({
      modalHiddenEname: false
    });
  },

  changename: function (e) {
    this.setData({
      newname: e.detail.value
    });
  },

  confirmChangeEventname: function () {
    let name = this.data.newname
    if (name.length > 20) {
      wx.showToast({
        title: '名称不应长于20字',
        icon: 'none',
      })
      return
    }
    this.setData({
      name: this.data.newname,
      modalHiddenEname: true
    });
  },

  cancelChangeEventname: function () {
    this.setData({
      modalHiddenEname: true
    });
  },

  inputEventDes: function (e) {
    this.setData({
      description: e.detail.value,
    });
  },

  // 大名单截止日期选择
  onDeadlineDateChange: function (e) {
    this.setData({
      rosterDeadlineDate: e.detail.value
    });
    this.updateRosterDeadline();
  },

  onDeadlineTimeChange: function (e) {
    this.setData({
      rosterDeadlineTime: e.detail.value
    });
    this.updateRosterDeadline();
  },

  updateRosterDeadline: function () {
    var date = this.data.rosterDeadlineDate;
    var time = this.data.rosterDeadlineTime;
    if (date && time) {
      this.setData({
        rosterDeadline: date + 'T' + time + ':00'
      });
    }
  },

  confirmDeadline: function () {
    var that = this;
    var date = this.data.rosterDeadlineDate;
    var time = this.data.rosterDeadlineTime;
    
    if (!date || !time) {
      wx.showToast({
        title: '请选择日期和时间',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '保存中',
      mask: true
    });

    wx.request({
      url: URL + '/event/update',
      method: 'PUT',
      data: {
        eventId: that.data.eventId,
        rosterDeadline: that.data.rosterDeadline
      },
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode !== 200) {
          wx.showToast({
            title: '保存失败',
            icon: 'error'
          });
          return;
        }
        that.setData({
          savedDeadline: that.data.rosterDeadlineDate + ' ' + that.data.rosterDeadlineTime
        });
        wx.showToast({
          title: '截止日期已保存',
          icon: 'success'
        });
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showToast({
          title: '保存失败',
          icon: 'error'
        });
      }
    });
  },

  showConfirmModal() {
    var that = this
    wx.showModal({
      title: '确认修改',
      content: '确定要进行修改吗？',
      confirmText: '确认',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.confirmEdit() // 点击确认时的回调函数
        } else if (res.cancel) {
          () => {} // 点击取消时的回调函数，这里不做任何操作
        }
      }
    })
  },

  // 点击取消比赛按钮，弹出确认取消模态框
  showCancelModal() {
    var that = this;
    this.showModal(
      '确认删除赛事',
      '确定要删除这项赛事吗？',
      '确认删除',
      '#FF0000',
      '我再想想',
      function() { that.deleteEvent(); }, // 点击确认取消时的回调函数
      function() {} // 点击我再想想时的回调函数，这里不做任何操作
    );
  },


  // 处理提交信息修改
  confirmEdit() {
    const dataToUpdate = {
      eventId: this.data.eventId,
      name: this.data.name,
      description: this.data.description,
      rosterDeadline: this.data.rosterDeadline || null,
      teamList: this.data.teamList,
      matchList: this.data.matchList,
      groupList: this.data.groupList,
      managerList: this.data.managerList,
      stageList: this.data.stageList,
    };

    wx.showLoading({
      title: '修改中',
      mask: true
    })

    wx.request({
      url: URL + '/event/update',
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
        console.log('赛事信息更新成功', res.data);
        wx.showToast({
          title: "修改成功",
          icon: "success",
        })
      },
      fail: err => {
        wx.hideLoading()
        console.error('赛事信息更新失败', err);
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'error',
        });
      }
    });
  },

  deleteEvent() {
    var that = this;
    // 模拟网络请求
    wx.request({
      url: URL + '/event/delete?eventId=' + that.data.eventId + '&userId=' + userId,
      method: 'DELETE',
      success(res) {
        console.log("event edit page: deleteEvent ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败',
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
        console.log('请求失败', err);
        wx.showToast({
          title: '删除失败',
          icon: 'error',
        });
      },
      complete() {}
    });
  },

  gotoUserPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/user/user?id=' + dataset.id,
    })
  },

  gotoTeamPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/team/team?id=' + dataset.id,
    })
  },

  gotoMatchPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + dataset.id,
    })
  },

  gotoTeams: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/event_edit/event_teams/event_teams?id=' + dataset.id,
    })
  },

  gotoMatches: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/event_edit/event_matches/event_matches?id=' + dataset.id,
    })
  },

  goToCreateMatch: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/event_edit/match_new/match_new?id=' + dataset.id,
    })
  },

  gotoInviteReferee: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/invite/invite?id=' + dataset.id + '&type=' + 'event_referee',
    })
  },

  gotoRefereePage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/user/referee/referee?id=' + dataset.id,
    })
  },

})