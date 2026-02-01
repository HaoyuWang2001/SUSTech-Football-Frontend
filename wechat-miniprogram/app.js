// app.js
App({
  globalData: {
    URL: 'https://haoyu-wang141.top:8085',
    SERVER: 'https://haoyu-wang141.top:8085',
    LOCAL: 'https://localhost:8085',
    openid: null,
    session_key: null,
    userId: null,
    nickName: null,
    avatarUrl: null,
    requestQueue: [],
    ANONYMITY: "/assets/newplayer.png",
  },

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    this.userLogin()

    // 获取用户头像url
    this.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
  },

  userLogin() {
    var that = this
    // 登录，获取code
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        if (res.code) {
          // 通过code获取openid和session_key
          that.fetchOpenIdAndSessionKey(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  fetchOpenIdAndSessionKey(code) {
    // 显示加载提示框，提示用户正在加载
    wx.showLoading({
      title: '加载中',
      mask: true // 创建一个蒙层，防止用户操作
    });
    var that = this
    wx.request({
      url: that.globalData.SERVER + '/user/wxLogin?code=' + code,
      method: "POST",
      success(res) {
        console.log(res.data)
        that.globalData.openid = res.data.openid
        that.globalData.session_key = res.data.session_key
        that.fetchUserId(res.data.openid, res.data.session_key)
      },
      complete() {
        // 关闭加载提示框
        wx.hideLoading();
      }
    })
  },

  fetchUserId(openid, session_key) {
    var that = this
    // 通过openid和session_key获取userId
    wx.request({
      url: that.globalData.URL + '/user/login?openid=' + openid + '&session_key=' + session_key,
      method: "POST",
      success(res) {
        console.log(res.data)
        that.globalData.userId = res.data.userId
        // that.globalData.userId = 2
        that.globalData.nickName = res.data.nickName

        that.processRequestQueue()
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  /**
   * @summary 当userId没获取到的时候，请求将加入队列；若已获取到，将立即执行
   * @param {function} task : the func you want to apply with userId
   */
  addToRequestQueue: function (task) {
    if (this.globalData.userId != null) {
      task(this.globalData.userId);
    } else {
      this.globalData.requestQueue.push(task);
    }
  },

  processRequestQueue: function () {
    while (this.globalData.requestQueue.length > 0) {
      const task = this.globalData.requestQueue.shift();
      task(this.globalData.userId);
    }
  },

  onChooseAvatar(avatarUrl, callback) {
    let URL = this.globalData.URL
    wx.uploadFile({
      url: URL + '/upload', // 你的上传图片的服务器API地址
      filePath: avatarUrl,
      name: 'file', // 必须填写，因为后台需要根据name键来获取文件内容
      success: function (uploadRes) {
        wx.hideLoading()
        console.log('uploadImage ->')
        console.log(uploadRes)
        if (uploadRes.statusCode != 200) {
          console.error("请求失败，状态码为：" + uploadRes.statusCode + "; 错误信息为：" + uploadRes.data)
          wx.showToast({
            title: '上传头像失败，请检查网络！', // 错误信息文本
            icon: "error", // 'none' 表示不显示图标，其他值如'success'、'loading'
            duration: 1000 // 持续时间
          });
          return
        }
        let filename = uploadRes.data;
        let url = URL + '/download?filename=' + filename
        callback(url)
        wx.showToast({
          title: '上传成功',
          icon: 'success',
        });
      },
      fail: function (error) {
        wx.hideLoading()
        console.log('上传失败', error);
        wx.showToast({
          title: '上传头像失败，请检查网络！', // 错误信息文本
          icon: "error", // 'none' 表示不显示图标，其他值如'success'、'loading'
          duration: 1000 // 持续时间
        });
      }
    });
  },
})