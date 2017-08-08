import moment from 'moment'

export const getTodaySmart = () => {
	return parseInt(moment().format('YYYYMMDD'), 10)
}
