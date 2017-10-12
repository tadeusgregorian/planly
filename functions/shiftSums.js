
const getPathToMiniShifts = (accountID, weekID, userID) => {
  return (`/accounts/${accountID}/roster/miniShiftWeeks/${weekID}/${userID}`)
}

const getPathAbsences = (accountID, weekID, userID) => {
  return (`/accounts/${accountID}/absencePlaner/absencesWeekly/${weekID}`)
}
// target should have: accountID, weekID, userID
exports.updater = (rootRef, target) => {
  const { accountID , weekID, userID } = target
  const shifts_pr =   rootRef.child(getPathToMiniShifts(accountID, weekID, userID)).once('value')
  const absences_pr = rootRef.child(getPathAbsences(accountID, weekID, userID)).sortByChild('user').equalTo(userID).once('value')

  return Promise.all([shifts_pr, absences_pr]).then(results => {
    const miniShifts = results[0].val()
    const absences   = results[1].val()

    console.log(miniShifts);
    console.log(absences);
  })
}
