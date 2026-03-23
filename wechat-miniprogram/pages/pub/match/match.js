// pages/pub/match/match.js
const appInstance = getApp()
let URL = null
let userId = null
const {
  formatTime
} = require("../../../utils/timeFormatter")
import { Colors, Shadows, Gradients } from '../../../utils/colors.js'

const ACTION_META = {
  GOAL: { label: '进球', short: '球', className: 'goal' },
  ASSIST: { label: '助攻', short: '助', className: 'assist' },
  YELLOW_CARD: { label: '黄牌', short: '黄', className: 'yellow' },
  RED_CARD: { label: '红牌', short: '红', className: 'red' },
  ON: { label: '上场', short: '上', className: 'on' },
  OFF: { label: '下场', short: '下', className: 'off' },
  进球: { label: '进球', short: '球', className: 'goal' },
  助攻: { label: '助攻', short: '助', className: 'assist' },
  黄牌: { label: '黄牌', short: '黄', className: 'yellow' },
  红牌: { label: '红牌', short: '红', className: 'red' },
  上场: { label: '上场', short: '上', className: 'on' },
  下场: { label: '下场', short: '下', className: 'off' }
}

const ACTION_DISPLAY_META = {
  GOAL: { label: '\u8fdb\u7403', short: '\u7403', className: 'goal', iconType: 'text', iconSymbol: '\u26bd', iconClass: 'icon-goal' },
  ASSIST: { label: '\u52a9\u653b', short: '\u52a9', className: 'assist', iconType: '', iconSymbol: '', iconClass: '' },
  YELLOW_CARD: { label: '\u9ec4\u724c', short: '\u9ec4', className: 'yellow', iconType: 'card', iconSymbol: '', iconClass: 'icon-yellow-card' },
  RED_CARD: { label: '\u7ea2\u724c', short: '\u7ea2', className: 'red', iconType: 'card', iconSymbol: '', iconClass: 'icon-red-card' },
  ON: { label: '\u4e0a\u573a', short: '\u4e0a', className: 'on', iconType: 'text', iconSymbol: '\u2191', iconClass: 'icon-on' },
  OFF: { label: '\u4e0b\u573a', short: '\u4e0b', className: 'off', iconType: 'text', iconSymbol: '\u2193', iconClass: 'icon-off' },
  '\u8fdb\u7403': { label: '\u8fdb\u7403', short: '\u7403', className: 'goal', iconType: 'text', iconSymbol: '\u26bd', iconClass: 'icon-goal' },
  '\u52a9\u653b': { label: '\u52a9\u653b', short: '\u52a9', className: 'assist', iconType: '', iconSymbol: '', iconClass: '' },
  '\u9ec4\u724c': { label: '\u9ec4\u724c', short: '\u9ec4', className: 'yellow', iconType: 'card', iconSymbol: '', iconClass: 'icon-yellow-card' },
  '\u7ea2\u724c': { label: '\u7ea2\u724c', short: '\u7ea2', className: 'red', iconType: 'card', iconSymbol: '', iconClass: 'icon-red-card' },
  '\u4e0a\u573a': { label: '\u4e0a\u573a', short: '\u4e0a', className: 'on', iconType: 'text', iconSymbol: '\u2191', iconClass: 'icon-on' },
  '\u4e0b\u573a': { label: '\u4e0b\u573a', short: '\u4e0b', className: 'off', iconType: 'text', iconSymbol: '\u2193', iconClass: 'icon-off' }
}

const GOAL_ACTION_SET = new Set(['GOAL', '\u8fdb\u7403'])

function getActionMeta(actionCode) {
  if (ACTION_DISPLAY_META[actionCode]) {
    return ACTION_DISPLAY_META[actionCode]
  }
  if (ACTION_META[actionCode]) {
    return {
      label: ACTION_META[actionCode].label || (actionCode || '\u4e8b\u4ef6'),
      short: ACTION_META[actionCode].short || '\u4e8b',
      className: ACTION_META[actionCode].className || 'neutral',
      iconType: '',
      iconSymbol: '',
      iconClass: ''
    }
  }
  return {
    label: actionCode || '\u4e8b\u4ef6',
    short: '\u4e8b',
    className: 'neutral',
    iconType: '',
    iconSymbol: '',
    iconClass: ''
  }
}

