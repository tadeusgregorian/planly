//@flow

export type TargetKey =
  'users'
| 'branches'
| 'positions'
| 'accountDetails'
| 'queues'
| 'roster'
| 'shiftWeeks'
| 'notes'
| 'shiftEdits'
| 'templatesFlat'
| 'absences'
| 'absencesByWeek'

// This function holds the Information, where in the FirebaseDB each Node sits
// If childPaths provided it concats the childPaths to a path-string.
export const getFBPath	= (target: TargetKey, childPaths?: Array<string>): string => {
  const pathfinder = {
    users: 					  '/users/',
    branches: 			  '/branches/',
    positions: 			  '/positions/',
    accountDetails:   '/accountDetails/',
    queues: 				  '/queues/',
    roster: 				  '/roster/',
    shiftWeeks: 		  '/roster/shiftWeeks/',
    notes: 					  '/roster/notes/',
    shiftEdits: 		  '/roster/shiftEdits/',
    templatesFlat: 	  '/roster/templatesFlat/',
    absences:         '/absencePlaner/absences/',
    absencesByWeek:   '/absencePlaner/absencesByWeek/',
  }

	const accPath  = 'accounts/' + window.accountID
  const rootPath = pathfinder[target]
  const tailPath = childPaths && childPaths.reduce((acc, val) => acc + val + '/', '')

  return accPath + rootPath + ( tailPath || '')
}
