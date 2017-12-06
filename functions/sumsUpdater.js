// no Object.values in this node version
const _values = (obj) => Object.keys(obj).map(key => obj[key])

const getPathToShifts = (accountID, weekID) =>
  `/accounts/${accountID}/roster/shiftWeeks/${weekID}/`

const getPathToExtraHours = (accountID, weekID) =>
  `/accounts/${accountID}/roster/extraHours/${weekID}/`

const getPathToAbsences = (accountID, weekID) =>
  `/accounts/${accountID}/absencePlaner/absencesWeekly/${weekID}/`

const getPathToWeekSums = (accountID) =>
  `/accounts/${accountID}/roster/weekSums/`

const WEEK = ['mo','tu','we','th','fr','sa','su']

const curVac = (vacs, day) => {
  const d = WEEK.indexOf(day)
  return vacs.find(v => v.firstDay <= d && v.lastDay >= d)
}

const earningInVac = (vacs, day) => {
  const vac = curVac(vacs, day)
  return (vac && vac.workDays[day]) ? vac.avgMins : 0
}

exports.updateWeekSums = function(rootRef, target) {
  const { accountID , weekID, userID } = target

  const _shifts =     rootRef.child(getPathToShifts(accountID, weekID)    ).orderByChild('user').equalTo(userID).once('value')
  const _extraHours = rootRef.child(getPathToExtraHours(accountID, weekID)).orderByChild('user').equalTo(userID).once('value')
  const _absences =   rootRef.child(getPathToAbsences(accountID, weekID)  ).orderByChild('user').equalTo(userID).once('value')

  return Promise.all([_shifts, _extraHours, _absences]).then(results => {

    const shifts      = results[0].val() ? _values(results[0].val()) : []
    const extras      = results[1].val() ? _values(results[1].val()) : []
    const vacs        = results[2].val() ? _values(results[2].val()).filter(v => v.type === 'vac') : [] // its absences becauste a user could have more than 1 absence in week

    const shiftsSum = shifts.reduce((acc, s)  => (curVac(vacs, s.day) ? 0 : ( s.e - s.s - s.b )) + acc , 0)
    const vacsSum   = WEEK.reduce((acc, d)    => earningInVac(vacs, d) + acc , 0)
    const extrasSum = extras.reduce((acc, e)  => acc + e.mins , 0)

    const minsSum = shiftsSum + vacsSum + extrasSum
    const key = userID + '_' + weekID

    return rootRef.child(getPathToWeekSums(accountID)).child(key).set(minsSum)
  })
}
