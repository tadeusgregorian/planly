//@flow

export type TargetKey =
  'users'
| 'branches'
| 'positions'
| 'accountDetails'
| 'shiftWeeks'
| 'shiftEdits'
| 'templatesFlat'
| 'absences'
| 'absencesWeekly'
| 'absenceCorrections'
| 'vacationRequests'
| 'weekSums'
| 'corrections'
| 'extraHours'
| 'dayNotes'
| 'shiftsPM'
| 'extraHoursPM'

// This function holds the Information, where in the FirebaseDB each Node sits
// If childPaths provided it concats the childPaths to a path-string.
export const getFBPath	= (target: TargetKey, childPaths?: Array<string>): string => {
  const pathfinder = {
    users: 					    '/users/',
    branches: 			    '/branches/',
    positions: 			    '/positions/',
    accountDetails:     '/accountDetails/',
    weekSums:           '/roster/weekSums/',
    shiftWeeks: 		    '/roster/shiftWeeks/',
    shiftEdits: 		    '/roster/shiftEdits/',
    extraHours:         '/roster/extraHours/',
    corrections:        '/roster/corrections/',
    templatesFlat: 	    '/roster/templatesFlat/',
    shiftsPM:           '/roster/shiftsPM/',
    extraHoursPM:       '/roster/extraHoursPM/',
    absences:           '/absencePlaner/absences/',
    absenceCorrections: '/absencePlaner/absenceCorrections/',
    absencesWeekly:     '/absencePlaner/absencesWeekly/',
    vacationRequests:   '/absencePlaner/vacationRequests/',
    dayNotes:           '/roster/dayNotes/',
  }

	const accPath  = 'accounts/' + window.accountID
  const rootPath = pathfinder[target]
  const tailPath = childPaths && childPaths.reduce((acc, val) => acc + val + '/', '')

  return accPath + rootPath + ( tailPath || '')
}
