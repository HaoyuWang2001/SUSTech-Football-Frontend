// pages/home/event_hall/event_hall.js
const app = getApp()
const URL = app.globalData.URL
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
    this.fetchData()
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
      eventList: [],
    })
    let that = this
    wx.request({
      url: URL + '/event/getAll',
      success(res) {
        console.log("search page: fetch event ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let eventList = res.data ?? []
        let filterEventList = []
        for (let event of eventList) {
          let patterns = [event.name, (event.description ? event.description : '')]
          if (filter(that.data.searchText, patterns)) {
            filterEventList.push(event)
          }
        }
        that.setData({
          eventList: filterEventList,
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

  gotoEventPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/event/event?id=' + dataset.id,
    })
  },

})