const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({
  data: {
    username: '',
    password: '',
    users: [],
    checkedUser: {},
    updatedUser: {},
    newPassword: '',
    isCreateModalVisible: false,
    isUpdateModalVisible: false,
    isCheckModalVisible: false,
  },

  onShow() {
    this.fetchData()
  },

  onPullDownRefresh() {
    this.fetchData()
    wx.stopPullDownRefresh()
  },

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  showCreateModal() {
    this.setData({
      isCreateModalVisible: true,
      username: '',
      password: ''
    });
  },

  showCheckModal(e) {
    const authorityId = e.currentTarget.dataset.id;
    const user = this.data.users.find(user => user.authorityId == authorityId);
    if (user) {
      this.setData({
        isCheckModalVisible: true,
        checkedUser: user
      });
    }
  },

  showUpdateModal(e) {
    const authority_id = e.currentTarget.dataset.id;
    const user = this.data.users.find(user => user.authority_id == authority_id);
    if (user) {
      this.setData({
        isUpdateModalVisible: true,
        updatedUser: user,
      });
    }
  },

  showDeleteConfirmation(e) {
    const authorityId = e.currentTarget.dataset.id;
    const user = this.data.users.find(user => user.authorityId == authorityId);
    wx.showModal({
      title: '删除',
      content: `删除二级权限 "${user.username}"`,
      confirmText: '删除',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          this.deleteUser(authorityId);
        }
      }
    });
  },

  closeModal() {
    this.setData({
      isCreateModalVisible: false,
      isUpdateModalVisible: false,
      isCheckModalVisible: false
    });
  },

  preventModalClose() {
    // 用于阻止点击模态框背景关闭模态框
  },

  // 拉取二级权限列表
  fetchData: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: `${URL}/authority/second/getAll`,
      success(res) {
        console.log("second_level_authorith page: fetchData->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)

        that.setData({
          users: res.data,
        });
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });
  },

  // 新建权限
  createUser() {
    if (!this.checkCreate()) {
      return
    }

    const {
      username,
      password,
    } = this.data;
    let createUserId = userId

    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: `${URL}/authority/second/create`,
      method: 'POST',
      data: {
        username,
        password,
        createUserId
      },
      success(res) {
        wx.hideLoading();
        console.log("second_level_authorith page: create->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        wx.showToast({
          title: '新增成功',
          icon: 'success'
        })
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '新增失败',
          icon: 'error'
        })
        console.log('create失败: ', err);
      },
      complete() {
        that.closeModal()
        that.fetchData()
      },
    });
  },

  checkCreate() {
    const {
      username,
      password,
      users
    } = this.data;
    if (username && password) {
      const userExists = users.some(user => user.username === username);
      if (!userExists) {
        this.setData({
          isCreateModalVisible: false
        });
        return true
      } else {
        wx.showToast({
          title: '用户已存在',
          icon: 'none'
        });
      }
    } else {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
    }
    return false
  },

  // 更新密码
  updateUser() {
    this.checkUpdate()

    const {
      password,
      updatedUser
    } = this.data
    const secondLevelAuthority = updatedUser
    secondLevelAuthority.password = password

    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: `${URL}/authority/second/update`,
      method: 'PUT',
      data: secondLevelAuthority,
      success(res) {
        wx.hideLoading();
        console.log("second_level_authorith page: update->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        wx.showToast({
          title: '更新成功',
          icon: 'success'
        })
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '更新失败',
          icon: 'error'
        })
        console.log('update失败: ', err);
      },
      complete() {
        that.closeModal()
        that.fetchData()
      },
    });
  },

  checkUpdate() {
    const {
      currentUsername,
      password,
      users
    } = this.data;
    if (password) {
      const userIndex = users.findIndex(user => user.username === currentUsername);
      if (userIndex !== -1) {
        this.setData({
          isUpdateModalVisible: false
        });
        return true
      } else {
        wx.showToast({
          title: '用户不存在',
          icon: 'none'
        });
      }
    } else {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      });
    }
    return false
  },

  // 删除权限
  deleteUser(authorityId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: `${URL}/authority/second/delete?authorityId=${authorityId}`,
      method: 'DELETE',
      success(res) {
        wx.hideLoading();
        console.log("second_level_authorith page: delete->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '删除失败',
          icon: 'error'
        })
        console.log('delete失败: ', err);
      },
      complete() {
        that.fetchData()
      },
    });
  },
});