import moment from 'moment'

export const getTodaySmart = () =>
	parseInt(moment().format('YYYYMMDD'), 10)

export const getThisMondaySmart = () =>
	moment().startOf('isoWeek').format('YYYYMMDD')