Page({
  data: {
    colors: Colors,
    shadows: Shadows,
    gradients: Gradients,
    activeIndex: 0,
    id: 0,

    matchPlayerActionList: [],
    timelineActionList: [],
    awayTeam: {
      logoUrl: "",
      name: "",
      penalty: -1,
      players: [],
      score: -1,
      teamId: -1,
    },
    matchEvent: {
      eventId: Number,
      eventName: String,
      stage: String,
      tag: String,
    },
    homeTeam: {
      logoUrl: "",
      name: "",
      penalty: -1,
      players: [],
      score: -1,
      teamId: -1,
    },
    managerList: Array,
    refereeList: Array,
    status: "PENDING",
    time: new Date(),

    strTime: '',
    hasBegun: false,

    liveList: [],
    videoList: [],

    description: "",

    isFavorite: Boolean,

    refereeId: -1,
    isReferee: false,

    commentList: [],
    commentText: '', // 用于存储输入框中的评论内容
    replyText: '', // 用于存储输入框中的回复内容
    expandList: [],
    likesList: [],

    lineupTabIndex: 0,
    homeStarters: [],
    awayStarters: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
    })
    URL = appInstance.globalData.URL
    userId = appInstance.globalData.userId
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
    this.fetchData(this.data.id)
    this.isFavorite(userId, this.data.id)
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
    this.fetchData(options.id)
    this.isFavorite(userId, options.id)
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

  // 获取比赛数据
  fetchData: function (id) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    const that = this
    wx.request({
      url: URL + "/match/get",
      data: {
        id: id,
      },
      success: async function (res) {
        console.log("match->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)

        let date = new Date(res.data.time)
        let strTime = formatTime(date)
        let hasBegun = res.data.status != "PENDING"

        const timelineActionList = that.buildEnhancedTimelineActions(
          res.data.matchPlayerActionList,
          res.data.homeTeam,
          res.data.awayTeam,
          res.data.status
        )
        const actionList = timelineActionList.filter(item => !item.isMilestone)

        const homePlayers = that.sortPlayersByNumber(res.data.homeTeam.players)
        const awayPlayers = that.sortPlayersByNumber(res.data.awayTeam.players)
        const homeStarters = homePlayers.filter(p => p.isStart)
        const awayStarters = awayPlayers.filter(p => p.isStart)

        that.setData({
          matchPlayerActionList: actionList,
          timelineActionList: timelineActionList,
          awayTeam: { ...res.data.awayTeam, players: awayPlayers },
          matchEvent: res.data.matchEvent,
          homeTeam: { ...res.data.homeTeam, players: homePlayers },
          managerList: res.data.managerList,
          refereeList: res.data.refereeList,
          status: res.data.status,
          time: res.data.time,
          hasBegun: hasBegun,
          strTime: strTime,
          homeStarters,
          awayStarters,
        })

        let refereeList = res.data.refereeList
        if (refereeList.length > 0) {
          try {
            const refereeId = await that.fetchRefereeId(userId)
            refereeList.forEach(function (referee){
              if(referee.refereeId === refereeId) {
                that.setData({
                  isReferee: true,
                })
              }
            })
          } catch (error) {
            console.error(error)
          }
        }
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
      complete() {
        wx.hideLoading();
        that.fetchComment(that.data.id)
      }
    })
  },

  sortPlayersByNumber(players) {
    if (!Array.isArray(players)) return []
    return players.slice().sort((a, b) => Number(a.number) - Number(b.number))
  },

  buildTimelineActions(actionList, homeTeam, awayTeam, matchStatus) {
    if (!Array.isArray(actionList)) {
      return []
    }

    const homeTeamId = homeTeam && homeTeam.teamId
    const awayTeamId = awayTeam && awayTeam.teamId

    return actionList
      .map((item, index) => {
        const actionMeta = ACTION_META[item.action] || {
          label: item.action || '事件',
          short: '事',
          className: 'neutral'
        }

        const player = item.player || {}
        const hasNumber = player.number !== undefined && player.number !== null && player.number !== ''
        const playerName = player.name || '未知球员'
        const playerDisplay = hasNumber ? `${player.number}号 ${playerName}` : playerName

        const isHomeTeam = item.teamId === homeTeamId
        const isAwayTeam = item.teamId === awayTeamId
        const side = isHomeTeam ? 'left' : (isAwayTeam ? 'right' : (index % 2 === 0 ? 'left' : 'right'))
        const teamName = isHomeTeam ? homeTeam.name : (isAwayTeam ? awayTeam.name : '未知球队')

        const minute = Number(item.time)
        const minuteLabel = Number.isFinite(minute) ? `${minute}'` : `${item.time || ''}'`

        return {
          ...item,
          actionCode: item.action,
          action: actionMeta.label,
          actionShort: actionMeta.short,
          actionClass: actionMeta.className,
          side,
          teamName,
          playerDisplay,
          minuteLabel,
          minuteSort: Number.isFinite(minute) ? minute : Number.MAX_SAFE_INTEGER,
          timelineKey: `${item.teamId || 'team'}-${player.playerId || index}-${item.time}-${item.action || 'action'}-${index}`
        }
      })
      .sort((left, right) => {
        if (left.minuteSort === right.minuteSort) {
          return 0
        }
        return left.minuteSort - right.minuteSort
      })
  },

  buildEnhancedTimelineActions(actionList, homeTeam, awayTeam, matchStatus) {
    if (!Array.isArray(actionList)) {
      return []
    }

    const homeTeamId = homeTeam && homeTeam.teamId
    const awayTeamId = awayTeam && awayTeam.teamId

    const normalizedList = actionList
      .map((item, index) => {
        const actionMeta = getActionMeta(item.action)
        const player = item.player || {}
        const hasNumber = player.number !== undefined && player.number !== null && player.number !== ''
        const playerName = player.name || '\u672a\u77e5\u7403\u5458'
        const playerDisplay = hasNumber ? `${player.number}\u53f7 ${playerName}` : playerName

        const isHomeTeam = item.teamId === homeTeamId
        const isAwayTeam = item.teamId === awayTeamId
        const side = isHomeTeam ? 'left' : (isAwayTeam ? 'right' : (index % 2 === 0 ? 'left' : 'right'))

        const minute = Number(item.time)
        const minuteSort = Number.isFinite(minute) ? minute : Number.MAX_SAFE_INTEGER
        const minuteLabel = Number.isFinite(minute) ? `${minute}'` : `${item.time || ''}'`

        return {
          ...item,
          actionCode: item.action,
          action: actionMeta.label,
          actionShort: actionMeta.short,
          actionClass: actionMeta.className,
          iconType: actionMeta.iconType,
          iconSymbol: actionMeta.iconSymbol,
          iconClass: actionMeta.iconClass,
          side,
          playerDisplay,
          minuteLabel,
          minuteSort,
          sourceIndex: index
        }
      })
      .sort((left, right) => {
        if (left.minuteSort === right.minuteSort) {
          return left.sourceIndex - right.sourceIndex
        }
        return left.minuteSort - right.minuteSort
      })

    const ON_ACTION_SET = new Set(['ON', '\u4e0a\u573a'])
    const OFF_ACTION_SET = new Set(['OFF', '\u4e0b\u573a'])
    const isSubAction = (actionCode) => ON_ACTION_SET.has(actionCode) || OFF_ACTION_SET.has(actionCode)

    const timelineActionList = []
    const subGroupMap = new Map()

    normalizedList.forEach(item => {
      if (!isSubAction(item.actionCode)) {
        timelineActionList.push({
          ...item,
          isSubGroup: false,
          groupEntries: [{
            entryKey: `${item.sourceIndex}-single`,
            iconType: item.iconType,
            iconSymbol: item.iconSymbol,
            iconClass: item.iconClass,
            action: item.action,
            playerDisplay: item.playerDisplay,
            showAction: true
          }],
          timelineKey: `${item.teamId || 'team'}-${item.player && item.player.playerId ? item.player.playerId : item.sourceIndex}-${item.time}-${item.actionCode || 'action'}-${item.sourceIndex}`,
          groupSort: item.sourceIndex
        })
        return
      }

      const subGroupKey = `${item.minuteSort}|${item.side}|${item.teamId || 'team'}`
      if (!subGroupMap.has(subGroupKey)) {
        const groupItem = {
          ...item,
          isSubGroup: true,
          groupEntries: [],
          timelineKey: `sub-${subGroupKey}`,
          groupSort: item.sourceIndex
        }
        subGroupMap.set(subGroupKey, groupItem)
        timelineActionList.push(groupItem)
      }

      const groupItem = subGroupMap.get(subGroupKey)
      groupItem.groupEntries.push({
        entryKey: `${item.sourceIndex}-sub`,
        iconType: item.iconType,
        iconSymbol: item.iconSymbol,
        iconClass: item.iconClass,
        action: item.action,
        playerDisplay: item.playerDisplay,
        showAction: false,
        order: ON_ACTION_SET.has(item.actionCode) ? 0 : 1
      })
    })

    timelineActionList.forEach(item => {
      if (!item.isSubGroup) {
        return
      }
      item.groupEntries.sort((left, right) => {
        if (left.order === right.order) {
          return 0
        }
        return left.order - right.order
      })
    })

    const hasSecondHalfEvent = normalizedList.some(item => Number.isFinite(item.minuteSort) && item.minuteSort > 45)
    const shouldInsertHalfTime = matchStatus === 'FINISHED' || hasSecondHalfEvent

    if (shouldInsertHalfTime) {
      let halfHomeScore = 0
      let halfAwayScore = 0

      normalizedList.forEach(item => {
        const isGoalAction = GOAL_ACTION_SET.has(item.actionCode)
        const isFirstHalfGoal = isGoalAction && Number.isFinite(item.minuteSort) && item.minuteSort <= 45
        if (!isFirstHalfGoal) {
          return
        }
        if (item.teamId === homeTeamId) {
          halfHomeScore += 1
        } else if (item.teamId === awayTeamId) {
          halfAwayScore += 1
        }
      })

      timelineActionList.push({
        timelineKey: 'milestone-halftime',
        isMilestone: true,
        side: 'center',
        minuteSort: 45.5,
        minuteLabel: `45'`,
        milestoneText: `\u534a\u573a ${halfHomeScore}-${halfAwayScore}`,
        groupSort: Number.MAX_SAFE_INTEGER
      })
    }

    return timelineActionList.sort((left, right) => {
      if (left.minuteSort === right.minuteSort) {
        return (left.groupSort || 0) - (right.groupSort || 0)
      }
      return left.minuteSort - right.minuteSort
    })
  },

  fetchComment: function (id) {

    const that = this
    wx.request({
      url: URL + "/comment/match/getCommentWithReply?matchId=" + id,
      success: async function (res) {
        console.log("comment->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)

        that.setData({
          commentList: res.data
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
      complete() {
        if(that.data.expandList.length < that.data.commentList.length){
          for(var i = 0; i < that.data.commentList.length; i++) {
            that.data.expandList.push({
              expanded: false
            })
          }
        }
        that.fetchCommentLikes(userId)
      }
    })
  },

  fetchCommentLikes: function (id) {
    const that = this
    var commentIds = []
    for(let i = 0; i < this.data.commentList.length; i++) {
      commentIds.push(this.data.commentList[i].commentId)
    }
    if(commentIds.length !== 0) {
      wx.request({
        url: URL + "/comment/match/like/getByIdList?userId=" + id + '&commentIds=' + commentIds,
        method: 'POST',
        success: async function (res) {
          console.log("likes->")
          if (res.statusCode != 200) {
            console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
            return
          }
          console.log(res.data)

          that.setData({
            likesList: res.data
          })
        },
        fail(err) {
          console.error('请求失败：', err.statusCode, err.errMsg);
        },
        complete() {
        }
      })
    }
  },

  // 点击不同tab时调用
  switchTab: function (e) {
    const tabIndex = e.currentTarget.dataset.index;
    if (this.data.activeIndex != tabIndex) {
      this.loadTabData(tabIndex);
    }
    this.setData({
      activeIndex: tabIndex,
      lineupTabIndex: 0
    })
  },

  switchLineupTab(e) {
    const tabIndex = e.currentTarget.dataset.index
    this.setData({
      lineupTabIndex: tabIndex
    })
  },

  // 加载tab内信息时调用
  loadTabData: function (tabIndex) {
    const that = this
    if (tabIndex == 1) {
      // 显示加载提示框，提示用户正在加载
      wx.request({
        url: URL + '/match/live/getAll',
        data: {
          matchId: that.data.id
        },
        success(res) {
          console.log("live->")
          console.log(res.data)
          that.setData({
            liveList: res.data
          })
        },
        fail(err) {
          console.log("请求失败，错误码为：" + err.statusCode + "；错误信息为：" + err.message)
        }
      })
      wx.request({
        url: URL + '/match/video/getAll',
        data: {
          matchId: that.data.id
        },
        success(res) {
          console.log("video->")
          console.log(res.data)
          that.setData({
            videoList: res.data
          })
        },
        fail(err) {
          console.log("请求失败，错误码为：" + err.statusCode + "；错误信息为：" + err.message)
        }
      })
    }
  },

  // 页面跳转
  goToLiveOrVideo: function (e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/pub/live/live?url=' + url,
    })
  },

  // 获取用户是否关注该比赛
  isFavorite(userId, id) {
    let that = this
    wx.request({
      url: URL + '/isFavorite',
      data: {
        userId: userId,
        type: "match",
        id: id,
      },
      success(res) {
        console.log("match page: isFavorite->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        that.setData({
          favorited: Boolean(res.data)
        })
      }
    })
  },

  // 关注比赛
  favorite() {
    let that = this
    wx.showLoading({
      title: '收藏中',
      mask: true,
    })
    wx.request({
      url: URL + '/favorite?type=match&userId=' + userId + '&id=' + that.data.id,
      method: "POST",
      success(res) {
        console.log("match page: favorite->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log("收藏成功")
        that.setData({
          favorited: true,
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },

  // 取消关注
  unfavorite() {
    let that = this
    wx.showModal({
      title: '确认取消收藏',
      content: '确定要取消收藏这个比赛吗？',
      confirmText: '确认取消',
      confirmColor: Colors.primary,
      cancelText: '我再想想',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消收藏中',
            mask: true,
          })
          wx.request({
            url: URL + '/unfavorite?type=match&userId=' + userId + '&id=' + that.data.id,
            method: "POST",
            success(res) {
              console.log("match page: unfavorite->")
              if (res.statusCode !== 200) {
                console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
                return
              }
              console.log("取消收藏成功")
              that.setData({
                favorited: false
              })
            },
            complete() {
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
          // 用户取消，不做任何操作
        }
      }
    })
  },

  // 获取user的refereeId
  fetchRefereeId(userId) {
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: URL + '/user/getRefereeId',
        data: {
          userId: userId,
        },
        success(res) {
          console.log("match referee page: fetchRefereeId ->")
          if (res.statusCode == 404) {
            reject(new Error("用户未注册为裁判"))
          }
          if (res.statusCode != 200) {
            reject(new Error("fetchRefereeId 失败"))
          }
          console.log(res.data)
          that.setData({
            refereeId: res.data,
          })
          resolve(res.data)
        },
        fail(err) {
          reject(new Error("fetchRefereeId 失败"))
        },
      })
    })

  },

  expandReply(e) {
    const index = e.currentTarget.dataset.id;
    const expandList = this.data.expandList;
    for(var i = 0; i < this.data.commentList.length; i++) {
      expandList[i].expanded = false
    }
    expandList[index].expanded = !expandList[index].expanded;
    this.setData({
      replyText: '',
      expandList: expandList
    });
  },

  dropReply(e) {
    const index = e.currentTarget.dataset.id;
    const expandList = this.data.expandList;
    expandList[index].expanded = !expandList[index].expanded;
    this.setData({
      expandList: expandList
    });
  },

  inputComment(e) {
    this.setData({
      commentText: e.detail.value // 更新评论内容
    });
  },

  addComment() {
    const dataToUpdate = {
      matchId: this.data.id,
      content: this.data.commentText,
      userId: userId,
    };
    var that = this
    // 发送请求到后端接口
    wx.request({
      url: URL + '/comment/match/addComment', // 后端接口地址
      method: 'POST', // 请求方法
      data: dataToUpdate, // 要发送的数据
      success: res => {
        console.log('add comment->')
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        this.setData({
          commentText: '' // 清空输入框内容
        });
        wx.showToast({
          title: '评论成功',
          icon: 'success',
        });
      },
      fail: err => {
        console.error('评论失败', err);
        wx.showToast({
          title: '评论失败，请重试',
          icon: 'error',
        });
      },
      complete(){
        that.fetchComment(that.data.id)
      }
    });
  },

  showDeleteCommentModal(e) {
    const commentId = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除评论',
      content: '确定要删除这条评论吗？',
      confirmText: '确认删除',
      confirmColor: '#FF0000',
      cancelText: '我再想想',
      success(res) {
        if (res.confirm) {
          that.deleteComment(commentId);
        } else if (res.cancel) {
          () => {}
        }
      }
    });
  },

  showDeleteReplyModal(e) {
    const replyId = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '确认删除回复',
      content: '确定要删除这条回复吗？',
      confirmText: '确认删除',
      confirmColor: '#FF0000',
      cancelText: '我再想想',
      success(res) {
        if (res.confirm) {
          that.deleteReply(replyId);
        } else if (res.cancel) {
          () => {}
        }
      }
    });
  },

  deleteComment(commentId) {
    var that = this
    // 发送请求到后端接口
    wx.request({
      url: URL + '/comment/match/deleteComment?commentId=' + commentId + '&userId=' + userId, // 后端接口地址
      method: 'POST', // 请求方法
      success: res => {
        console.log('delete comment->')
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败',
            icon: 'error',
          });
          return
        }
        wx.showToast({
          title: '删除成功',
          icon: 'success',
        });
      },
      fail: err => {
        console.error('删除评论失败', err);
        // 显示失败信息
        wx.showToast({
          title: '删除失败',
          icon: 'error',
        });
      },
      complete(){
        that.fetchComment(that.data.id)
      }
    });
  },

  like_comment(e) {
    console.log(e)
    const commentId = e.currentTarget.dataset.id; // 获取评论 ID
    console.log('like comment->')
    var that = this
    // 发送请求到后端接口
    wx.request({
      url: URL + '/comment/match/like/doLike?commentId=' + commentId + '&userId=' + userId, // 后端接口地址
      method: 'POST', // 请求方法
      success: res => {
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        this.setData({
          commentText: '' // 清空输入框内容
        });
        console.log('点赞成功', res.data);
      },
      fail: err => {
        console.error('点赞失败', err);
      },
      complete(){
        that.fetchComment(that.data.id)
      }
    });
  },

  unlike_comment(e) {
    const commentId = e.currentTarget.dataset.id; // 获取评论 ID
    var that = this
    // 发送请求到后端接口
    wx.request({
      url: URL + '/comment/match/like/cancelLike?commentId=' + commentId + '&userId=' + userId, // 后端接口地址
      method: 'POST', // 请求方法
      success: res => {
        console.log('unlike comment->')
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        this.setData({
          commentText: '' // 清空输入框内容
        });
        console.log('取消点赞成功', res.data);
      },
      fail: err => {
        console.error('取消点赞失败', err);
      },
      complete(){
        that.fetchComment(that.data.id)
      }
    });
  },

  inputReply(e) {
    this.setData({
      replyText: e.detail.value // 更新评论内容
    });
  },

  addReply(e) {
    const index = e.currentTarget.dataset.id;
    const dataToUpdate = {
      userId: userId,
      commentId: this.data.commentList[index].commentId,
      content: this.data.replyText
    };
    var that = this
    // 发送请求到后端接口
    wx.request({
      url: URL + '/comment/match/addReply', // 后端接口地址
      method: 'POST', // 请求方法
      data: dataToUpdate, // 要发送的数据
      success: res => {
        console.log('add reply->')
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '回复失败',
            icon: 'error',
          });
          return
        }
        this.setData({
          replyText: '' // 清空回复输入框内容
        });
        wx.showToast({
          title: '回复成功',
          icon: 'success',
        });
      },
      fail: err => {
        console.error('回复失败', err);
        // 显示失败信息
        wx.showToast({
          title: '回复失败',
          icon: 'error',
        });
      },
      complete(){
        that.fetchComment(that.data.id)
      }
    });
  },

  deleteReply(replyId) {
    var that = this
    // 发送请求到后端接口
    wx.request({
      url: URL + '/comment/match/deleteReply?replyId=' + replyId + '&userId=' + userId, // 后端接口地址
      method: 'POST', // 请求方法
      success: res => {
        console.log('delete comment->')
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          wx.showToast({
            title: '删除失败',
            icon: 'error',
          });
          return
        }
        wx.showToast({
          title: '删除成功',
          icon: 'success',
        });
      },
      fail: err => {
        console.error('删除回复失败', err);
        wx.showToast({
          title: '删除失败',
          icon: 'error',
        });
      },
      complete(){
        that.fetchComment(that.data.id)
      }
    });
  },

  // 跳转至裁判页面
  gotoMatchRefereePage() {
    wx.navigateTo({
      url: './match_referee/match_referee?matchId=' + this.data.id + '&refereeId=' + this.data.refereeId,
    })
  },
})
