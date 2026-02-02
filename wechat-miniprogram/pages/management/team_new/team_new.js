// pages/management/team_new/team_new.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const { showModal } = require("../../../utils/modal")

Page({
  data: {
    authorityLevel: 0,
    authorityId: 0,
    teamId: 0,
    logoUrl: '',
    tempFilePath: '',
    teamname: '',
  },

  onLoad(options) {
    this.setData({
      authorityLevel: options.authorityLevel,
      authorityId: options.authorityId,
    })
  },

  // 上传队徽图片
  uploadLogo: function () {
    var that = this;
    // 打开相册或相机选择图片
    wx.chooseMedia({
      count: 1, // 默认为9，设置为1表示只选择一张图片
      mediaType: ['image'],
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表
        console.log(res.tempFiles)
        that.setData({
          tempFilePath: res.tempFiles[0].tempFilePath,
        });
      }
    })
  },

  inputTeamname: function (e) {
    this.setData({
      teamname: e.detail.value
    });
  },

  showCreateModal() {
    showModal({
      title: '确认创建',
      content: '确定要进行创建球队吗？',
      onConfirm: () => {
        this.confirmCreate()
      },
    });
  },

  confirmCreate(){
    var that = this;
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    // 首先上传图片
    wx.uploadFile({
      url: URL + '/upload', // 你的上传图片的服务器API地址
      filePath: that.data.tempFilePath,
      name: 'file', // 必须填写，因为后台需要根据name键来获取文件内容
      success(uploadRes) {
        console.log('team_new page: confirmCreate uploadFile ->')
        if (uploadRes.statusCode != 200) {
          console.error("请求失败，状态码为：" + uploadRes.statusCode + "; 错误信息为：" + uploadRes.data)
          wx.showToast({
            title: '上传队徽失败',
            icon: "error"
          });
          return
        }
        var filename = uploadRes.data;
        that.setData({
          logoUrl: URL + '/download?filename=' + filename
        });
        that.createNewTeam()
      },
      fail (error) {
        wx.hideLoading()
        console.log('上传失败', error);
        wx.showToast({
          title: '上传队徽失败，请检查网络！',
          icon: "error"
        });
      }
    })
  },

  createNewTeam() {
    if (this.data.teamname.length > 15) {
      wx.showToast({
        title: '队名过长',
        icon: 'error',
      })
      return
    }

    let createAuthorityLevel = this.data.authorityLevel
    let createAuthorityId = this.data.authorityId

    wx.showLoading({
      title: '正在创建',
      mask: true
    })
    wx.request({
      url: `${URL}/team/create?ownerId=${userId}&createAuthorityLevel=${createAuthorityLevel}&createAuthorityId=${createAuthorityId}`,
      method: 'POST',
      data: {
        name: this.data.teamname,
        logoUrl: this.data.logoUrl,
      },
      success: res => {
        wx.hideLoading()
        console.log('team_new page: createNewTeam ->')
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: "创建失败",
            icon: "error"
          });
          return
        }
        wx.navigateBack({
          success: () => {
            setTimeout(() => {
              wx.showToast({
                title: "创建成功",
                icon: "success",
              });
            }, 500);
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        console.error(err);
        wx.showToast({
          title: '创建失败，请重试',
          icon: "error",
        });
      },
    });
  },
})