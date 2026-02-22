const appInstance = getApp()
const URL = appInstance.globalData.URL

Page({
  data: {
    teamList: [],
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
    var that = this
    wx.request({
      url: URL + '/team/getAll',
      success(res) {
        console.log("sport center: teams page: fetchData ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          teamList: res.data
        })
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });
  },

  gotoEditTeam: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/team_edit/team_edit?id=' + dataset.id,
    })
  },

  createNewTeam() {
    wx.navigateTo({
      url: '/pages/management/team_new/team_new?authorityLevel=1&authorityId=0',
    })
  },

  // 点击取消比赛按钮，弹出确认取消模态框
  showCancelModal(e) {
    this.setData({
      deleteTeamId: e.currentTarget.dataset.id
    })
    var that = this
    wx.showModal({
      title: '确认删除球队',
      content: '确定要删除这支球队吗？',
      confirmText: '确认删除',
      confirmColor: '#FF0000',
      cancelText: '我再想想',
      success(res) {
        if (res.confirm) {
          that.deleteTeam() // 点击确认删除时的回调函数
        } else if (res.cancel) {
          () => {} // 点击我再想想时的回调函数，这里不做任何操作
        }
      }
    });
  },

  deleteTeam() {
    var that = this;
    wx.showLoading({
      title: '删除中',
      mask: true,
    })
    wx.request({
      url: `${URL}/team/delete?teamId=${that.data.deleteTeamId}&userId=0`,
      method: 'DELETE',
      success(res) {
        wx.hideLoading()
        console.log("delete team->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败',
            icon: "error",
          });
          return
        }
        that.fetchData()
        wx.showToast({
          title: "删除成功",
          icon: "success",
        });
      },
      fail(err) {
        wx.hideLoading()
        console.error('球队删除失败', err);
        wx.showToast({
          title: '删除失败',
          icon: 'error',
        });
      },
    });
  },
})