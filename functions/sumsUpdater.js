const getPathToMiniShifts = (accountID, weekID, userID) =>
  `/accounts/${accountID}/roster/miniShiftWeeks/${weekID}/${userID}`

const getPathToAbsences = (accountID, weekID, userID) =>
  `/accounts/${accountID}/absencePlaner/absencesWeekly/${weekID}`

const getPathToWeekSums = (accountID) =>
  `/accounts/${accountID}/roster/weekSums/`

const _values = (obj) => { // cause Object.values doesnt work with this node version...
  let arr = []
  for(let key in obj){ arr.push(obj[key])}
  return arr
}

exports.updateWeekSums = function(rootRef, target) {
  const { accountID , weekID, userID } = target
  const shifts_pr =   rootRef.child(getPathToMiniShifts(accountID, weekID, userID)).once('value')
  const absences_pr = rootRef.child(getPathToAbsences(accountID, weekID, userID)).orderByChild('user').equalTo(userID).once('value')

  console.log('RUNNING tade!');

  return Promise.all([shifts_pr, absences_pr]).then(results => {

    const miniShifts = results[0].val()
    const absences   = results[1].val()

    const WEEK = ['mo','tu','we','th','fr','sa','su']
    let minsGrid = [0, 0, 0, 0, 0, 0, 0] // holds the sum of worked minutes per WeekDay ( every index represents the corresponding weekday )

    miniShifts && _values(miniShifts).forEach(ms => minsGrid[ms.weekDay] += ms.mins ) // adds worked mins to the empty minsGrid

    const minsGridFinal = minsGrid.map((mins, weekDay) => { // corrects the minsGrid in case of absences ( if useAvgHours is true )
      const vacToApply =  absences && _values(absences).find(a => {

        if(!a.useAvgHours) return false
        if(a.firstWeekDay > weekDay) return false
        if(a.lastWeekDay  < weekDay) return false
        return true
      })
      if(!vacToApply) return mins // no vacation to effect the minutes this day ( already over / didnt start yet / useAvgHours is false )
      return vacToApply.workDays[WEEK[weekDay]] ? vacToApply.avgDailyMins : 0 // zero mins -> if its a day thats not marked as workday in prefs
    })

    const minsSum = minsGridFinal.reduce((acc, val) => val + acc, 0)
    const key = userID + '_' + weekID

    return rootRef.child(getPathToWeekSums(accountID)).child(key).set(minsSum)
  })
}
