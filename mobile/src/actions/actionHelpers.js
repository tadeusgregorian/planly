//@flow

export type TargetKey =
  'users'
| 'branches'
| 'positions'
| 'accountDetails'
| 'shiftWeeks'
| 'shiftEdits'
| 'dayNotes'
| 'absencesWeekly'

// This function holds the Information, where in the FirebaseDB each Node sits
// If childPaths provided it concats the childPaths to a path-string.
export const getFBPath	= (target: TargetKey, childPaths?: Array<string>): string => {
  const pathfinder = {
    users: 					  '/users/',
    branches: 			  '/branches/',
    positions: 			  '/positions/',
    accountDetails:   '/accountDetails/',
    shiftWeeks: 		  '/roster/shiftWeeks/',
    shiftEdits: 		  '/roster/shiftEdits/',
    dayNotes:         '/roster/dayNotes/',
    absencesWeekly:   '/absencePlaner/absencesWeekly/',
  }

	const accPath  = 'accounts/' + window.accountID
  const rootPath = pathfinder[target]
  const tailPath = childPaths && childPaths.reduce((acc, val) => acc + val + '/', '')

  return accPath + rootPath + ( tailPath || '')
}
