// pages/pub/match/match_referee/match_referee.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const LOCAL = appInstance.globalData.LOCAL
const userId = appInstance.globalData.userId
const {
  formatTime
} = require("../../../../utils/timeFormatter")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchId: Number,
    refereeId: Number,
    match: Object,

    MatchInfoModalIsHidden: true,
    tmpHomeTeamScore: Number,
    tmpAwayTeamScore: Number,
    tmpHomeTeamPenalty: Number,
    tmpAwayTeamPenalty: Number,

    ActionAddModalIsHidden: true,
    tmpTime: Number,
    tmpTeam: Object,
    tmpPlayer: Object,
    tmpAction: String,
    teamOptions: Array,
    playerOptions: Array,
    strActionOptions: ['进球', '助攻', '黄牌', '红牌', '上场', '下场'],
    actionOptions: ['GOAL', 'ASSIST', 'YELLOW_CARD', 'RED_CARD', 'ON', 'OFF'],

    liveList: [],
    videoList: [],

    modalHidden_source: true,
    sourceOptions: ['直播', '回放'],
    source: {
      type: "请选择",
      name: "",
      url: "",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let matchId = Number(options.matchId)
    let refereeId = Number(options.refereeId)
    if (!matchId || matchId == -1 || !refereeId || refereeId == -1) {
      wx.showToast({
        title: '裁判页面错误',
        icon: 'error',
      })
      wx.navigateBack()
    }
    this.setData({
      matchId: matchId,
      refereeId: refereeId,
    })
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
    this.fetchData(this.data.matchId)
    this.fetchLiveList(this.data.matchId)
    this.fetchVideoList(this.data.matchId)
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
    this.fetchData(this.data.matchId)
    this.fetchLiveList(this.data.matchId)
    this.fetchVideoList(this.data.matchId)
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

  // ----------------------------

  // 获取比赛数据
  fetchData(matchId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    const that = this
    wx.request({
      url: URL + "/match/get",
      data: {
        id: matchId,
      },
      success: function (res) {
        console.log("match referee page: fetchData->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)

        let match = res.data
        if (match.status === "PENDING") {
          match.strStatus = "未开始"
        } else if (match.status === "ONGOING") {
          match.strStatus = "进行中"
        } else if (match.status === "FINISHED") {
          match.strStatus = "已完赛"
        } else {
          match.strStatus = "未知状态"
        }
        that.setData({
          match: match,
        })
      },
      fail(err) {
        console.log("请求失败，错误码为：" + err.statusCode + "；错误信息为：" + err.message)
      },
      complete() {
        wx.hideLoading();
      }
    })
  },

  fetchLiveList(matchId) {
    const that = this
    wx.request({
      url: `${URL}/match/live/getAll?matchId=${matchId}`,
      success: function (res) {
        console.log("match referee page: fetchLiveList->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          liveList: res.data
        })
      },
      fail(err) {
        console.log("请求失败，错误码为：" + err.statusCode + "；错误信息为：" + err.message)
      }
    })
  },

  fetchVideoList(matchId) {
    const that = this
    wx.request({
      url: `${URL}/match/video/getAll?matchId=${matchId}`,
      success: function (res) {
        console.log("match referee page: fetchVideoList->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          videoList: res.data
        })
      },
      fail(err) {
        console.log("请求失败，错误码为：" + err.statusCode + "；错误信息为：" + err.message)
      }
    })
  },

  // 跳转至球员列表页面
  gotoMatchRefereeUpdatePlayerListPage(e) {
    let matchId = this.data.matchId
    let refereeId = this.data.refereeId
    let isHomeTeam = e.currentTarget.dataset['ishometeam']
    wx.navigateTo({
      url: '../match_referee_updatePlayerList/match_referee_updatePlayerList?matchId=' + matchId + '&refereeId=' + refereeId + '&isHomeTeam=' + isHomeTeam,
    })
  },

  // ----------------------------
  // 更改比赛状态
  changeMatchStatus(e) {
    let status = e.currentTarget.dataset.status;
    wx.showModal({
      title: '确认更改',
      content: '您确定更改比赛状态吗？该过程不可逆！',
      complete: (res) => {
        if (res.confirm) {
          this.handleMatchStatusSubmit(status)
        }
      }
    })
  },

  // 提交比赛状态更新，进行POST请求
  handleMatchStatusSubmit(status) {
    let that = this
    const matchInfo = {
      matchId: this.data.matchId,
      status: status,
      homeTeamScore: this.data.match.homeTeam.score,
      awayTeamScore: this.data.match.awayTeam.score,
      homeTeamPenalty: this.data.match.homeTeam.penalty,
      awayTeamPenalty: this.data.match.awayTeam.penalty,
    }

    // 日志
    console.log("match referee: handleMatchStatusSubmit->")
    console.log(matchInfo);

    wx.showLoading({
      title: '正在更新',
    })

    wx.request({
      url: URL + '/match/referee/updateResult?refereeId=' + that.data.refereeId,
      method: 'POST',
      data: matchInfo,
      success(res) {
        console.log("match referee: handleMatchStatusSubmit->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("更新成功")
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
      complete() {
        wx.hideLoading()
        // 需重新拉取数据
        that.fetchData(that.data.matchId)
      }
    })
  },

  // ----------------------------
  // Modal 公用的方法

  // 处理input输入框
  handleInput: function (e) {
    const {
      name
    } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({
      [`${name}`]: Number(value)
    });
  },

  // 取消编辑
  handleCancel: function () {
    this.setData({
      MatchInfoModalIsHidden: true,
      ActionAddModalIsHidden: true,
      modalHidden_source: true,
    });
  },

  // ----------------------------
  //与MatchInfoModal相关

  // 显示MatchInfoModal
  showMatchInfoModal: function () {
    this.setData({
      tmpHomeTeamScore: this.data.match.homeTeam.score,
      tmpAwayTeamScore: this.data.match.awayTeam.score,
      tmpHomeTeamPenalty: this.data.match.homeTeam.penalty,
      tmpAwayTeamPenalty: this.data.match.awayTeam.penalty,
      MatchInfoModalIsHidden: false
    });
  },

  // 验证函数
  validateMatchInfo(matchInfo) {
    // 验证matchId是否为数字
    if (typeof matchInfo.matchId !== 'number') {
      throw new Error("matchId 必须是数字");
    }

    // 验证homeTeamScore是否为数字
    if (typeof matchInfo.homeTeamScore !== 'number') {
      throw new Error("主队得分必须是数字");
    }

    // 验证awayTeamScore是否为数字
    if (typeof matchInfo.awayTeamScore !== 'number') {
      throw new Error("客队得分必须是数字");
    }

    // 验证homeTeamPenalty是否为数字
    if (typeof matchInfo.homeTeamPenalty !== 'number') {
      throw new Error("主队点球必须是数字");
    }

    // 验证awayTeamPenalty是否为数字
    if (typeof matchInfo.awayTeamPenalty !== 'number') {
      throw new Error("客队点球必须是数字");
    }

    return true;
  },

  // 提交更新，进行POST请求
  handleMatchInfoSubmit() {
    let that = this
    const matchInfo = {
      matchId: this.data.matchId,
      status: this.data.match.status,
      homeTeamScore: this.data.tmpHomeTeamScore,
      awayTeamScore: this.data.tmpAwayTeamScore,
      homeTeamPenalty: this.data.tmpHomeTeamPenalty,
      awayTeamPenalty: this.data.tmpAwayTeamPenalty,
    }

    // 日志
    console.log("match referee: handleMatchInfoSubmit->")
    console.log(matchInfo);

    // 调用验证函数
    try {
      if (this.validateMatchInfo(matchInfo)) {
        console.log('matchInfo 验证成功');
      }
    } catch (error) {
      wx.showToast({
        title: "请填写完整",
        icon: "error",
      })
      console.error(error.message);
      return
    }

    wx.showLoading({
      title: '正在更新',
    })

    wx.request({
      url: URL + '/match/referee/updateResult?refereeId=' + that.data.refereeId,
      method: 'POST',
      data: matchInfo,
      success(res) {
        console.log("match referee: handleMatchInfoSubmit->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("更新成功")
        that.setData({
          MatchInfoModalIsHidden: true
        });
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
      complete() {
        wx.hideLoading()
        // 需重新拉取数据
        that.fetchData(that.data.matchId)
      }
    })
  },

  // ----------------------------
  // 处理ActionAdd相关

  // 显示 ActionAdd Modal，准备初始数据
  showActionAddModal: function () {
    this.setData({
      ActionAddModalIsHidden: false,
      tmpTime: '',
      tmpTeam: {
        name: '请选择球队'
      },
      tmpPlayer: {
        numberAndName: '请选择球员'
      },
      tmpAction: '请选择行为',
      teamOptions: [this.data.match.homeTeam, this.data.match.awayTeam],
      playerOptions: [{
        playerId: -1,
        numberAndName: '请先选择球队'
      }],
    });
  },

  // 球队发生改变，需更新playerOption
  handleTeamChange: function (e) {
    const tmpTeam = e.detail.value == 0 ? this.data.match.homeTeam : this.data.match.awayTeam
    const playerOptions = [];
    for (let player of tmpTeam.players) {
      const playerOption = {
        playerId: player.playerId,
        numberAndName: `${player.number}号 - ${player.name}`
      };
      playerOptions.push(playerOption);
    }
    this.setData({
      tmpTeam,
      playerOptions,
    });
  },

  // 选择球员
  handlePlayerChange: function (e) {
    this.setData({
      tmpPlayer: this.data.playerOptions[e.detail.value]
    });
  },

  // 选择行动
  handleActionChange: function (e) {
    this.setData({
      tmpAction: this.data.actionOptions[e.detail.value]
    });
  },

  validatePlayerAction(newPlayerAction) {
    // 验证matchId是否为数字
    if (typeof newPlayerAction.matchId !== 'number') {
      throw new Error("matchId 必须是数字");
    }

    // 验证teamId是否为数字
    if (typeof newPlayerAction.teamId !== 'number') {
      throw new Error("teamId 必须是数字");
    }

    // 验证playerId是否为数字
    if (typeof newPlayerAction.playerId !== 'number') {
      throw new Error("playerId 必须是数字");
    }

    // 验证time是否为数字
    if (typeof newPlayerAction.time !== 'number') {
      throw new Error("time 必须是数字");
    }

    // 验证action是否为空
    if (!newPlayerAction.action) {
      throw new Error("action 不能为空");
    }

    return true;
  },

  // 提交更新，进行POST请求
  handleActionAddSubmit() {
    let that = this
    const newPlayerAction = {
      matchId: this.data.matchId,
      teamId: this.data.tmpTeam.teamId,
      playerId: this.data.tmpPlayer.playerId,
      action: this.data.tmpAction,
      time: this.data.tmpTime,
    }

    // 日志
    console.log("match referee: handleActionAddSubmit ->")
    console.log(newPlayerAction);

    // 调用验证函数
    try {
      if (this.validatePlayerAction(newPlayerAction)) {
        console.log('newPlayerAction 验证成功');
      }
    } catch (error) {
      wx.showToast({
        title: "请填写完整",
        icon: "error",
      })
      console.error(error.message);
      return
    }

    wx.showLoading({
      title: '正在添加',
    })

    wx.request({
      url: URL + '/match/referee/addPlayerAction?refereeId=' + that.data.refereeId,
      method: 'POST',
      data: newPlayerAction,
      success(res) {
        console.log("match referee: handleActionAddSubmit->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("更新成功")
        that.setData({
          ActionAddModalIsHidden: true,
        });
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
      complete() {
        wx.hideLoading()
        that.fetchData(that.data.matchId)
      }
    })
  },

  // ----------------------------
  // 删除比赛事件
  showDeletePlayerActionDialog(e) {
    let playerAction = e.currentTarget.dataset.action
    playerAction = {
      matchId: this.data.matchId,
      teamId: playerAction.teamId,
      playerId: playerAction.player.playerId,
      action: playerAction.action,
      time: playerAction.time
    }

    wx.showModal({
      title: '确认删除',
      content: '您确定删除该比赛事件吗？',
      complete: (res) => {
        if (res.confirm) {
          this.deletePlayerAction(playerAction)
        }
      }
    })
  },

  deletePlayerAction(playerAction) {
    // 日志
    console.log("match referee: deletePlayerAction ->")
    console.log(playerAction);

    // 调用验证函数
    try {
      if (this.validatePlayerAction(playerAction)) {
        console.log('将要删除的 playerAction 验证成功');
      }
    } catch (error) {
      wx.showToast({
        title: "请填写完整",
        icon: "error",
      })
      console.error(error.message);
      return
    }

    wx.showLoading({
      title: '正在删除',
    })

    const that = this
    wx.request({
      url: URL + '/match/referee/deletePlayerAction?refereeId=' + that.data.refereeId,
      method: 'DELETE',
      data: playerAction,
      success(res) {
        console.log("match referee: handleActionAddSubmit->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("删除成功")
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
      complete() {
        wx.hideLoading()
        that.fetchData(that.data.matchId)
      }
    })
  },

  // ----------------------------
  // 直播和回放
  goToLiveOrVideo: function (e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/pub/live/live?url=' + url,
    })
  },

  showAddSourceModal() {
    this.setData({
      modalHidden_source: false
    })
  },

  handleSourceTypeChange(e) {
    let source = this.data.source
    source.type = this.data.sourceOptions[e.detail.value]
    this.setData({
      source
    });
  },

  handleInputSourceNameChange(e) {
    let source = this.data.source
    console.log(source)
    source.name = e.detail.value
    this.setData({
      source
    })
  },

  handleInputSourceUrlChange(e) {
    let source = this.data.source
    source.url = e.detail.value
    this.setData({
      source
    })
  },

  handleSubmit_source() {
    const that = this
    let matchId = this.data.matchId
    let type = this.data.source.type
    let name = this.data.source.name
    let url = this.data.source.url

    // 日志
    console.log("match referee: handleSubmit_source ->")
    if (type === "直播") {
      type = "live"
    }
    if (type === "回放") {
      type = "video"
    }
    if (type !== "live" && type !== "video") {
      console.error(`${type} is invalid!`)
      return
    }
    if (name.length > 10) {
      wx.showToast({
        title: '命名过长！',
        icon: "error"
      })
      return
    }
    console.log(`${name}: ${url}`);

    wx.showLoading({
      title: '正在添加',
      mask: true,
    })
    wx.request({
      url: `${URL}/match/${type}/add?matchId=${matchId}&${type}Name=${name}&${type}Url=${url}`,
      method: 'POST',
      success(res) {
        console.log("match referee: handleSubmit_source->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("更新成功")
        that.setData({
          modalHidden_source: true,
        });
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
      complete() {
        wx.hideLoading()
        that.fetchLiveList(that.data.matchId)
        that.fetchVideoList(that.data.matchId)
        that.setData({
          source: {
            type: "请选择",
            name: "",
            url: "",
          },
        })
      }
    })
  },

  showDeleteSourceDialog(e) {
    let sourceId = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type

    wx.showModal({
      title: '确认删除',
      content: '您确定删除该直播或回放吗？',
      confirmText: '确认删除',
      confirmColor: '#FF0000',
      complete: (res) => {
        if (res.confirm) {
          console.log("match referee: showDeleteSourceDialog ->")
          console.log(`delete ${type}: ${sourceId}`);
          wx.showLoading({
            title: '正在删除',
          })
          const that = this
          wx.request({
            url: `${URL}/match/${type}/delete?${type}Id=${sourceId}`,
            method: 'DELETE',
            success(res) {
              console.log(`match referee: showDeleteSourceDialog delete ${type} ->`)
              if (res.statusCode != 200) {
                console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                return
              }
              console.log("删除成功")
            },
            fail(err) {
              console.error(`请求失败：${err.statusCode}, ${err.errMsg}`);
            },
            complete() {
              wx.hideLoading()
              that.fetchLiveList(that.data.matchId)
              that.fetchVideoList(that.data.matchId)
            }
          })
        }
      }
    })
  },


})