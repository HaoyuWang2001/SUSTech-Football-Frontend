const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 处理用户名输入
  onUsernameInput(event) {
    this.setData({
      username: event.detail.value
    });
  },

  // 处理密码输入
  onPasswordInput(event) {
    this.setData({
      password: event.detail.value
    });
  },

  // 处理登录操作
  onLogin() {
    const {
      username,
      password
    } = this.data;

    if (!username || !password) {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none'
      });
      return;
    }

    // 假设有一个登录 API
    wx.request({
      url: `${URL}/authority/check/second`,
      method: 'POST',
      data: {
        username,
        password
      },
      success: (res) => {
        if (res.statusCode == 200 && res.data != -1) {
          wx.navigateBack({
            complete: () => {
              wx.navigateTo({
                url: `/pages/mine/second_authority/second_authority?authorityId=${res.data}&username=${username}`,
              });
            }
          });
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'error'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },
})