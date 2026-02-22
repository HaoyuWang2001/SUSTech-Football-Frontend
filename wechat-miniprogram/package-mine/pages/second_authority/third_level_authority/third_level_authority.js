const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({
  data: {
    authorityId: 0,
    newUserId: "",
    thirdAuthorityList: [],
    isCreateModalVisible: false,
  },

  onLoad(options) {
    this.setData({
      authorityId: options.authorityId,
    })
  },

  onShow() {
    this.fetchData()
  },

  onPullDownRefresh() {
    this.fetchData()
    wx.stopPullDownRefresh()
  },

  onUserIdInput(e) {
    this.setData({
      newUserId: e.detail.value
    });
  },

  showCreateModal() {
    this.setData({
      isCreateModalVisible: true,
      username: '',
      password: ''
    });
  },

  showDeleteConfirmation(e) {
    const authorityId = e.currentTarget.dataset.id;
    const authority = this.data.thirdAuthorityList.find(authority => authority.authorityId == authorityId);
    wx.showModal({
      title: '删除',
      content: `删除二级权限 "${authority.user.nickName}"`,
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
      newUserId: "",
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
      url: `${URL}/authority/third/getBySecond?authorityId=${this.data.authorityId}`,
      success(res) {
        console.log("second_level_authorith page: fetchData->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)

        that.setData({
          thirdAuthorityList: res.data,
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

    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: `${URL}/authority/third/create`,
      method: 'POST',
      data: {
        secondLevelAuthorityId: this.data.authorityId,
        userId: this.data.newUserId,
        createUserId: userId,
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
      newUserId,
      thirdAuthorityList
    } = this.data;
    if (newUserId) {
      const userExists = thirdAuthorityList.some(authority => authority.userId == newUserId);
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
        title: '请输入用户Id',
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
      url: `${URL}/authority/third/delete?authorityId=${authorityId}`,
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