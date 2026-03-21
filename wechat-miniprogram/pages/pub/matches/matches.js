// pages/pub/matches/matches.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const {formatTime} = require("../../../utils/timeFormatter")
const { sortMatchList } = require("../../../utils/matchSorter")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchIdList: [],
    matchList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let matchIdList = [];

    try {
      const idListStr = decodeURIComponent(options.idList || '[]');
      matchIdList = JSON.parse(idListStr);

      // 验证是数组
      if (!Array.isArray(matchIdList)) {
        console.error('matchIdList is not an array:', matchIdList);
        matchIdList = [];
      }
    } catch (error) {
      console.error('Failed to parse matchIdList:', error);
      matchIdList = [];
    }

    this.setData({
      matchIdList: matchIdList,
    })
    this.fetchData(matchIdList);
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

  fetchData: function (matchIdList) {
    // 如果matchIdList为空，直接设置空列表
    if (!matchIdList || matchIdList.length === 0) {
      this.setData({
        matchList: []
      })
      return
    }

    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this
    let queryParams = ""
    for (let id of matchIdList) {
      queryParams += "idList=" + id + "&"
    }
    wx.request({
      url: URL + '/match/getByIdList?' + queryParams,
      success(res) {
        console.log("/match/getByIdList ->")
        console.log(res.data)
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        let matchList = res.data
        for(let match of matchList) {
          const date = new Date(match.time)
          match.strTime = formatTime(date)
          match.hasBegun = match.status !== "PENDING"
        }
        matchList = sortMatchList(matchList)
        that.setData({
          matchList: matchList
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

  gotoMatch: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + id,
    })
  },

})