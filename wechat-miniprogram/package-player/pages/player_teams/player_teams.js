const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({
  data: {
    playerId: 0,
    teamList: [],
  },

  onLoad(options) {
    this.setData({
      playerId: options.playerId,
    })
    this.fetchData()
  },

  onPullDownRefresh() {
    this.fetchData()
    wx.stopPullDownRefresh()
  },

  fetchData() {
    const playerId = this.data.playerId
    const that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.request({
      url: `${URL}/player/team/getAll?playerId=${playerId}`,
      success(res) {
        wx.hideLoading()
        console.log("/pages/profile_player/player_teams: fetchData ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let teamList = res.data ?? []
        that.setData({
          teamList: teamList,
        })
      },
      fail(err) {
        wx.hideLoading()
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  gotoTeam: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/team/team?id=' + id,
    })
  },

  // 弹出确认退出模态框
  showExitModal(e) {
    let teamId = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认退出',
      content: '确定要退出这支球队吗？',
      confirmText: '退出',
      confirmColor: '#FF0000',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          that.exitTeam(teamId)
        }
      }
    });
  },

  exitTeam(teamId) {
    const that = this;
    wx.showLoading({
      title: '退出中',
      mask: true,
    })
    wx.request({
      url: `${URL}/player/team/exit?playerId=${this.data.playerId}&teamId=${teamId}`,
      method: 'POST',
      success(res) {
        wx.hideLoading()
        console.log("/pages/profile_player/player_teams: exitTeam ->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '退出失败',
            icon: "error",
          });
          return
        }
        that.fetchData()
        wx.showToast({
          title: "退出成功",
          icon: "success",
        });
      },
      fail(err) {
        wx.hideLoading()
        console.error('退出球队失败：', err);
        wx.showToast({
          title: '退出失败',
          icon: 'error',
        });
      },
    });
  },
})