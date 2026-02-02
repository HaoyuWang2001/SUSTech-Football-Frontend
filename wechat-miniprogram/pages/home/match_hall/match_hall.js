// pages/home/event_hall/event_hall.js
const app = getApp()
const URL = app.globalData.URL
const {
  formatTime
} = require("../../../utils/timeFormatter")
const {
  filter
} = require("../../../utils/searchFilter")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventList: [],
    searchText: '',
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
    app.addToRequestQueue(this.fetchData)
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
    app.addToRequestQueue(this.fetchData)
    wx.stopPullDownRefresh()
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

  fetchData(id) {
    this.setData({
      matchList: [],
    })
    let that = this
    wx.request({
      url: URL + '/match/getAll',
      success(res) {
        console.log("search page: fetch match ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let matchList = res.data ?? []
        let filterMatchList = []
        for (let match of matchList) {
          let patterns = [(match.homeTeam ? match.homeTeam.name : ''), (match.awayTeam ? match.awayTeam.name : ''), (match.matchEvent ? match.matchEvent.eventName : '')]
          if (filter(that.data.searchText,  patterns)) {
            let date = new Date(match.time)
            match.strTime = formatTime(date)
            match.hasBegun = match.status == 'PENDING' ? false : true
            filterMatchList.push(match)
          }
        }
        that.setData({
          matchList: filterMatchList,
        })
      },
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  bindInput: function (e) {
    this.setData({
      searchText: e.detail.value,
    });
  },

  search: function () {
    console.log('搜索内容:', this.data.searchText);
    app.addToRequestQueue(this.fetchData)
  },

  showAll: function () {
    this.setData({
      searchText: '',
    });
    app.addToRequestQueue(this.fetchData)
  },

  gotoMatchPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + dataset.id,
    })
  },

})