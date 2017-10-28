//@flow
import type { GetState } from 'types/index'

export const getLastTempIDOfBranch = ( getState: GetState, branch: string): string => {
  const templatesFlat = getState().roster.templatesFlat
  const tempID =  templatesFlat.filter(tf => tf.branch === branch).map(tf => tf.id).sort().reverse()[0]
  return tempID
}
