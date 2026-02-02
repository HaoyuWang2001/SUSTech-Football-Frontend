// pages/management/event_new/event_new.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const { showModal } = require("../../../utils/modal")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorityLevel: 0,
    authorityId: 0,
    icon: '/assets/cup.svg',
    name: '创建新赛事名称',
    description: '编辑赛事简介',
    modalHiddenEname: true,
    modalHiddenEdes: true,

    teamList: [],
    eventId: 0,
    stageList: [],
    eventType: '',
    eventTypeList: ['杯赛', '联赛'],
    groupNumber: [],
    teamNumber: [],
    turnNumber: [],
    gNumber: 0,
    tNumber: 0,
    tuNumber: 0,
    
    // 比赛人数和大名单人数
    matchPlayerCountList: [5, 7, 8, 11],
    matchPlayerCount: 0,
    rosterSize: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化groupNumber数组
    var groupArr = [];
    for (var i = 2; i <= 8; i++) {
      groupArr.push(i);
    }

    // 初始化teamNumber数组
    var teamArr = [];
    for (var j = 2; j <= 16; j *= 2) {
      teamArr.push(j);
    }

    // 初始化turnNumber数组
    var turnArr = [];
    for (var k = 1; k <= 20; k++) {
      turnArr.push(k);
    }

    // 更新data中的数组
    this.setData({
      authorityLevel: options.authorityLevel,
      authorityId: options.authorityId,
      groupNumber: groupArr,
      teamNumber: teamArr,
      turnNumber: turnArr
    });
  },

  inputEventName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  inputEventDes: function (e) {
    this.setData({
      description: e.detail.value
    });
  },

  changeEventType: function (e) {
    const eventType = this.data.eventTypeList[e.detail.value]
    var stageList
    if (eventType == '杯赛') {
      stageList = [{
        stageName: '小组赛',
        tags: []
      }, {
        stageName: '淘汰赛',
        tags: []
      }]
    } else if (eventType == '联赛') {
      stageList = [{
        stageName: '联赛',
        tags: []
      }]
    }
    this.setData({
      eventType: eventType,
      stageList: stageList
    });

  },

  groupNumberChange: function (e) {
    const gNumber = this.data.groupNumber[e.detail.value]
    this.setData({
      gNumber: gNumber
    });
  },

  teamNumberChange: function (e) {
    const tNumber = this.data.teamNumber[e.detail.value]
    this.setData({
      tNumber: tNumber
    });
  },

  turnNumberChange: function (e) {
    const tuNumber = this.data.turnNumber[e.detail.value]
    this.setData({
      tuNumber: tuNumber
    });
  },

  matchPlayerCountChange: function (e) {
    const matchPlayerCount = this.data.matchPlayerCountList[e.detail.value]
    this.setData({
      matchPlayerCount: matchPlayerCount
    });
  },

  inputRosterSize: function (e) {
    const rosterSize = parseInt(e.detail.value) || 0
    this.setData({
      rosterSize: rosterSize
    });
  },

  showCreateModal() {
    showModal({
      title: '确认创建',
      content: '确定要进行创建赛事吗？',
      onConfirm: () => {
        this.confirmCreate();
      },
    })
  },

  confirmCreate: function () {
    if (this.data.name.length > 20) {
      wx.showToast({
        title: '赛事名称过长',
        icon: 'error',
      })
      return
    }

    var that = this;
    var stageList = [];
    // 根据不同的eventType设置不同的stageList
    if (that.data.eventType !== '杯赛' && that.data.eventType !== '联赛') {
      wx.showToast({
        title: '请选择赛事类型',
        icon: 'error',
      });
    } else if (that.data.gNumber === 0 && that.data.eventType === '杯赛') {
      wx.showToast({
        title: '请选择小组数量',
        icon: "error",
      });
    } else if (that.data.tNumber === 0 && that.data.eventType === '杯赛') {
      wx.showToast({
        title: '请选择出线数量',
        icon: "error",
      });
    } else if (that.data.tuNumber === 0 && that.data.eventType === '联赛') {
      wx.showToast({
        title: '请选择联赛轮数',
        icon: "error",
      });
    } else if (that.data.matchPlayerCount === 0) {
      wx.showToast({
        title: '请选择比赛人数',
        icon: "error",
      });
    } else if (that.data.rosterSize === 0) {
      wx.showToast({
        title: '请输入大名单人数',
        icon: "error",
      });
    } else if (that.data.rosterSize < that.data.matchPlayerCount) {
      wx.showToast({
        title: '大名单人数不能小于比赛人数',
        icon: "error",
      });
    } else {
      if (that.data.eventType === '杯赛') {
        // 杯赛有两个阶段：小组赛和淘汰赛
        var groupStage = {
          stageName: '小组赛',
          tags: []
        };

        // 添加小组赛的tag
        for (var i = 0; i < that.data.gNumber; i++) {
          groupStage.tags.push({
            tagName: String.fromCharCode(65 + i) + '组', // A组、B组...
            matches: []
          });
        }

        // 添加淘汰赛的tag
        var eliminationStage = {
          stageName: '淘汰赛',
          tags: [] // 可根据需要自定义
        };

        switch (that.data.tNumber) {
          case 2:
            eliminationStage.tags.push({
              tagName: '决赛',
              matches: []
            })
            break
          case 4:
            eliminationStage.tags.push({
              tagName: '决赛',
              matches: []
            }, {
              tagName: '三四名决赛',
              matches: []
            }, {
              tagName: '半决赛',
              matches: []
            })
            break
          case 8:
            eliminationStage.tags.push({
              tagName: '决赛',
              matches: []
            }, {
              tagName: '三四名决赛',
              matches: []
            }, {
              tagName: '半决赛',
              matches: []
            }, {
              tagName: '四分之一决赛',
              matches: []
            })
            break
          case 16:
            eliminationStage.tags.push({
              tagName: '决赛',
              matches: []
            }, {
              tagName: '三四名决赛',
              matches: []
            }, {
              tagName: '半决赛',
              matches: []
            }, {
              tagName: '四分之一决赛',
              matches: []
            }, {
              tagName: '八分之一决赛',
              matches: []
            })
            break
          default:
            break
        }
        // 将两个阶段加入stageList
        stageList.push(groupStage, eliminationStage);
      } else if (that.data.eventType === '联赛') {
        // 联赛只有一个阶段：联赛
        var leagueStage = {
          stageName: '联赛',
          tags: []
        };

        // 添加联赛的tag
        for (var j = 1; j <= that.data.tuNumber; j++) {
          leagueStage.tags.push({
            tagName: '第' + j + '轮',
            matches: []
          });
        }

        // 将联赛阶段加入stageList
        stageList.push(leagueStage);
      }

      // 构造要发送给后端的数据
      const dataToCreate = {
        name: this.data.name,
        description: this.data.description,
        stageList: stageList,
        matchPlayerCount: this.data.matchPlayerCount,
        rosterSize: this.data.rosterSize,
      };
      wx.showLoading({
        title: '正在创建',
        mask: true
      })
      wx.request({
        url: `${URL}/event/create?ownerId=${userId}&createAuthorityLevel=${this.data.authorityLevel}&createAuthorityId=${this.data.authorityId}`,
        method: 'POST',
        data: dataToCreate,
        success: res => {
          wx.hideLoading()
          console.log('event_new page: confirmCreate ->')
          if (res.statusCode != 200) {
            console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
            wx.showToast({
              title: "创建失败",
              icon: "error"
            });
            return
          }
          wx.navigateBack({
            success: () => {
              setTimeout(function () {
                wx.showToast({
                  title: "创建成功",
                  icon: "success",
                })
              }, 500)
            }
          });
        },
        fail: err => {
          wx.hideLoading()
          console.error('赛事创建失败', err);
          wx.showToast({
            title: '创建失败，请重试',
            icon: "error",
          });
        },
      });
    }
  },
})