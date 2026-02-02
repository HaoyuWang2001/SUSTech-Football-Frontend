// pages/pub/match/match.js
const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const {
  formatTime
} = require("../../../utils/timeFormatter")
const { showModal } = require("../../../utils/modal")

Page({
  data: {
    activeIndex: 0,
    id: 0,

    matchPlayerActionList: [],
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
    userId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: options.id,
      userId: userId
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
        that.setData({
          matchPlayerActionList: res.data.matchPlayerActionList,
          awayTeam: res.data.awayTeam,
          matchEvent: res.data.matchEvent,
          homeTeam: res.data.homeTeam,
          managerList: res.data.managerList,
          refereeList: res.data.refereeList,
          status: res.data.status,
          time: res.data.time,
          hasBegun: hasBegun,
          strTime: strTime,
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
      activeIndex: tabIndex
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
    showModal({
      title: '确认删除评论',
      content: '确定要删除这条评论吗？',
      confirmText: '确认删除',
      confirmColor: '#FF0000',
      cancelText: '我再想想',
      onComfirm: () => {
        this.deleteComment(commentId);
      },
    });
  },

  showDeleteReplyModal(e) {
    const replyId = e.currentTarget.dataset.id
    showModal({
      title: '确认删除回复',
      content: '确定要删除这条回复吗？',
      confirmText: '确认删除',
      confirmColor: '#FF0000',
      cancelText: '我再想想',
      onComfirm: () => {
        this.deleteReply(replyId);
      },
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