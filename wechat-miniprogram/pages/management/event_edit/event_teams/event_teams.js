// pages/management/event_edit/event_teams/event_teams.js
const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    eventId: 0,
    teamList: [],
    groupList: [],
    stageList: [],
    deleteTeamId: 0,
    deleteGroupId: 0,
    groupNameList: [],
    groupTeamList: [],
    noGroupTeamList: [],
    selectedGroupIndex: 0, // 选择的组别索引
    groupModalHidden: true, // 控制分组确认模态框显示隐藏
    currentTeamId: 0, // 当前选择分组的球队ID
    currentGroupId: 0,
    currentTeamName: '',
    showPicker: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.fetchData(this.data.id);
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
    this.fetchData(this.data.id);
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
    this.fetchData(this.data.id);
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

  fetchData: function (id) {
    // 显示加载提示框，提示用户正在加载
    wx.showLoading({
      title: '加载中',
      mask: true // 创建一个蒙层，防止用户操作
    });

    var that = this;
    // 模拟网络请求
    wx.request({
      url: URL + '/event/get?id=' + id,
      success(res) {
        console.log("eventTeam->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        // 基本数据
        that.setData({
          eventId: res.data.eventId,
          teamList: res.data.teamList,
          groupList: res.data.groupList,
          stageList: res.data.stageList
        });
        let groupNameList = []
        let groupTeamList = []
        for (let i = 0; i < res.data.groupList.length; i++) {
          groupNameList.push(res.data.groupList[i].name);
          for (let j = 0; j < res.data.groupList[i].teamList.length; j++){
            groupTeamList.push(res.data.groupList[i].teamList[j].team)
          }
        }
        that.setData({
          groupNameList: groupNameList,
          groupTeamList: groupTeamList
        });
        let teamList = res.data.teamList
        let noGroupTeamList = []
        for (let i = 0; i < teamList.length; i++) {
          var hasGruop = false
          for (let j = 0; j < groupTeamList.length; j++) {
            if (teamList[i].id === groupTeamList[j].id) {
              hasGruop = true
              break
            }
          }
          if (!hasGruop) {
            noGroupTeamList.push(teamList[i])
            console.log(teamList[i])
          }
        }
        that.setData({
          noGroupTeamList: noGroupTeamList
        })
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
      deleteTeamId: e.currentTarget.dataset.teamid,
      deleteGroupId: e.currentTarget.dataset.groupid
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

  // 显示选择组别的picker
  selectGroup: function (e) {
    console.log(e)
    const teamId = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;
    const currentGroupId = e.currentTarget.dataset.groupid
    this.setData({
      currentTeamId: teamId,
      currentTeamName: name,
      currentGroupId: currentGroupId,
      showPicker: true
    });
  },

  // 处理组别选择变化
  onGroupChange: function (e) {
    this.setData({
      selectedGroupIndex: e.detail.value,
    });
    this.showSelectConfirmModal();
  },

  // 点击取消比赛按钮，弹出确认取消模态框
  showSelectConfirmModal() {
    var that = this
    wx.showModal({
      title: '确认分配小组',
      content: '确定将球队' + that.data.currentTeamName + '分配到' + that.data.groupNameList[that.data.selectedGroupIndex] + '吗？',
      confirmText: '确认分配',
      cancelText: '我再想想',
      success(res) {
        if (res.confirm) {
          that.confirmGroupAssignment() // 点击确认删除时的回调函数
        } else if (res.cancel) {
          () => {} // 点击我再想想时的回调函数，这里不做任何操作
        }
      }
    });
  },

  // 确认分配组别
  confirmGroupAssignment: function () {
    const teamId = this.data.currentTeamId
    const groupId = this.data.groupList[this.data.selectedGroupIndex].groupId
    var that = this
    let isInGroup = true
    for (let i = 0; i < this.data.noGroupTeamList.length; i++){
      if (teamId === this.data.noGroupTeamList[i].id) {
        isInGroup = false
        break
      }
    }
    if (isInGroup) {
      wx.request({
        url: URL + '/event/group/deleteTeam?groupId=' + that.data.currentGroupId + '&teamId=' + teamId,
        method: 'DELETE',
        success(res) {
          console.log("delete event group team->")
          console.log(res.data)
          if (res.statusCode !== 200) {
            console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
            wx.showToast({
              title: '删除失败，请重试',
              icon: 'error',
            });
            return
          }
          wx.request({
            url: URL + '/event/group/addTeam?groupId=' + groupId + '&teamId=' + teamId,
            method: 'POST',
            success(res) {
              console.log("gruop addTeam->")
              console.log(res.data)
              if (res.statusCode !== 200) {
                console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                wx.showToast({
                  title: '分配失败，请重试',
                  icon: 'error',
                });
                return
              }
              const successMsg = res.data ? res.data : '分配成功'; // 假设后端返回的成功信息在 res.
              wx.showToast({
                title: successMsg,
                icon: 'success',
              });
            },
            fail(err) {
              // 请求失败的处理逻辑
              console.error('赛事球队分配小组失败', err);
              // 显示失败信息
              wx.showToast({
                title: '分配失败，请重试',
                icon: 'error',
              });
            },
            complete() {
              that.fetchData(that.data.id);
            }
          });
        },
        fail(err) {
          // 请求失败的处理逻辑
          console.error('赛事小组球队删除失败', err);
          // 显示失败信息
          wx.showToast({
            title: '删除失败，请重试',
            icon: 'error',
          });
        },
        complete() {
        }
      });
    } else {
      // 模拟网络请求
      wx.request({
        url: URL + '/event/group/addTeam?groupId=' + groupId + '&teamId=' + teamId,
        method: 'POST',
        success(res) {
          console.log("gruop addTeam->")
          console.log(res.data)
          if (res.statusCode !== 200) {
            console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
            wx.showToast({
              title: '分配失败，请重试',
              icon: 'error',
            });
            return
          }
          const successMsg = res.data ? res.data : '分配成功'; // 假设后端返回的成功信息在 res.
          wx.showToast({
            title: successMsg,
            icon: 'success',
          });
        },
        fail(err) {
          // 请求失败的处理逻辑
          console.error('赛事球队分配小组失败', err);
          // 显示失败信息
          wx.showToast({
            title: '分配失败，请重试',
            icon: 'error',
          });
        },
        complete() {
          that.fetchData(that.data.id);
        }
      });
    }
  },

  deleteTeam() {
    var that = this;
    // 模拟网络请求
    if(this.data.groupId === 0){
      wx.request({
        url: URL + '/event/team/delete?eventId=' + that.data.eventId + '&teamId=' + that.data.deleteTeamId,
        method: 'DELETE',
        success(res) {
          console.log("delete event team->")
          console.log(res.data)
          if (res.statusCode !== 200) {
            console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
            wx.showToast({
              title: '删除失败，请重试',
              icon: 'error',
            });
            return
          }
          const successMsg = res.data ? res.data : '删除成功';
          that.fetchData(that.data.id);
          wx.showToast({
            title: successMsg,
            icon: 'success',
          });
        },
        fail(err) {
          // 请求失败的处理逻辑
          console.error('赛事球队删除失败', err);
          // 显示失败信息
          wx.showToast({
            title: '删除失败，请重试',
            icon: 'error',
          });
        },
        complete() {
        }
      });
    } else {
      wx.request({
        url: URL + '/event/group/deleteTeam?groupId=' + that.data.deleteGroupId + '&teamId=' + that.data.deleteTeamId,
        method: 'DELETE',
        success(res) {
          console.log("delete event group team->")
          console.log(res.data)
          if (res.statusCode !== 200) {
            console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
            wx.showToast({
              title: '删除失败，请重试',
              icon: 'error',
            });
            return
          }
          wx.request({
            url: URL + '/event/team/delete?eventId=' + that.data.eventId + '&teamId=' + that.data.deleteTeamId,
            method: 'DELETE',
            success(res) {
              console.log("delete event team->")
              console.log(res.data)
              if (res.statusCode !== 200) {
                console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                wx.showToast({
                  title: '删除失败，请重试',
                  icon: 'error',
                });
                return
              }
              const successMsg = res.data ? res.data : '删除成功'; // 假设后端返回的成功信息在 res.
              that.fetchData(that.data.id);
              wx.showToast({
                title: successMsg,
                icon: 'success',
              });
            },
            fail(err) {
              // 请求失败的处理逻辑
              console.error('赛事球队删除失败', err);
              // 显示失败信息
              wx.showToast({
                title: '删除失败，请重试',
                icon: 'error',
              });
            },
            complete() {
            }
          });
        },
        fail(err) {
          // 请求失败的处理逻辑
          console.error('赛事小组球队删除失败', err);
          // 显示失败信息
          wx.showToast({
            title: '删除失败，请重试',
            icon: 'error',
          });
        },
        complete() {
        }
      });
    }
  },

  gotoInviteTeam: function(e){
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/invite/invite?id=' + dataset.id + '&type=' + 'team',
    })
  },

  gotoTeamPage: function(e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/team/team?id=' + dataset.id,
    })
  },

  gotoViewRoster: function(e) {
    var that = this;
    var teamId = e.currentTarget.dataset.teamid;
    var teamName = e.currentTarget.dataset.teamname;
    var teamLogo = e.currentTarget.dataset.teamlogo || '';
    wx.navigateTo({
      url: '/pages/management/event_edit/event_roster_view/event_roster_view?eventId=' + that.data.eventId + '&teamId=' + teamId + '&teamName=' + encodeURIComponent(teamName) + '&teamLogo=' + encodeURIComponent(teamLogo)
    })
  },

})