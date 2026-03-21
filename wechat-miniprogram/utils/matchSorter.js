// Utility to sort matches: upcoming first (nearest first), finished after (oldest last)
function sortMatchList(list = []) {
  const now = Date.now()
  const upcoming = []
  const finished = []

  list.forEach(match => {
    const timeValue = new Date(match.time).getTime()
    const isPending = match.status === 'PENDING' || timeValue > now
    const normalized = { ...match, _timeValue: timeValue }
    if (isPending) {
      upcoming.push(normalized)
    } else {
      finished.push(normalized)
    }
  })

  upcoming.sort((a, b) => a._timeValue - b._timeValue)
  finished.sort((a, b) => b._timeValue - a._timeValue)

  return [...upcoming, ...finished].map(({ _timeValue, ...rest }) => rest)
}

module.exports = {
  sortMatchList,
}
