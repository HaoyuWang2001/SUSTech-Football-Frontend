const app = getApp()
const URL = app.globalData.URL
const {
  formatTime
} = require("../../utils/timeFormatter")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coachId: 0,
    coach: {},
    matchList: [],
    teamList: [],
    eventList: [],
    isLoading: true, // 新增：加载状态
    showRedDot: false,
  },

  onLoad(options) {},

  onShow() {
    this.setData({
      isLoading: true, // 开始加载
    })
    app.addToRequestQueue(this.fetchCoachId)
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
    this.setData({
      isLoading: true // 开始加载
    })
    app.addToRequestQueue(this.fetchCoachId)
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

  // 拉取数据
  fetchCoachId(userId) {
    let that = this
    wx.request({
      url: URL + '/user/getCoachId',
      data: {
        userId: userId,
      },
      success(res) {
        console.log("profile coach page: fetchCoachId ->")
        if (res.statusCode == 404) {
          console.log("用户未注册为教练")
          that.setData({
            isLoading: false, // 加载完成，隐藏loading
            coachId: 0, // 明确设置为0
          })
          wx.showToast({
            title: '请先注册为教练',
            icon: 'error',
          })
          return
        }
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          that.setData({
            isLoading: false // 加载完成（即使失败）
          })
          return
        }
        console.log(res.data)
        let coachId = res.data
        that.setData({
          coachId: coachId,
          isLoading: false // 加载完成，隐藏loading
        })
        // 后续数据获取不显示loading
        that.fetchData(coachId)
        that.fetchCoachMatches(coachId)
        that.fetchCoachTeams(coachId)
        that.fetchCoachEvents(coachId)
        that.fetchCoachTeamInvitations(coachId)
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
        that.setData({
          isLoading: false // 加载完成（即使失败）
        })
      },
    })
  },

  fetchData(coachId) {
    let that = this
    wx.request({
      url: URL + '/coach/get',
      data: {
        id: coachId,
      },
      success(res) {
        console.log("profile coach page: fetchData ->")
        if (res.statusCode != 200) {
          console.error("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        that.setData({
          coach: res.data,
        })
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchCoachTeams(coachId) {
    let that = this
    wx.request({
      url: URL + '/coach/team/getAll',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("profile coach page: fetchCoachTeams ->")
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
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchCoachEvents(coachId) {
    let that = this
    wx.request({
      url: URL + '/coach/event/getAll',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("profile coach page: fetchCoachEvents ->")
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
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  fetchCoachTeamInvitations(coachId) {
    const that = this
    wx.request({
      url: URL + '/coach/team/getInvitations',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("profile coach page: fetch Coach Invitations->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let invitations = res.data.map(invitation => {
          if (invitation.status == "PENDING") {
            return invitation
          }
          return null;
        }).filter(invitation => invitation !== null);
        let showDot = invitations.length > 0 ? true : false;
        if (showDot == true) {
          that.setData({
            showRedDot: showDot
          })
        }
      },
      fail(err) {
        console.log('请求失败', err);
      },
      complete() {}
    });
  },

  fetchCoachMatches(coachId) {
    let that = this
    wx.request({
      url: URL + '/coach/match/getAll',
      data: {
        coachId: coachId,
      },
      success(res) {
        console.log("profile coach page: fetchCoachMatches ->")
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
        let matches = res.data.map(match => {
          const matchDay = new Date(match.time);
          const nowDay = new Date();
          if (matchDay < nowDay) return null;
          else {
            let differenceInDays = (matchDay - nowDay) / (1000 * 60 * 60 * 24);
            if (differenceInDays <= 14)
              return match
          }
          return null;
        }).filter(match => match !== null);
        let showDot = matches.length > 0 ? true : false;
        if (showDot == true) {
          that.setData({
            showRedDot: showDot
          })
        }
      },
      fail(err) {
        console.error('请求失败：', err.statusCode, err.errMsg);
      },
    })
  },

  // 页面跳转
  edit_information() {
    let coach = this.data.coach
    console.log(coach)
    const queryString = Object.keys(coach).map(key => {
      console.log(key + ": " + encodeURIComponent(coach[key]))
      return `${key}=${encodeURIComponent(coach[key])}`
    }).join('&');
    console.log("queryString->")
    console.log(queryString)
    wx.navigateTo({
      url: `/package-coach/pages/profile_coach_edit/profile_coach_edit?${queryString}`
    })
  },

  gotoMatchesPage(e) {
    let matchList = e.currentTarget.dataset.list ?? []
    let matchIdList = matchList.map(match => match.matchId)
    wx.navigateTo({
      url: '/pages/pub/matches/matches?idList=' + encodeURIComponent(JSON.stringify(matchIdList)),
    })
  },

  gotoMatchPage: function (e) {
    const dataset = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/pub/match/match?id=' + dataset.id,
    })
  },

  gotoTeamsPage(e) {
    wx.navigateTo({
      url: `/package-coach/pages/coach_teams/coach_teams?coachId=${this.data.coachId}`,
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

  gotoRegisterPage() {
    wx.navigateTo({
      url: '/package-coach/pages/profile_coach_register/profile_coach_register',
    })
  },

  gotoCoachNoticePage() {
    wx.navigateTo({
      url: '/package-coach/pages/profile_coach_notice/profile_coach_notice',
    })
  },
})