// pages/home/search/search.js
const app = getApp()
const URL = app.globalData.URL
const {
  formatTime
} = require("../../../utils/timeFormatter")
const {
  filter
} = require("../../../utils/searchFilter")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,
    searchText: '',
    newsList: [],
    eventList: [],
    matchList: [],
    userList: [],
    teamList: [],

    expandNews: true,
    expandEvent: true,
    expandMatch: true,
    expandUser: true,
    expandTeam: true,
    newsBound: 3,
    eventBound: 3,
    matchBound: 3,
    userBound: 3,
    teamBound: 3,
    newsIdx: 0,
    eventIdx: 0,
    matchIdx: 0,
    userIdx: 0,
    teamIdx: 0,
    newsDisplayList: [],
    eventDisplayList: [],
    matchDisplayList: [],
    userDisplayList: [],
    teamDisplayList: [],

    // 搜索相关
    searchPlaceholder: '请输入搜索内容',
    activeIndex: 0,
    filterTypes: ['全部', '赛事', '比赛', '用户', '球队', '新闻'],
    type: '全部',
    // showFilter: false,
    // filterSortings: ['按时间', '按热度'],
    // sorting: '按时间',
    // filterFavors: ['仅我的关注', '所有'],
    // favor: '仅我的关注'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      searchText: decodeURIComponent(options.searchText)
    });
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
    app.addToRequestQueue(this.fetchData)
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
    app.addToRequestQueue(this.fetchData)
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


  fetchData(id) {
    this.setData({
      newsList: [],
      eventList: [],
      matchList: [],
      userList: [],
      teamList: [],
    })
    if (this.data.type == '全部') {
      app.addToRequestQueue(this.fetchEvent)
      app.addToRequestQueue(this.fetchMatch)
      app.addToRequestQueue(this.fetchTeam)
      app.addToRequestQueue(this.fetchUser)
      app.addToRequestQueue(this.fetchNews)
    } else {
      if (this.data.type == '赛事') {
        app.addToRequestQueue(this.fetchEvent)
      } else if (this.data.type == '比赛') {
        app.addToRequestQueue(this.fetchMatch)
      } else if (this.data.type == '球队') {
        app.addToRequestQueue(this.fetchTeam)
      } else if (this.data.type == '用户') {
        app.addToRequestQueue(this.fetchUser)
      } else if (this.data.type == '新闻') {
        app.addToRequestQueue(this.fetchNews)
      }
    }
  },

  fetchEvent(id) {
    let that = this
    wx.request({
      url: URL + '/event/getAll',
      success(res) {
        console.log("search page: fetch event ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let eventList = res.data ?? []
        let filterEventList = []
        for (let event of eventList) {
          let patterns = [event.name, (event.description ? event.description : '')]
          if (filter(that.data.searchText, patterns)) {
            filterEventList.push(event)
          }
        }
        that.setData({
          eventList: filterEventList,
        })
        that.updateEventDisplayList()
      },
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchMatch(id) {
    let that = this
    wx.request({
      url: URL + '/match/getAll',
      success(res) {
        console.log("search page: fetch match ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let matchList = res.data ?? []
        let filterMatchList = []
        for (let match of matchList) {
          let patterns = [(match.homeTeam ? match.homeTeam.name : ''), (match.awayTeam ? match.awayTeam.name : ''), (match.matchEvent ? match.matchEvent.eventName : '')]
          if (filter(that.data.searchText,  patterns)) {
            let date = new Date(match.time)
            match.strTime = formatTime(date)
            match.hasBegun = match.status == 'PENDING' ? false : true
            filterMatchList.push(match)
          }
        }
        that.setData({
          matchList: filterMatchList,
        })
        that.updateMatchDisplayList()
      },
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchUser(id) {
    let that = this
    wx.request({
      url: URL + '/user/getAllRoleUsers',
      success(res) {
        console.log("home page: fetch verified users ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let userList = res.data ?? []
        let filterUserList = []
        for (let user of userList) {
          let patterns = [(user.nickName ? user.nickName : ''), (user.playerRole ? user.playerRole.name : ''), (user.coachRole ? user.coachRole.name : ''), (user.refereeRole ? user.refereeRole.name : '')]
          if (filter(that.data.searchText, patterns)) {
            filterUserList.push(user)
          }
        }
        that.setData({
          userList: filterUserList,
        })
        that.updateUserDisplayList()
      },
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchTeam(id) {
    let that = this
    wx.request({
      url: URL + '/team/getAll',
      success(res) {
        console.log("home page: fetch teams ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let teamList = res.data ?? []
        let filterTeamList = []
        for (let team of teamList) {
          if (filter(that.data.searchText, [team.name])) {
            filterTeamList.push(team)
          }
        }
        that.setData({
          teamList: filterTeamList,
        })
        that.updateTeamDisplayList()
      },
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchNews(id) {
    //TODO
  },

  /**
   * 监听搜索框文本
   */
  bindInput: function (e) {
    this.setData({
      searchText: e.detail.value,
    });
  },

  /**
   * 监听搜索按钮
   */
  search: function () {
    console.log('搜索内容:', this.data.searchText);
    app.addToRequestQueue(this.fetchData)
  },

  bindTypeChange: function (e) {
    const val = e.detail.value;
    this.setData({
      type: this.data.filterTypes[val]
    });
    app.addToRequestQueue(this.fetchData)
  },

  bindExpandNews: function (e) {
    this.setData({
      expandNews: !this.data.expandNews,
    })
  },

  bindExpandEvent: function (e) {
    this.setData({
      expandEvent: !this.data.expandEvent,
    })
  },

  bindExpandMatch: function (e) {
    this.setData({
      expandMatch: !this.data.expandMatch,
    })
  },

  bindExpandUser: function (e) {
    this.setData({
      expandUser: !this.data.expandUser,
    })
  },

  bindExpandTeam: function (e) {
    this.setData({
      expandTeam: !this.data.expandTeam,
    })
  },

  gotoEvent: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/event/event?id=' + id,
    })
  },

  gotoMatch: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + id,
    })
  },

  gotoUser: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/user/user?id=' + id,
    })
  },

  gotoTeam: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/team/team?id=' + id,
    })
  },

  updateNewsDisplayList() {
    // TODO
  },
  
  updateEventDisplayList() {
    var eventBound = this.data.eventBound
    var eventIdx = this.data.eventIdx
    var eventDisplayList = this.data.eventDisplayList
    while (eventIdx < this.data.eventList.length && eventIdx < eventBound) {
      eventDisplayList.push(this.data.eventList[eventIdx])
      eventIdx++;
    }
    if (eventIdx < this.data.eventList.length) {
      eventBound += 8;
    }
    this.setData({
      eventBound: eventBound,
      eventIdx: eventIdx,
      eventDisplayList: eventDisplayList,
    });
  },

  updateMatchDisplayList() {
    var matchBound = this.data.matchBound;
    var matchIdx = this.data.matchIdx;
    var matchDisplayList = this.data.matchDisplayList;
    while (matchIdx < this.data.matchList.length && matchIdx < matchBound) {
      matchDisplayList.push(this.data.matchList[matchIdx]);
      matchIdx++;
    }
    if (matchIdx < this.data.matchList.length) {
      matchBound += 8;
    }
    this.setData({
      matchBound: matchBound,
      matchIdx: matchIdx,
      matchDisplayList: matchDisplayList,
    });
  },
  
  updateUserDisplayList() {
    var userBound = this.data.userBound;
    var userIdx = this.data.userIdx;
    var userDisplayList = this.data.userDisplayList;
    while (userIdx < this.data.userList.length && userIdx < userBound) {
      userDisplayList.push(this.data.userList[userIdx]);
      userIdx++;
    }
    if (userIdx < this.data.userList.length) {
      userBound += 8;
    }
    this.setData({
      userBound: userBound,
      userIdx: userIdx,
      userDisplayList: userDisplayList,
    });
  },
  
  updateTeamDisplayList() {
    var teamBound = this.data.teamBound;
    var teamIdx = this.data.teamIdx;
    var teamDisplayList = this.data.teamDisplayList;
    while (teamIdx < this.data.teamList.length && teamIdx < teamBound) {
      teamDisplayList.push(this.data.teamList[teamIdx]);
      teamIdx++;
    }
    if (teamIdx < this.data.teamList.length) {
      teamBound += 8;
    }
    this.setData({
      teamBound: teamBound,
      teamIdx: teamIdx,
      teamDisplayList: teamDisplayList,
    });
  }

})