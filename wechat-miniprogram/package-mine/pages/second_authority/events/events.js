const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorityId: 0,
    events: [],
  },

  onLoad(options) {
    this.setData({
      authorityId: options.authorityId,
    })
  },

  onShow() {
    this.fetchData()
  },

  onPullDownRefresh() {
    this.fetchData()
    wx.stopPullDownRefresh()
  },

  fetchData: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: `${URL}/event/getBySecondAuthority?authorityId=${this.data.authorityId}`,
      success(res) {
        console.log("events page: fetchData->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)

        that.setData({
          events: res.data,
        });
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });
  },

  gotoEventEditPage: function(e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/event_edit/event_edit?id=' + dataset.id,
    })
  },

  gotoEventNewPage() {
    wx.navigateTo({
      url: '/pages/management/event_new/event_new?authorityLevel=2&authorityId=' + this.data.authorityId,
    })
  },

})

