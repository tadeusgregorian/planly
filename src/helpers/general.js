import moment from 'moment'

export const generateGuid = () => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const x1 = possible.charAt(Math.floor(Math.random() * possible.length))
  const x2 = possible.charAt(Math.floor(Math.random() * possible.length))
  const unix = moment().format('X')
  let d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  let uuid = 'xxxxxxxxyxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    // eslint-disable-next-line
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  });
  return unix + uuid + x1 + x2
}

export const isValidEmail = (email) => {
	// eslint-disable-next-line
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

export const deletePropAndReturnObj = (obj, prop) => {
	const obj_copy = { ...obj }
	delete obj_copy[prop]
	return obj_copy
}

export const numToTriplex = (num) => {
  if(num < 10) 	  return ('u00' + num)
  if(num < 100) 	return ('u0' + num)
  if(num < 1000)  return ('u' + num)
  return('error_in_numToTriplex_tade')
}

export const replaceDotsWithCommas = (str) => str.replace(/\./g, ',')
