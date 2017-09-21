import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { generateGuid } from 'helpers/general'

export const createNewTempForBranch = (branch: string) => {
  const tempID  = generateGuid()
  const tempObj = { id: tempID, name: 'unbenannt', branch }
  const path    = getFBPath('templatesFlat')
  return db().ref(path).child(tempID).set(tempObj).then(()=> tempID)
}

export const saveTemplateName = (tempID: string, name: string) => {
  const path    = getFBPath('templatesFlat')
  db().ref(path).child(tempID).child('name').set(name)
}
