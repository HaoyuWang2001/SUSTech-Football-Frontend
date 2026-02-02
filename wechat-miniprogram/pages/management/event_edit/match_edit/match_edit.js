// pages/management/event_edit/match_edit/match_edit.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const {
  formatTime,
  splitDateTime
} = require("../../../../utils/timeFormatter")
const { showModal } = require("../../../../utils/modal")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventId: 0,
    hasBegun: false,
    strTimeInfo: '',
    strDate: '',
    strTime: '',
    name: '',
    stage: '',
    tag: '',
    stageList: [],
    stageNameList: [],
    tagNameList: [],
    matchId: 0,
    time: '',
    homeTeam: [],
    awayTeam: [],
    homeTeamId: 0,
    awayTeamId: 0,
    homeTeamScore: 0,
    awayTeamScore: 0,
    homeTeamPenalty: 0,
    awayTeamPenalty: 0,
    matchPlayerActionList: [],
    refereeList: [{
      refereeId: 0,
      name: "",
      photoUrl: "",
      bio: "",
      userId: 0,
      matchList: []
    }],
    matchEvent: {
      eventId: 0,
      matchStage: "",
      matchTag: "",
      eventName: ""
    },
    status: '',
    strStatus: '暂无',
    modalHidden: true,
    array: [
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    ],
    strStatusArray: ["未开始", "正在进行", "已结束"],
    statusArray: ["PENDING", "ONGOING", "FINISHED"]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      matchId: options.id,
    })
    this.fetchData(this.data.matchId);
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
    this.fetchData(this.data.matchId);
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
    this.fetchData(this.data.matchId);
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

  fetchData: function (id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: URL + '/match/get?id=' + that.data.matchId,
      success(res) {
        console.log("match->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        var date = new Date(res.data.time)
        let strTimeInfo = formatTime(date)
        let hasBegun = res.data.status != "PENDING"
        let strStatus = ""
        if (res.data.status == "PENDING") {
          strStatus = "未开始"
        } else if (res.data.status == "ONGOING") {
          strStatus = "正在进行"
        } else if (res.data.status == "FINISHED") {
          strStatus = "已结束"
        } else {
          strStatus = "未定义"
        }
        let {
          strDate,
          strTime
        } = splitDateTime(strTimeInfo)
        that.setData({
          hasBegun: hasBegun,
          strTimeInfo: strTimeInfo,
          strDate: strDate,
          strTime: strTime,
          matchId: res.data.matchId,
          time: res.data.time,
          homeTeamId: res.data.homeTeam.teamId,
          awayTeamId: res.data.awayTeam.teamId,
          homeTeamScore: res.data.homeTeam.score,
          awayTeamScore: res.data.awayTeam.score,
          homeTeamPenalty: res.data.homeTeam.penalty,
          awayTeamPenalty: res.data.awayTeam.penalty,
          homeTeam: res.data.homeTeam,
          awayTeam: res.data.awayTeam,
          refereeList: res.data.refereeList,
          matchPlayerActionList: res.data.matchPlayerActionList,
          stage: res.data.matchEvent.stage,
          tag: res.data.matchEvent.tag,
          matchEvent: res.data.matchEvent,
          eventId: res.data.matchEvent.eventId,
          status: res.data.status,
          strStatus: strStatus
        });
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
        that.load(that.data.eventId);
      }
    });
  },

  load: function (eventId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var that = this;
    wx.request({
      url: URL + '/event/get?id=' + eventId,
      success(res) {
        console.log("event->")
        console.log(res.data)
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        // 将 stageList 中的每个 stageName 提取出来存储到 stageNameList 中
        const stageNameList = res.data.stageList.map(stage => stage.stageName);
        console.log("stageNameList->");
        console.log(stageNameList);
        const selectedStage = res.data.stageList.find(stage => stage.stageName === that.data.stage);
        const tagNameList = selectedStage.tags.map(tag => tag.tagName);
        that.setData({
          stageList: res.data.stageList,
          stageNameList: stageNameList,
          tagNameList: tagNameList,
        });
        console.log('stageList->');
        console.log(that.data.stageList);
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {
        wx.hideLoading();
      }
    });
  },

  bindDateChange: function (e) {
    this.setData({
      strDate: e.detail.value
    });
  },

  bindTimeChange: function (e) {
    this.setData({
      strTime: e.detail.value
    });
  },

  bindStageChange: function (e) {
    // 更新页面上的比赛阶段显示
    const selectedStage = this.data.stageList.find(stage => stage.stageName === this.data.stageNameList[e.detail.value]);
    const tagNameList = selectedStage.tags.map(tag => tag.tagName);
    const matchEvent = this.data.matchEvent
    matchEvent.matchStage = this.data.stageNameList[e.detail.value],
      this.setData({
        stage: this.data.stageNameList[e.detail.value],
        tag: "",
        tagNameList: tagNameList,
        matchEvent: matchEvent
      });
  },

  bindTagChange: function (e) {
    // 更新页面上的比赛组别显示
    const matchEvent = this.data.matchEvent
    matchEvent.matchTag = this.data.tagNameList[e.detail.value],
      this.setData({
        tag: this.data.tagNameList[e.detail.value],
        matchEvent: matchEvent
      });
  },

  bindPickerChangeScore: function (e) {
    const value = e.detail.value;
    // 更新页面上的比分显示
    this.setData({
      homeTeamScore: this.data.array[0][value[0]],
      awayTeamScore: this.data.array[0][value[1]]
    });
  },

  bindPickerChangePenalty: function (e) {
    const value = e.detail.value;
    // 更新页面上的点球比分显示
    this.setData({
      homeTeamPenalty: this.data.array[0][value[0]],
      awayTeamPenalty: this.data.array[0][value[1]]
    });
  },

  bindPickerChangeStatus(e) {
    const value = e.detail.value;
    // 更新页面上的比赛状态显示
    this.setData({
      status: this.data.statusArray[value],
      strStatus: this.data.strStatusArray[value],
    });
  },

  showConfirmModal() {
    showModal({
      title: '确认修改',
      content: '确定要进行修改吗？',
      onConfirm: () => {
        this.confirmEdit();
      }
    })
  },

  showCancelModal() {
    showModal({
      title: '确认取消比赛',
      content: '确定要取消这场比赛吗？',
      confirmText: '确认取消',
      confirmColor: '#FF0000',
      cancelText: '我再想想',
      onConfirm: () => {
        this.deleteMatch();
      }
    })
  },

  confirmEdit() {
    let sqlTimestamp = this.data.strDate + 'T' + this.data.strTime + ":00.000+08:00";

    const dataToUpdate = {
      matchId: this.data.matchId,
      homeTeamId: this.data.homeTeamId,
      awayTeamId: this.data.awayTeamId,
      time: sqlTimestamp,
      status: this.data.status,
      homeTeamScore: this.data.homeTeamScore,
      awayTeamScore: this.data.awayTeamScore,
      homeTeamPenalty: this.data.homeTeamPenalty,
      awayTeamPenalty: this.data.awayTeamPenalty,
    };
    console.log('dataToUpdate->');
    console.log(dataToUpdate);

    wx.showLoading({
      title: '更新中',
      mask: true
    });
    wx.request({
      url: `${URL}/event/match/update?eventId=${this.data.eventId}`,
      method: 'PUT',
      data: dataToUpdate,
      success: res => {
        wx.hideLoading()
        console.log("event_edit match_edit page: confirmEdit ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '修改失败，请重试',
            icon: 'error',
          });
          return
        }
        console.log('赛事比赛信息修改成功', res.data);
        wx.showToast({
          title: '修改成功',
          icon: 'success',
        });
      },
      fail: err => {
        wx.hideLoading()
        console.error('赛事比赛信息修改失败', err);
        wx.showToast({
          title: '修改失败，请重试',
          icon: 'error',
        });
      },
    });
  },

  deleteMatch() {
    var that = this;
    wx.showLoading({
      title: '删除中',
      mask: true,
    })
    wx.request({
      url: URL + '/event/match/delete?eventId=' + that.data.eventId + '&matchId=' + that.data.matchId,
      method: 'DELETE',
      success(res) {
        wx.hideLoading()
        console.log("event_edit=>match_edit page: deleteMatch->")
        if (res.statusCode !== 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败',
            icon: 'error',
          });
          return;
        }
        wx.navigateBack({
          success: () => {
            setTimeout(() => {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
              })
            }, 500)
          }
        })
      },
      fail(err) {
        wx.hideLoading()
        console.error('赛事比赛删除失败', err);
        wx.showToast({
          title: '删除失败',
          icon: 'error',
        });
      },
    });
  },

  gotoInviteReferee: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/management/invite/invite?matchId=' + dataset.matchid + '&eventId=' + dataset.eventid + '&type=' + 'event_match_referee',
    })
  },

  gotoRefereePage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/user/referee/referee?id=' + dataset.id,
    })
  },

})