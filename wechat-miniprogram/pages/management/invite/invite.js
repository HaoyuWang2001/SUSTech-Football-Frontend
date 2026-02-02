// pages/management/invite/invite.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const {
  filter
} = require("../../../utils/searchFilter")
const { showModal } = require("../../../utils/modal")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    matchId: 0,
    eventId: 0,
    homeTeamId: 0,
    awayTeamId: 0,
    type: '',
    blockTitle: '', // block-title 的文本内容
    blockMore: '', // block-more 的文本内容
    allList: [],
    searchText: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      type: options.type,
    })
    if (this.data.type === 'event_match_referee') {
      this.setData({
        matchId: parseInt(options.matchId),
        eventId: parseInt(options.eventId),
      })
    } else {
      this.setData({
        id: parseInt(options.id),
      })
    }
    switch (this.data.type) {
      case 'player':
        this.setData({
          blockTitle: '球员列表',
          blockMore: '搜索球员',
        });
        break;
      case 'coach':
        this.setData({
          blockTitle: '教练列表',
          blockMore: '点击邀请教练',
        });
        break;
      case 'referee':
        this.setData({
          blockTitle: '裁判列表',
          blockMore: '点击邀请裁判',
        });
        break;
      case 'event_referee':
        this.setData({
          blockTitle: '裁判列表',
          blockMore: '点击邀请裁判',
        });
        break;
      case 'event_match_referee':
        this.setData({
          blockTitle: '裁判列表',
          blockMore: '点击设置裁判',
        });
        break;
      case 'team':
        this.setData({
          blockTitle: '球队列表',
          blockMore: '点击邀请球队',
        });
        break;
      case 'hometeam-match':
        this.setData({
          blockTitle: '管理的球队',
          blockMore: '点击设置主队',
        });
        break;
      case 'awayteam-match':
        this.setData({
          blockTitle: '球队列表',
          blockMore: '点击邀请客队',
        });
        break;
      case 'hometeam-event-match':
        this.setData({
          blockTitle: '参赛球队列表',
          blockMore: '点击设置主队',
        });
        break;
      case 'awayteam-event-match':
        this.setData({
          blockTitle: '参赛球队列表',
          blockMore: '点击设置客队',
        });
        break;
      case 'captain':
        this.setData({
          blockTitle: '队员列表',
          blockMore: '点击选择队长',
        });
        break;
      default:
    }
    this.fetchData();
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
    this.fetchData();
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
    this.fetchData();
    wx.stopPullDownRefresh();
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

  // 获取基本数据
  fetchData: function () {
    const that = this
    let url = '';
    switch (this.data.type) {
      case 'player':
        url = URL + '/player/getAll';
        break;
      case 'coach':
        url = URL + '/coach/getAll';
        break;
      case 'referee':
        url = URL + '/referee/getAll';
        break;
      case 'event_referee':
        url = URL + '/referee/getAll';
        break;
      case 'event_match_referee':
        url = URL + '/event/referee/getAll?eventId=' + that.data.eventId;
        break;
      case 'team':
        url = URL + '/team/getAll';
        break;
      case 'hometeam-match':
        url = URL + '/user/getUserManageTeam?userId=' + userId;
        break;
      case 'awayteam-match':
        url = URL + '/team/getAll';
        break;
      case 'hometeam-event-match':
        url = URL + '/event/team/getAll?eventId=' + that.data.id;
        break;
      case 'awayteam-event-match':
        url = URL + '/event/team/getAll?eventId=' + that.data.id;
        break;
      case 'captain':
        url = URL + "/team/player/getAll?teamId=" + that.data.id;
        break;
      default:
        url = URL;
    }
    if (this.data.type !== 'player') {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      wx.request({
        url: url,
        success(res) {
          console.log(that.data.type + '->')
          console.log(res.data)
          if (res.statusCode !== 200) {
            console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
            return
          }
          that.setData({
            allList: res.data,
          })
        },
        fail(err) {
          console.log("请求失败，错误码为：" + err.statusCode + "；错误信息为：" + err.message)
        },
        complete() {
          wx.hideLoading();
        }
      })
    }
  },

  fetchSearchPlayer() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({
      allList: [],
    })
    if (this.data.searchText === '') {
      wx.hideLoading();
      wx.showToast({
        title: '输入为空，请重试',
        icon: 'error',
      });
    } else {
      let that = this
      wx.request({
        url: URL + '/player/getAll',
        success(res) {
          console.log("invite page: fetch verified player ->")
          if (res.statusCode != 200) {
            console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
            return
          }
          console.log(res.data)
          let allList = res.data ?? []
          let filterAllList = []
          for (let player of allList) {
            let patterns = [(player.name ? player.name : '')]
            if (filter(that.data.searchText, patterns)) {
              filterAllList.push(player)
            }
          }
          that.setData({
            allList: filterAllList,
          })
        },
        fail: function (err) {
          console.error('请求失败：', err.statusCode, err.errMsg);
        },
        complete() {
          wx.hideLoading();
          if (that.data.allList.length == 0) {
            wx.showToast({
              title: '未找到该球员,请重新输入',
              icon: 'error',
            });
          }
        }
      })
    }
  },

  bindInput: function (e) {
    this.setData({
      searchText: e.detail.value,
    });
  },

  search: function () {
    console.log('搜索内容:', this.data.searchText);
    appInstance.addToRequestQueue(this.fetchSearchPlayer)
  },

  selectHomeTeam(e) {
    const homeTeamId = e.target.dataset.id;
    this.setData({
      homeTeamId: homeTeamId,
    })
    console.log('选择主队' + this.data.homeTeamId);
    this.homeTeamBack();
  },

  selectAwayTeam(e) {
    const awayTeamId = e.target.dataset.id;
    this.setData({
      awayTeamId: awayTeamId,
    })
    console.log('选择客队' + this.data.awayTeamId);
    this.awayTeamBack();
  },

  homeTeamBack() {
    console.log('Back->');
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      tempHomeTeamId: this.data.homeTeamId,
    })
    wx.navigateBack()
  },

  awayTeamBack() {
    console.log('Back->');
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      tempAwayTeamId: this.data.awayTeamId,
    })
    wx.navigateBack()
  },

  showConfirmInviteModal(e) {
    var that = this
    const id = e.currentTarget.dataset.id
    let content = ''
    switch (this.data.type) {
      case 'player':
        content = '确定要邀请该球员吗？';
        break;
      case 'coach':
        content = '确定要邀请该教练吗？';
        break;
      case 'referee':
        content = '确定要邀请该裁判吗？';
        break;
      case 'event_referee':
        content = '确定要邀请该裁判吗？';
        break;
      case 'event_match_referee':
        content = '确定要设置该裁判吗？';
        break;
      case 'team':
        content = '确定要邀请该球队吗？';
        break;
      default:
        ;
    }
    showModal({
      title: '确认邀请',
      content: content,
      onConfirm: () => {
        this.invite(id);
      },
    });
  },

  showConfirmSelectModal(e) {
    const id = e.currentTarget.dataset.id
    showModal({
      title: '确认邀请',
      content: '确定要选择该球员做队长吗？',
      onConfirm: () => {
        this.selectCaptain(id);
      },
    })
  },

  invite(id) {
    let url = '';
    switch (this.data.type) {
      case 'player':
        url = URL + '/team/player/invite?teamId=' + this.data.id + "&playerId=" + id;
        break;
      case 'coach':
        url = URL + '/team/coach/invite?teamId=' + this.data.id + "&coachId=" + id;
        break;
      case 'referee':
        url = URL + '/match/referee/invite?matchId=' + this.data.id + "&refereeId=" + id;
        break;
      case 'event_referee':
        url = URL + '/event/referee/invite?eventId=' + this.data.id + "&refereeId=" + id;
        break;
      case 'event_match_referee':
        url = `${URL}/event/match/setReferee?eventId=${this.data.eventId}&matchId=${this.data.matchId}&refereeId=${id}`;
        break;
      case 'team':
        url = URL + '/event/team/invite?eventId=' + this.data.id + '&teamId=' + id;
        break;
      default:
        url = URL;
    }
    wx.request({
      url: url,
      method: 'POST',
      success: res => {
        console.log('已邀请 type=', this.data.type, res.data);
        const successMsg = res.data ? res.data : '邀请成功';
        wx.showToast({
          title: successMsg,
          icon: 'success',
        });
      },
      fail: err => {
        console.error('邀请失败', err);
        wx.showToast({
          title: '请求失败，请重试',
          icon: 'error',
        });
      }
    });
  },

  selectCaptain(id) {
    const that = this;
    this.setData({
      captainId: id,
    })
    wx.request({
      url: URL + '/team/captain/updateByPlayerId?teamId=' + that.data.id + '&captainId=' + id,
      method: 'POST',
      success: res => {
        console.log("manager invite page: selectCaptain ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log('成功设置队长', res.data);
        wx.navigateBack({
          success: () => {
            setTimeout(() => {
              wx.showToast({
                title: '设置成功',
                icon: 'success',
              })
            }, 500)
          }
        })
      },
      fail: err => {
        console.error('设置失败', err);
        wx.showToast({
          title: '设置失败，请重试',
          icon: 'error',
        });
      },
    });
  },
})