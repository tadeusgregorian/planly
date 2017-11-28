//@flow
import type { GetState } from 'types/index'

export const getLastTempIDOfBranch = ( getState: GetState, branch: string): string => {
  const templatesFlat = getState().roster.templatesFlat

  console.log(templatesFlat);
  console.log(templatesFlat.filter(tf => tf.branch === branch));

  const tempID =  templatesFlat.filter(tf => tf.branch === branch).map(tf => tf.id).sort().reverse()[0]
  return tempID
}
