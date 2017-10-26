const trimAbsence = (a, firstWeekDay, lastWeekDay) => {
  return {
    id: a.id,
    user: a.user,
    type: a.type,
    workDays: (a.workDays || null), // a.workDays can be undefined -> cant write undefined to DB
    useAvgHours: (a.useAvgHours || null), // a.useAvgHours can be undefined -> cant write undefined to DB
    avgDailyMins: a.avgDailyMins,
    firstWeekDay,
    lastWeekDay
  }
}

const getAbsFanOutPath = (accountID, smartWeek, absenceID) =>
  `/accounts/${accountID}/absencePlaner/absencesWeekly/${smartWeek}/${absenceID}`

exports.fanOutAbsence = (rootRef, { accountID, absencePrev, absenceNew }) => {

  console.log('absences Work bro.');

  const isAbsenceRequest = absenceNew && absenceNew.status === 'requested'
  if(isAbsenceRequest) return // we dont care if its just requests -> we just handle accepted absences

  const touchingWeeksPrev = (absencePrev && absencePrev.touchingWeeks && Object.keys(absencePrev.touchingWeeks)) || []
  const touchingWeeksNew  = (absenceNew  && absenceNew.touchingWeeks  && Object.keys(absenceNew.touchingWeeks)) || []

  const removedWeeks = []
  touchingWeeksPrev.forEach(w => { if(!touchingWeeksNew.includes(w)) removedWeeks.push(w) })

  const updates = {}
  removedWeeks.forEach(w => { updates[getAbsFanOutPath(accountID, w, absencePrev.id)] = null })

  touchingWeeksNew.sort().forEach((w, i) => {
    const firstWeekDay = i === 0 ? absenceNew.startWeekDay : 0
    const lastWeekDay  = (i === touchingWeeksNew.length - 1) ? absenceNew.endWeekDay : 7
    const trimmedAbsence = trimAbsence(absenceNew, firstWeekDay, lastWeekDay)
    updates[getAbsFanOutPath(accountID, w, absenceNew.id)] = trimmedAbsence
  })

  return rootRef.update(updates)
}
