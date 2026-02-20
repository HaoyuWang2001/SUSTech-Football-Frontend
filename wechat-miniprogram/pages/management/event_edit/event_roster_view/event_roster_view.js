// pages/management/event_edit/event_roster_view/event_roster_view.js
var appInstance = getApp()
var URL = appInstance.globalData.URL

Page({
  data: {
    eventId: 0,
    teamId: 0,
    teamName: '',
    teamLogo: '',
    rosterList: [], // 大名单球员列表
    isLoading: true,
    hasRoster: false
  },

  onLoad: function(options) {
    this.setData({
      eventId: parseInt(options.eventId),
      teamId: parseInt(options.teamId),
      teamName: decodeURIComponent(options.teamName || ''),
      teamLogo: decodeURIComponent(options.teamLogo || '')
    });

    this.fetchRoster();
  },

  onPullDownRefresh: function() {
    this.fetchRoster();
    wx.stopPullDownRefresh();
  },

  // 获取大名单
  fetchRoster: function() {
    var that = this;
    that.setData({ isLoading: true });

    wx.request({
      url: URL + '/event/roster/get?eventId=' + that.data.eventId + '&teamId=' + that.data.teamId,
      method: 'GET',
      success: function(res) {
        if (res.statusCode === 200 && res.data) {
          that.setData({
            rosterList: res.data,
            hasRoster: res.data.length > 0,
            isLoading: false
          });
        } else {
          that.setData({
            rosterList: [],
            hasRoster: false,
            isLoading: false
          });
        }
      },
      fail: function(err) {
        console.error('获取大名单失败', err);
        that.setData({
          rosterList: [],
          hasRoster: false,
          isLoading: false
        });
        wx.showToast({
          title: '获取数据失败',
          icon: 'error'
        });
      }
    });
  },

  // 点击球员查看详情
  gotoPlayerPage: function(e) {
    var playerId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/pub/user/player/player?id=' + playerId
    });
  }
})
