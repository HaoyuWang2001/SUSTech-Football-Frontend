// pages/profile_player/profile_referee_register/profile_referee_register.js
const app = getApp()
const URL = app.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoUrl: '/assets/newplayer.png',
    name: '',
    bio: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  uploadImage(e) {
    const {
      avatarUrl
    } = e.detail
    const that = this
    app.onChooseAvatar(avatarUrl, (url) => {
      that.setData({
        photoUrl: url
      });
    })
  },

  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  inputBio: function (e) {
    this.setData({
      bio: e.detail.value
    })
  },

    // 表单提交
    submit: function () {
      console.log('profile referee register: submit ->')
      console.log(this.data);
      if (this.validateData()) {
        // 如果验证通过，进行数据上传或其他处理
        console.log('验证通过，开始上传');
        wx.showLoading({
          title: '正在注册',
        })
        wx.request({
          url: URL + '/referee/create',
          method: 'POST',
          data: {
            photoUrl: this.data.photoUrl,
            name: this.data.name,
            bio: this.data.bio,
            userId: app.globalData.userId,
          },
          success (res) {
            console.log('profile referee register: submit ->')
            if (res.statusCode != 200) {
              console.error('新建裁判失败' + res.statusCode + ' ' + res.data)
              return
            }
            console.log('新建裁判成功')
            wx.navigateBack()
          },
          fail(err) {
            console.error('新建裁判失败：', err.statusCode, err.errMsg);
          },
          complete() {
            wx.hideLoading()
          }
        })
      }
    },

      // 验证函数
  validateData: function () {
    const {
      photoUrl,
      name
    } = this.data;

    if (!photoUrl) {
      wx.showToast({
        title: '头像不能为空',
        icon: 'none'
      });
      return false;
    }

    if (!name) {
      wx.showToast({
        title: '名字不能为空',
        icon: 'none'
      });
      return false;
    }

    return true;
  },

})