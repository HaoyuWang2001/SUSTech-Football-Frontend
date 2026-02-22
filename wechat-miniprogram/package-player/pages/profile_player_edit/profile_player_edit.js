// pages/profile_player/profile_player_edit/profile_player_edit.js
import { Colors, Shadows, Gradients } from '../../../utils/colors.js'
const app = getApp()
const URL = app.globalData.URL

Page({
  /**
   * 页面的初始数据
   */
  data: {
    playerId: Number,
    photoUrl: '', // 头像链接
    name: '', // 名字
    birthDate: '', // 生日
    strBirthDate: '请选择出生日期',
    height: '', // 身高
    weight: '', // 体重
    position: '', // 场上位置
    identity: '', // 学工号
    shuYuan: '', // 书院
    college: '', // 院系
    admissionYear: '请选择入学年份', // 入学年份
    modalHiddenEname: true, // 控制模态框显示隐藏
    modalHiddenId: true,
    modalHiddenHeight: true,
    modalHiddenWeight: true,
    modalHiddenPosition: true,
    modalHiddenShuyuan: true,
    modalHiddenCollege: true,
    shuYuanOptions: ['无书院/不愿透露', '致仁书院', '树仁书院', '致诚书院', '树礼书院', '树德书院', '致新书院'],
    // 颜色设计系统常量
    Colors: Colors,
    Shadows: Shadows,
    Gradients: Gradients
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      playerId: decodeURIComponent(options.playerId),
      photoUrl: decodeURIComponent(options.photoUrl),
      name: decodeURIComponent(options.name), // 名字
      birthDate: decodeURIComponent(options.birthDate), // 生日
      strBirthDate: decodeURIComponent(options.strBirthDate), // 生日
      height: decodeURIComponent(options.height), // 身高
      weight: decodeURIComponent(options.weight), // 体重
      position: decodeURIComponent(options.position), // 场上位置
      identity: decodeURIComponent(options.identity), // 学工号
      shuYuan: decodeURIComponent(options.shuYuan), // 书院
      college: decodeURIComponent(options.college), // 院系
      admissionYear: decodeURIComponent(options.admissionYear), // 入学年份
    })
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

  uploadImage: function () {
    var that = this; // 保存当前上下文的this值
    // 打开相册或相机选择图片
    wx.chooseMedia({
      count: 1, // 默认为9，设置为1表示只选择一张图片
      mediaType: ['image'],
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表
        console.log(res.tempFiles)
        var tempFilePath = res.tempFiles[0].tempFilePath;
        // 选取完成后，上传到服务器
        wx.showLoading({
          title: '上传头像，请稍后',
          mask: true,
        })
        wx.uploadFile({
          url: URL + '/upload', // 你的上传图片的服务器API地址
          filePath: tempFilePath,
          name: 'file', // 必须填写，因为后台需要根据name键来获取文件内容
          success: function (uploadRes) {
            console.log('profile player register: uploadImage ->')
            console.log(uploadRes)
            if (uploadRes.statusCode != 200) {
              console.error("请求失败，状态码为：" + uploadRes.statusCode + "; 错误信息为：" + uploadRes.data)
              wx.showToast({
                title: '上传头像失败，请检查网络！', // 错误信息文本
                icon: 'error', // 'none' 表示不显示图标，其他值如'success'、'loading'
                duration: 2000 // 持续时间
              });
              return
            }

            wx.hideLoading()
            wx.showToast({
              title: '上传成功',
              icon: 'success',
            });
          },
          fail: function (error) {
            console.log('上传失败', error);
            wx.hideLoading()
            wx.showToast({
              title: '上传头像失败，请检查网络！', // 错误信息文本
              icon: 'error', // 'none' 表示不显示图标，其他值如'success'、'loading'
              duration: 2000 // 持续时间
            });
          }
        })
      }
    })
  },

  showNameInput: function () {
    this.setData({
      modalHiddenEname: false
    });
  },

  confirmChangeName: function () {
    // 这里可以添加逻辑，如检查输入是否合法等
    this.setData({
      name: this.data.newname,
      modalHiddenEname: true
    });
  },

  cancelChangeName: function () {
    this.setData({
      modalHiddenEname: true
    });
  },

  changename: function (e) {
    this.setData({
      newname: e.detail.value
    });
  },

  showIdInput: function () {
    this.setData({
      modalHiddenId: false
    });
  },

  confirmChangeId: function () {
    // 这里可以添加逻辑，如检查输入是否合法等
    this.setData({
      identity: this.data.newid,
      modalHiddenId: true
    });
  },

  cancelChangeId: function () {
    this.setData({
      modalHiddenId: true
    });
  },

  changeid: function (e) {
    this.setData({
      newid: e.detail.value
    });
  },

  showHeightInput: function () {
    this.setData({
      modalHiddenHeight: false
    });
  },

  confirmChangeHeight: function () {
    // 这里可以添加逻辑，如检查输入是否合法等
    this.setData({
      height: this.data.newheight,
      modalHiddenHeight: true
    });
  },

  cancelChangeHeight: function () {
    this.setData({
      modalHiddenHeight: true
    });
  },

  changeheight: function (e) {
    this.setData({
      newheight: e.detail.value
    });
  },

  showWeightInput: function () {
    this.setData({
      modalHiddenWeight: false
    });
  },

  confirmChangeWeight: function () {
    // 这里可以添加逻辑，如检查输入是否合法等
    this.setData({
      weight: this.data.newweight,
      modalHiddenWeight: true
    });
  },

  cancelChangeWeight: function () {
    this.setData({
      modalHiddenWeight: true
    });
  },

  changeweight: function (e) {
    this.setData({
      newweight: e.detail.value
    });
  },

  showPositionInput: function () {
    this.setData({
      modalHiddenPosition: false
    });
  },

  confirmChangePosition: function () {
    // 这里可以添加逻辑，如检查输入是否合法等
    this.setData({
      position: this.data.newposition,
      modalHiddenPosition: true
    });
  },

  cancelChangePosition: function () {
    this.setData({
      modalHiddenPosition: true
    });
  },

  changeposition: function (e) {
    this.setData({
      newposition: e.detail.value
    });
  },

  // 处理书院选择
  bindShuYuanChange: function (e) {
    this.setData({
      shuYuan: this.data.shuYuanOptions[e.detail.value]
    });
  },

  showCollegeInput: function () {
    this.setData({
      modalHiddenCollege: false
    });
  },

  confirmChangeCollege: function () {
    // 这里可以添加逻辑，如检查输入是否合法等
    this.setData({
      college: this.data.newcollege,
      modalHiddenCollege: true
    });
  },

  cancelChangeCollege: function () {
    this.setData({
      modalHiddenCollege: true
    });
  },

  changecollege: function (e) {
    this.setData({
      newcollege: e.detail.value
    });
  },

  // 处理生日选择
  bindDateChange: function (e) {
    let birthDate = new Date(e.detail.value)
    var year = birthDate.getFullYear();
    var month = birthDate.getMonth() + 1; // 月份是从0开始的，所以要加1
    var day = birthDate.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    let strBirthDate = year + '-' + month + '-' + day
    this.setData({
      birthDate: birthDate,
      strBirthDate: strBirthDate,
    });
  },

  bindAdmissionYearChange: function (e) {
    this.setData({
      admissionYear: e.detail.value
    });
  },

  submit: function (player) {
    let that = this
    console.log('profile player edit: submit ->')
    console.log(this.data);
    if (this.validateData()) {
      // 如果验证通过，进行数据上传或其他处理
      console.log('验证通过，开始上传');
      wx.showLoading({
        title: '正在注册',
      })
      wx.request({
        url: URL + '/player/update',
        method: 'PUT',
        data: {
          playerId: this.data.playerId,
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
            console.error('更新球员失败' + res.statusCode + ' ' + res.data)
            return
          }
          console.log('更新球员成功')
          wx.navigateBack()
        },
        fail(err) {
          console.error('更新球员失败：', err.statusCode, err.errMsg);
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
})