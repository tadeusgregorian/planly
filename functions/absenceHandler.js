const trimAbsence = (a, firstDay, lastDay) => {
  return {
    id: a.id,
    user: a.user,
    type: a.type,
    avgMins: a.avgMins,
    workDays: a.workDays,
    firstDay,
    lastDay
  }
}

const getAbsFanOutPath = (accountID, smartWeek, absenceID) =>
  `/accounts/${accountID}/absencePlaner/absencesWeekly/${smartWeek}/${absenceID}`

exports.fanOutAbsence = (rootRef, { accountID, absencePrev, absenceNew }) => {

  const isAbsenceRequest = absenceNew && absenceNew.status === 'requested'
  if(isAbsenceRequest) return // we dont care if its just requests -> we just handle accepted absences

  const touchingWeeksPrev = (absencePrev && absencePrev.touchingWeeks && Object.keys(absencePrev.touchingWeeks)) || []
  const touchingWeeksNew  = (absenceNew  && absenceNew.touchingWeeks  && Object.keys(absenceNew.touchingWeeks)) || []

  const updates = {}

  //first we put all previous touchingWeeks to be null -> may get overrided in the next step if still there.
  touchingWeeksPrev.forEach(w => { updates[getAbsFanOutPath(accountID, w, absencePrev.id)] = null })

  touchingWeeksNew.forEach((w, i) => {
    const firstDay = parseInt(absenceNew.touchingWeeks[w].charAt(0), 10)
    const lastDay  = parseInt(absenceNew.touchingWeeks[w].charAt(1), 10)

    const trimmedAbsence = trimAbsence(absenceNew, firstDay, lastDay)
    updates[getAbsFanOutPath(accountID, w, absenceNew.id)] = trimmedAbsence
  })

  return rootRef.update(updates)
}
