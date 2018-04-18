//@flow

export const isBuild      = () => process.env.NODE_ENV === 'production' // set by react-app if running build-process
export const isProduction = () => process.env.REACT_APP_ENV === 'production' // set by package json when running 'startprod' or 'buildprod'

export const getDomain    = () => isProduction() ? 'aplano.de'             : 'plandy-91a56.firebaseapp.com'
export const getAppUrl    = () => isProduction() ? 'https://app.aplano.de' : 'https://plandy-91a56.firebaseapp.com'

export const testingForMobile = () => {
  if(process.env.NODE_ENV === 'production') return false // just in case if I forget to switch back to false
  return true
}
