// pages/pub/teams/teams.js
const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamIdList: [],
    teamList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let teamIdList = [];

    try {
      const idListStr = decodeURIComponent(options.idList || '[]');
      teamIdList = JSON.parse(idListStr);

      // 验证是数组
      if (!Array.isArray(teamIdList)) {
        console.error('teamIdList is not an array:', teamIdList);
        teamIdList = [];
      }
    } catch (error) {
      console.error('Failed to parse teamIdList:', error);
      teamIdList = [];
    }

    this.setData({
      teamIdList: teamIdList,
    })
    this.fetchData(teamIdList)
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

  ////////////////////////////////////////////////////////////////
  // HTTP 请求

  fetchData: function (teamIdList) {
    // 如果teamIdList为空，直接设置空列表
    if (!teamIdList || teamIdList.length === 0) {
      this.setData({
        teamList: []
      })
      return
    }

    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let queryParams = ""
    for (let id of teamIdList) {
      queryParams += "idList=" + id + "&"
    }
    var that = this
    wx.request({
      url: URL + '/team/getByIdList?' + queryParams,
      success(res) {
        console.log("/team/getByIdList ->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.setData({
          teamList: res.data
        })
      },
      fail(err) {
        console.log('请求失败', err);
        // 可以显示失败的提示信息，或者做一些错误处理
      },
      complete() {
        // 无论请求成功还是失败都会执行
        wx.hideLoading(); // 关闭加载提示框
      }
    });
  },

  /////////////////////////////////////////////////////
  // 跳转

  gotoTeam: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/team/team?id=' + id,
    })
  },
})