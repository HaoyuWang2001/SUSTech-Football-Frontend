// pages/management/team_edit/team_edit.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    modalHidden_name: true, // 控制模态框显示隐藏
    modalHidden_description: true,
    inviteManager: {
      name: '邀请管理员',
      img: '/assets/newplayer.png'
    },
    invitePlayer: {
      name: '邀请新队员',
      img: '/assets/newplayer.png'
    },
    selectCaptain: {
      name: '选择队长',
      img: '/assets/newplayer.png'
    },
    inviteCoach: {
      name: '邀请教练',
      img: '/assets/newplayer.png'
    },
    captain: [],

    teamId: 0,
    name: '',
    newName: '',
    logoUrl: '',
    description: '',
    newdes: "",
    playerList: [],
    captainId: 0,
    coachList: [],
    eventList: [],
    managerList: [],
    matchList: [],
    editPlayerModalHidden: true,
    newPlayerNumber: '',
    managerList: [],
    modalHidden_inviteManager: true,
    inviteManagerId: -1,
  },

  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.fetchData(this.data.id);
  },

  onShow() {
    this.fetchData(this.data.id);
  },

  onPullDownRefresh() {
    this.fetchData(this.data.id);
    wx.stopPullDownRefresh();
  },

  // 拉取数据
  fetchData: function (id) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    var that = this;
    wx.request({
      url: URL + '/team/get?id=' + id,
      success(res) {
        console.log("team->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          teamId: res.data.teamId,
          name: res.data.name,
          logoUrl: res.data.logoUrl,
          coachList: res.data.coachList,
          eventList: res.data.eventList,
          managerList: res.data.managerList,
          matchList: res.data.matchList,
          playerList: res.data.playerList,
          description: res.data.description,
          managerList: res.data.managerList
        });
        if (res.data.captainId !== null) {
          that.setData({
            captainId: res.data.captainId,
          });
          that.fetchCaptain(res.data.captainId);
        }
      },
      fail(err) {
        console.error('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });
  },

  fetchCaptain(captainId) {
    if (captainId <= 0 || captainId === null) {
      return;
    }
    var that = this;
    wx.request({
      url: URL + '/player/get?id=' + captainId,
      success(res) {
        console.log("captain->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        // 基本数据
        that.setData({
          captain: res.data
        });
      },
      fail(err) {
        console.log('请求失败', err);
      },
    })
  },

  // 上传数据进行更新
  updateTeamInfo() {
    if (this.data.name.length > 15) {
      wx.showToast({
        title: '队名过长',
        icon: 'error',
      })
      return
    }

    // 构造要发送给后端的数据
    const dataToUpdate = {
      teamId: this.data.teamId,
      name: this.data.name,
      logoUrl: this.data.logoUrl,
      captainId: this.data.captainId,
      description: this.data.description
    };
    console.log('dataToUpdate->');
    console.log(dataToUpdate);

    wx.showLoading({
      title: '上传中',
      mask: true,
    })

    wx.request({
      url: URL + '/team/update',
      method: 'PUT',
      data: dataToUpdate,
      success: res => {
        wx.hideLoading()
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '修改失败',
            icon: "error",
          });
          return
        }
        console.log('球队信息修改成功', res.data);
        wx.showToast({
          title: "修改成功",
          icon: 'success',
        });
      },
      fail: err => {
        wx.hideLoading()
        console.error('球队信息修改失败', err);
        wx.showToast({
          title: '修改失败',
          icon: "error",
        });
      }
    });
  },

  // 选择队徽
  chooseLogo: function () {
    var that = this;
    // 打开相册或相机选择图片
    wx.chooseMedia({
      count: 1, // 默认为9，设置为1表示只选择一张图片
      mediaType: ['image'],
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表
        let tempFilePath = res.tempFiles[0].tempFilePath
        console.log('tempFilePath->');
        console.log(tempFilePath);
        that.uploadLogo(tempFilePath)
      }
    })
  },

  // 上传队徽图片至服务器并获得URL
  uploadLogo(tempFilePath) {
    var that = this;
    wx.uploadFile({
      url: URL + '/upload', // 你的上传图片的服务器API地址
      filePath: tempFilePath,
      name: 'file', // 必须填写，因为后台需要根据name键来获取文件内容
      success: function (uploadRes) {
        console.log('Create Team: uploadLogo ->')
        console.log(uploadRes)
        if (uploadRes.statusCode != 200) {
          console.error("请求失败，状态码为：" + uploadRes.statusCode + "; 错误信息为：" + uploadRes.data)
          wx.showToast({
            title: '上传头像失败',
            icon: "error",
          });
          return
        }
        var filename = uploadRes.data;
        that.setData({
          logoUrl: URL + '/download?filename=' + filename
        });
        console.log("logoUrl->")
        console.log(that.data.logoUrl)
        that.updateTeamInfo()
      },
      fail: function (error) {
        console.log('上传失败', error);
        wx.hideLoading()
        wx.showToast({
          title: '上传头像失败，请检查网络！',
          icon: "error"
        });
      },
    })
  },

  // 更改队名
  showNameModal: function () {
    this.setData({
      modalHidden_name: false
    });
  },

  changeName: function (e) {
    this.setData({
      newName: e.detail.value
    });
  },

  confirmChangeName: function () {
    this.setData({
      name: this.data.newName,
      modalHidden_name: true
    });
    this.updateTeamInfo()
  },

  cancelChangeName: function () {
    this.setData({
      modalHidden_name: true
    });
  },

  inputTeamDes: function (e) {
    this.setData({
      description: e.detail.value,
    });
  },

  // 球队管理员
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
    this.inviteTeamManager(this.data.teamId, this.data.inviteManagerId)
  },

  cancelInviteManager: function () {
    this.setData({
      modalHidden_inviteManager: true
    });
  },

  inviteTeamManager(teamId, managerId) {
    wx.showLoading({
      title: '上传中',
      mask: true,
    })
    let that = this
    wx.request({
      url: `${URL}/team/manager/invite?managerId=${managerId}&teamId=${teamId}`,
      method: 'POST',
      success: res => {
        wx.hideLoading()
        console.log('team edit page: inviteTeamManager ->');
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
        that.fetchData(that.data.id)
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

  showDeletePlayerModal(e) {
    const that = this
    const playerId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认移除',
      content: '确定要移除该球员吗？',
      confirmText: '确认',
      confirmColor: 'red',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.deletePlayer(playerId)
        }
      }
    });
  },

  deletePlayer() {
    var that = this;
    // 模拟网络请求
    wx.request({
      url: URL + '/team/player/delete?teamId=' + that.data.teamId + '&playerId=' + that.data.selectPlayerId,
      method: 'DELETE',
      success(res) {
        console.log("delete team player->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: res.data,
            icon: "error",
          });
          return
        }
        const successMsg = res.data ? res.data : '删除成功';
        that.fetchData(that.data.id);
        wx.showToast({
          title: successMsg,
          icon: "success",
        });
      },
      fail(err) {
        console.error('球员删除失败', err);
        wx.showToast({
          title: '删除失败',
          icon: "error",
        });
      },
    });
  },

  // 删除教练模态框
  showDeleteCoachModal(e) {
    const that = this
    const coachId = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认移除',
      content: '确定要移除该教练吗？',
      confirmText: '确认',
      confirmColor: 'red',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.deleteCoach(coachId)
        }
      }
    })
  },

  // 显示编辑球员号码模态框
  showEditPlayerModal: function (e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      editPlayerModalHidden: false,
      newPlayerNumber: '', // 清空之前的输入
      selectPlayerId: id
    });
  },

  // 输入球员号码
  inputPlayerNumber: function (e) {
    const value = e.detail.value;
    this.setData({
      newPlayerNumber: value,
    });
  },

  // 确认修改球员号码
  confirmEditPlayerNumber: function () {
    var that = this;
    // 模拟网络请求
    wx.request({
      url: URL + '/team/player/updateNumber?teamId=' + that.data.teamId + '&playerId=' + that.data.selectPlayerId + '&number=' + that.data.newPlayerNumber,
      method: 'POST',
      success(res) {
        console.log("set team player number->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '设置号码失败，请重试',
            icon: "error",
          });
          return
        }
        const successMsg = res.data ? res.data : '设置号码成功'; // 假设后端返回的成功信息在 res.data
        that.fetchData(that.data.id);
        wx.showToast({
          title: successMsg,
          icon: "success",
        });
      },
      fail(err) {
        // 请求失败的处理逻辑
        console.error('设置号码失败', err);
        // 显示失败信息
        wx.showToast({
          title: '设置失败，请重试',
          icon: "error",
        });
      },
      complete() {
        that.setData({
          editPlayerModalHidden: true,
        });
      }
    });
  },

  // 取消修改球员号码
  cancelEditPlayerNumber: function () {
    this.setData({
      editPlayerModalHidden: true,
    });
  },

  deleteCoach(coachId) {
    var that = this;
    wx.showLoading({
      title: '删除中',
      mask: true,
    })
    wx.request({
      url: `${URL}/team/coach/delete?teamId=${that.data.teamId}&coachId=${coachId}`,
      method: 'DELETE',
      success(res) {
        wx.hideLoading()
        console.log("/pages/management/team_edit/team_edit: deleteCoach ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败，请重试',
            icon: 'error',
          });
          return
        }
        console.log("删除成功")
        that.fetchData(that.data.id)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
        });
      },
      fail(err) {
        wx.hideLoading()
        console.error('教练删除失败', err);
        wx.showToast({
          title: '删除失败，请重试',
          icon: 'error',
        });
      },
    });
  },

  gotoUserPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/user/user?id=' + dataset.id,
    })
  },

  gotoInvitePlayer: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/invite/invite?id=' + dataset.id + '&type=' + 'player',
    })
  },

  gotoSelectCaptain: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      //url: '/pages/management/team_edit/select_captain/select_captain?id=' + dataset.id,
      url: '/pages/management/invite/invite?id=' + dataset.id + '&type=' + 'captain',
    })
  },

  gotoInviteCoach: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/invite/invite?id=' + dataset.id + '&type=' + 'coach',
    })
  },

  gotoPlayerPage: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/user/player/player?id=' + id,
    })
  },

  gotoCoachPage: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/user/coach/coach?id=' + id,
    })
  },

})