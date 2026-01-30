// pages/management/event_roster/event_roster.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId

Page({
  data: {
    eventId: 0,
    teamId: 0,
    eventName: '',
    teamName: '',
    rosterSize: 0,
    matchPlayerCount: 0,
    allPlayers: [], // 球队所有球员
    selectedPlayers: [], // 已选择的球员
    isLoading: false,
  },

  onLoad: function(options) {
    this.setData({
      eventId: parseInt(options.eventId),
      teamId: parseInt(options.teamId),
      eventName: decodeURIComponent(options.eventName || ''),
      teamName: decodeURIComponent(options.teamName || ''),
      rosterSize: parseInt(options.rosterSize) || 23,
      matchPlayerCount: parseInt(options.matchPlayerCount) || 11,
    });

    this.fetchTeamPlayers();
  },

  // 获取球队所有球员
  fetchTeamPlayers: function() {
    var that = this;
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: URL + '/team/player/getAll?teamId=' + that.data.teamId,
      method: 'GET',
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var players = res.data || [];
          var allPlayers = [];
          for (var i = 0; i < players.length; i++) {
            var player = players[i];
            player.selected = false;
            allPlayers.push(player);
          }
          that.setData({
            allPlayers: allPlayers
          });
          // 获取球员数据后再检查已有大名单
          that.checkExistingRoster();
        } else {
          wx.showToast({
            title: '获取球员失败',
            icon: 'error'
          });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        console.error('获取球员失败', err);
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        });
      }
    });
  },

  // 检查是否已有大名单
  checkExistingRoster: function() {
    var that = this;
    wx.request({
      url: URL + '/event/roster/get?eventId=' + that.data.eventId + '&teamId=' + that.data.teamId,
      method: 'GET',
      success: function(res) {
        if (res.statusCode === 200 && res.data && res.data.length > 0) {
          var existingPlayerIds = [];
          for (var i = 0; i < res.data.length; i++) {
            existingPlayerIds.push(res.data[i].playerId);
          }
          
          var allPlayers = that.data.allPlayers;
          var selectedPlayers = [];
          for (var j = 0; j < allPlayers.length; j++) {
            if (existingPlayerIds.indexOf(allPlayers[j].playerId) !== -1) {
              allPlayers[j].selected = true;
              selectedPlayers.push(allPlayers[j]);
            }
          }
          that.setData({
            allPlayers: allPlayers,
            selectedPlayers: selectedPlayers
          });
        }
      },
      fail: function(err) {
        console.error('获取已有大名单失败', err);
      }
    });
  },

  // 切换球员选择状态
  togglePlayer: function(e) {
    var that = this;
    var playerId = e.currentTarget.dataset.playerid;
    var allPlayers = that.data.allPlayers;
    var selectedPlayers = that.data.selectedPlayers;

    var playerIndex = -1;
    for (var i = 0; i < allPlayers.length; i++) {
      if (allPlayers[i].playerId === playerId) {
        playerIndex = i;
        break;
      }
    }
    if (playerIndex === -1) return;

    var player = allPlayers[playerIndex];
    var isCurrentlySelected = player.selected;

    // 检查是否超过人数限制
    if (!isCurrentlySelected && selectedPlayers.length >= that.data.rosterSize) {
      wx.showToast({
        title: '最多选择' + that.data.rosterSize + '人',
        icon: 'none'
      });
      return;
    }

    // 更新选择状态
    allPlayers[playerIndex].selected = !isCurrentlySelected;

    // 更新已选择列表
    var newSelectedPlayers = [];
    if (isCurrentlySelected) {
      for (var j = 0; j < selectedPlayers.length; j++) {
        if (selectedPlayers[j].playerId !== playerId) {
          newSelectedPlayers.push(selectedPlayers[j]);
        }
      }
    } else {
      newSelectedPlayers = selectedPlayers.slice();
      newSelectedPlayers.push(player);
    }

    that.setData({
      allPlayers: allPlayers,
      selectedPlayers: newSelectedPlayers
    });
  },

  // 提交大名单
  submitRoster: function() {
    var that = this;
    var selectedCount = that.data.selectedPlayers.length;

    if (selectedCount === 0) {
      wx.showToast({
        title: '请至少选择一名球员',
        icon: 'none'
      });
      return;
    }

    if (selectedCount < that.data.matchPlayerCount) {
      wx.showToast({
        title: '至少需要选择' + that.data.matchPlayerCount + '人',
        icon: 'none'
      });
      return;
    }

    if (selectedCount > that.data.rosterSize) {
      wx.showToast({
        title: '最多选择' + that.data.rosterSize + '人',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认提交',
      content: '确定提交包含' + selectedCount + '名球员的大名单吗？',
      success: function(res) {
        if (res.confirm) {
          that.doSubmitRoster();
        }
      }
    });
  },

  // 执行提交
  doSubmitRoster: function() {
    var that = this;
    var playerIds = [];
    for (var i = 0; i < that.data.selectedPlayers.length; i++) {
      playerIds.push(that.data.selectedPlayers[i].playerId);
    }

    wx.showLoading({ title: '提交中...' });

    wx.request({
      url: URL + '/event/roster/set?eventId=' + that.data.eventId + '&teamId=' + that.data.teamId,
      method: 'POST',
      data: playerIds,
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          });
          setTimeout(function() {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: res.data || '提交失败',
            icon: 'error'
          });
        }
      },
      fail: function(err) {
        wx.hideLoading();
        console.error('提交大名单失败', err);
        wx.showToast({
          title: '网络错误',
          icon: 'error'
        });
      }
    });
  }
})
