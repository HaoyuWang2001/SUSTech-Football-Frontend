// pages/home/home.js
const app = getApp()
const URL = app.globalData.URL
const {
  formatTime
} = require("../../utils/timeFormatter")
// 导入颜色设计系统
import { Colors, Shadows, Gradients } from '../../utils/colors.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '', // 初始化搜索框内容为空
    // 颜色设计系统常量
    colors: {
      primary: Colors.primary,
      primaryLight: Colors.primaryLight,
      primaryAlpha15: Colors.primaryAlpha15,
    },
    shadows: {
      card: Shadows.card,
      button: Shadows.button,
    },
    gradients: {
      primary: Gradients.primary,
      primaryDiagonal: Gradients.primaryDiagonal,
    },
    newsList: [],
    matchList: [],
    userList: [],
    teamList: [],
    eventList: [],
    newsList: [{
        url: 'https://mp.weixin.qq.com/s/r6u14fRKytUs15NsA4VAPA',
        img: 'https://haoyu-wang141.top:8085/download?filename=3a26b5f0-5e38-48c5-b28a-fd38fc6e51db.jpg',
        title: '南方科技大学第八届“书院杯”足球赛顺利举办'
      },
      {
        url: 'https://mp.weixin.qq.com/s/5KGveHjUeyG3RC2otzJEtA',
        img: 'https://haoyu-wang141.top:8085/download?filename=0e3a73b8-c46e-4b09-97fb-1406f45bb604.png',
        title: '四星致诚'
      },
      {
        url: 'https://mp.weixin.qq.com/s/k2GceIOHC80c1d36ss4aLw',
        img: 'https://haoyu-wang141.top:8085/download?filename=20f6e008-b9d2-4331-9bba-5124dc49b4bb.png',
        title: '南方科技大学男子足球队荣获2023年深圳市大中小学生校园足球比赛（大学组）冠军'
      },
    ],
    currentSwiperIndex: 0, // 当前显示的新闻索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    app.addToRequestQueue(this.fetchFavorateMatch)
    app.addToRequestQueue(this.fetchFavorateUser)
    app.addToRequestQueue(this.fetchFavorateTeam)
    app.addToRequestQueue(this.fetchFavorateEvent)
    // app.addToRequestQueue(this.fetchNews)
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
    app.addToRequestQueue(this.fetchFavorateMatch)
    app.addToRequestQueue(this.fetchFavorateUser)
    app.addToRequestQueue(this.fetchFavorateTeam)
    app.addToRequestQueue(this.fetchFavorateEvent)
    // app.addToRequestQueue(this.fetchNews)
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

  /////////////////////////////////////
  // 网络传输

  fetchFavorateMatch(id) {
    let that = this
    wx.request({
      url: URL + '/getFavorite',
      data: {
        userId: id,
        type: 'match',
      },
      success(res) {
        console.log("home page: fetchFavorite match ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let matchList = res.data ?? []
        for (let match of matchList) {
          let date = new Date(match.time)
          match.strTime = formatTime(date)
          match.hasBegun = match.status == 'PENDING' ? false : true
        }
        that.setData({
          matchList,
        })
      },
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchFavorateUser(id) {
    let that = this
    wx.request({
      url: URL + '/getFavorite',
      data: {
        userId: id,
        type: 'user',
      },
      success(res) {
        console.log("home page: fetchFavorite: users ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let userList = res.data ?? []
        for (let user of userList) {
          user.avatarUrl = user.avatarUrl ?? "/assets/newplayer.png"
          user.nickName = user.nickName ?? "暂无昵称"
        }
        that.setData({
          userList: userList,
        })
      },
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchFavorateTeam(id) {
    let that = this
    wx.request({
      url: URL + '/getFavorite',
      data: {
        userId: id,
        type: 'team',
      },
      success(res) {
        console.log("home page: fetchFavorite: teams ->")
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
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchFavorateEvent(id) {
    let that = this
    wx.request({
      url: URL + '/getFavorite',
      data: {
        userId: id,
        type: 'event',
      },
      success(res) {
        console.log("home page: fetchFavorite: events ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let eventList = res.data ?? []
        that.setData({
          eventList: eventList,
        })
      },
      fail: function (err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  // fetchNews(id) {
  //   let that = this
  //   wx.request({
  //     url: URL + '',
  //     success(res) {
  //       console.log("home page: fetchNews: news ->")
  //       if (res.statusCode != 200) {
  //         console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
  //         return
  //       }
  //       console.log(res.data)
  //       let newsList = res.data ?? []
  //       that.setData({
  //         newsList: newsList,
  //       })
  //     },
  //     fail: function(err) {
  //       console.error('请求失败：', err.statusCode, err.errMsg);
  //     },
  //   })
  // },

  ///////////////////////////////////////////////////////////////////////////////
  // 页面跳转

  gotoExample() {
    wx.navigateTo({
      url: '/pages/example/example',
    })
  },

  gotoSearch() {
    let text = this.data.searchText
    this.setData({
      searchText: '',
    })
    wx.navigateTo({
      url: '/pages/home/search/search?' + 'searchText=' + encodeURIComponent(text),
    })
  },

  gotoNewsPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/news/news?id=' + dataset.id,
    })
  },

  gotoMatchesPage(e) {
    let matchList = e.currentTarget.dataset.list ?? []
    let matchIdList = matchList.map(match => match.matchId)
    wx.navigateTo({
      url: '/pages/pub/matches/matches?idList=' + matchIdList,
    })
  },

  gotoMatchPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + dataset.id,
    })
  },

  gotoPlayerPage(e) {
    wx.navigateTo({
      url: '/pages/pub/players/players',
    })
  },

  gotoTeamsPage(e) {
    let teamList = e.currentTarget.dataset.list ?? []
    let teamIdList = teamList.map(team => team.teamId)
    wx.navigateTo({
      url: '/pages/pub/teams/teams?idList=' + teamIdList,
    })
  },

  gotoTeamPage: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/pub/team/team?id=' + id,
    })
  },

  gotoEventPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/event/event?id=' + dataset.id,
    })
  },

  gotoUserPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/user/user?id=' + dataset.id,
    })
  },

  gotoEventHallPage: function (e) {
    wx.navigateTo({
      url: './event_hall/event_hall',
    })
  },

  gotoMatchHallPage: function (e) {
    wx.navigateTo({
      url: './match_hall/match_hall',
    })
  },

  gotoTeamHallPage: function (e) {
    wx.navigateTo({
      url: './team_hall/team_hall',
    })
  },

  gotoUserHallPage: function (e) {
    wx.navigateTo({
      url: './user_hall/user_hall',
    })
  },

  gotoNewsHallPage: function (e) {
    wx.navigateTo({
      url: './news_hall/news_hall',
    })
  },

  gotoProfilePlayerPage() {
    wx.switchTab({
      url: '/pages/profile_player/profile_player',
    })
  },

  gotoProfileCoachPage() {
    wx.switchTab({
      url: '/pages/profile_player/profile_coach/profile_coach',
    })
  },

  gotoProfileRefereePage() {
    wx.switchTab({
      url: '/pages/profile_player/profile_referee/profile_referee',
    })
  },

  ///////////////////////////////////////////////////////////////////////////////
  // 监听

  /**
   * 监听搜索框文本
   */
  bindInput: function (e) {
    this.setData({
      searchText: e.detail.value // 更新data中的searchText值为用户输入的内容
    });
    // 这里可以添加你的搜索逻辑，比如根据用户输入的内容进行实时搜索
  },

  /**
   * 监听搜索按钮
   */
  search: function () {
    // 这里添加搜索逻辑，比如发起网络请求或其他操作
    console.log('搜索内容:', this.data.searchText);
    this.gotoSearch();
  },

  login() {
    app.userLogin()
  },

  ///////////////////////////////////////////////////
  //新闻
  onSwiperChange: function (e) {
    this.setData({
      currentSwiperIndex: e.detail.current,
    });
  },

  gotoNews: function (e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: '/pages/news/news?url=' + url,
    })
  },
})