// pages/management/team_events/team_events.js
const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({
  data: {
    teamList: [], // 用户管理的所有球队
    selectedTeamIndex: 0, // 当前选中的球队索引
    selectedTeam: null, // 当前选中的球队
    eventList: [], // 当前球队参与的赛事列表
    isLoading: false,
  },

  onLoad: function(options) {
    this.fetchTeamList();
  },

  onShow: function() {
    // 刷新赛事列表的大名单状态
    if (this.data.selectedTeam) {
      this.fetchTeamEvents(this.data.selectedTeam.teamId);
    }
  },

  onPullDownRefresh: function() {
    if (this.data.selectedTeam) {
      this.fetchTeamEvents(this.data.selectedTeam.teamId);
    }
    wx.stopPullDownRefresh();
  },

  // 获取用户管理的所有球队
  fetchTeamList: function() {
    var that = this;
    var userId = appInstance.globalData.userId;
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: URL + '/user/getUserManageTeam?userId=' + userId,
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200 && res.data && res.data.length > 0) {
          that.setData({
            teamList: res.data,
            selectedTeam: res.data[0],
            selectedTeamIndex: 0
          });
          that.fetchTeamEvents(res.data[0].teamId);
        } else {
          that.setData({
            teamList: [],
            eventList: [],
            isLoading: false
          });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        console.error('获取球队列表失败', err);
        that.setData({
          isLoading: false
        });
        wx.showToast({
          title: '获取数据失败',
          icon: 'error'
        });
      }
    });
  },

  // 获取球队参与的赛事
  fetchTeamEvents: function(teamId) {
    var that = this;
    that.setData({ isLoading: true });
    wx.request({
      url: URL + '/team/event/getAll?teamId=' + teamId,
      method: 'GET',
      success: function(res) {
        if (res.statusCode === 200) {
          var events = res.data || [];
          // 先获取每个赛事的详细信息（包括rosterDeadline）
          that.fetchEventDetails(events, teamId);
        } else {
          that.setData({
            eventList: [],
            isLoading: false
          });
        }
      },
      fail: function(err) {
        console.error('获取赛事列表失败', err);
        that.setData({
          eventList: [],
          isLoading: false
        });
      }
    });
  },

  // 获取每个赛事的详细信息
  fetchEventDetails: function(events, teamId) {
    var that = this;
    if (events.length === 0) {
      that.setData({
        eventList: [],
        isLoading: false
      });
      return;
    }

    var completedCount = 0;
    var detailedEvents = [];

    for (var i = 0; i < events.length; i++) {
      (function(index) {
        var event = events[index];
        wx.request({
          url: URL + '/event/get?id=' + event.eventId,
          method: 'GET',
          success: function(res) {
            if (res.statusCode === 200 && res.data) {
              detailedEvents[index] = res.data;
            } else {
              detailedEvents[index] = event;
            }
          },
          fail: function() {
            detailedEvents[index] = event;
          },
          complete: function() {
            completedCount++;
            if (completedCount === events.length) {
              // 所有赛事详情获取完成，检查大名单状态
              that.checkRosterStatus(detailedEvents, teamId);
            }
          }
        });
      })(i);
    }
  },

  // 检查每个赛事的大名单状态
  checkRosterStatus: function(events, teamId) {
    var that = this;
    if (events.length === 0) {
      that.setData({
        eventList: [],
        isLoading: false
      });
      return;
    }

    var completedCount = 0;
    var updatedEvents = [];
    var now = new Date();
    
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      var deadlineStr = '';
      var isExpired = false;
      
      if (event.rosterDeadline) {
        var deadline = new Date(event.rosterDeadline);
        deadlineStr = deadline.getFullYear() + '-' + 
                     String(deadline.getMonth() + 1).padStart(2, '0') + '-' + 
                     String(deadline.getDate()).padStart(2, '0') + ' ' +
                     String(deadline.getHours()).padStart(2, '0') + ':' +
                     String(deadline.getMinutes()).padStart(2, '0');
        isExpired = now > deadline;
      }
      
      updatedEvents.push({
        eventId: event.eventId,
        name: event.name,
        description: event.description,
        matchPlayerCount: event.matchPlayerCount,
        rosterSize: event.rosterSize,
        rosterDeadline: event.rosterDeadline,
        deadlineStr: deadlineStr,
        isExpired: isExpired,
        hasRoster: false,
        rosterCount: 0
      });
    }

    for (var j = 0; j < events.length; j++) {
      (function(index) {
        var event = events[index];
        // 检查是否已设置大名单
        wx.request({
          url: URL + '/event/roster/hasSet?eventId=' + event.eventId + '&teamId=' + teamId,
          method: 'GET',
          success: function(res) {
            if (res.statusCode === 200) {
              updatedEvents[index].hasRoster = res.data === true;
            }
          },
          complete: function() {
            // 获取大名单人数
            wx.request({
              url: URL + '/event/roster/get?eventId=' + event.eventId + '&teamId=' + teamId,
              method: 'GET',
              success: function(res2) {
                if (res2.statusCode === 200 && res2.data) {
                  updatedEvents[index].rosterCount = res2.data.length;
                }
              },
              complete: function() {
                completedCount++;
                if (completedCount === events.length) {
                  that.setData({
                    eventList: updatedEvents,
                    isLoading: false
                  });
                }
              }
            });
          }
        });
      })(j);
    }
  },

  // 切换球队
  onTeamChange: function(e) {
    var index = e.detail.value;
    var team = this.data.teamList[index];
    this.setData({
      selectedTeamIndex: index,
      selectedTeam: team
    });
    this.fetchTeamEvents(team.teamId);
  },

  // 点击赛事，进入大名单设置页面
  gotoRosterPage: function(e) {
    var event = e.currentTarget.dataset.event;
    var team = this.data.selectedTeam;
    
    wx.navigateTo({
      url: '/pages/management/event_roster/event_roster?eventId=' + event.eventId + '&teamId=' + team.teamId + '&eventName=' + encodeURIComponent(event.name) + '&teamName=' + encodeURIComponent(team.name) + '&rosterSize=' + (event.rosterSize || 23) + '&matchPlayerCount=' + (event.matchPlayerCount || 11) + '&isExpired=' + (event.isExpired ? '1' : '0')
    });
  }
})
