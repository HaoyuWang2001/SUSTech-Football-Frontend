// pages/profile_player/profile_player_register/profile_player_register.js
const app = getApp()
const URL = app.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoUrl: '/assets/newplayer.png', // 头像链接
    name: '', // 名字
    birthDate: '请选择出生日期', // 生日
    height: '', // 身高
    weight: '', // 体重
    position: '', // 场上位置
    identity: '', // 学工号
    shuYuan: '请选择书院', // 书院
    college: '', // 院系
    admissionYear: '请选择入学年份', // 入学年份
    shuYuanOptions: ['无书院/不愿透露', '致仁书院', '树仁书院', '致诚书院', '树礼书院', '树德书院', '致新书院']
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

  // 处理学工号输入
  inputIdentity: function (e) {
    this.setData({
      identity: e.detail.value
    });
  },

  // 处理身高输入
  inputHeight: function (e) {
    this.setData({
      height: e.detail.value
    });
  },

  // 处理体重输入
  inputWeight: function (e) {
    this.setData({
      weight: e.detail.value
    });
  },

  // 处理生日选择
  bindDateChange: function (e) {
    this.setData({
      birthDate: e.detail.value
    });
  },

  // 处理场上位置选择
  inputPosition: function (e) {
    this.setData({
      position: e.detail.value
    });
  },

  // 处理书院选择
  bindShuYuanChange: function (e) {
    this.setData({
      shuYuan: this.data.shuYuanOptions[e.detail.value]
    });
  },

  // 处理院系输入
  inputCollege: function (e) {
    this.setData({
      college: e.detail.value
    });
  },

  // 处理入学年份选择
  bindAdmissionYearChange: function (e) {
    this.setData({
      admissionYear: e.detail.value
    });
  },

  // 表单提交
  submit: function () {
    console.log('profile player register: submit ->')
    console.log(this.data);
    if (this.validateData()) {
      // 如果验证通过，进行数据上传或其他处理
      console.log('验证通过，开始上传');
      wx.showLoading({
        title: '正在注册',
      })
      wx.request({
        url: URL + '/player/create',
        method: 'POST',
        data: {
          photoUrl: this.data.photoUrl,
          name: this.data.name,
          birthDate: this.data.birthDate,
          height: this.data.height,
          weight: this.data.weight,
          position: this.data.position,
          identity: this.data.identity,
          shuYuan: this.data.shuYuan,
          college: this.data.college,
          admissionYear: this.data.admissionYear,
          userId: app.globalData.userId,
        },
        success(res) {
          console.log('profile player register: submit ->')
          if (res.statusCode != 200) {
            console.error('新建球员失败' + res.statusCode + ' ' + res.data)
            return
          }
          console.log('新建球员成功')
          wx.navigateBack()
        },
        fail(err) {
          console.error('新建球员失败：', err.statusCode, err.errMsg);
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
      name,
      identity,
      birthDate,
      admissionYear
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

    if (!identity) {
      wx.showToast({
        title: '学工号不能为空',
        icon: 'none'
      });
      return false;
    }

    // 对出生日期进行验证，确保用户已经选择
    if (birthDate === '请选择出生日期') {
      wx.showToast({
        title: '请选择出生日期',
        icon: 'none'
      });
      return false;
    }

    // 对入学年份进行验证，确保用户已经选择
    if (admissionYear === '请选择入学年份') {
      wx.showToast({
        title: '请选择入学年份',
        icon: 'none'
      });
      return false;
    }

    return true;
  },

})