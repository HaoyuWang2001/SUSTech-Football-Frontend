// pages/pub/event_team/event_team.js
import { formatTime } from '../../../utils/timeFormatter'

const app = getApp()
let URL = null

Page({
  data: {
    eventId: '',
    teamId: '',
    teamName: '',
    logoUrl: '',
    playerList: [],
    matchList: [],
    activeTab: 0,
  },

  onLoad(options) {
    URL = app.globalData.URL
    const eventId = options.eventId || ''
    const teamId = options.teamId || ''
    const teamName = options.teamName ? decodeURIComponent(options.teamName) : ''

    this.setData({ eventId, teamId, teamName })
    if (teamName) {
      wx.setNavigationBarTitle({ title: `${teamName} - 赛事球队` })
    }

    this.fetchEventTeamData(eventId, teamId)
  },

  onPullDownRefresh() {
    this.fetchEventTeamData(this.data.eventId, this.data.teamId)
  },

  switchTab(e) {
    const tabIndex = Number(e.currentTarget.dataset.index) || 0
    this.setData({ activeTab: tabIndex })
  },

  gotoTeamPage() {
    const { teamId } = this.data
    if (!teamId) {
      wx.showToast({ title: '缺少球队信息', icon: 'error' })
      return
    }
    wx.navigateTo({ url: `/pages/pub/team/team?id=${teamId}` })
  },

  gotoMatchPage(e) {
    const { id } = e.currentTarget.dataset
    if (!id) {
      return
    }
    wx.navigateTo({ url: `/pages/pub/match/match?id=${id}` })
  },

  gotoMatchesPage(e) {
    let matchList = e.currentTarget.dataset.list ?? []
    let matchIdList = matchList.map(match => match.matchId)
    wx.navigateTo({
      url: '/pages/pub/matches/matches?idList=' + encodeURIComponent(JSON.stringify(matchIdList)),
    })
  },

  fetchEventTeamData(eventId, teamId) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });

    var that = this;
    wx.request({
      url: `${URL}/event/team/get`,
      method: 'GET',
      data: { eventId, teamId },
      success: (res) => {
        console.log("event_team->")
        if (res.statusCode !== 200) {
          console.log("请求失败，状态码为：" + res.statusCode + "; 错误信息为：" + res.data)
          return
        }
        console.log(res.data)
        const data = res.data || {}
        const playerList = that.sortPlayersByNumber(data.playerList || data.players || [])
        const matchList = that.formatMatches(data.matchList || [])
        const teamName = data.teamName || data.name || that.data.teamName

        that.setData({
          teamId: data.teamId || teamId,
          teamName,
          logoUrl: data.logoUrl || data.teamLogoUrl || '',
          playerList,
          matchList,
        })
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'error' })
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

  sortPlayersByNumber(players) {
    const normalized = (players || []).map((player) => ({
      ...player,
      number: player.number ?? '',
      goals: player.goals ?? 0,
      assists: player.assists ?? 0,
      yellowCards: player.yellowCards ?? 0,
      redCards: player.redCards ?? 0,
    }))

    normalized.sort((a, b) => {
      const aNum = parseInt(a.number, 10)
      const bNum = parseInt(b.number, 10)
      const aVal = Number.isNaN(aNum) ? 9999 : aNum
      const bVal = Number.isNaN(bNum) ? 9999 : bNum
      return aVal - bVal
    })

    return normalized
  },

  formatMatches(list) {
    return (list || []).map((match) => {
      const time = match.time ? new Date(match.time) : null
      const matchId = match.matchId || match.id
      return {
        ...match,
        matchId,
        strTime: time ? formatTime(time) : '',
        hasBegun: match.status === 'PENDING' ? false : true,
      }
    })
  },
})