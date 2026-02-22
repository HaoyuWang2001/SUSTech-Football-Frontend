const appInstance = getApp()
const URL = appInstance.globalData.URL
const userId = appInstance.globalData.userId
const ANONYMITY = appInstance.globalData.ANONYMITY

Page({
  data: {
    type: '',
    teamList: [],
  },

  onLoad(options) {
    this.setData({
      type: options.type,
    })
    this.fetchData()
  },

  fetchData() {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.request({
      url: URL + '/team/getAll',
      success(res) {
        console.log("/pages/mine/sport_center/matches/match_new/set_team: fetchData ->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        let teamList = res.data
        for (let team of teamList) {
          team.logoUrl = team.logoUrl ?? ANONYMITY
        }
        that.setData({
          teamList,
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

  selectTeam(e) {
    const teamId = e.target.dataset.id;
    const chosenTeam = {}
    for (let team of this.data.teamList) {
      if (team.teamId == teamId) {
        chosenTeam.teamId = team.teamId
        chosenTeam.name = team.name
        chosenTeam.logoUrl = team.logoUrl
        break
      }
    }
    this.goBack(chosenTeam);
  },

  goBack(team) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (this.data.type === "home") {
      prevPage.setData({
        homeTeam: team,
      })
    } else if (this.data.type === "away") {
      prevPage.setData({
        awayTeam: team,
      })
    } else {
      console.error("输入type错误")
    }
    wx.navigateBack({
      delta: 1,
    })
  },
})