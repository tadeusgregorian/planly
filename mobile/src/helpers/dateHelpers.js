//@flow
import moment from 'moment'

export const getTodaySmart = (): number =>
	parseInt(moment().format('YYYYMMDD'), 10)

export const getThisMondaySmart = (): number =>
	parseInt(moment().startOf('isoWeek').format('YYYYMMDD'), 10)

export const getThisSmartWeek = (): number => {
	const year = moment().year()
	const week = moment().week()
	return parseInt((year + '' + week), 10)
}

export const areEqualShallow = (a: {}, b: {}) => {
	for(var key in a) {
	  if(!(key in b) || a[key] !== b[key]) return false
	}
	for(var key2 in b) {
	  if(!(key2 in a) || a[key2] !== b[key2]) return false
	}
	return true
}
