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
