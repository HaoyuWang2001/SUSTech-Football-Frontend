const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    isChangePasswordModalVisible: false,
    newPassword: '',
    repeatedPassword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      username: options.username,
    })
  },

  gotoTeamsPage: function (e) {
    wx.navigateTo({
      url: 'teams/teams',
    })
  },

  gotoMatchesPage: function (e) {
    wx.navigateTo({
      url: 'matches/matches',
    })
  },

  gotoEventsPage: function (e) {
    wx.navigateTo({
      url: 'events/events',
    })
  },

  gotoSecondLevelAuthorityPage() {
    wx.navigateTo({
      url: 'second_level_authority/second_level_authority',
    })
  },

  showChangePasswordModal() {
    this.setData({
      isChangePasswordModalVisible: true,
    })
  },

  closeModal() {
    this.setData({
      isChangePasswordModalVisible: false,
    })
  },

  onNewPasswordInput(e) {
    this.setData({
      newPassword: e.detail.value
    });
  },

  onRepeatedPasswordInput(e) {
    this.setData({
      repeatedPassword: e.detail.value
    });
  },

  updatePassword() {
    const {
      username,
      newPassword,
      repeatedPassword
    } = this.data;

    // 检查新密码和重复密码是否为空
    if (!newPassword || !repeatedPassword) {
      wx.showToast({
        title: '不能为空',
        icon: 'error',
      });
      return;
    }

    // 检查新密码和重复密码是否相同
    if (newPassword !== repeatedPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'error',
      });
      return;
    }

    wx.showLoading({
      title: '更新中',
      mask: true,
    })

    // 发送请求更新密码
    var that = this
    wx.request({
      url: `${URL}/authority/first/update`,
      method: 'PUT',
      data: {
        username: username,
        password: newPassword
      },
      success(res) {
        wx.hideLoading()
        if (res.statusCode === 200) {
          wx.showToast({
            title: '更新成功',
            icon: 'success',
          });
          that.closeModal()
        } else {
          wx.showToast({
            title: '更新失败',
            icon: 'error',
          });
        }
      },
      fail(error) {
        wx.hideLoading()
        wx.showToast({
          title: '更新失败',
          icon: 'error',
        });
      }
    });
  }

})